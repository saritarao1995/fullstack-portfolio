# Velora Atelier

Luxury furniture boutique for the Kota showroom. React 18, Vite, Tailwind, Redux Toolkit. Accounts, catalog, and orders live on the showroom API. Prices are **INR**. Customers pay with **Razorpay** once keys are set.

## Run

```powershell
cd velora
$env:LOCALAPPDATA = 'F:\localappdata'
npm install
npm run dev
```

Shop: http://localhost:5178  
API: http://localhost:4010

Browse without an account. **Checkout and payment need a customer login.**

Create an account from **Sign in → Create an account**. Forgot password is on the sign-in page (email link, if Gmail App Password is set).

**Studio (staff only, not linked from the shop):** go to http://localhost:5178/studio  
Default staff login: `demo@velora.shop` / `Demo@12345` — change this before a public launch.

Studio → **Pieces** to add furniture. Studio → **Settings** for Razorpay keys and email/SMS/WhatsApp.

### Before customers pay online

1. Paste Razorpay keys in Studio → Settings → Payments (or `.env`).
2. Add a Gmail App Password in Settings → Email, SMS & WhatsApp so order and shipping alerts actually send.
3. Without Razorpay keys, checkout saves the order but **does not mark it paid**. The customer is asked to call the showroom.

Home delivery is ₹7,500. Kota collect is free.

Data: `velora/server/data/` (do not commit).

## Customer path

1. Browse the collection
2. Create an account
3. Checkout → pay
4. **Orders** in the header for status
5. Shipping alerts when studio marks shipped / deliver today
