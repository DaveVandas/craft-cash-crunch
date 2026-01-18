import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// CORS configuration - restrict to allowed origins
const ALLOWED_ORIGINS = [
  'https://earningsexplorer.shop',
  'https://www.earningsexplorer.shop',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8080',
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    // Allow Lovable preview + published domains
    return hostname.endsWith('lovable.app');
  } catch {
    return false;
  }
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && isAllowedOrigin(origin)
    ? origin
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  
  // Service role client for admin operations
  const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Authenticate the user using their JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Create anon client to properly verify JWT signature
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseAnonClient = createClient(supabaseUrl, anonKey);
    
    // Properly verify JWT signature and get user
    const { data: userData, error: userError } = await supabaseAnonClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is admin
    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      console.warn(`Non-admin user ${userData.user.id} attempted to access admin endpoint`);
      return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // SECURITY: Rate limiting for admin endpoints (20 requests per minute)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    const adminRateLimitKey = `admin_${userData.user.id}_${clientIp}`;
    
    const { data: isRateLimited } = await supabaseClient.rpc('check_rate_limit', {
      p_ip_address: adminRateLimitKey,
      p_max_requests: 20,
      p_window_seconds: 60
    });
    
    if (isRateLimited) {
      console.warn(`Rate limit exceeded for admin ${userData.user.id}`);
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // SECURITY: Audit logging for admin data access
    const auditLog = {
      admin_user_id: userData.user.id,
      action: 'admin_get_users',
      ip_address: clientIp,
      user_agent: req.headers.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString(),
    };
    console.log(`AUDIT: Admin data access - ${JSON.stringify(auditLog)}`);

    // Fetch all users from auth (requires service role)
    const authUsers: any[] = [];
    let page = 1;
    const perPage = 1000;

    while (true) {
      const { data, error: authError } = await supabaseClient.auth.admin.listUsers({ page, perPage });

      if (authError) {
        console.error("Error fetching auth users:", authError);
        throw authError;
      }

      authUsers.push(...data.users);

      if (data.users.length < perPage) break;
      page += 1;
    }

    // Fetch all user_access records
    const { data: accessData, error: accessError } = await supabaseClient
      .from("user_access")
      .select("*");

    if (accessError) {
      console.error("Error fetching user access:", accessError);
      throw accessError;
    }

    // Fetch all user roles
    const { data: rolesData, error: rolesError } = await supabaseClient
      .from("user_roles")
      .select("user_id, role");

    if (rolesError) {
      console.error("Error fetching user roles:", rolesError);
      throw rolesError;
    }

    // Combine the data
    const users = authUsers.map((authUser) => {
      const access = accessData?.find((a) => a.user_id === authUser.id);
      const roles = rolesData?.filter((r) => r.user_id === authUser.id).map((r) => r.role) || [];
      
      // Determine paid_at: use updated_at when has_lifetime_access and stripe_payment_intent_id exist
      let paid_at: string | null = null;
      if (access?.has_lifetime_access && access?.stripe_payment_intent_id) {
        paid_at = access.updated_at;
      }
      
      return {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at,
        has_lifetime_access: access?.has_lifetime_access ?? false,
        search_count: access?.search_count ?? 0,
        stripe_customer_id: access?.stripe_customer_id,
        stripe_payment_intent_id: access?.stripe_payment_intent_id,
        paid_at,
        referred_by_code: access?.referred_by_code,
        roles,
      };
    });

    console.log(`Returning ${users.length} users`);

    return new Response(JSON.stringify({ users }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin get users error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
