# Website #1 — BrightSmile Dental Clinic (Lahore)

Part of Abdullah's **100 Websites** series. Category: Health & Medical → Dental clinic.
Features per plan: Appointments, Treatments, Doctors, WhatsApp booking.

Multi-page static website — every page is its own file, with real images.

## Structure

```
01-dental-clinic/
├── index.html        → Home (hero, popular treatments, about teaser, doctors, reviews)
├── about.html        → Our story, stats, why choose us, clinic gallery
├── treatments.html   → All 6 treatments with photos & PKR prices
├── doctors.html      → 3 specialist doctor profiles
├── appointment.html  → Booking form → confirms on WhatsApp
├── contact.html      → Contact cards, map, clinic hours, FAQ
├── css/
│   └── style.css     → Shared design for all pages (responsive, animations)
├── js/
│   └── script.js     → Shared JS (nav, slider, FAQ, counters, booking form)
└── images/           → All photos used by the pages (14 images)
```

No build step, no backend. Upload the folder to any hosting (or push to GitHub)
and open `index.html`. Fonts load from Google Fonts CDN; everything else is local.

## Nice touches
- "Book" on any treatment opens `appointment.html` with that treatment pre-selected
  (`?t=`), and doctor cards pre-select the doctor (`?d=`).
- Booking form validates name/phone/date/time, then opens WhatsApp with a
  pre-filled booking message to the clinic number.
- Fully responsive; scroll-reveal animations; auto-rotating patient reviews.

## Before going live — replace the placeholders
- WhatsApp / phone number `+92 300 1234567` (links in all pages +
  `CLINIC_WHATSAPP` in `js/script.js`)
- Clinic name, address, doctor names, prices — in the HTML files
- Photos in `images/` are stock/AI sample photos — swap with real clinic photos

Design: deep petrol + teal + mint palette, Sora/Inter typography — unique to this
site (each of the 100 websites gets its own design).
Photos: Unsplash (free to use) + AI-generated samples.
