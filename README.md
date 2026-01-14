# just-eat.ch — Customer Frontend

Customer-facing **React + TypeScript** frontend for the Swiss food delivery platform **just-eat.ch** clone.

Built with **Vite**, **Tailwind CSS v4**, **shadcn/ui**, **Redux Toolkit + RTK Query**, and **react-i18next** for multilingual support (DE · EN · FR · IT).

---

## Tech Stack

| Area                 | Technology                                   |
| -------------------- | -------------------------------------------- |
| Framework            | React 19 + TypeScript 5.9 (strict)           |
| Build Tool           | Vite 7                                       |
| Styling              | Tailwind CSS v4 + shadcn/ui (new-york style) |
| State Management     | Redux Toolkit                                |
| Server State         | RTK Query (all API data)                     |
| Routing              | React Router v7                              |
| Internationalization | react-i18next (DE, EN, FR, IT)               |
| Forms                | React Hook Form + Zod                        |
| Icons                | Lucide React                                 |
| Date/Time            | dayjs                                        |
| Toasts               | sonner                                       |
| Containers           | Docker + Docker Compose                      |
| Production Server    | Nginx                                        |

---

## Features

### Guest (Unauthenticated)

- Homepage with location-based search, popular cuisines, top restaurants
- Restaurant listing with filters (cuisine, rating, delivery fee, open now)
- Restaurant detail with full menu, reviews, opening hours
- Full-text search with autocomplete suggestions
- Restaurant exploration (cursor-based infinite scroll)
- Partner signup (restaurant owner application)
- Courier signup (courier application)
- Application status tracking
- Login, register, forgot/reset password

### Customer (Authenticated)

- Cart sidebar (desktop) / sheet (mobile) with quantity controls
- Checkout with address selection, payment methods (Stripe, TWINT, PostFinance, Cash), coupon codes
- Order tracking with real-time status timeline
- Order history with reorder capability
- Favorite restaurants
- Delivery address management (CRUD)
- Profile settings + avatar
- Review management (create, edit, delete)
- Notification center
- Stamp card progress & coupon promotions

### Restaurant Owner

- Dashboard with stats (revenue, orders, top items)
- Menu management (categories + items CRUD with drag-and-drop)
- Order queue (accept, reject, status updates, assign courier)
- Restaurant settings (info, logo/cover upload, opening hours)
- Promotion management (coupons + stamp cards)
- Customer review management with reply capability
- Analytics (revenue charts, top items, order trends)

### Courier

- Available deliveries list
- Active delivery tracking with status updates
- Delivery history

### Cross-Cutting

- Multilingual UI (German, English, French, Italian) — 17 i18n namespaces
- Responsive design (mobile-first, 3 breakpoints)
- Code splitting (React.lazy + Suspense, 60+ chunks)
- Error boundaries with recovery
- 404 Not Found page
- Scroll-to-top on navigation
- Keyboard accessibility (focus-visible, skip-to-content)
- ARIA landmarks (banner, navigation, main, contentinfo)
- Reduced motion support
- CHF currency formatting throughout

---

## Project Structure

