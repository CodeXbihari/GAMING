import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace('Bearer ', '');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(jwt);
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403 });
    }

    const { method } = req;
    const payload = method !== 'GET' ? await req.json().catch(() => ({})) : {};

    // ── GET: list all equipment ───────────────────────────────────────────
    if (method === 'GET') {
      const { data, error } = await supabaseAdmin.from('equipment').select('*').order('name');
      return new Response(JSON.stringify({ data, error }), {
        status: error ? 400 : 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── POST: create equipment ────────────────────────────────────────────
    if (method === 'POST') {
      const { name, type, price, inventory_count, description, specs, status } = payload;
      if (!name || !type || price == null) {
        return new Response(JSON.stringify({ error: 'name, type, and price are required' }), { status: 400 });
      }
      const newId = crypto.randomUUID();
      const { data, error } = await supabaseAdmin.from('equipment').insert({
        id: newId,
        name,
        type,
        price,
        inventory_count: inventory_count ?? 1,
        description: description ?? '',
        specs: specs ?? '',
        status: status ?? 'Available',
      }).select().single();

      if (!error) {
        await supabaseAdmin.from('audit_logs').insert({
          admin_id: user.id,
          action: 'create_equipment',
          target_table: 'equipment',
          target_id: newId,
          details: { name, type, price },
        });
      }
      return new Response(JSON.stringify({ data, error }), {
        status: error ? 400 : 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── PUT: update equipment ─────────────────────────────────────────────
    if (method === 'PUT') {
      const { id, ...updates } = payload;
      if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
      const { data, error } = await supabaseAdmin
        .from('equipment')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (!error) {
        await supabaseAdmin.from('audit_logs').insert({
          admin_id: user.id,
          action: 'update_equipment',
          target_table: 'equipment',
          target_id: id,
          details: updates,
        });
      }
      return new Response(JSON.stringify({ data, error }), {
        status: error ? 400 : 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── DELETE: remove equipment ──────────────────────────────────────────
    if (method === 'DELETE') {
      const { id } = payload;
      if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
      const { error } = await supabaseAdmin.from('equipment').delete().eq('id', id);
      if (!error) {
        await supabaseAdmin.from('audit_logs').insert({
          admin_id: user.id,
          action: 'delete_equipment',
          target_table: 'equipment',
          target_id: id,
          details: {},
        });
      }
      return new Response(JSON.stringify({ error }), {
        status: error ? 400 : 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message ?? 'Internal error' }), { status: 500 });
  }
});
