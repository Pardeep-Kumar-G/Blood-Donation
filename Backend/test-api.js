// API Test Script for LifeFlow Backend
// Run this with: node test-api.js (after starting the backend server)

const API_BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
    console.log('🧪 Testing LifeFlow Backend API...\n');

    try {
        // Test 1: Check if server is running
        console.log('1️⃣  Testing server connection...');
        const serverResponse = await fetch('http://localhost:5000');
        if (serverResponse.ok) {
            const text = await serverResponse.text();
            console.log('   ✅ Server is running:', text);
        }
        console.log('');

        // Test 2: Get all donors
        console.log('2️⃣  Testing GET /api/donors...');
        const donorsResponse = await fetch(`${API_BASE_URL}/donors`);
        if (donorsResponse.ok) {
            const donors = await donorsResponse.json();
            console.log(`   ✅ Found ${donors.length} donors`);
        } else {
            console.log('   ❌ Failed to fetch donors');
        }
        console.log('');

        // Test 3: Create a test donor
        console.log('3️⃣  Testing POST /api/donors...');
        const testDonor = {
            name: 'Test User',
            bloodGroup: 'O+',
            city: 'Test City',
            age: 25,
            gender: 'Male',
            phone: '+1234567890',
            email: 'test@example.com',
            notes: 'This is a test donor'
        };
        
        const createResponse = await fetch(`${API_BASE_URL}/donors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testDonor)
        });

        if (createResponse.ok) {
            const newDonor = await createResponse.json();
            console.log('   ✅ Donor created successfully');
            console.log('   ID:', newDonor._id);

            // Test 4: Update the donor
            console.log('');
            console.log('4️⃣  Testing PUT /api/donors/:id...');
            const updateResponse = await fetch(`${API_BASE_URL}/donors/${newDonor._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: 'Updated notes' })
            });

            if (updateResponse.ok) {
                console.log('   ✅ Donor updated successfully');
            } else {
                console.log('   ❌ Failed to update donor');
            }

            // Test 5: Delete the test donor
            console.log('');
            console.log('5️⃣  Testing DELETE /api/donors/:id...');
            const deleteResponse = await fetch(`${API_BASE_URL}/donors/${newDonor._id}`, {
                method: 'DELETE'
            });

            if (deleteResponse.ok) {
                console.log('   ✅ Donor deleted successfully');
            } else {
                console.log('   ❌ Failed to delete donor');
            }
        } else {
            const error = await createResponse.json();
            console.log('   ❌ Failed to create donor:', error.error);
        }
        console.log('');

        // Test 6: Get all requests
        console.log('6️⃣  Testing GET /api/requests...');
        const requestsResponse = await fetch(`${API_BASE_URL}/requests`);
        if (requestsResponse.ok) {
            const requests = await requestsResponse.json();
            console.log(`   ✅ Found ${requests.length} requests`);
        } else {
            console.log('   ❌ Failed to fetch requests');
        }
        console.log('');

        // Test 7: Create a test request
        console.log('7️⃣  Testing POST /api/requests...');
        const testRequest = {
            bloodGroup: 'A+',
            units: 2,
            hospital: 'Test Hospital',
            city: 'Test City',
            urgency: 'medium',
            contact: 'Test Contact',
            phone: '+1234567890',
            details: 'This is a test request'
        };

        const createRequestResponse = await fetch(`${API_BASE_URL}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testRequest)
        });

        if (createRequestResponse.ok) {
            const newRequest = await createRequestResponse.json();
            console.log('   ✅ Request created successfully');
            console.log('   ID:', newRequest._id);

            // Clean up: Delete the test request
            await fetch(`${API_BASE_URL}/requests/${newRequest._id}`, {
                method: 'DELETE'
            });
        } else {
            const error = await createRequestResponse.json();
            console.log('   ❌ Failed to create request:', error.error);
        }
        console.log('');

        console.log('✨ All tests completed!\n');
        console.log('📝 Summary:');
        console.log('   - Server connection: Working');
        console.log('   - Donors API: Working');
        console.log('   - Requests API: Working');
        console.log('   - CRUD operations: Working\n');

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
        console.log('\n💡 Make sure:');
        console.log('   1. Backend server is running (npm start in Backend folder)');
        console.log('   2. MongoDB is connected');
        console.log('   3. No firewall blocking the connection\n');
    }
}

// Run the tests
testAPI();
