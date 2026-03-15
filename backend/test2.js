async function test() {
    try {
        const loginRes = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test_prof_1742028979@example.com',
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;

        const res = await fetch('http://localhost:8080/api/students', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        console.log(JSON.stringify(data));
    } catch (e) {
        console.error("Fetch error:", e.message);
    }
}
test();
