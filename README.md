# U-properties MVP

Verified property listings for Lagos: rentals, sales, land and short-lets.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # fee, move-in cost and AI assistant checks
```

## What's in it

| Page | What it does |
| --- | --- |
| `/` | Home with plain-English search |
| `/search` | Filters by type, area, price, bedrooms and check level |
| `/listing/[id]` | Full move-in cost, checks done, chat, email, call the U-properties line, save, report |
| `/assistant` | AI assistant: searches listings, explains fees, titles and scams |
| `/messages` | Your conversations and saved properties |
| `/agents/join` | Agent / landlord sign-up: details, NIN + selfie, CAC, documents |
| `/agents/list` | Post a listing: fee caps enforced, AI description writer, document upload |
| `/admin` | Verification queue: approve agents and listings, handle scam reports |

## Placeholders to replace before real users

- **Data** is demo data in `lib/data.ts`, and chats, sign-ups and reports are saved in the browser (`lib/store.ts`). Move to a database such as Supabase.
- **Phone line** `PHONE_LINE` in `lib/data.ts` is a fake number. Get a real line with call masking from a telephony provider.
- **Email** enquiries are logged in the chat thread; connect an email service to actually send them.
- **AI assistant** is rule-based (`lib/assistant.ts`); swap in a Claude API call.
- **ID checks and document scans** are upload steps only; connect an identity provider (e.g. Smile ID, Dojah, Prembly) and OCR.
- **Fee caps** (10% agency, 10% legal) in `lib/money.ts` are a placeholder policy.
- **Admin** has no login yet.
- **Photos** are drawn placeholders; add image upload and storage.
