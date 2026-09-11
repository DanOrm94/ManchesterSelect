interface Env {
  TURNSTILE_SECRET_KEY: string;
  CONTACT_TO_EMAIL: string;
  EMAIL: SendEmail;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const form = await request.formData();
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const message = String(form.get('message') || '').trim();
    const tier = String(form.get('tier') || '').trim();
    const token = String(form.get('turnstile_token') || form.get('cf-turnstile-response') || '').trim();

    if (!name || !email || !message) {
      return new Response('Please complete the required fields.', { status: 400 });
    }

    if (!env.TURNSTILE_SECRET_KEY || !token) {
      return new Response('Turnstile is not configured.', { status: 503 });
    }

    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: request.headers.get('CF-Connecting-IP') || '',
      }),
    });

    const result = await verification.json() as { success?: boolean };
    if (!result.success) {
      return new Response('Security verification failed.', { status: 403 });
    }

    if (!env.CONTACT_TO_EMAIL) {
      return new Response('Email delivery is not configured.', { status: 503 });
    }

    const subject = `Manchester Select enquiry${tier ? ` — ${tier}` : ''}`;
    const text = `Name: ${name}\nEmail: ${email}\nTier: ${tier || 'Not specified'}\n\n${message}`;

    try {
      await env.EMAIL.send({
        from: 'info@mcrselect.co.uk',
        to: env.CONTACT_TO_EMAIL,
        replyTo: email,
        subject,
        text,
      });
    } catch {
      return new Response('Unable to send your enquiry right now.', { status: 502 });
    }

    return new Response('Thanks — your enquiry has been sent.', { status: 200 });
  } catch {
    return new Response('Unable to process the enquiry.', { status: 500 });
  }
};
