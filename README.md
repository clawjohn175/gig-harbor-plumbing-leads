# Gig Harbor Plumbing Leads Site (MVP)

Simple static website to collect plumbing leads for Gig Harbor, Washington.

## What it does

- Presents a local plumbing lead capture landing page
- Collects contact info + issue details + urgency
- Sends leads to a backend API route (`/api/lead`)
- Forwards alerts by email (Resend) and optional SMS (Twilio)

## Run locally

Open `index.html` directly in a browser, or serve it:

```bash
python3 -m http.server 8080
```

Then visit: `http://localhost:8080/plumbing-leads-site/`

## Configure production alerts (Vercel)

Set these environment variables in your Vercel project settings:

### Required (email alerts)

- `RESEND_API_KEY`
- `LEAD_ALERT_EMAIL`
- `LEAD_FROM_EMAIL` (optional override; defaults to onboarding@resend.dev)

### Optional (SMS alerts)

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `PLUMBER_ALERT_NUMBER`

You can also copy `.env.example` for local development.

## Next production steps

1. Add spam protection (honeypot + reCAPTCHA)
2. Add TCPA-compliant consent language for SMS
3. Create plumber dashboard or automated dispatch rules
4. Add lead storage (Supabase/Postgres) for tracking + follow-up
