import { listCodaTables } from '@/utils/coda';

// Add region configuration for Vercel deployment
export const runtime = 'nodejs';
export const preferredRegion = 'iad1'; // US East (N. Virginia)

export default async function TablesPage() {
  const result = await listCodaTables();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Coda Document Tables</h1>
      
      {result.success && result.tables ? (
        <div className="space-y-8">
          {result.tables.map((table) => (
            <div key={table.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {table.name}
              </h2>
              {table.description && (
                <p className="text-gray-600 mb-4">{table.description}</p>
              )}
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Columns</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {table.columns.map((column) => (
                        <tr key={column.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {column.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {column.type}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Number of rows: {table.rowCount}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded">
          <h2 className="text-xl font-semibold text-red-800">Failed to Load Tables</h2>
          <p className="mt-2">{result.error}</p>
        </div>
      )}
    </div>
  );
} 