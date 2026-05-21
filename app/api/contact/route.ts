import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

// NOTE: 'onboarding@resend.dev' is a Resend sandbox sender.
// It only delivers to the email address registered with the Resend account.
// For production sends to daniel@monkeysolutions.se from any sender, verify the
// monkeysolutions.se domain in the Resend Dashboard and change `from` to:
//   'Contact Form <contact@monkeysolutions.se>'
// Until then, use onboarding@resend.dev ONLY if daniel@monkeysolutions.se is
// the Resend account's registered email address.
//
// Resend is instantiated lazily inside the handler so that builds without
// RESEND_API_KEY succeed. The SDK throws at construction time when the key
// is absent, which would break `next build` for all other routes.

export async function POST(request: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY is not set');
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  let name: string, email: string, budget: string, project: string;
  try {
    const body = await request.json();
    name = String(body.name ?? '').trim();
    email = String(body.email ?? '').trim();
    budget = String(body.budget ?? '').trim();
    project = String(body.project ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!name || !email || !project) {
    return NextResponse.json(
      { error: 'Missing required fields: name, email, project' },
      { status: 400 }
    );
  }

  const { data, error } = await resend.emails.send({
    from: 'Contact request for Monkey Solutions <contact@notifications.monkeysolutions.se>',
    to: 'daniel@monkeysolutions.se',
    subject: `New contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\n${project}`,
    replyTo: email,
  });

  if (error) {
    console.error('[contact] Resend error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data?.id }, { status: 200 });
}
