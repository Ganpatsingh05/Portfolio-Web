// Backend connectivity testing utilities

interface TestResult {
  status: 'passed' | 'failed' | 'pending';
  message: string;
  responseTime: number;
}

interface ConnectivityResults {
  timestamp: string;
  backendUrl: string;
  tests: {
    health: TestResult;
    cors: TestResult;
    personalInfo: TestResult;
    projects: TestResult;
    analytics: TestResult;
  };
  summary: { passed: number; failed: number; total: number };
}

declare global {
  interface Window {
    testBackend: () => Promise<boolean>;
    testEndpoint: (endpoint: string, method?: string, body?: any) => Promise<any>;
    fullBackendTest: () => Promise<ConnectivityResults>;
  }
}

export const testBackendConnectivity = async (): Promise<ConnectivityResults> => {
  const results: ConnectivityResults = {
    timestamp: new Date().toISOString(),
    backendUrl: '',
    tests: {
      health: { status: 'pending', message: '', responseTime: 0 },
      cors: { status: 'pending', message: '', responseTime: 0 },
      personalInfo: { status: 'pending', message: '', responseTime: 0 },
      projects: { status: 'pending', message: '', responseTime: 0 },
      analytics: { status: 'pending', message: '', responseTime: 0 }
    },
    summary: { passed: 0, failed: 0, total: 5 }
  };

  // Determine backend URL
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-web-gsr.onrender.com';
  results.backendUrl = backendUrl;

  console.log(`🔍 Testing backend connectivity to: ${backendUrl}`);

  // Test 1: Health Check
  try {
    const start = Date.now();
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const responseTime = Date.now() - start;
    const data = await response.json();
    
    if (response.ok) {
      results.tests.health = {
        status: 'passed',
        message: `Health check successful (${response.status}) - ${data.status}`,
        responseTime
      };
    } else {
      results.tests.health = {
        status: 'failed',
        message: `Health check failed (${response.status})`,
        responseTime
      };
    }
  } catch (error) {
    results.tests.health = {
      status: 'failed',
      message: `Health check error: ${error instanceof Error ? error.message : String(error)}`,
      responseTime: 0
    };
  }

  // Test 2: CORS Test
  try {
    const start = Date.now();
    const response = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      }
    });
    const responseTime = Date.now() - start;
    
    if (response.ok) {
      const data = await response.json();
      results.tests.cors = {
        status: 'passed',
        message: `CORS test successful (${response.status}) - ${data.message}`,
        responseTime
      };
    } else {
      results.tests.cors = {
        status: 'failed',
        message: `CORS test failed (${response.status}) - Check CORS configuration`,
        responseTime
      };
    }
  } catch (error) {
    results.tests.cors = {
      status: 'failed',
      message: `CORS error: ${error instanceof Error ? error.message : String(error)}`,
      responseTime: 0
    };
  }

  // Test 3: Personal Info API
  try {
    const start = Date.now();
    const response = await fetch(`${backendUrl}/api/personal-info`);
    const responseTime = Date.now() - start;
    
    if (response.ok) {
      const data = await response.json();
      results.tests.personalInfo = {
        status: 'passed',
        message: `Personal info API successful - Got ${data.data?.name || 'data'}`,
        responseTime
      };
    } else {
      results.tests.personalInfo = {
        status: 'failed',
        message: `Personal info API failed (${response.status})`,
        responseTime
      };
    }
  } catch (error) {
    results.tests.personalInfo = {
      status: 'failed',
      message: `Personal info API error: ${error instanceof Error ? error.message : String(error)}`,
      responseTime: 0
    };
  }

  // Test 4: Projects API
  try {
    const start = Date.now();
    const response = await fetch(`${backendUrl}/api/projects`);
    const responseTime = Date.now() - start;
    
    if (response.ok) {
      const data = await response.json();
      const projectCount = Array.isArray(data) ? data.length : (data.data?.length || 0);
      results.tests.projects = {
        status: 'passed',
        message: `Projects API successful - Found ${projectCount} projects`,
        responseTime
      };
    } else {
      results.tests.projects = {
        status: 'failed',
        message: `Projects API failed (${response.status})`,
        responseTime
      };
    }
  } catch (error) {
    results.tests.projects = {
      status: 'failed',
      message: `Projects API error: ${error instanceof Error ? error.message : String(error)}`,
      responseTime: 0
    };
  }

  // Test 5: Analytics API (POST test)
  try {
    const start = Date.now();
    const response = await fetch(`${backendUrl}/api/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'connectivity_test',
        event_data: { test: true, timestamp: new Date().toISOString() }
      })
    });
    const responseTime = Date.now() - start;
    
    if (response.ok) {
      results.tests.analytics = {
        status: 'passed',
        message: `Analytics API successful (${response.status})`,
        responseTime
      };
    } else {
      results.tests.analytics = {
        status: 'failed',
        message: `Analytics API failed (${response.status})`,
        responseTime
      };
    }
  } catch (error) {
    results.tests.analytics = {
      status: 'failed',
      message: `Analytics API error: ${error instanceof Error ? error.message : String(error)}`,
      responseTime: 0
    };
  }

  // Calculate summary
  Object.values(results.tests).forEach(test => {
    if (test.status === 'passed') {
      results.summary.passed++;
    } else {
      results.summary.failed++;
    }
  });

  return results;
};

export const displayConnectivityResults = (results: ConnectivityResults): boolean => {
  console.log('\n🔗 Backend Connectivity Test Results');
  console.log('=====================================');
  console.log(`Backend URL: ${results.backendUrl}`);
  console.log(`Timestamp: ${results.timestamp}`);
  console.log(`\nSummary: ${results.summary.passed}/${results.summary.total} tests passed\n`);

  Object.entries(results.tests).forEach(([testName, result]: [string, TestResult]) => {
    const icon = result.status === 'passed' ? '✅' : '❌';
    const time = result.responseTime > 0 ? ` (${result.responseTime}ms)` : '';
    console.log(`${icon} ${testName.toUpperCase()}${time}: ${result.message}`);
  });

  if (results.summary.failed > 0) {
    console.log('\n🔧 Troubleshooting Tips:');
    if (results.tests.health.status === 'failed') {
      console.log('- Backend server may be down or unreachable');
    }
    if (results.tests.cors.status === 'failed') {
      console.log('- Check CORS_ORIGIN environment variable in backend');
      console.log(`- Add "${window.location.origin}" to allowed origins`);
    }
    if (results.tests.personalInfo.status === 'failed' || results.tests.projects.status === 'failed') {
      console.log('- Database connection or Supabase configuration issues');
    }
  }

  return results.summary.failed === 0;
};

// Quick connectivity test for debugging
export const quickBackendTest = async () => {
  try {
    console.log('🚀 Running quick backend connectivity test...');
    const results = await testBackendConnectivity();
    return displayConnectivityResults(results);
  } catch (error) {
    console.error('❌ Connectivity test failed:', error);
    return false;
  }
};

// Test specific endpoint
export const testEndpoint = async (endpoint: string, method: string = 'GET', body: any = null) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-web-gsr.onrender.com';
  const fullUrl = endpoint.startsWith('http') ? endpoint : `${backendUrl}${endpoint}`;
  
  console.log(`🔍 Testing ${method} ${fullUrl}`);
  
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      }
    };
    
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }
    
    const start = Date.now();
    const response = await fetch(fullUrl, options);
    const responseTime = Date.now() - start;
    
    console.log(`Status: ${response.status} ${response.statusText} (${responseTime}ms)`);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      try {
        const data = await response.json();
        console.log('Response data:', data);
        return { success: true, data, responseTime, status: response.status };
      } catch (parseError) {
        const text = await response.text();
        console.log('Response text:', text);
        return { success: true, data: text, responseTime, status: response.status };
      }
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return { success: false, error: errorText, responseTime, status: response.status };
    }
  } catch (error) {
    console.error('Request failed:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error), responseTime: 0, status: 0 };
  }
};

// Make these functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testBackend = quickBackendTest;
  (window as any).testEndpoint = testEndpoint;
  (window as any).fullBackendTest = testBackendConnectivity;
  
  // Print helper info to console
  console.log('🔧 Backend Debug Functions Available:');
  console.log('- testBackend() - Run quick connectivity test');
  console.log('- fullBackendTest() - Run comprehensive test');
  console.log('- testEndpoint("/api/health") - Test specific endpoint');
}