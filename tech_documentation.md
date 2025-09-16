# Tech Documentation - Payment Console

## Key Decisions

### Architecture

- **Next.js 15 App Router** - Server-side rendering with client-side interactivity
- **Hybrid Components** - Server components for data fetching, client components for user interactions
- **File-based Storage** - JSON file persistence (`payments.json`) for simplicity
- **Server Actions** - For all write operations (create, update payments)

### Data Layer

- **In-memory processing** - Load all data once, filter on frontend for better UX
- **No database** - JSON file storage as specified in requirements
- **Type safety** - Centralized types in `/types/payments.ts`

### Search Implementation

- **Client-side filtering** - Real-time search with `onChange` handlers
- **URL synchronization** - Search parameters preserved in URL for sharing/bookmarking
- **Utility functions** - Extracted filtering logic to `/lib/payment-utils.ts`

## Data Flow

### Payment Creation

```
New Payment Form → createNewPayment (Server Action) → createPayment (DB) → JSON File → Redirect
```

### Payment Status Update

```
Customer Payment Page → markPaymentPaid/Canceled (Server Action) → updatePayment (DB) → JSON File → Redirect
```

### Payment Search/Filter

```
User Input → PaymentSearch Component → PaymentList Component → filterAndSortPayments → Filtered Results
```

### Data Persistence

```
Server Action → Database Layer → File I/O → payments.json
                     ↓
               revalidatePath → Cache Invalidation
```

## File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home - payment list (server component)
│   ├── new/page.tsx       # Create payment form
│   ├── payments/[id]/     # Payment details
│   └── pay/[publicId]/    # Customer payment link
├── actions/
│   └── payments.ts        # Server actions for CRUD operations
├── components/
│   ├── PaymentSearch.tsx  # Client component - search/filter
│   ├── PaymentList.tsx    # Client component - payment table
│   └── CopyButton.tsx     # Client component - clipboard functionality
├── lib/
│   ├── db.ts             # Database layer - file operations
│   ├── id.ts             # ID generation utilities
│   ├── payment-utils.ts  # Filtering/sorting logic
│   └── updateURL.ts      # URL manipulation helper
└── types/
    └── payments.ts       # TypeScript type definitions
```

## Key Assumptions

### Business Logic

- **Currency**: Supports multiple currencies via enum (EGP, USD, EUR, GBP, SAR, AED)
- **Amount**: Stored in piasters (cents), displayed as EGP with 2 decimals
- **Status Flow**: pending → paid/canceled (no reversal)
- **No Authentication**: Open access to all payment operations

### Technical Assumptions

- **Small Dataset**: All payments loaded in memory for client-side filtering
- **Single User**: No concurrency handling for file operations
- **Development Focus**: No production concerns (logging, monitoring, etc.)
- **Modern Browsers**: ES6+ features, clipboard API support

### Data Validation

- **Amount**: Must be positive integer (piasters)
- **Merchant Order ID**: Required, trimmed whitespace
- **Status Updates**: Only allowed from 'pending' status
- **File Persistence**: Graceful error handling, fallback to empty array

## Task Estimate

**T-shirt Size: Medium (M)**  
4 pages, client-side search, localStorage persistence, and custom hooks for a mid-level developer.

**Time Estimate: 1-2 days (8-16 hours)**  
Frontend-only approach with Next.js App Router, React hooks, and basic styling.

## Performance Considerations

- **Client-side Filtering**: Fast for small datasets (<1000 payments)
- **Server-side Rendering**: Initial page load optimized
- **localStorage I/O**: Acceptable for demo scale
- **URL Updates**: `router.replace()` prevents browser history pollution

## Future Scalability

### When to Consider Database
- **>1000 payments**: Switch to server-side pagination/filtering
- **Concurrent Users**: Add proper database with transactions
- **Complex Queries**: Need indexed searches, date ranges, etc.

### Performance Optimizations
- Add virtualization for large payment lists
- Implement debounced search input
- Add caching layer for frequent operations
- Consider real-time updates with WebSockets