```
src/
├── app/                    # Store, hooks, router, providers
├── features/               # Feature modules (self-contained)
│   ├── home/               # Homepage
│   ├── restaurants/        # Restaurant listing + detail + menu
│   ├── search/             # Search bar + results
│   ├── cart/               # Cart sidebar/sheet
│   ├── auth/               # Login, register, password reset
│   ├── checkout/           # Checkout + order confirmation
│   ├── orders/             # Order tracking + history
│   ├── profile/            # User profile settings
│   ├── addresses/          # Delivery address management
│   ├── favorites/          # Favorite restaurants
│   ├── reviews/            # Review management
│   ├── notifications/      # Notification center
│   ├── promotions/         # Stamp cards + coupons
│   ├── restaurant-dashboard/ # Restaurant owner dashboard
│   ├── courier-dashboard/  # Courier dashboard
│   └── static/             # About, Terms, Privacy, Contact
├── shared/                 # Shared API, components, hooks, state, types, utils
│   ├── api/baseApi.ts      # RTK Query base with auth + i18n headers
│   ├── components/ui/      # 31 shadcn/ui components
│   ├── hooks/              # useAuth, useCart, useLanguage, useApiError
│   ├── state/              # auth, cart, language, ui slices
│   ├── types/              # API response and common types
│   └── utils/              # formatters (CHF), validators, constants
├── layouts/                # MainLayout, AccountLayout, RestaurantLayout, CourierLayout, AuthLayout
├── routes/                 # Route definitions, ProtectedRoute, RoleRoute
├── i18n/                   # i18n config + 4 locale folders × 17 namespaces
└── styles/globals.css      # Tailwind v4 @theme (just-eat.ch color palette)
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **Docker** + **Docker Compose**
- The **just-eat-api-node** backend running on port 4005

### 1. Start the API

```bash
cd ../just-eat-api-node
docker compose up -d
```

### 2. Start the Frontend (Docker — recommended)

```bash
cd just-eat-frontend-react
docker compose up
```

The app will be available at **http://localhost:5176**.

### 3. Start the Frontend (local alternative)

```bash
npm install
npm run dev
```

---

## Available Scripts

| Script                  | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start development server (port 5176) |
| `npm run build`         | Type-check + production build        |
| `npm run preview`       | Preview production build locally     |
| `npm run lint`          | Run ESLint                           |
| `npm run lint:fix`      | Fix ESLint issues                    |
| `npm run format`        | Format code with Prettier            |
| `npm run type-check`    | TypeScript type-check (no emit)      |
| `npm run test`          | Run Vitest unit tests                |
| `npm run test:coverage` | Run tests with coverage              |
| `npm run test:e2e`      | Run Playwright E2E tests             |

---

## Environment Variables

Copy `.env.example` to `.env.development`:

```env
VITE_API_URL=http://localhost:4005/api/v1
VITE_APP_NAME=just-eat.ch
VITE_APP_VERSION=1.0.0
VITE_DEFAULT_LANGUAGE=de
VITE_ENABLE_DEVTOOLS=true
```

---

## Test Accounts

| Role             | Email                        | Password       |
| ---------------- | ---------------------------- | -------------- |
| Customer         | `customer1@example.ch`       | `Password123!` |
| Restaurant Owner | `owner.bigburger@example.ch` | `Password123!` |
| Courier          | `courier1@justeat-clone.ch`  | `Password123!` |

---

## Docker

### Development

```bash
docker compose up
# → http://localhost:5176 (hot-reload via volume mount)
```

### Production

```bash
docker build -t justeat-frontend .
docker run -p 3000:3000 justeat-frontend
# → http://localhost:3000 (Nginx serving static build)
```

### Ports

| Service         | Port |
| --------------- | ---- |
| Frontend (dev)  | 5176 |
| Frontend (prod) | 3000 |
| API             | 4005 |

---

## Architecture Decisions

- **Feature-based modules** — each feature is self-contained with components, pages, API, types
- **RTK Query** for all API calls — automatic caching, loading states, tag-based invalidation
- **No Axios** — RTK Query's `fetchBaseQuery` handles all HTTP
- **No API data in Redux slices** — only auth, cart, language, and UI state in slices
- **All text through i18n** — zero hardcoded strings in JSX
- **`Accept-Language` header** on every API request for localized content
- **`baseQueryWithReauth`** — automatic token refresh on 401
- **React.lazy + Suspense** — code splitting for all 30+ feature pages
- **Manual chunks** — vendor, redux, ui, i18n, forms separated for optimal caching
- **Cursor pagination** — restaurant explore page uses cursor-based pagination for infinite scroll
- **Application system** — partner/courier signup with status tracking

---

## License

Private — All rights reserved.
