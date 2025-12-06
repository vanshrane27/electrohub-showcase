import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SPREADSHEET_ID = '1JGFLawXljs_qWanT3xD-pQb9wv8jZO9B_gHR330whDQ';

async function getAccessToken(serviceAccountKey: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: serviceAccountKey.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const claimB64 = btoa(JSON.stringify(claim)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const signatureInput = `${headerB64}.${claimB64}`;

  // Import the private key
  const pemContents = serviceAccountKey.private_key
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\n/g, '');
  
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  const key = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    encoder.encode(signatureInput)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${signatureInput}.${signatureB64}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

async function appendToSheet(accessToken: string, sheetName: string, values: any[][]): Promise<void> {
  const range = `${sheetName}!A:Z`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Google Sheets API error:', error);
    throw new Error(`Failed to append to sheet: ${error}`);
  }
  
  console.log('Successfully appended to sheet:', sheetName);
}

async function getSheetData(accessToken: string, sheetName: string): Promise<any[][]> {
  const range = `${sheetName}!A:Z`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Google Sheets API error:', error);
    // Return empty array if sheet doesn't exist
    if (response.status === 400) {
      return [];
    }
    throw new Error(`Failed to get sheet data: ${error}`);
  }

  const data = await response.json();
  return data.values || [];
}

async function ensureSheetHeaders(accessToken: string, sheetName: string, headers: string[]): Promise<void> {
  const existingData = await getSheetData(accessToken, sheetName);
  
  if (existingData.length === 0) {
    // Create the sheet first if it doesn't exist
    try {
      const createUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`;
      await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            addSheet: {
              properties: { title: sheetName }
            }
          }]
        }),
      });
    } catch (e) {
      console.log('Sheet might already exist:', e);
    }
    
    // Add headers
    await appendToSheet(accessToken, sheetName, [headers]);
    console.log('Created headers for sheet:', sheetName);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serviceAccountKeyStr = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKeyStr) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not configured');
    }

    const serviceAccountKey = JSON.parse(serviceAccountKeyStr);
    const accessToken = await getAccessToken(serviceAccountKey);

    const { action, data } = await req.json();
    console.log('Received action:', action, 'data:', data);

    if (action === 'addWarranty') {
      const headers = ['ID', 'Serial Number', 'Purchase Date', 'Name', 'Email', 'Registered At'];
      await ensureSheetHeaders(accessToken, 'Warranties', headers);
      
      const row = [
        crypto.randomUUID(),
        data.productSerial,
        data.purchaseDate,
        data.name,
        data.email,
        new Date().toISOString(),
      ];
      await appendToSheet(accessToken, 'Warranties', [row]);
      
      return new Response(JSON.stringify({ success: true, message: 'Warranty registered' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'addContactForm') {
      const headers = ['ID', 'First Name', 'Last Name', 'Phone', 'Message', 'Submitted At', 'Status'];
      await ensureSheetHeaders(accessToken, 'ContactForms', headers);
      
      const row = [
        crypto.randomUUID(),
        data.firstName,
        data.lastName,
        data.phone,
        data.message,
        new Date().toISOString(),
        'New',
      ];
      await appendToSheet(accessToken, 'ContactForms', [row]);
      
      return new Response(JSON.stringify({ success: true, message: 'Contact form submitted' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'getData') {
      const warranties = await getSheetData(accessToken, 'Warranties');
      const contactForms = await getSheetData(accessToken, 'ContactForms');
      
      // Parse data (skip header row)
      const warrantyData = warranties.slice(1).map(row => ({
        id: row[0] || '',
        serialNumber: row[1] || '',
        purchaseDate: row[2] || '',
        name: row[3] || '',
        email: row[4] || '',
        registeredAt: row[5] || '',
      }));

      const contactData = contactForms.slice(1).map(row => ({
        id: row[0] || '',
        firstName: row[1] || '',
        lastName: row[2] || '',
        phone: row[3] || '',
        message: row[4] || '',
        submittedAt: row[5] || '',
        status: row[6] || 'New',
      }));

      return new Response(JSON.stringify({ 
        success: true, 
        warranties: warrantyData,
        contactForms: contactData,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});