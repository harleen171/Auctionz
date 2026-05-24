
fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'John Doe',
    username: 'john_doe',
    email: 'john@example.com',
    password: 'Password123'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Token:', data.token);
  localStorage.setItem('token', data.token);
});

/**
 * 2. LOGIN - Login with credentials
 */
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'Password123'
  })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem('token', data.token);
  window.location.href = '/dashboard';
});


const token = localStorage.getItem('token');

fetch('http://localhost:3000/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log('Protected data:', data));

fetch('http://localhost:3000/api/auctions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Vintage Camera',
    description: 'Rare camera in excellent condition',
    category: 'Electronics',
    startingPrice: 50,
    startTime: new Date(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    condition: 'like-new',
    location: 'New York, NY',
    images: []
  })
})
.then(res => res.json())
.then(data => console.log('Auction created:', data));


fetch('http://localhost:3000/api/auctions?page=1&limit=10&status=active')
.then(res => res.json())
.then(data => console.log('Auctions:', data.auctions));


console.log('✅ Project setup complete! Start with: npm start');
