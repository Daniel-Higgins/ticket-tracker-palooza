
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; 
import { 
  testStubHubToken, 
  testStubHubRequest,
  testTicketmasterToken,
  testTicketmasterRequest
} from "@/utils/api/ticket/testToken";

const StubHubTokenTest = () => {
  const [tokenResult, setTokenResult] = useState<string | null>(null);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'stubhub' | 'ticketmaster'>('stubhub');
  
  const handleGetToken = async () => {
    setIsLoading(true);
    setTokenResult(null);
    
    try {
      let result;
      if (activeProvider === 'stubhub') {
        result = await testStubHubToken();
      } else {
        result = await testTicketmasterToken();
      }
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
      let result;
      if (activeProvider === 'stubhub') {
        result = await testStubHubRequest();
      } else {
        result = await testTicketmasterRequest();
      }
      setApiResult(result);
    } catch (error) {
      setApiResult(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProviderChange = (value: string) => {
    setActiveProvider(value as 'stubhub' | 'ticketmaster');
    setTokenResult(null);
    setApiResult(null);
  };
  
  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Ticket API Token Test</h2>
      
      <Tabs 
        defaultValue="stubhub" 
        value={activeProvider}
        onValueChange={handleProviderChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="stubhub">StubHub</TabsTrigger>
          <TabsTrigger value="ticketmaster">Ticketmaster</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stubhub" className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">How to use StubHub API:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Make sure you've added your StubHub credentials to the <code>api_credentials</code> table in Supabase</li>
              <li>Set <code>provider="stubhub"</code>, <code>client_id</code> to your API key, and <code>client_secret</code> to your API secret</li>
              <li>Click "Get Token" to test token acquisition</li>
              <li>If successful, try "Test API" to make a sample API request</li>
            </ol>
          </div>
        </TabsContent>
        
        <TabsContent value="ticketmaster" className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">How to use Ticketmaster API:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Make sure you've added your Ticketmaster credentials to the <code>api_credentials</code> table in Supabase</li>
              <li>Set <code>provider="ticketmaster"</code>, <code>client_id</code> to your API key, and <code>client_secret</code> to your API secret</li>
              <li>Click "Get Token" to test token acquisition</li>
              <li>If successful, try "Test API" to make a sample API request</li>
            </ol>
          </div>
        </TabsContent>
      </Tabs>
      
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
        <p>All token operations are handled automatically by the <code>getTicketmasterToken()</code> and <code>getStubHubToken()</code> functions</p>
        <p>View the code in <code>@/utils/api/ticket/ticketmaster.ts</code> and <code>@/utils/api/ticket/stubhub.ts</code> for details.</p>
      </div>
    </div>
  );
};

export default StubHubTokenTest;
