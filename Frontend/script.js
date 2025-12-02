 // API Configuration
        const API_BASE_URL = 'http://localhost:5000/api';

        // Initialize app
        const App = {
            donors: [],
            requests: [],
            cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Mumbai', 'Delhi', 'Bangalore', 'London', 'Toronto', 'Sydney'],
            
            async init() {
                // Attach UI handlers and render initial UI immediately so
                // the app is responsive even if backend requests are slow.
                this.setupEventListeners();
                this.setupTheme();
                this.populateCities();

                // Initial render from available (mock or cached) data
                this.updateStats();
                this.renderDonors();
                this.renderRequests();
                this.updateDashboard();

                // Load data in the background with a short timeout so it
                // doesn't block the UI. When data arrives, refresh the UI.
                this.loadDataWithTimeout(3000)
                    .then(() => {
                        this.updateStats();
                        this.renderDonors();
                        this.renderRequests();
                        this.updateDashboard();
                    })
                    .catch((err) => {
                        // If timed out or failed, try a non-blocking full load
                        console.warn('Background data load failed or timed out:', err);
                        this.loadData().then(() => {
                            this.updateStats();
                            this.renderDonors();
                            this.renderRequests();
                            this.updateDashboard();
                        }).catch(() => {});
                    });
            },

    

            async loadData() {
                try {
                    // Load donors from backend
                    const donorsResponse = await fetch(`${API_BASE_URL}/donors`);
                    if (donorsResponse.ok) {
                        this.donors = await donorsResponse.json();
                        // Convert MongoDB _id to id for compatibility
                        this.donors = this.donors.map(donor => ({
                            ...donor,
                            id: donor._id || donor.id
                        }));
                    } else {
                        console.error('Failed to load donors from backend');
                        this.donors = [];
                    }
                } catch (error) {
                    console.error('Error loading donors:', error);
                    this.donors = [];
                    // Fallback to mock data if backend is not available
                    this.donors = [
                        {
                            id: '1',
                            name: 'John Smith',
                            bloodGroup: 'O+',
                            city: 'New York',
                            lastDonation: '2024-08-15',
                            age: 32,
                            gender: 'Male',
                            phone: '+1234567890',
                            email: 'john@example.com',
                            notes: 'Available weekdays after 5 PM',
                            photo: null,
                            registered: '2024-01-10',
                            distance: 2.5
                        },
                        {
                            id: '2',
                            name: 'Sarah Johnson',
                            bloodGroup: 'A+',
                            city: 'Los Angeles',
                            lastDonation: '2024-10-20',
                            age: 28,
                            gender: 'Female',
                            phone: '+1234567891',
                            email: 'sarah@example.com',
                            notes: 'Prefer morning appointments',
                            photo: null,
                            registered: '2024-02-15',
                            distance: 5.1
                        },
                        {
                            id: '3',
                            name: 'Michael Chen',
                            bloodGroup: 'B+',
                            city: 'Chicago',
                            lastDonation: '2024-09-05',
                            age: 35,
                            gender: 'Male',
                            phone: '+1234567892',
                            email: 'michael@example.com',
                            notes: 'Regular donor, available anytime',
                            photo: null,
                            registered: '2023-11-20',
                            distance: 3.8
                        },
                        {
                            id: '4',
                            name: 'Emily Rodriguez',
                            bloodGroup: 'AB+',
                            city: 'Houston',
                            lastDonation: '2024-07-12',
                            age: 29,
                            gender: 'Female',
                            phone: '+1234567893',
                            email: 'emily@example.com',
                            notes: 'Available weekends',
                            photo: null,
                            registered: '2024-03-08',
                            distance: 7.2
                        },
                        {
                            id: '5',
                            name: 'David Williams',
                            bloodGroup: 'O-',
                            city: 'Phoenix',
                            lastDonation: '2024-06-25',
                            age: 41,
                            gender: 'Male',
                            phone: '+1234567894',
                            email: 'david@example.com',
                            notes: 'Universal donor',
                            photo: null,
                            registered: '2023-09-14',
                            distance: 4.5
                        }
                    ];
                }

                try {
                    // Load requests from backend
                    const requestsResponse = await fetch(`${API_BASE_URL}/requests`);
                    if (requestsResponse.ok) {
                        this.requests = await requestsResponse.json();
                        // Convert MongoDB _id to id for compatibility
                        this.requests = this.requests.map(request => ({
                            ...request,
                            id: request._id || request.id
                        }));
                    } else {
                        console.error('Failed to load requests from backend');
                        this.requests = [];
                    }
                } catch (error) {
                    console.error('Error loading requests:', error);
                    this.requests = [];
                    // Fallback to mock data if backend is not available
                    this.requests = [
                        {
                            id: '1',
                            bloodGroup: 'O+',
                            units: 2,
                            hospital: 'City General Hospital',
                            city: 'New York',
                            urgency: 'high',
                            contact: 'Jane Doe',
                            phone: '+1234567895',
                            details: 'Emergency surgery patient',
                            created: new Date().toISOString()
                        },
                        {
                            id: '2',
                            bloodGroup: 'A-',
                            units: 1,
                            hospital: 'Memorial Medical Center',
                            city: 'Los Angeles',
                            urgency: 'medium',
                            contact: 'Robert Brown',
                            phone: '+1234567896',
                            details: 'Scheduled procedure',
                            created: new Date(Date.now() - 86400000).toISOString()
                        }
                    ];
                }
            },

            loadDataWithTimeout(timeout = 3000) {
                return Promise.race([
                    this.loadData(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
                ]);
            },

            // No longer saving to localStorage - data is saved to backend
            async saveData() {
                // This method is now deprecated but kept for backwards compatibility
                console.log('Data saved to backend via API calls');
            },

            setupEventListeners() {
                // Navigation
                document.querySelectorAll('[data-page]').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.navigateTo(link.dataset.page);
                    });
                });

                // Mobile menu
                document.getElementById('mobileMenuBtn').addEventListener('click', () => {
                    document.querySelector('.nav-links').classList.toggle('active');
                });

                // Quick search
                document.getElementById('quickSearchBtn').addEventListener('click', () => {
                    const bloodGroup = document.getElementById('quickBloodGroup').value;
                    const city = document.getElementById('quickCity').value;
                    document.getElementById('filterBloodGroup').value = bloodGroup;
                    document.getElementById('filterCity').value = city;
                    this.navigateTo('search');
                    this.renderDonors();
                });

                // Search filters
                ['filterBloodGroup', 'filterCity', 'filterAvailability', 'sortBy'].forEach(id => {
                    document.getElementById(id).addEventListener('change', () => this.renderDonors());
                });

                // Request filters
                ['requestFilterBlood', 'requestFilterCity', 'requestFilterUrgency'].forEach(id => {
                    document.getElementById(id).addEventListener('input', () => this.renderRequests());
                });

                // Forms
                document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
                document.getElementById('requestForm').addEventListener('submit', (e) => this.handleRequest(e));

                // Photo preview
                document.getElementById('regPhoto').addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            document.getElementById('photoPreviewImg').src = event.target.result;
                            document.getElementById('photoPreview').classList.remove('hidden');
                        };
                        reader.readAsDataURL(file);
                    }
                });

                // Modal close
                document.getElementById('modalClose').addEventListener('click', () => {
                    document.getElementById('donorModal').classList.remove('active');
                });

                document.getElementById('donorModal').addEventListener('click', (e) => {
                    if (e.target.id === 'donorModal') {
                        document.getElementById('donorModal').classList.remove('active');
                    }
                });
            },

            setupTheme() {
                const theme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);

                document.getElementById('themeToggle').addEventListener('click', () => {
                    const current = document.documentElement.getAttribute('data-theme');
                    const next = current === 'dark' ? 'light' : 'dark';
                    document.documentElement.setAttribute('data-theme', next);
                    localStorage.setItem('theme', next);
                });
            },

            populateCities() {
                const citiesHTML = this.cities.map(city => `<option value="${city}">`).join('');
                document.querySelectorAll('#cities, #citiesFilter, #citiesReg, #citiesReq').forEach(datalist => {
                    datalist.innerHTML = citiesHTML;
                });
            },

            navigateTo(page) {
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById(page + 'Page').classList.add('active');
                document.querySelector('.nav-links').classList.remove('active');
                window.scrollTo(0, 0);
                // Re-init slider if navigating to home page
                if(page === 'home' && typeof window.App.initSlider === 'function') {
                    window.App.initSlider();
                }
            },

            updateStats() {
                const livesSaved = this.donors.length * 3;
                document.getElementById('statDonors').textContent = this.donors.length;
                document.getElementById('statLives').textContent = livesSaved;
                document.getElementById('statRequests').textContent = this.requests.length;
                document.getElementById('statCities').textContent = [...new Set(this.donors.map(d => d.city))].length;
            },

            renderDonors() {
                const bloodGroup = document.getElementById('filterBloodGroup').value;
                const city = document.getElementById('filterCity').value.toLowerCase();
                const availability = document.getElementById('filterAvailability').value;
                const sortBy = document.getElementById('sortBy').value;

                let filtered = this.donors.filter(donor => {
                    if (bloodGroup && donor.bloodGroup !== bloodGroup) return false;
                    if (city && !donor.city.toLowerCase().includes(city)) return false;
                    if (availability === 'available') {
                        const daysSince = this.daysSince(donor.lastDonation);
                        if (daysSince < 56) return false;
                    }
                    if (availability === 'recent') {
                        const daysSince = this.daysSince(donor.lastDonation);
                        if (daysSince >= 56) return false;
                    }
                    return true;
                });

                // Sort
                filtered.sort((a, b) => {
                    if (sortBy === 'name') return a.name.localeCompare(b.name);
                    if (sortBy === 'date') return new Date(b.lastDonation) - new Date(a.lastDonation);
                    if (sortBy === 'distance') return a.distance - b.distance;
                    return 0;
                });

                const html = filtered.map(donor => this.donorCard(donor)).join('');
                document.getElementById('donorResults').innerHTML = html || '<p style="text-align:center;padding:2rem;">No donors found matching your criteria</p>';

                // Add click handlers
                document.querySelectorAll('[data-donor-id]').forEach(card => {
                    card.addEventListener('click', () => {
                        this.showDonorProfile(card.dataset.donorId);
                    });
                });
            },

            donorCard(donor) {
                const daysSince = this.daysSince(donor.lastDonation);
                const available = daysSince >= 56;
                const initials = donor.name.split(' ').map(n => n[0]).join('');
                const bloodClass = 'blood-' + donor.bloodGroup.toLowerCase().replace('+', '-pos').replace('-', '-neg');

                return `
                    <div class="card" data-donor-id="${donor.id}" style="cursor: pointer;">
                        <div class="donor-header">
                            <div class="avatar">${initials}</div>
                            <div class="donor-info">
                                <h3>${donor.name}</h3>
                                <span class="blood-badge ${bloodClass}">${donor.bloodGroup}</span>
                            </div>
                        </div>
                        <div class="donor-meta">
                            <span>
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                </svg>
                                ${donor.city}
                            </span>
                            <span>
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                                </svg>
                                ${daysSince} days ago
                            </span>
                            <span>
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                                ${donor.age} yrs
                            </span>
                        </div>
                        <div style="margin-top: 0.5rem;">
                            ${available ? 
                                '<span style="color: var(--success); font-weight: 600;">✓ Available</span>' :
                                '<span style="color: var(--text-secondary);">Recently donated</span>'}
                        </div>
                    </div>
                `;
            },

            showDonorProfile(id) {
                const donor = this.donors.find(d => d.id === id);
                if (!donor) return;

                const daysSince = this.daysSince(donor.lastDonation);
                const available = daysSince >= 56;
                const initials = donor.name.split(' ').map(n => n[0]).join('');
                const bloodClass = 'blood-' + donor.bloodGroup.toLowerCase().replace('+', '-pos').replace('-', '-neg');

                const modalBody = document.getElementById('modalBody');
                modalBody.innerHTML = `
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <div class="avatar" style="width: 100px; height: 100px; font-size: 2.5rem; margin: 0 auto 1rem;">${initials}</div>
                        <h2>${donor.name}</h2>
                        <span class="blood-badge ${bloodClass}">${donor.bloodGroup}</span>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                        <div>
                            <strong>Age:</strong> ${donor.age} years
                        </div>
                        <div>
                            <strong>Gender:</strong> ${donor.gender}
                        </div>
                        <div>
                            <strong>City:</strong> ${donor.city}
                        </div>
                        <div>
                            <strong>Last Donation:</strong> ${this.formatDate(donor.lastDonation)}
                        </div>
                    </div>

                    ${donor.notes ? `
                        <div style="padding: 1rem; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 1.5rem;">
                            <strong>Notes:</strong><br>
                            ${donor.notes}
                        </div>
                    ` : ''}

                    <div style="padding: 1rem; background: ${available ? 'var(--success)' : 'var(--bg-tertiary)'}; color: ${available ? 'white' : 'var(--text)'}; border-radius: 8px; margin-bottom: 1.5rem; text-align: center;">
                        ${available ? 
                            '<strong>✓ Available for donation</strong>' :
                            `<strong>Recently donated</strong><br><small>Can donate again in ${56 - daysSince} days</small>`}
                    </div>

                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="App.contactDonor('${donor.id}')" style="flex: 1;">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            Contact Donor
                        </button>
                        <button class="btn btn-outline" onclick="App.reportUnavailable('${donor.id}')">
                            Report Unavailable
                        </button>
                    </div>
                `;

                document.getElementById('donorModal').classList.add('active');
            },

            contactDonor(id) {
                const donor = this.donors.find(d => d.id === id);
                if (!donor) return;

                // Copy masked contact
                const maskedPhone = donor.phone.slice(0, -4) + '****';
                const maskedEmail = donor.email.split('@')[0].slice(0, 3) + '***@' + donor.email.split('@')[1];
                
                const contactInfo = `Contact: ${donor.name}\nPhone: ${maskedPhone}\nEmail: ${maskedEmail}`;
                navigator.clipboard.writeText(contactInfo);

                const message = `Hi ${donor.name}, I saw your profile on LifeFlow and am in need of ${donor.bloodGroup} blood. Would you be available to donate? Thank you for considering.`;
                
                this.showToast('Contact information copied! Here\'s a recommended message:', 'success');
                setTimeout(() => {
                    navigator.clipboard.writeText(message);
                    this.showToast('Message template copied to clipboard!', 'success');
                }, 1500);
            },

            async reportUnavailable(id) {
                const donor = this.donors.find(d => d.id === id);
                if (!donor) return;

                try {
                    // Update last donation to today
                    donor.lastDonation = new Date().toISOString().split('T')[0];
                    
                    const response = await fetch(`${API_BASE_URL}/donors/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ lastDonation: donor.lastDonation })
                    });

                    if (response.ok) {
                        await this.loadData();
                        this.renderDonors();
                        this.updateStats();
                        this.updateDashboard();
                        
                        document.getElementById('donorModal').classList.remove('active');
                        this.showToast('Donor marked as recently donated', 'success');
                    } else {
                        this.showToast('Failed to update donor status', 'error');
                    }
                } catch (error) {
                    console.error('Error updating donor:', error);
                    this.showToast('Failed to update donor status', 'error');
                }
            },

            async handleRegister(e) {
                e.preventDefault();
                
                // Validation
                const form = e.target;
                let isValid = true;

                // Clear previous errors
                form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

                // Name
                const name = document.getElementById('regName').value.trim();
                if (!name || name.length < 2) {
                    this.setFieldError('regName', true);
                    isValid = false;
                }

                // DOB & Age
                const dob = document.getElementById('regDob').value;
                const age = this.calculateAge(dob);
                if (!dob || age < 18 || age > 65) {
                    this.setFieldError('regDob', true);
                    isValid = false;
                }

                // Gender
                if (!document.getElementById('regGender').value) {
                    this.setFieldError('regGender', true);
                    isValid = false;
                }

                // Blood group
                if (!document.getElementById('regBloodGroup').value) {
                    this.setFieldError('regBloodGroup', true);
                    isValid = false;
                }

                // Phone
                const phone = document.getElementById('regPhone').value.trim();
                if (!phone || phone.length < 10) {
                    this.setFieldError('regPhone', true);
                    isValid = false;
                }

                // Email
                const email = document.getElementById('regEmail').value.trim();
                if (!email || !email.includes('@')) {
                    this.setFieldError('regEmail', true);
                    isValid = false;
                }

                // City
                const city = document.getElementById('regCity').value.trim();
                if (!city) {
                    this.setFieldError('regCity', true);
                    isValid = false;
                }

                // Consent
                if (!document.getElementById('regConsent').checked) {
                    this.setFieldError('regConsent', true);
                    isValid = false;
                }

                if (!isValid) {
                    this.showToast('Please correct the errors in the form', 'error');
                    return;
                }

                // Create donor
                const newDonor = {
                    name: name,
                    bloodGroup: document.getElementById('regBloodGroup').value,
                    city: city,
                    lastDonation: document.getElementById('regLastDonation').value || new Date(Date.now() - 90*24*60*60*1000).toISOString().split('T')[0],
                    age: age,
                    gender: document.getElementById('regGender').value,
                    phone: phone,
                    email: email,
                    notes: document.getElementById('regNotes').value.trim(),
                    photo: null,
                    registered: new Date().toISOString().split('T')[0],
                    distance: Math.random() * 10
                };

                try {
                    const response = await fetch(`${API_BASE_URL}/donors`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newDonor)
                    });

                    if (response.ok) {
                        await this.loadData();
                        this.updateStats();
                        this.updateDashboard();

                        // Reset form
                        form.reset();
                        document.getElementById('photoPreview').classList.add('hidden');

                        // Show success and navigate
                        this.showToast('Registration successful! Thank you for joining LifeFlow.', 'success');
                        setTimeout(() => {
                            this.navigateTo('search');
                            this.renderDonors();
                        }, 1500);
                    } else {
                        const error = await response.json();
                        this.showToast('Registration failed: ' + (error.error || 'Unknown error'), 'error');
                    }
                } catch (error) {
                    console.error('Error registering donor:', error);
                    this.showToast('Failed to register. Please check your connection.', 'error');
                }
            },

            async handleRequest(e) {
                e.preventDefault();
                
                const form = e.target;
                let isValid = true;

                // Clear previous errors
                form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

                // Validate all fields
                if (!document.getElementById('reqBloodGroup').value) {
                    this.setFieldError('reqBloodGroup', true);
                    isValid = false;
                }

                const units = parseInt(document.getElementById('reqUnits').value);
                if (!units || units < 1 || units > 10) {
                    this.setFieldError('reqUnits', true);
                    isValid = false;
                }

                if (!document.getElementById('reqHospital').value.trim()) {
                    this.setFieldError('reqHospital', true);
                    isValid = false;
                }

                if (!document.getElementById('reqCity').value.trim()) {
                    this.setFieldError('reqCity', true);
                    isValid = false;
                }

                if (!document.getElementById('reqUrgency').value) {
                    this.setFieldError('reqUrgency', true);
                    isValid = false;
                }

                if (!document.getElementById('reqContact').value.trim()) {
                    this.setFieldError('reqContact', true);
                    isValid = false;
                }

                if (!document.getElementById('reqPhone').value.trim()) {
                    this.setFieldError('reqPhone', true);
                    isValid = false;
                }

                if (!isValid) {
                    this.showToast('Please correct the errors in the form', 'error');
                    return;
                }

                // Create request
                const newRequest = {
                    bloodGroup: document.getElementById('reqBloodGroup').value,
                    units: units,
                    hospital: document.getElementById('reqHospital').value.trim(),
                    city: document.getElementById('reqCity').value.trim(),
                    urgency: document.getElementById('reqUrgency').value,
                    contact: document.getElementById('reqContact').value.trim(),
                    phone: document.getElementById('reqPhone').value.trim(),
                    details: document.getElementById('reqDetails').value.trim(),
                    created: new Date().toISOString()
                };

                try {
                    const response = await fetch(`${API_BASE_URL}/requests`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newRequest)
                    });

                    if (response.ok) {
                        await this.loadData();
                        this.updateStats();
                        this.updateDashboard();

                        // Reset form
                        form.reset();

                        // Show success and navigate
                        this.showToast('Blood request posted successfully!', 'success');
                        setTimeout(() => {
                            this.navigateTo('requests');
                            this.renderRequests();
                        }, 1500);
                    } else {
                        const error = await response.json();
                        this.showToast('Failed to post request: ' + (error.error || 'Unknown error'), 'error');
                    }
                } catch (error) {
                    console.error('Error posting request:', error);
                    this.showToast('Failed to post request. Please check your connection.', 'error');
                }
            },

            renderRequests() {
                const bloodFilter = document.getElementById('requestFilterBlood').value;
                const cityFilter = document.getElementById('requestFilterCity').value.toLowerCase();
                const urgencyFilter = document.getElementById('requestFilterUrgency').value;

                let filtered = this.requests.filter(req => {
                    if (bloodFilter && req.bloodGroup !== bloodFilter) return false;
                    if (cityFilter && !req.city.toLowerCase().includes(cityFilter)) return false;
                    if (urgencyFilter && req.urgency !== urgencyFilter) return false;
                    return true;
                });

                // Sort by urgency and date
                filtered.sort((a, b) => {
                    const urgencyOrder = { high: 0, medium: 1, low: 2 };
                    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
                        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
                    }
                    return new Date(b.created) - new Date(a.created);
                });

                const html = filtered.map(req => this.requestCard(req)).join('');
                document.getElementById('requestsList').innerHTML = html || '<p style="text-align:center;padding:2rem;">No blood requests found</p>';

                // Add respond handlers
                document.querySelectorAll('[data-request-id]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        this.respondToRequest(btn.dataset.requestId);
                    });
                });
            },

            requestCard(req) {
                const bloodClass = 'blood-' + req.bloodGroup.toLowerCase().replace('+', '-pos').replace('-', '-neg');
                const urgencyClass = 'urgency-' + req.urgency;
                const timeAgo = this.timeAgo(req.created);

                return `
                    <div class="request-card ${req.urgency === 'high' ? 'urgent' : ''}">
                        <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
                            <div>
                                <h3 style="margin-bottom: 0.5rem;">${req.hospital}</h3>
                                <span class="blood-badge ${bloodClass}">${req.bloodGroup}</span>
                                <span class="urgency-badge ${urgencyClass}" style="margin-left: 0.5rem;">${req.urgency}</span>
                            </div>
                            <button class="btn btn-primary" data-request-id="${req.id}">Respond</button>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem; font-size: 0.875rem;">
                            <div>
                                <strong>Units Needed:</strong> ${req.units}
                            </div>
                            <div>
                                <strong>City:</strong> ${req.city}
                            </div>
                            <div>
                                <strong>User Name:</strong> ${req.contact}
                            </div>
                            <div>
                                <strong>User Number:</strong> ${req.phone}
                            </div>
                            <div>
                                <strong>Posted:</strong> ${timeAgo}
                            </div>
                        </div>
                        
                        ${req.details ? `
                            <div style="padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px; font-size: 0.875rem;">
                                ${req.details}
                            </div>
                        ` : ''}
                    </div>
                `;
            },

            respondToRequest(id) {
                const request = this.requests.find(r => r.id === id);
                if (!request) return;

                const message = `Hello ${request.contact},

I saw your blood request on LifeFlow for ${request.bloodGroup} blood at ${request.hospital}, ${request.city}.

I am available to donate blood. Here are my details:
- Blood Group: [Your blood group]
- Available: [Your availability]
- Contact Number: [Your phone number]

Please contact me at your earliest convenience.

Best regards`;

                navigator.clipboard.writeText(message);
                this.showToast(`Response template copied! Contact ${request.contact} at ${request.phone}`, 'success');
            },

            updateDashboard() {
                // Summary stats
                document.getElementById('dashTotalDonors').textContent = this.donors.length;
                document.getElementById('dashActiveRequests').textContent = this.requests.length;
                
                const available = this.donors.filter(d => this.daysSince(d.lastDonation) >= 56).length;
                document.getElementById('dashAvailable').textContent = available;
                
                const cities = [...new Set(this.donors.map(d => d.city))].length;
                document.getElementById('dashCities').textContent = cities;

                // Blood group chart
                const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
                const counts = {};
                bloodGroups.forEach(bg => {
                    counts[bg] = this.donors.filter(d => d.bloodGroup === bg).length;
                });

                const maxCount = Math.max(...Object.values(counts), 1);
                const chartHTML = bloodGroups.map(bg => {
                    const count = counts[bg];
                    const percentage = (count / maxCount) * 100;
                    return `
                        <div class="chart-bar">
                            <div class="chart-label">${bg}</div>
                            <div class="chart-bar-fill">
                                <div class="chart-bar-value" style="width: ${percentage}%">
                                    ${count}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
                document.getElementById('bloodGroupChart').innerHTML = chartHTML;

                // Recent registrations
                const recent = [...this.donors]
                    .sort((a, b) => new Date(b.registered) - new Date(a.registered))
                    .slice(0, 5);
                
                const recentHTML = recent.length ? recent.map(d => `
                    <div style="padding: 0.75rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${d.name}</strong>
                            <span style="margin-left: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">${d.bloodGroup} • ${d.city}</span>
                        </div>
                        <span style="font-size: 0.875rem; color: var(--text-secondary);">${this.formatDate(d.registered)}</span>
                    </div>
                `).join('') : '<p style="text-align: center; padding: 1rem; color: var(--text-secondary);">No recent registrations</p>';
                
                document.getElementById('recentDonors').innerHTML = recentHTML;
            },

            setFieldError(fieldId, hasError) {
                const field = document.getElementById(fieldId);
                const formGroup = field.closest('.form-group');
                if (hasError) {
                    formGroup.classList.add('error');
                } else {
                    formGroup.classList.remove('error');
                }
            },

            showToast(message, type = 'success') {
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.setAttribute('role', 'alert');
                toast.innerHTML = `
                    <div style="display: flex; align-items: start; gap: 0.75rem;">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0; margin-top: 2px;">
                            ${type === 'success' ? 
                                '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>' :
                                '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>'}
                        </svg>
                        <div>${message}</div>
                    </div>
                `;
                
                document.getElementById('toastContainer').appendChild(toast);
                
                setTimeout(() => {
                    toast.style.opacity = '0';
                    setTimeout(() => toast.remove(), 300);
                }, 4000);
            },

            daysSince(dateString) {
                const date = new Date(dateString);
                const now = new Date();
                const diff = now - date;
                return Math.floor(diff / (1000 * 60 * 60 * 24));
            },

            calculateAge(dateString) {
                const today = new Date();
                const birthDate = new Date(dateString);
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            },

            formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            },

            timeAgo(dateString) {
                const date = new Date(dateString);
                const now = new Date();
                const seconds = Math.floor((now - date) / 1000);
                
                const intervals = [
                    { label: 'year', seconds: 31536000 },
                    { label: 'month', seconds: 2592000 },
                    { label: 'day', seconds: 86400 },
                    { label: 'hour', seconds: 3600 },
                    { label: 'minute', seconds: 60 }
                ];
                
                for (const interval of intervals) {
                    const count = Math.floor(seconds / interval.seconds);
                    if (count >= 1) {
                        return count === 1 ? `1 ${interval.label} ago` : `${count} ${interval.label}s ago`;
                    }
                }
                
                return 'just now';
            }
        };

        // Initialize app when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => App.init());
        } else {
            App.init();
        }
        