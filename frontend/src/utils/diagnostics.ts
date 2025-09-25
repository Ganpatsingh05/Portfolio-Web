// Quick diagnostic tool to check backend status
export const runBackendDiagnostics = async () => {
  const backendUrl = 'https://portfolio-web-gsr.onrender.com';
  console.log('🏥 Running Backend Health Diagnostics');
  console.log('====================================');
  console.log(`Target: ${backendUrl}`);
  console.log(`From: ${window.location.origin}\n`);

  // Test 1: Basic reachability (no-cors mode)
  console.log('1️⃣ Testing basic reachability...');
  try {
    await fetch(backendUrl, { mode: 'no-cors' });
    console.log('✅ Backend server appears to be reachable (no-cors test passed)');
  } catch (error) {
    console.log('❌ Backend server appears to be unreachable');
    console.log('Error:', error);
    return { reachable: false, error };
  }

  // Test 2: Health endpoint
  console.log('\n2️⃣ Testing health endpoint...');
  try {
    const response = await fetch(`${backendUrl}/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Health endpoint working:', data);
    } else {
      console.log(`❌ Health endpoint returned: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log('❌ Health endpoint failed:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.log('💡 This suggests a CORS issue - the server is reachable but blocking cross-origin requests');
    }
  }

  // Test 3: CORS pre-flight check
  console.log('\n3️⃣ Testing CORS preflight...');
  try {
    const response = await fetch(`${backendUrl}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log(`CORS preflight response: ${response.status}`);
    console.log('CORS headers:', {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    });
  } catch (error) {
    console.log('❌ CORS preflight failed:', error);
  }

  // Test 4: Environment check
  console.log('\n4️⃣ Environment variables:');
  console.log(`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'Not set'}`);
  console.log(`Current origin: ${window.location.origin}`);

  // Test 5: Browser info
  console.log('\n5️⃣ Browser info:');
  console.log(`User agent: ${navigator.userAgent.substring(0, 100)}...`);
  console.log(`Platform: ${navigator.platform}`);
  console.log(`Online: ${navigator.onLine}`);

  return { completed: true };
};

// Make it globally available
if (typeof window !== 'undefined') {
  (window as any).runBackendDiagnostics = runBackendDiagnostics;
  console.log('🩺 Diagnostic function available: runBackendDiagnostics()');
}