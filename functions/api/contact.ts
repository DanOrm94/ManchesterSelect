interface Env {
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const form = await request.formData();
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const message = String(form.get('message') || '').trim();
    const tier = String(form.get('tier') || '').trim();
    const token = String(form.get('turnstile_token') || form.get('cf-turnstile-response') || '').trim();
    if (!name || !email || !message) return new Response('Please complete the required fields.', { status: 400 });
    if (!env.TURNSTILE_SECRET_KEY || !token) return new Response('Turnstile is not configured.', { status: 503 });

    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get('CF-Connecting-IP') || '' }),
    });
    const result = await verification.json() as { success?: boolean };
    if (!result.success) return new Response('Security verification failed.', { status: 403 });

    if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) return new Response('Email delivery is not configured.', { status: 503 });
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Manchester Select <onboarding@resend.dev>', to: [env.CONTACT_TO_EMAIL], reply_to: email, subject: `Manchester Select enquiry${tier ? ` — ${tier}` : ''}`, text: `Name: ${name}\nEmail: ${email}\nTier: ${tier || 'Not specified'}\n\n${message}` }),
    });
    if (!emailResponse.ok) return new Response('Unable to send your enquiry right now.', { status: 502 });
    return new Response('Thanks — your enquiry has been sent.', { status: 200 });
  } catch {
    return new Response('Unable to process the enquiry.', { status: 500 });
  }
};
