# Creativetone — Book Strategy journey

A 28-second Remotion motion-graphics video (1920×1080, 30fps) of a client booking a strategy call on creativetoneagency.com:

1. Typing the domain into the browser
2. Clicking **Book Strategy** on the homepage
3. Filling name, email and phone
4. Choosing an industry from the dropdown
5. Sending the request → success state
6. Phone rings: **Creativetone calling…**
7. Outro: ~~“Hi, can you help me?”~~ → *Just book. We’ll be ready for the call.*

## Commands

```bash
npm i
npm run dev                        # Remotion Studio preview
npx remotion render BookingJourney out/creativetone-booking-journey.mp4
node scripts/gen-sfx.mjs           # regenerate the sound effects in public/
```

Each scene is also registered on its own under **Scenes** in Studio, with its text (name, email, industry, headlines, CTA) editable as props.
