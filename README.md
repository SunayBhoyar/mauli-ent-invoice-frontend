![Demo Screenshot](./readmeImg.png)
# Invoice Maker Next.js Frontend for Mauli Ent

A modern, responsive frontend built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, designed to work seamlessly with the Invoice Maker API. This interface allows users to create, manage, and download GST invoices easily.

---

## ✨ Features

- **Dashboard View**

  - Displays a list of the most recent invoices
  - Quick access to invoice previews and downloads

- **Invoice Generator**

  - Dynamically generates tax invoices
  - Supports custom branding, buyer details, shipping details, and tax calculations

- **Live Preview**

  - Automatically updates the invoice preview as data is filled
  - Ready-to-download PDF

- **Invoice Search**

  - Search by customer name, date, or invoice number

- **Persistent Invoice Settings**

  - Save supplier info, GSTIN, bank details, and more

---

## 🧠 Tech Stack

| Layer        | Technology                         |
| ------------ | ---------------------------------- |
| Framework    | Next.js 14                         |
| Language     | TypeScript                         |
| Styling      | Tailwind CSS                       |
| State Mgmt   | useState / Context API             |
| PDF Download | react-pdf / html2canvas (optional) |

---

## 📦 Installation & Setup

```bash
# Clone the frontend repo
$ git clone https://github.com/<your-org>/invoice-maker-ui.git
$ cd invoice-maker-ui

# Install dependencies
$ npm install

# Run development server
$ npm run dev

# Open in browser
$ http://localhost:3000
```

Make sure your API backend is running at `http://localhost:4000` or set up a `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```
---

## 🔒 Notes

- Invoice data is stored in MongoDB via the API backend
- Make sure your API routes (`/api/invoices/...`) are correct
- PDF export depends on DOM rendering. For production use, consider server-side generation using tools like Puppeteer.


