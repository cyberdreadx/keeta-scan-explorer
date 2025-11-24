import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let address: string;
    
    // Try to get address from request body
    try {
      const body = await req.json();
      address = body.address;
      console.log('Received address from body:', address);
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!address) {
      console.error('No address provided in request');
      return new Response(
        JSON.stringify({ error: 'Address parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Using Basescan API V2 to fetch transactions for the Base network
    const apiKey = Deno.env.get('BASESCAN_API_KEY');
    console.log('Fetching transactions for address:', address);
    
    const basescanUrl = `https://api.basescan.org/v2/api?chainid=8453&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&page=1&offset=20&apikey=${apiKey}`;
    
    const response = await fetch(basescanUrl);
    const data = await response.json();
    
    console.log('Basescan response status:', data.status, 'message:', data.message);

    return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=10'
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching Base transactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Base transactions', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
