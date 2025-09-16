// Quick test file to check API connection
export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:5000';

console.log('=== API CONNECTION TEST ===');
console.log('API_BASE:', API_BASE);
console.log('Environment:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

// Test the connection
fetch(`${API_BASE}/health`)
  .then(res => res.json())
  .then(data => console.log('Backend health check:', data))
  .catch(err => console.error('Backend connection failed:', err));

// Test login endpoint
fetch(`${API_BASE}/api/admin/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'GanpatPortfolio2024!' })
})
  .then(res => res.json())
  .then(data => console.log('Login test:', data))
  .catch(err => console.error('Login test failed:', err));