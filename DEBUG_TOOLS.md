# Backend Connectivity Testing Tools

## Overview
These tools help you debug and test the connection between your frontend and backend services.

## Available Tools

### 1. Visual Debug Panel
A floating debug panel appears on your main page with a "🔧 Debug Backend" button in the bottom-right corner.

**Features:**
- **Full Test**: Comprehensive connectivity test covering all API endpoints
- **Quick Tests**: Individual tests for health, API health, personal info, and projects
- **Custom Endpoint**: Test any endpoint manually
- **Results Summary**: Visual display of test results

### 2. Browser Console Functions

Open your browser's developer console (F12) and use these functions:

#### Basic Tests
```javascript
// Quick connectivity test
testBackend()

// Comprehensive test with detailed results
fullBackendTest()

// Test a specific endpoint
testEndpoint('/api/health')
testEndpoint('/api/personal-info')
testEndpoint('/api/projects')
```

#### Environment Checks
```javascript
// Check environment variables and configuration
checkEnvironment()

// Simple ping test
pingBackend()

// Test CORS configuration
checkCORS()
```

## What Each Test Checks

### Health Check (`/health`)
- Basic server connectivity
- Server response time
- JSON response format

### CORS Test (`/api/health`)
- Cross-origin request handling
- Proper CORS headers
- Origin validation

### Personal Info API (`/api/personal-info`)
- Database connectivity
- Supabase integration
- Data retrieval functionality

### Projects API (`/api/projects`)
- Project data access
- API response format
- Data structure validation

### Analytics API (`/api/analytics`)
- POST request handling
- Event tracking functionality
- Request body processing

## Troubleshooting Common Issues

### CORS Errors
```
❌ CORS error: Failed to fetch
```
**Solution**: Update backend `CORS_ORIGIN` environment variable to include your frontend domain.

### Connection Refused
```
❌ Backend is not reachable
```
**Solution**: Check if backend server is running and accessible.

### 404 Errors
```
❌ Health check failed (404)
```
**Solution**: Verify API routes are properly configured on the backend.

### Authentication Issues
```
❌ Unauthorized (401)
```
**Solution**: Check if admin token is present and valid in localStorage.

## Backend Configuration Requirements

### Environment Variables Needed
```bash
# Backend
CORS_ORIGIN=http://localhost:3000,https://your-vercel-domain.vercel.app

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

### CORS Configuration
Your backend should allow requests from:
- `http://localhost:3000` (development)
- Your Vercel deployment domain (production)
- `*.vercel.app` (for preview deployments)

## Usage Examples

### Development Workflow
1. Start your development server (`npm run dev`)
2. Open browser to `http://localhost:3000`
3. Click the "🔧 Debug Backend" button
4. Run "Full Test" to check all connectivity
5. Check browser console for detailed logs

### Console Debugging
```javascript
// Check environment setup
checkEnvironment()

// Test basic connectivity
pingBackend()

// Run comprehensive test
fullBackendTest().then(results => {
  console.log('Test completed:', results);
});

// Test specific endpoint with custom data
testEndpoint('/api/analytics', 'POST', {
  event_type: 'test',
  event_data: { message: 'hello' }
});
```

### Production Testing
1. Deploy to Vercel
2. Open deployed site
3. Run tests using the debug panel or console
4. Verify CORS and environment variables are correct

## Expected Successful Output

```
🔗 Backend Connectivity Test Results
=====================================
Backend URL: https://portfolio-web-gsr.onrender.com
Timestamp: 2025-09-16T...

Summary: 5/5 tests passed

✅ HEALTH (234ms): Health check successful (200) - OK
✅ CORS (345ms): CORS test successful (200) - API is healthy
✅ PERSONALINFO (456ms): Personal info API successful - Got Ganpat Singh
✅ PROJECTS (567ms): Projects API successful - Found 3 projects
✅ ANALYTICS (678ms): Analytics API successful (200)
```

## Files Created

- `src/utils/backend-test.ts` - Core testing functions
- `src/utils/debug-tools.ts` - Environment and configuration checks
- `src/components/debug/BackendDebugPanel.tsx` - Visual debug interface