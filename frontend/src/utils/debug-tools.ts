// Environment and configuration checker
export const checkEnvironment = () => {
  console.log('🔍 Environment Configuration Check');
  console.log('==================================');
  
  // Environment variables
  console.log('\n📦 Environment Variables:');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'Not set'}`);
  console.log(`BACKEND_URL: ${process.env.BACKEND_URL || 'Not set'}`);
  
  // Fallback URL determination
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-web-gsr.onrender.com';
  console.log(`\n🎯 Resolved Backend URL: ${backendUrl}`);
  
  // Client-side checks
  if (typeof window !== 'undefined') {
    console.log(`\n🌐 Client Environment:`);
    console.log(`Origin: ${window.location.origin}`);
    console.log(`Host: ${window.location.host}`);
    console.log(`Protocol: ${window.location.protocol}`);
    console.log(`User Agent: ${navigator.userAgent.slice(0, 100)}...`);
    
    // Check for localStorage token
    const token = localStorage.getItem('admin_token');
    console.log(`\n🔐 Authentication:`);
    console.log(`Admin token present: ${token ? 'Yes' : 'No'}`);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log(`Token expires: ${new Date(payload.exp * 1000).toLocaleString()}`);
        console.log(`Token user: ${payload.username || 'Unknown'}`);
      } catch (e) {
        console.log('Token format invalid');
      }
    }
  }
  
  // Network connectivity hints
  console.log('\n🌍 Network Connectivity Tips:');
  console.log('1. Check if backend server is running');
  console.log('2. Verify CORS configuration on backend');
  console.log('3. Ensure environment variables are set correctly');
  console.log('4. Test direct backend access in new tab');
  
  return {
    backendUrl,
    hasToken: typeof window !== 'undefined' ? !!localStorage.getItem('admin_token') : false,
    origin: typeof window !== 'undefined' ? window.location.origin : 'Unknown',
    nodeEnv: process.env.NODE_ENV,
    apiUrl: process.env.NEXT_PUBLIC_API_URL
  };
};

// Quick network test function
export const pingBackend = async () => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-web-gsr.onrender.com';
  console.log(`🏓 Pinging backend at ${backendUrl}...`);
  
  const start = Date.now();
  try {
    const response = await fetch(`${backendUrl}/health`);
    const responseTime = Date.now() - start;
    
    if (response.ok) {
      console.log(`✅ Backend is reachable (${responseTime}ms)`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      try {
        const data = await response.json();
        console.log('Response:', data);
      } catch (e) {
        console.log('Response is not JSON');
      }
      
      return true;
    } else {
      console.log(`❌ Backend returned error: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    const responseTime = Date.now() - start;
    console.log(`❌ Backend is not reachable (${responseTime}ms)`);
    console.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

// Check CORS specifically
export const checkCORS = async () => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-web-gsr.onrender.com';
  console.log(`🔒 Testing CORS with backend at ${backendUrl}...`);
  
  try {
    const response = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      }
    });
    
    if (response.ok) {
      console.log('✅ CORS is working correctly');
      console.log('Access-Control headers:', {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
      });
      return true;
    } else {
      console.log(`❌ CORS test failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log('❌ CORS test error:', error);
    if (error instanceof TypeError && error.message.includes('CORS')) {
      console.log('💡 This is likely a CORS configuration issue on the backend');
    }
    return false;
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  (window as any).checkEnvironment = checkEnvironment;
  (window as any).pingBackend = pingBackend;
  (window as any).checkCORS = checkCORS;
}