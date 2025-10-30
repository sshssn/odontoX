Executive summary
OdontoX is a multi-tenant dental practice management SaaS with robust RBAC, licensing, and billing.
Recommended stack for fastest path with your UI requirement: Next.js + shadcn/ui + Auth.js + Neon + Drizzle, with a separate Node worker for async jobs.
If you must use Vue, we should switch to shadcn-vue (community port) or Nuxt UI; Auth.js UI/handlers will need custom integration.
Key decision to confirm
Choose one:
Option A (recommended): Next.js (App Router) + shadcn/ui MCP + Auth.js (NextAuth) → best fit for shadcn UI and MCP blocks/demos.
Option B: Vue (Nuxt 3 or Vite + Vue 3) + shadcn-vue or Nuxt UI + Auth.js core (custom) or Lucia → more custom work, no native shadcn MCP for Vue.
Backend-first development: Yes. We’ll implement DB schema, auth, tenancy, billing, and APIs first; then wire up frontend against stable contracts.
Product scope and roles
Multi-tenant SaaS for single- and multi-location dental practices.
Roles:
Super Admin (SaaS platform owner): manage tenants, billing, plans, feature flags, abuse controls, support.
Org Owner/Admin (clinic): manage org, locations, staff, roles, billing, feature toggles.
Dentist/Provider: clinical records, treatment plans, prescriptions, imaging, notes.
Front Desk/Reception: scheduling, intake, payments, insurance coordination.
Billing/RCM: claims, remits, AR, statements, adjustments, reports.
Patient (portal): onboarding, appointments, documents, payments, messages.
Core modules and features
Authentication and RBAC
Email/password, OAuth (Google/MS), optional MFA
Org invites, SSO (SAML/OIDC) for enterprise tier
Session management, device management, audit trails
Multi-tenancy + Licensing
Row-level isolation with tenant_id + Postgres RLS
Plans (Free/Pro/Enterprise), entitlements/feature flags, usage metering, hard/soft limits
License/Subscription state surfaced in app and admin
Organization/Locations
Multiple locations, providers, chair/room resources, hours/closures
Patient 360
Demographics, contacts, insurance, medical alerts/allergies, consents
Documents (IDs, x-rays, forms), e-signatures
Clinical records: charts (FDI/Universal), diagnoses, treatment plans, progress notes, vitals
Imaging integrations (DICOM or vendor bridge; placeholder at v1)
Appointments and Scheduling
Provider schedules, chair/room assignment, reason codes
Online booking rules, confirmations, reminders (email/SMS/WhatsApp), waitlist
No-show/cancellation policies, rebooking flows
Billing and Payments
Procedure codes, fee schedules, discounts, taxes
Invoices, receipts, refunds, partial payments, payment links
Stripe integration, Stripe Customer per patient; org-level Stripe account
Statements, AR aging, write-offs
Insurance and Claims (phase 2+)
Payer management, eligibility checks (clearinghouse integration later)
Claim creation, submission status, EOB/ERA posting (future integration)
Inventory (phase 2)
Stock items, vendors, par levels, purchase orders, consumption logs
Communications
Templates, broadcasts, transactional notifications
Secure messages, appointment reminders, review requests
Analytics and Reports
Operational KPIs (production, collections, new patients, no-show rate)
Financial reports (revenue, AR, payer mix)
Provider productivity, treatment acceptance
Patient Portal
Self-onboarding, intake forms, appointments, payments, documents, messages
Admin (SaaS)
Tenants, plans, billing, usage, feature flags, incidents, support tickets, data export
Platform ops
Audit logs, error pages, rate limiting, API keys/webhooks for partners
UI/UX and shadcn usage
Layout primitives: App shell with responsive sidebar, topbar, breadcrumbs, user/org switcher.
shadcn/ui blocks and components to use (samples):
Navigation: Sidebar, Command Palette, Breadcrumbs
Forms: Form, Input, Select, DatePicker, Combobox, Toggle, Switch
Data: Table (with column filters), Tabs, Accordion, Badge, Tooltip
Feedback: Toast, Alert, Dialog, Drawer, Skeleton, Empty states, Error boundaries
Pages/flows: Auth (Sign in/up/forgot/reset), 401/403/404/500, Onboarding, Dashboard, Settings
We’ll compose demos/blocks to build:
Patient 360 page
Scheduler (calendar grid + drawer)
Billing workspace (table + detail drawer)
Admin SaaS panel (tenants/plans/usage)
Plan/License banner and limits indicators
Note: The official shadcn/ui is React-first; MCP content maps to React. This is why Option A (Next.js) is the best fit if you want us to “call the demos, blocks, containers.”
Architecture
Monorepo (Turborepo)
apps/web: Next.js (or Nuxt 3 if Vue chosen)
apps/api: Node (NestJS recommended) for REST/tRPC and webhooks
apps/worker: BullMQ/Queues for reminders, billing, emails
packages/db: Drizzle schema + migrations
packages/auth: shared auth/session/RBAC utils
packages/ui: design system (wrapped shadcn components)
packages/config: eslint, tsconfig, tailwind config
Data
Neon Postgres; Drizzle ORM; RLS for row-level tenant isolation
S3-compatible object store for documents/images
Integrations
Stripe billing (subscriptions, invoices, metered usage)
Email (Resend/SES), SMS (Twilio)
Future: claims clearinghouse, eRx, imaging
Security, compliance, and reliability
RLS enforced on all queries; server-side checks (org + roles)
Secrets via managed vault; least-privilege DB roles
Audit logs across auth, billing, PHI access (HIPAA-readiness posture)
Backups, PITR, read replicas (Neon)
Observability: OpenTelemetry, structured logs, traces, dashboards, alerting
Rate limiting, bot protection, idempotency keys for payments/webhooks
Data residency strategy (phase 3)
API design
Auth: Auth.js with credentials/OAuth, JWT sessions (stateless) and server session helpers
Contract
REST (OpenAPI-spec’d) or tRPC (internal). Public partner APIs REST.
Versioning: /v1 with sunset headers
Pagination, filtering, sorting; consistent error model
Webhooks
Stripe events, comms delivery, scheduled jobs outcomes
Idempotency
Header-based for POST/PUT sensitive actions
Database (high-level tables)
Multi-tenancy and billing
tenants, tenant_domains
plans, plan_features, tenant_subscriptions, usage_events, feature_flags
Users and org membership
users, user_identities, org_members, org_roles, invites
Clinical and operations
patients, patient_contacts, patient_insurances
providers, provider_schedules, resources (chairs/rooms)
appointments, appointment_messages, waitlist
charts, diagnoses, treatment_plans, treatment_items, clinical_notes, consents
documents, media, signatures
Financials
procedure_codes, fee_schedules
invoices, invoice_items, payments, refunds, statements, adjustments
payers, claims, claim_items, remittances (phase 2+)
Inventory (phase 2)
items, vendors, stock_ledger, purchase_orders
Communications
templates, messages, message_events
Platform
audit_logs, api_keys, webhooks, webhook_deliveries
System
migrations, background_jobs
We’ll finalize the exact columns in the migration phase; the above captures entities and relationships.
Billing and licensing
Stripe products/prices → plans; entitlements → plan_features
Subscription state synced via webhooks
Usage-based metering (appointments created, SMS sent, storage GB)
In-app license/plan banner with limits and upgrade CTAs
Admin SaaS controls for overrides and grace periods
Error pages and flows
Auth errors, permission denied (403), missing pages (404), server errors (500)
Org selection required, plan limit reached, payment past due
Graceful offline/maintenance states
Dev workflow
TypeScript everywhere; strict mode
CI: lint, type check, test, build
Preview deployments per PR
Seed script for demo data
Feature flags for staged rollouts
Phased roadmap (milestones)
M1: Foundations (auth, tenants, plans, RBAC, orgs, providers, patients, basic scheduler, invoices, Stripe, communications infra, audit logs, dashboards)
M2: Patient portal, inventory basics, analytics v1, claims scaffolding, advanced scheduler (rooms), reminders
M3: Insurance claims integration, ERA/EOB posting, imaging bridge, enterprise SSO, data residency
M4: Marketplace APIs, partner integrations
Testing
Unit tests (services, repositories), contract tests (API schemas), E2E (Cypress/Playwright), seed-based scenario tests
Load tests for scheduling and billing paths
Security tests (authz, RLS)
Deployment
Neon for Postgres
Vercel (Next.js) or Netlify (Nuxt) for web; Render/Fly/Dokku for API/worker or a single provider on AWS
S3 for storage; CloudFront/Edge cache for assets
Background workers on managed Redis (Upstash) + BullMQ
Answering your process question
Yes: we’ll do backend first (DB, auth, tenancy, billing, APIs), then connect the frontend. We can start basic frontend scaffolding early for faster feedback, but API contracts will drive UI integration.
Open items to confirm
1) Stack choice: Option A (Next.js + shadcn/ui + Auth.js) or Option B (Vue + shadcn-vue/Nuxt UI + custom Auth.js/Lucia)?
2) Initial markets/compliance target (HIPAA posture only vs. full BAA/hosted region constraints)?
3) Must-have for v1: claims integration now or defer to M2?
4) Branding inputs (logo/colors) or proceed with shadcn defaults initially?
If you approve the spec and choose the stack, I’ll proceed to finalize the DB schema and service contracts, then set up the backend foundation next.