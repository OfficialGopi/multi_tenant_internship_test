# Multi-Tenant SaaS Notes Application

A secure, multi-tenant SaaS application for managing notes with role-based access control and subscription-based feature gating. Built with Next.js, Prisma, PostgreSQL, and deployed on Vercel.

## 🏗️ Architecture

### Multi-Tenancy Approach

This application uses a **shared schema with tenant ID column** approach for multi-tenancy. All data is stored in a single PostgreSQL database with strict tenant isolation enforced at the application level through `tenantId` foreign keys.

**Benefits:**

- Cost-effective for smaller applications
- Easier to maintain and backup
- Simplified analytics and reporting
- Single database connection management

**Data Isolation:**

- All queries include `tenantId` filtering
- JWT tokens contain tenant information
- Middleware validates tenant access on every request
- Strict role-based access control within tenant boundaries

## 🔐 Authentication & Authorization

### JWT-Based Authentication

- **Access Token**: Short-lived (24 hours), stored in HTTP-only cookies
- **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookies
- **Token Validation**: Middleware checks tokens on protected routes

### User Roles

- **Admin**: Can invite users, upgrade subscriptions, manage all notes
- **Member**: Can create, view, edit, and delete their own notes

### Test Accounts

All accounts use password: `password`

| Email             | Role   | Tenant |
| ----------------- | ------ | ------ |
| admin@acme.test   | Admin  | Acme   |
| user@acme.test    | Member | Acme   |
| admin@globex.test | Admin  | Globex |
| user@globex.test  | Member | Globex |

## 💳 Subscription Plans

### Free Plan

- **Note Limit**: 3 notes maximum
- **Features**: Basic CRUD operations
- **Upgrade Prompt**: Shown when limit reached

### Pro Plan

- **Note Limit**: Unlimited
- **Features**: All Free plan features + unlimited notes
- **Upgrade**: Instant via admin upgrade endpoint

## 🚀 API Endpoints

### Health Check

```http
GET /api/health
```

**Response:**

```json
{
  "status": "ok"
}
```

### Authentication

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "admin@acme.test",
  "password": "password"
}
```

```http
POST /api/auth/me
```

**Headers:** `Cookie: access-token=<token>`

```http
POST /api/auth/logout
```

```http
POST /api/auth/refresh-access-token
```

### Notes Management

```http
POST /api/notes
```

**Request Body:**

```json
{
  "title": "My Note",
  "content": "Note content here"
}
```

```http
GET /api/notes
```

**Returns:** All notes for the authenticated user's tenant

```http
GET /api/notes/:id
```

**Returns:** Specific note (tenant-isolated)

```http
PUT /api/notes/:id
```

**Request Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

```http
DELETE /api/notes/:id
```

### Tenant Management

```http
POST /api/tenants/create
```

**Request Body:**

```json
{
  "tenantName": "New Company",
  "adminName": "Admin User",
  "adminEmail": "admin@newcompany.com",
  "adminPassword": "password123"
}
```

```http
GET /api/tenants
```

**Returns:** Current tenant information

```http
POST /api/tenants/:slug/upgrade
```

**Access:** Admin only
**Upgrades tenant to Pro plan**

```http
POST /api/tenants/invite
```

**Access:** Admin only
**Invites new users to tenant**

## 🛡️ Security Features

### Tenant Isolation

- All database queries filtered by `tenantId`
- JWT tokens contain tenant information
- Middleware validates tenant access
- No cross-tenant data access possible

### Role-Based Access Control

- Admin: Full access to tenant management
- Member: Limited to own notes
- Authorization checks on every protected endpoint

### Data Protection

- Passwords hashed with bcrypt
- HTTP-only cookies for token storage
- Secure cookie settings (SameSite, Secure)
- Input validation with Zod schemas

## 🎨 Frontend Features

### Login System

- Secure authentication form
- Role-based dashboard access
- Session management

### Notes Management

- Create, read, update, delete notes
- Real-time note count tracking
- Tenant-isolated note display

### Subscription Management

- Free plan limit enforcement
- "Upgrade to Pro" prompts
- Admin upgrade functionality

### Responsive Design

- Modern UI with Tailwind CSS
- Mobile-friendly interface
- Clean, intuitive user experience

## 🚀 Deployment

### Vercel Configuration

- **Frontend**: Next.js application
- **Backend**: API routes in `/api`
- **Database**: PostgreSQL (Vercel Postgres)
- **CORS**: Enabled for external access

### Environment Variables

```env
DATABASE_URL=postgresql://...
NODE_ENV=production
ACCESS_TOKEN_SECRET=your-secret
REFRESH_TOKEN_SECRET=your-secret
ACCESS_TOKEN_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=7d
```

## 🧪 Testing

The application is designed to work with automated test scripts that verify:

1. **Health endpoint availability**
2. **Authentication for all test accounts**
3. **Tenant isolation enforcement**
4. **Role-based access restrictions**
5. **Free plan note limits**
6. **Pro plan upgrade functionality**
7. **CRUD operations on notes**
8. **Frontend accessibility**

## 📊 Database Schema

### Core Models

- **Tenant**: Company/organization data
- **User**: User accounts with roles
- **Note**: Individual notes with tenant isolation

### Key Relationships

- Tenant → Users (1:many)
- Tenant → Notes (1:many)
- User → Notes (1:many, creator relationship)

## 🔧 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Validation**: Zod schemas

## 📝 Usage Instructions

1. **Login**: Use any of the provided test accounts
2. **Create Notes**: Start creating notes (Free plan: 3 max)
3. **Upgrade**: Admin users can upgrade to Pro plan
4. **Manage**: Full CRUD operations on notes
5. **Invite**: Admins can invite new team members

## 🔒 Security Considerations

- All API endpoints require authentication
- Tenant isolation enforced at database level
- Role-based permissions on all operations
- Secure token storage and validation
- Input sanitization and validation
- CORS properly configured for external access

---

**Live Demo**: [Your Vercel Deployment URL]
**Repository**: [Your GitHub Repository URL]
