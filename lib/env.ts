export const CODA_API_TOKEN = process.env.CODA_API_TOKEN;
export const CODA_DOC_ID = process.env.CODA_DOC_ID;

if (!CODA_API_TOKEN) {
  throw new Error('CODA_API_TOKEN is not defined in environment variables');
}

if (!CODA_DOC_ID) {
  throw new Error('CODA_DOC_ID is not defined in environment variables');
} 