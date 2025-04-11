import { testCodaAccess } from '@/utils/coda';

// Add region configuration for Vercel deployment
export const runtime = 'nodejs';
export const preferredRegion = 'iad1'; // US East (N. Virginia)

export default async function TestCodaPage() {
  const result = await testCodaAccess();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Coda API Access Test</h1>
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold">Testing Document ID:</h3>
        <code className="block mt-2 p-2 bg-white rounded">{result.docId}</code>
      </div>
      
      {result.success ? (
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-xl font-semibold text-green-800">Access Successful!</h2>
          <div className="mt-4 space-y-2">
            <p>API Token Owner: {result.userName}</p>
            <p>Document Name: {result.documentName}</p>
            <p>Access Level: {result.accessLevel}</p>
          </div>
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded">
          <h2 className="text-xl font-semibold text-red-800">Access Failed</h2>
          <pre className="mt-4 p-4 bg-red-50 rounded overflow-auto whitespace-pre-wrap">
            {result.error}
          </pre>
          <div className="mt-4 text-sm">
            <p className="font-semibold">Troubleshooting Tips:</p>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li>Check if your API token is correct in the .env file</li>
              <li>Make sure you have shared the document with the API token's account</li>
              <li>Try opening the document in your browser to verify access</li>
              <li>If using a workspace doc, make sure the API token has workspace access</li>
              <li>Check if the document requires specific permissions or is in a restricted folder</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 