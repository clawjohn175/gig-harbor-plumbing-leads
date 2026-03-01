# Gig Harbor Plumbing Leads Site (MVP)

Simple static website to collect plumbing leads for Gig Harbor, Washington.

## What it does

- Presents a local plumbing lead capture landing page
- Collects contact info + issue details + urgency
- Stores submitted leads in browser `localStorage` (demo mode)

## Run locally

Open `index.html` directly in a browser, or serve it:

```bash
python3 -m http.server 8080
```

Then visit: `http://localhost:8080/plumbing-leads-site/`

## Next production steps

1. Replace localStorage with real backend endpoint (Supabase/Firebase/Node API)
2. Add spam protection (honeypot + reCAPTCHA)
3. Add TCPA-compliant consent language for SMS
4. Create plumber dashboard or automated dispatch rules
5. Send instant notifications (SMS/email) to partner plumbers
