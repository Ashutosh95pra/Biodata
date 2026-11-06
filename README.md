# Personal Marriage Biodata

A private, mobile-first marriage biodata website built with Next.js 14, React 18, plain CSS, and a lightweight Three.js hero scene.

## 1. Install and run locally

Install Node.js 18.17 or newer. From the project folder run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create a production build with `npm run build`, then serve it locally with `npm start`.

## 2. Add your photo

Put a portrait image at `public/photo.jpg`. A vertical image works best. The hero uses an arch-shaped crop; if the file is absent or cannot be loaded, it displays your configured initial instead.

The same photo path is used for the Open Graph preview. Some sharing platforms cache previews, so refresh or re-scrape the link with the platform if an old preview persists.

## 3. Edit your details

Edit `lib/data.js` for your name, initial, date of birth, city, native place, personal details, about text, hobbies, education, company/designation, family, partner expectations, WhatsApp message, number, and PIN. Replace all bracketed values such as `[HEIGHT]`, `[CITY]`, `[DESIGNATION]`, and `[PARTNER EXPECTATIONS]` before sharing the page. The age is calculated automatically from the date of birth.

Use the WhatsApp number in international format with digits only: country code followed by the number, without `+`, spaces, or punctuation. It is only used to construct the WhatsApp button URL; it is not printed as page text.

## 4. Deploy free on Vercel

1. Push the project to a GitHub repository.
2. Sign in at [vercel.com](https://vercel.com) and choose **Add New → Project**.
3. Import the repository. Vercel detects Next.js automatically.
4. Choose **Deploy**. No environment variables are required.
5. Add your own domain in Vercel project settings if desired, then share the deployment URL.

The free Vercel Hobby plan is suitable for personal, non-commercial use; check Vercel’s current plan terms for eligibility and limits.
For the Open Graph image to use your preferred public URL, optionally set `NEXT_PUBLIC_SITE_URL` in the Vercel project environment variables to your deployed site origin (for example, `https://your-site.vercel.app`) and redeploy. Without it, the Vercel deployment URL is used.

## 5. Change the PIN and WhatsApp number

Change `site.pin` and `site.whatsappNumber` in `lib/data.js`. Visitors who unlock the page keep it unlocked in that browser tab session; closing the tab/session clears that state.

**Important:** The PIN gate is only a light barrier for casual viewing. The PIN and page content are delivered to the browser, and this is not real security or access control. Do not put sensitive, confidential, or regulated information here. `noindex` asks search engines not to index the page but cannot prevent access or sharing.

## Print / Save as PDF

Use **Save as PDF** in the hero and choose **Save to PDF** in the browser print dialog. Navigation, buttons, and the 3D canvas are hidden in print, with a clean light layout intended to fit approximately one or two A4 pages depending on your content and browser print settings.
