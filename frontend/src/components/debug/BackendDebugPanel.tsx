'use client';

import { useState } from 'react';
import { testBackendConnectivity, displayConnectivityResults, testEndpoint } from '@/utils/backend-test';

interface DebugPanelProps {
  className?: string;
}

export default function BackendDebugPanel({ className = '' }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [lastResults, setLastResults] = useState<any>(null);
  const [customEndpoint, setCustomEndpoint] = useState('/api/health');

  const runFullTest = async () => {
    setTesting(true);
    try {
      console.clear();
      console.log('🚀 Starting comprehensive backend connectivity test...');
      const results = await testBackendConnectivity();
      displayConnectivityResults(results);
      setLastResults(results);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  const testCustomEndpoint = async () => {
    setTesting(true);
    try {
      console.log(`🔍 Testing custom endpoint: ${customEndpoint}`);
      const result = await testEndpoint(customEndpoint);
      console.log('Custom endpoint test result:', result);
    } catch (error) {
      console.error('Custom endpoint test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  const quickTests = [
    { name: 'Health Check', endpoint: '/health' },
    { name: 'API Health', endpoint: '/api/health' },
    { name: 'Personal Info', endpoint: '/api/personal-info' },
    { name: 'Projects', endpoint: '/api/projects' },
  ];

  const runQuickTest = async (endpoint: string, name: string) => {
    setTesting(true);
    try {
      console.log(`🔍 Testing ${name}...`);
      const result = await testEndpoint(endpoint);
      console.log(`${name} result:`, result);
    } catch (error) {
      console.error(`${name} test failed:`, error);
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-50 ${className}`}
      >
        🔧 Debug Backend
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto z-50 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Backend Debug Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* Full Test */}
        <button
          onClick={runFullTest}
          disabled={testing}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded transition-colors"
        >
          {testing ? '🔄 Testing...' : '🚀 Run Full Test'}
        </button>

        {/* Quick Tests */}
        <div className="grid grid-cols-2 gap-2">
          {quickTests.map(({ name, endpoint }) => (
            <button
              key={endpoint}
              onClick={() => runQuickTest(endpoint, name)}
              disabled={testing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-2 py-1 rounded text-sm transition-colors"
            >
              {name}
            </button>
          ))}
        </div>

        {/* Custom Endpoint Test */}
        <div className="border-t pt-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custom Endpoint:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
              placeholder="/api/endpoint"
            />
            <button
              onClick={testCustomEndpoint}
              disabled={testing}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Test
            </button>
          </div>
        </div>

        {/* Backend URL Info */}
        <div className="border-t pt-3 text-xs text-gray-600 dark:text-gray-400">
          <p><strong>Backend URL:</strong></p>
          <p className="break-all">{process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-web-gsr.onrender.com'}</p>
        </div>

        {/* Last Test Results Summary */}
        {lastResults && (
          <div className="border-t pt-3 text-xs">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Last Test Results:</p>
            <div className="space-y-1">
              {Object.entries(lastResults.tests).map(([name, result]: [string, any]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 capitalize">{name}:</span>
                  <span className={result.status === 'passed' ? 'text-green-600' : 'text-red-600'}>
                    {result.status === 'passed' ? '✅' : '❌'}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {lastResults.summary.passed}/{lastResults.summary.total} tests passed
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-2">
          💡 Check browser console for detailed results
        </div>
      </div>
    </div>
  );
}