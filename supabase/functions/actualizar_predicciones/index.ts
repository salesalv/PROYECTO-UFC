import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const { evento_id } = await req.json();

  // Conexión a la base de datos usando Deno Postgres
  const connectionString = Deno.env.get('DATABASE_URL');
  const { Client } = await import("npm:pg");
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();

  // 1. Obtener resultado oficial
  const { rows: [resultado] } = await client.query(
    'SELECT * FROM resultados_eventos WHERE id = $1',
    [evento_id]
  );

  if (!resultado) {
    await client.end();
    return new Response(JSON.stringify({ error: 'Resultado no encontrado' }), { status: 404 });
  }

  // 2. Obtener predicciones de ese evento
  const { rows: predicciones } = await client.query(
    'SELECT * FROM predicciones WHERE evento = $1',
    [resultado.evento]
  );

  // 3. Comparar y actualizar
  for (const pred of predicciones) {
    let acierto = true;
    const prediccion = pred.prediccion;
    if (prediccion.winner && prediccion.winner !== resultado.winner) acierto = false;
    if (prediccion.method && prediccion.method !== resultado.method) acierto = false;
    if (prediccion.round && Array.isArray(prediccion.round) && prediccion.round[0] !== resultado.round) acierto = false;

    await client.query(
      'UPDATE predicciones SET acertada = $1 WHERE id = $2',
      [acierto, pred.id]
    );
  }

  await client.end();

  return new Response(JSON.stringify({ ok: true, updated: predicciones.length }), { status: 200 });
});