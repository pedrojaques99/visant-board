// Add region configuration for Vercel deployment
export const runtime = 'nodejs';
export const preferredRegion = 'iad1'; // US East (N. Virginia)

const CODA_API_TOKEN = process.env.CODA_API_TOKEN;
const CODA_DOC_ID = process.env.CODA_DOC_ID;

const CODA_API_BASE = 'https://coda.io/apis/v1';

interface CodaTable {
  id: string;
  name: string;
  description?: string;
  rowCount: number;
  columns: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

export interface PortfolioItem {
  id: string;
  title: string;
  job: string;
  client: string;
  type: string;
  date: string;
  description: string;
  ptbr: string;
  thumb: string;
  video: string;
  credits: string;
  model3d: string;
  logo2d: string;
  image02: string;
  image03: string;
  image04: string;
  image05: string;
  image06: string;
  image07: string;
  image08: string;
  image09: string;
  image10: string;
  image11: string;
  image12: string;
  image13: string;
  image15: string;
  image16: string;
  image17: string;
  image18: string;
  image19: string;
  image20: string;
  image21: string;
  image22: string;
  image23: string;
  image24: string;
  image25: string;
}

interface PortfolioDataResponse {
  success: boolean;
  items?: PortfolioItem[];
  tipos?: string[];
  error?: string;
}

export async function testCodaAccess() {
  try {
    // First test the API token with a general API call
    const apiTest = await fetch(`${CODA_API_BASE}/whoami`, {
      headers: {
        'Authorization': `Bearer ${CODA_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!apiTest.ok) {
      const errorBody = await apiTest.text();
      throw new Error(`API token validation failed: ${apiTest.status} ${apiTest.statusText}\nDetails: ${errorBody}`);
    }

    const userInfo = await apiTest.json();
    console.log('API Token belongs to:', userInfo.name);

    // List all accessible documents
    const listDocsResponse = await fetch(`${CODA_API_BASE}/docs`, {
      headers: {
        'Authorization': `Bearer ${CODA_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (listDocsResponse.ok) {
      const docsData = await listDocsResponse.json();
      console.log('Accessible documents:', docsData.items);
    }

    // Then test specific document access
    const response = await fetch(`${CODA_API_BASE}/docs/${CODA_DOC_ID}`, {
      headers: {
        'Authorization': `Bearer ${CODA_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Full error response:', errorBody);
      throw new Error(`Coda API error: ${response.status} ${response.statusText}\nDetails: ${errorBody}`);
    }

    const data = await response.json();
    console.log('Coda API Access Test Results:', data);
    
    return {
      success: true,
      documentName: data.name,
      accessLevel: data.type,
      userName: userInfo.name,
      docId: CODA_DOC_ID
    };
  } catch (error) {
    console.error('Error testing Coda API access:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      docId: CODA_DOC_ID
    };
  }
}

export async function listCodaTables() {
  try {
    // Get all tables in the document
    const tablesResponse = await fetch(`${CODA_API_BASE}/docs/${CODA_DOC_ID}/tables`, {
      headers: {
        'Authorization': `Bearer ${CODA_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!tablesResponse.ok) {
      throw new Error(`Failed to fetch tables: ${tablesResponse.status} ${tablesResponse.statusText}`);
    }

    const tablesData = await tablesResponse.json();
    const tables: CodaTable[] = [];

    // Get details for each table
    for (const table of tablesData.items) {
      // Get table columns
      const columnsResponse = await fetch(`${CODA_API_BASE}/docs/${CODA_DOC_ID}/tables/${table.id}/columns`, {
        headers: {
          'Authorization': `Bearer ${CODA_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!columnsResponse.ok) {
        console.warn(`Failed to fetch columns for table ${table.name}`);
        continue;
      }

      const columnsData = await columnsResponse.json();
      
      // Get sample rows (first 5 rows)
      const rowsResponse = await fetch(`${CODA_API_BASE}/docs/${CODA_DOC_ID}/tables/${table.id}/rows?limit=5`, {
        headers: {
          'Authorization': `Bearer ${CODA_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      let rowCount = 0;
      if (rowsResponse.ok) {
        const rowsData = await rowsResponse.json();
        rowCount = rowsData.items.length;
      }

      tables.push({
        id: table.id,
        name: table.name,
        description: table.description,
        rowCount: rowCount,
        columns: columnsData.items.map((col: any) => ({
          id: col.id,
          name: col.name,
          type: col.type
        }))
      });
    }

    return {
      success: true,
      tables
    };
  } catch (error) {
    console.error('Error fetching Coda tables:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Helper function to collect image URLs from a Coda row
function collectImagesFromRow(values: any): string[] {
  const images: string[] = [];
  console.log('Collecting images from values:', values);

  // Try column IDs first
  for (let i = 1; i <= 10; i++) {
    const imageKey = `Image ${i.toString().padStart(2, '0')}`;
    const columnId = `c-image${i}`; // Replace with actual column IDs if different
    
    if (values[imageKey]) {
      console.log(`Found image at ${imageKey}:`, values[imageKey]);
      images.push(values[imageKey]);
    } else if (values[columnId]) {
      console.log(`Found image at ${columnId}:`, values[columnId]);
      images.push(values[columnId]);
    }
  }

  // Also check for a single image/thumbnail field
  if (values['Thumbnail'] && !images.includes(values['Thumbnail'])) {
    console.log('Found thumbnail:', values['Thumbnail']);
    images.push(values['Thumbnail']);
  }

  console.log('Collected images:', images);
  return images.filter(url => typeof url === 'string' && url.trim().length > 0);
}

export async function getPortfolioData(): Promise<PortfolioDataResponse> {
  try {
    const response = await fetch(`${CODA_API_BASE}/docs/${CODA_DOC_ID}/tables/grid-7B5GsoqgKn/rows`, {
      headers: {
        'Authorization': `Bearer ${CODA_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio data: ${response.statusText}`);
    }

    const data = await response.json();
    const items = data.items.map((row: any) => ({
      id: row.id,
      title: row.values['c-iiN3n6MEYb'] || '',
      job: row.values['c-XO-i1nglc5'] || '',
      client: row.values['c-lR6pD7jLuH'] || '',
      type: row.values['c-Rddnn9er3T'] || '',
      date: row.values['c-OHfxznTpkF'] || '',
      description: row.values['c-is7YUDQ1sQ'] || '',
      ptbr: row.values['c-V1pN1xw0YX'] || '',
      thumb: row.values['c-E8jRBgytkd'] || '',
      video: row.values['c-czpRT8O481'] || '',
      credits: row.values['c-IlJ9HvA1wE'] || '',
      model3d: row.values['c-oQXi3wWbeZ'] || '',
      logo2d: row.values['c-logo2d'] || '',
      image02: row.values['c-z1ZQeSebCy'] || '',
      image03: row.values['c-pGUgOu2reI'] || '',
      image04: row.values['c-W6-LDMJSKa'] || '',
      image05: row.values['c-rxIfH1hRP3'] || '',
      image06: row.values['c-s6fyHmse58'] || '',
      image07: row.values['c-LOa8e4nCkq'] || '',
      image08: row.values['c-0ghK6_C4j8'] || '',
      image09: row.values['c-jIynrl7RUZ'] || '',
      image10: row.values['c-04IvmYEhd2'] || '',
      image11: row.values['c-6NAP6bmBqv'] || '',
      image12: row.values['c-tAutX-ZqxJ'] || '',
      image13: row.values['c-vk39cR8F71'] || '',
      image15: row.values['c-sZWSNgNW3s'] || '',
      image16: row.values['c-NewBGsNkZS'] || '',
      image17: row.values['c-4I8UEY1Yz8'] || '',
      image18: row.values['c-Ht50OlmCEA'] || '',
      image19: row.values['c-uV1eotAzGV'] || '',
      image20: row.values['c-n_OqSyAAs7'] || '',
      image21: row.values['c-AHA9kFeaAJ'] || '',
      image22: row.values['c-pugBX7ZtIL'] || '',
      image23: row.values['c-Hp5XCZvrC_'] || '',
      image24: row.values['c-d6AT3-x9cv'] || '',
      image25: row.values['c-GOgBFSGEFK'] || ''
    }));

    // Extract unique types for filtering
    const uniqueTypes = Array.from(new Set(items.map((item: PortfolioItem) => item.type))).filter(Boolean) as string[];

    return {
      success: true,
      items,
      tipos: uniqueTypes
    };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getPortfolioItemById(id: string) {
  try {
    const response = await fetch(`${CODA_API_BASE}/docs/${CODA_DOC_ID}/tables/grid-7B5GsoqgKn/rows/${id}`, {
      headers: {
        'Authorization': `Bearer ${CODA_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio item: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    const item: PortfolioItem = {
      id: data.id,
      title: data.values['c-iiN3n6MEYb'] || '',
      job: data.values['c-XO-i1nglc5'] || '',
      client: data.values['c-lR6pD7jLuH'] || '',
      type: data.values['c-Rddnn9er3T'] || '',
      date: data.values['c-OHfxznTpkF'] || '',
      description: data.values['c-is7YUDQ1sQ'] || '',
      ptbr: data.values['c-V1pN1xw0YX'] || '',
      thumb: data.values['c-E8jRBgytkd'] || '',
      video: data.values['c-czpRT8O481'] || '',
      credits: data.values['c-IlJ9HvA1wE'] || '',
      model3d: data.values['c-oQXi3wWbeZ'] || '',
      logo2d: data.values['c-logo2d'] || '',
      image02: data.values['c-z1ZQeSebCy'] || '',
      image03: data.values['c-pGUgOu2reI'] || '',
      image04: data.values['c-W6-LDMJSKa'] || '',
      image05: data.values['c-rxIfH1hRP3'] || '',
      image06: data.values['c-s6fyHmse58'] || '',
      image07: data.values['c-LOa8e4nCkq'] || '',
      image08: data.values['c-0ghK6_C4j8'] || '',
      image09: data.values['c-jIynrl7RUZ'] || '',
      image10: data.values['c-04IvmYEhd2'] || '',
      image11: data.values['c-6NAP6bmBqv'] || '',
      image12: data.values['c-tAutX-ZqxJ'] || '',
      image13: data.values['c-vk39cR8F71'] || '',
      image15: data.values['c-sZWSNgNW3s'] || '',
      image16: data.values['c-NewBGsNkZS'] || '',
      image17: data.values['c-4I8UEY1Yz8'] || '',
      image18: data.values['c-Ht50OlmCEA'] || '',
      image19: data.values['c-uV1eotAzGV'] || '',
      image20: data.values['c-n_OqSyAAs7'] || '',
      image21: data.values['c-AHA9kFeaAJ'] || '',
      image22: data.values['c-pugBX7ZtIL'] || '',
      image23: data.values['c-Hp5XCZvrC_'] || '',
      image24: data.values['c-d6AT3-x9cv'] || '',
      image25: data.values['c-GOgBFSGEFK'] || ''
    };

    return {
      success: true,
      item
    };
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function listCodaTableColumnIds(tableId: string): Promise<{ success: boolean; columns?: { name: string, id: string }[], error?: string }> {
  try {
    const response = await fetch(`${CODA_API_BASE}/docs/${CODA_DOC_ID}/tables/${tableId}/columns?limit=100`, {
      headers: {
        'Authorization': `Bearer ${CODA_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Erro ao buscar colunas da tabela ${tableId}: ${response.status} ${response.statusText}\n${errorBody}`);
    }

    const data = await response.json();
    console.log('Total columns found:', data.items.length);

    const columns = data.items.map((col: any) => ({
      name: col.name,
      id: col.id,
    }));

    return {
      success: true,
      columns
    };
  } catch (error) {
    console.error('Erro ao listar colunas:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

export async function getStatistics() {
  try {
    // Get total projects (all rows from grid-7B5GsoqgKn)
    const projectsResponse = await fetch(`${CODA_API_BASE}/docs/${CODA_DOC_ID}/tables/grid-7B5GsoqgKn/rows?limit=1000`, {
      headers: {
        'Authorization': `Bearer ${CODA_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    // Get total clients (all rows from grid-emZAaCaN7j)
    const clientsResponse = await fetch(`${CODA_API_BASE}/docs/${CODA_DOC_ID}/tables/grid-emZAaCaN7j/rows?limit=1000`, {
      headers: {
        'Authorization': `Bearer ${CODA_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!projectsResponse.ok || !clientsResponse.ok) {
      throw new Error('Failed to fetch data from Coda');
    }

    const [projectsData, clientsData] = await Promise.all([
      projectsResponse.json(),
      clientsResponse.json()
    ]);

    // Count branding projects by filtering the projects data
    const brandingProjects = projectsData.items.filter((item: any) => {
      const type = item.values['c-Rddnn9er3T'] || '';
      return type.toLowerCase().includes('branding');
    });

    return {
      success: true,
      statistics: {
        totalProjects: projectsData.items?.length || 0,
        totalClients: clientsData.items?.length || 0,
        totalBrands: brandingProjects.length || 0
      }
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 