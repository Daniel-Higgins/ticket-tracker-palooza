
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { testStubHubToken, testStubHubRequest } from "@/utils/api/ticket/testToken";

const StubHubTokenTest = () => {
  const [tokenResult, setTokenResult] = useState<string | null>(null);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGetToken = async () => {
    setIsLoading(true);
    setTokenResult(null);
    
    try {
      const result = await testStubHubToken();
      setTokenResult(result);
    } catch (error) {
      setTokenResult(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestApi = async () => {
    setIsLoading(true);
    setApiResult(null);
    
    try {
      const result = await testStubHubRequest();
      setApiResult(result);
    } catch (error) {
      setApiResult(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">StubHub API Token Test</h2>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-2">How to use:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Make sure you've added your StubHub credentials to the <code>api_credentials</code> table in Supabase</li>
          <li>Click "Get Token" to test token acquisition</li>
          <li>If successful, try "Test API" to make a sample API request</li>
        </ol>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          onClick={handleGetToken} 
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Get Token'}
        </Button>
        
        <Button 
          onClick={handleTestApi} 
          disabled={isLoading || !tokenResult?.includes('Success')}
          variant="outline"
        >
          Test API
        </Button>
      </div>
      
      {tokenResult && (
        <Alert variant={tokenResult.includes('Error') ? 'destructive' : 'default'}>
          <AlertTitle>Token Result</AlertTitle>
          <AlertDescription>
            {tokenResult}
          </AlertDescription>
        </Alert>
      )}
      
      {apiResult && (
        <Alert variant={apiResult.includes('Error') ? 'destructive' : 'default'}>
          <AlertTitle>API Test Result</AlertTitle>
          <AlertDescription>
            {apiResult}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="border-t pt-4 text-sm text-gray-500">
        <p>All token operations are handled automatically by the <code>getStubHubToken()</code> function from <code>@/utils/api/ticket/stubhub.ts</code></p>
        <p>View the code for details on how tokens are requested, cached, and refreshed automatically.</p>
      </div>
    </div>
  );
};

export default StubHubTokenTest;
