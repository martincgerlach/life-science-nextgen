const allowedRoles = new Set([
  "Student",
  "PhD",
  "Early-career professional",
  "Mid-stage professional",
  "Other",
]);

function json(body, init = {}) {
  return Response.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init.headers || {}),
    },
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed." }, { status: 405 });
  }

  if (!env.DB) {
    return json(
      { ok: false, error: "Database binding is not configured." },
      { status: 500 },
    );
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const email = String(payload.email || "").trim().toLowerCase();
  const role = String(payload.role || "").trim();

  if (!isValidEmail(email)) {
    return json({ ok: false, error: "A valid email is required." }, { status: 400 });
  }

  if (!allowedRoles.has(role)) {
    return json({ ok: false, error: "A valid role is required." }, { status: 400 });
  }

  try {
    const insert = await env.DB.prepare(
      "INSERT OR IGNORE INTO signups (email, role) VALUES (?, ?)",
    )
      .bind(email, role)
      .run();

    const signup = await env.DB.prepare(
      "SELECT id, email, role, created_at FROM signups WHERE email = ?",
    )
      .bind(email)
      .first();

    if (!signup) {
      return json({ ok: false, error: "Signup was not saved." }, { status: 500 });
    }

    const created = Number(insert.meta?.changes || 0) > 0;

    return json(
      {
        ok: true,
        status: created ? "created" : "already_registered",
        signup,
      },
      { status: created ? 201 : 200 },
    );
  } catch (error) {
    return json({ ok: false, error: "Database error." }, { status: 500 });
  }
}
