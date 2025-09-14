# Multi-Tenant SaaS Notes Application

A secure, multi-tenant SaaS application for managing notes with role-based access control and subscription-based feature gating. Built with Next.js, Prisma, PostgreSQL, and deployed on Vercel.

## 🏗️ Multi-Tenancy

**Approach**: Shared schema with tenant ID column

- Single PostgreSQL database with `tenantId` foreign keys
- Strict tenant isolation enforced at application level
- All queries filtered by `tenantId` for data separation

## 🔐 Authentication & Test Accounts

**JWT-based authentication** with HTTP-only cookies

- Access Token: 24 hours
- Refresh Token: 7 days

### Test Accounts (Password: `password`)

| Email             | Role   | Tenant |
| ----------------- | ------ | ------ |
| admin@acme.test   | Admin  | Acme   |
| user@acme.test    | Member | Acme   |
| admin@globex.test | Admin  | Globex |
| user@globex.test  | Member | Globex |

**Roles:**

- **Admin**: Invite users, upgrade subscriptions, manage all notes
- **Member**: Create, view, edit, delete own notes

## 💳 Subscription Plans

- **Free Plan**: 3 notes maximum
- **Pro Plan**: Unlimited notes (upgrade via admin endpoint)

## 🚀 API Endpoints

### Health Check

```http
GET /api/health
```

Response: `{"status": "ok"}`

### Authentication

```http
POST /api/auth/login
POST /api/auth/me
POST /api/auth/logout
POST /api/auth/refresh-access-token
```

### Notes (CRUD)

```http
POST /api/notes          # Create note
GET /api/notes           # List all notes (tenant-isolated)
GET /api/notes/:id       # Get specific note
PUT /api/notes/:id       # Update note
DELETE /api/notes/:id    # Delete note
```

### Tenant Management

```http
POST /api/tenants/create           # Create new tenant
GET /api/tenants                   # Get current tenant info
POST /api/tenants/:slug/upgrade    # Upgrade to Pro (Admin only)
POST /api/tenants/invite           # Invite users (Admin only)
```

## 🛡️ Security

- **Tenant Isolation**: All data filtered by `tenantId`
- **Role-Based Access**: Admin vs Member permissions
- **Data Protection**: bcrypt password hashing, secure cookies
- **CORS**: Enabled for external API access

## 🎨 Frontend

- Login system with test accounts
- Notes management (CRUD operations)
- Subscription limit enforcement
- "Upgrade to Pro" prompts
- Responsive design with Tailwind CSS

## 🚀 Deployment

**Vercel** with PostgreSQL database

- Frontend: Next.js application
- Backend: API routes in `/api`
- CORS enabled for automated testing

## 🧪 Testing

Automated test scripts verify:

1. Health endpoint availability
2. Authentication for all test accounts
3. Tenant isolation enforcement
4. Role-based access restrictions
5. Free plan note limits (3 max)
6. Pro plan upgrade functionality
7. All CRUD operations
8. Frontend accessibility

## 🔧 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

---

**Live Demo**: [Your Vercel Deployment URL]
