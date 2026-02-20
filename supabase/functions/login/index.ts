import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(':');
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const computedHash = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return computedHash === hashHex;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: user, error } = await supabase
      .from('kodusers')
      .select('uid, username, email, password_hash, role')
      .eq('username', username)
      .single();

    if (error || !user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate JWT using HMAC-SHA256
    const secret = Deno.env.get('JWT_SECRET') || 'kodbank-secret-key-2024';
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );

    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const jwt = await create(
      { alg: 'HS256', typ: 'JWT' },
      { sub: user.username, role: user.role, uid: user.uid, exp: getNumericDate(expiry) },
      key
    );

    // Store token
    await supabase.from('usertokens').insert({
      token: jwt,
      uid: user.uid,
      expiry: expiry.toISOString(),
    });

    return new Response(JSON.stringify({
      message: 'Login successful',
      token: jwt,
      user: { uid: user.uid, username: user.username, role: user.role },
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Set-Cookie': `kodbank_token=${jwt}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`,
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
