# Payment Console

A simple payment console for a fake payment service built with Next.js App Router and TypeScript.

## Features

Merchants can:

1. Create new payments
2. Send payment links to customers
3. Track payment status changes (pending → paid/canceled)

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Run

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Finished Parts

✅ **Core Features**

- Payment creation with amount, currency, and merchant order ID
- Payment listing with search by merchant order ID and status filtering
- Payment details view with copyable payment links
- Customer payment completion page (mark as paid/canceled)

✅ **Technical Implementation**

- Next.js 15 App Router with TypeScript
- File-based storage using localStorage
- Server components for routing, client components for interactivity
- Real-time search and filtering
- Responsive design with Tailwind CSS
- Currency enum support (EGP, USD, EUR, GBP, SAR, AED)

✅ **Pages**

- `/` - Home page with payment list and search
- `/new` - Create new payment form
- `/payments/[id]` - Payment details and management
- `/pay/[publicId]` - Customer payment completion

## Documentation

📋 [Tech Documentation](tech_documentation.md) - Architecture decisions and technical implementation details
