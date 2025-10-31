# 🎯 OdontoX Frontend Finalization Plan

**Branch:** `fe/dashboards-finalize-2024-10-31`  
**Created:** October 31, 2024  
**Status:** Awaiting Approval

---

## 📋 Executive Summary

This plan outlines the complete frontend implementation for OdontoX SaaS, connecting all role-based dashboards to existing backend APIs and NeonDB. The backend, database schema, and authentication are **complete and will NOT be modified**. This is a **frontend-only** implementation.

---

## 🗄️ Database Schema Summary

### Core Tables (from NeonDB/Drizzle Schema)

#### 1. Tenancy & Users (`packages/db/src/schema/tenancy.ts`)
- **tenants** - Organizations/clinics
  - `id` (uuid, PK), `slug` (unique), `name`, `createdAt`, `updatedAt`
  
- **users** - All system users
  - `id` (uuid, PK), `email` (unique), `name`, `passwordHash`, `emailVerified`, `image`, `createdAt`, `updatedAt`
  
- **orgMembers** - User-tenant-role mapping
  - `tenantId` (FK → tenants), `userId` (FK → users), `role` (enum), `createdAt`, `updatedAt`
  - Composite PK: (tenantId, userId)
  
- **plans** - Subscription tiers
  - `id` (uuid, PK), `key` (unique: FREE/PRO/ENTERPRISE), `name`, `active`, `createdAt`, `updatedAt`
  
- **subscriptions** - Tenant subscription state
  - `id` (uuid, PK), `tenantId` (FK), `planId` (FK), `status`, `stripeCustomerId`, `stripeSubscriptionId`, `createdAt`, `updatedAt`

#### 2. Clinical Data (`packages/db/src/schema/clinical.ts`)
- **patients** - Patient records
  - `id`, `tenantId`, `firstName`, `lastName`, `dateOfBirth`, `email`, `phone`, `address`, `city`, `state`, `zipCode`, `emergencyContact`, `emergencyPhone`, `medicalNotes`
  
- **providers** - Dentists/doctors
  - `id`, `tenantId`, `firstName`, `lastName`, `email`, `phone`, `licenseNumber`, `specialization`
  
- **resources** - Chairs/rooms/equipment
  - `id`, `tenantId`, `name`, `type`
  
- **appointments** - Scheduling
  - `id`, `tenantId`, `patientId`, `providerId`, `resourceId`, `startAt`, `endAt`, `status` (scheduled/confirmed/completed/cancelled/no_show), `reason`, `notes`

#### 3. Financial Data (`packages/db/src/schema/financials.ts`)
- **invoices**
  - `id`, `tenantId`, `patientId`, `status` (draft/issued/paid/overdue/cancelled), `issuedAt`, `dueAt`, `paidAt`, `currency`, `subtotal`, `taxTotal`, `total`, `balanceDue`, `notes`
  
- **invoiceItems**
  - `id`, `invoiceId`, `description`, `quantity`, `unitPrice`, `total`
  
- **payments**
  - `id`, `tenantId`, `patientId`, `invoiceId`, `amount`, `currency`, `method` (card/cash/check/bank_transfer), `status` (pending/completed/failed/refunded), `stripePaymentIntentId`, `paidAt`, `notes`
  
- **procedureCodes**
  - `id`, `tenantId`, `code`, `description`, `defaultPrice`

#### 4. Plans & Features (`packages/db/src/schema/plans.ts`)
- **planFeatures** - Feature entitlements per plan
  - `id`, `planId`, `key`, `enabled`, `hardLimit`, `softLimit`, `metadata`
  
- **featureFlags** - Tenant-level feature toggles
  - `id`, `tenantId`, `key`, `enabled`, `value`

---

## 🔐 Role Definitions

### Current Roles in Database Schema:
```typescript
export const roleEnum = pgEnum("role", [
  "SUPER_ADMIN",  // ✅ Keep - Platform admin
  "ORG_ADMIN",    // ✅ Keep - Clinic admin
  "DENTIST",      // ✅ Keep - Doctor/provider
  "RECEPTION",    // ✅ Keep - Front desk
  "BILLING",      // ❌ REMOVE - To be eliminated
  "PATIENT"       // ✅ Keep - Patient portal
]);
```

### Valid Roles (Final):
1. **SUPER_ADMIN** - Platform administrator
2. **ORG_ADMIN** - Organization/clinic administrator  
3. **DENTIST** - Healthcare provider
4. **RECEPTION** - Front desk/receptionist
5. **PATIENT** - Patient portal access

### ⚠️ BILLING Role Removal Plan:
- Remove billing-specific UI routes and sidebar links
- Delete `apps/web/src/components/dashboards/billing-dashboard.tsx`
- Remove BILLING from `apps/web/src/components/app-sidebar.tsx`
- Remove BILLING from `apps/web/src/app/dashboard/page.tsx`
- Remove billing seed user from documentation
- **DO NOT** modify database schema or backend code

---

## 🔌 API Endpoints (Existing)

### Super Admin APIs
- `GET /api/admin/tenants` - List all tenants (SUPER_ADMIN only)
- `POST /api/admin/tenants` - Create new tenant (SUPER_ADMIN only)
- `GET /api/admin/plans` - List subscription plans
- `GET /api/admin/plan-features` - List plan features

### Clinical APIs (Tenant-scoped)
- `GET /api/patients?q={search}` - Search patients
- `POST /api/patients` - Create patient
- `GET /api/providers` - List providers
- `GET /api/appointments?patientId={id}` - List appointments
- `POST /api/appointments` - Create appointment

### Financial APIs (Tenant-scoped)
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice

### Auth APIs
- `POST /api/auth/signin` - Login (NextAuth)
- `POST /api/auth/signout` - Logout
- `POST /api/users/signup` - User registration

---

## 🎨 UI → API → DB Mapping

### 1️⃣ SUPER_ADMIN Dashboard

**Routes:**
- `/dashboard` - Main dashboard
- `/admin/tenants` - Tenant management
- `/admin/tenants/[id]` - Tenant detail
- `/admin/plans` - Plan management
- `/admin/usage` - Usage & billing analytics
- `/settings` - Global settings

**Dashboard KPIs:**
| Metric | API Endpoint | DB Query | Calculation |
|--------|--------------|----------|-------------|
| Total Tenants | `GET /api/admin/tenants` | `SELECT COUNT(*) FROM tenants` | Count active tenants |
| Active Subscriptions | `GET /api/admin/subscriptions` | `SELECT COUNT(*) FROM subscriptions WHERE status='active'` | Count active subs |
| Monthly Revenue | `GET /api/admin/revenue` | `SELECT SUM(amount) FROM payments WHERE paidAt >= DATE_TRUNC('month', NOW())` | Sum payments this month |
| System Health | Static | N/A | Badge: "Healthy" |

**Components Needed:**
- Tenants table with search, filter, sort (shadcn `Table`, `Input`, `Select`)
- Create tenant modal (shadcn `Dialog`, `Form`, `Input`, `Button`)
- Tenant detail view (shadcn `Card`, `Tabs`, `Badge`)
- Plans management table (shadcn `Table`)

---

### 2️⃣ ORG_ADMIN Dashboard

**Routes:**
- `/dashboard` - Main dashboard
- `/org/staff` - Staff management
- `/org/staff/invite` - Invite staff member
- `/org/locations` - Location management
- `/org/billing` - Billing & subscription
- `/settings` - Org settings

**Dashboard KPIs:**
| Metric | API Endpoint | DB Query | Calculation |
|--------|--------------|----------|-------------|
| Staff Members | `GET /api/org/members` | `SELECT COUNT(*) FROM orgMembers WHERE tenantId=?` | Count org members |
| Locations | `GET /api/org/locations` | `SELECT COUNT(*) FROM resources WHERE tenantId=? AND type='location'` | Count locations |
| Subscription | `GET /api/org/subscription` | `SELECT plan.name FROM subscriptions JOIN plans WHERE tenantId=?` | Current plan name |
| Settings | N/A | Static | Badge: "Configure" |

**Components Needed:**
- Staff table with role badges (shadcn `Table`, `Badge`, `DropdownMenu`)
- Invite staff form (shadcn `Dialog`, `Form`, `Select`)
- Location management cards (shadcn `Card`, `Button`)
- Subscription status card (shadcn `Card`, `Badge`)

---

### 3️⃣ DENTIST Dashboard

**Routes:**
- `/dashboard` - Main dashboard
- `/schedule` - Provider schedule/calendar
- `/patients` - Patient list
- `/patients/[id]` - Patient record detail
- `/treatments` - Treatment plans
- `/notes` - Clinical notes
- `/settings` - Provider settings

**Dashboard KPIs:**
| Metric | API Endpoint | DB Query | Calculation |
|--------|--------------|----------|-------------|
| Today's Appointments | `GET /api/appointments?date=today&providerId={userId}` | `SELECT COUNT(*) FROM appointments WHERE DATE(startAt)=CURRENT_DATE AND providerId=?` | Count today |
| Active Patients | `GET /api/patients/count` | `SELECT COUNT(DISTINCT patientId) FROM appointments WHERE providerId=?` | Unique patients |
| Treatment Plans | `GET /api/treatments?status=pending` | `SELECT COUNT(*) FROM treatment_plans WHERE status='pending'` | Count pending |
| Next Appointment | `GET /api/appointments?limit=1&sort=startAt` | `SELECT startAt FROM appointments WHERE startAt > NOW() ORDER BY startAt LIMIT 1` | Next time slot |

**Components Needed:**
- Schedule calendar view (shadcn `Calendar`, custom time grid)
- Patient list with search (shadcn `Table`, `Input`)
- Patient detail view with tabs (shadcn `Tabs`, `Card`, `ScrollArea`)
- Appointment cards (shadcn `Card`, `Badge`)

---

### 4️⃣ RECEPTION Dashboard

**Routes:**
- `/dashboard` - Main dashboard
- `/appointments` - Appointment scheduling
- `/appointments/new` - Create appointment
- `/patients` - Patient registry
- `/patients/new` - Register new patient
- `/checkin` - Check-in queue
- `/messages` - Communications
- `/settings` - Reception settings

**Dashboard KPIs:**
| Metric | API Endpoint | DB Query | Calculation |
|--------|--------------|----------|-------------|
| Today's Appointments | `GET /api/appointments?date=today` | `SELECT COUNT(*) FROM appointments WHERE DATE(startAt)=CURRENT_DATE` | All today |
| Pending Check-ins | `GET /api/appointments?status=confirmed&time=upcoming` | `SELECT COUNT(*) FROM appointments WHERE status='confirmed' AND startAt < NOW()+INTERVAL '30 min'` | Arriving soon |
| Waitlist | `GET /api/waitlist` | `SELECT COUNT(*) FROM waitlist` | Waitlist count |
| Missed Calls | Static/Future | N/A | Placeholder: 0 |

**Components Needed:**
- Full-day calendar view (custom grid + shadcn `Calendar`)
- Appointment creation form (shadcn `Form`, `DatePicker`, `Select`, `Combobox`)
- Patient search with quick registration (shadcn `Command`, `Dialog`)
- Check-in queue list (shadcn `Table`, `Badge`)

---

### 5️⃣ PATIENT Dashboard

**Routes:**
- `/dashboard` - Main dashboard
- `/my-appointments` - Upcoming appointments
- `/my-documents` - Medical documents
- `/my-billing` - Invoices & payments
- `/my-billing/pay` - Make payment
- `/messages` - Secure messaging
- `/profile` - Patient profile settings

**Dashboard KPIs:**
| Metric | API Endpoint | DB Query | Calculation |
|--------|--------------|----------|-------------|
| Next Appointment | `GET /api/patients/me/appointments?limit=1` | `SELECT startAt FROM appointments WHERE patientId=? AND startAt > NOW() ORDER BY startAt LIMIT 1` | Next scheduled |
| Documents | `GET /api/patients/me/documents` | `SELECT COUNT(*) FROM documents WHERE patientId=?` | Count docs |
| Outstanding Balance | `GET /api/patients/me/invoices?status=issued` | `SELECT SUM(balanceDue) FROM invoices WHERE patientId=? AND status IN ('issued','overdue')` | Sum balance due |
| Messages | `GET /api/patients/me/messages?unread=true` | `SELECT COUNT(*) FROM messages WHERE patientId=? AND read=false` | Unread count |

**Components Needed:**
- Appointment cards with time countdown (shadcn `Card`, `Badge`)
- Document viewer/download list (shadcn `Table`, `Button`)
- Invoice list with payment button (shadcn `Table`, `Dialog`)
- Profile edit form (shadcn `Form`, `Input`)

---

## 🧩 Component Reuse Strategy

### Existing shadcn/ui Components (Already Installed):
```
apps/web/src/components/ui/
├── accordion.tsx
├── alert-dialog.tsx
├── alert.tsx
├── badge.tsx
├── button.tsx
├── calendar.tsx
├── card.tsx
├── chart.tsx
├── checkbox.tsx
├── combobox.tsx
├── command.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── form.tsx
├── input.tsx
├── label.tsx
├── select.tsx
├── separator.tsx
├── sidebar.tsx
├── skeleton.tsx
├── table.tsx
├── tabs.tsx
├── textarea.tsx
└── toast.tsx
```

### New Shared Components to Create:
1. **DataTable** (`components/data-table.tsx`)
   - Reusable table with sorting, filtering, pagination
   - Used in: Tenants, Staff, Patients, Appointments, Invoices

2. **AppointmentCard** (`components/appointment-card.tsx`)
   - Displays single appointment with status badge
   - Used in: All role dashboards

3. **PatientSearchCombobox** (`components/patient-search.tsx`)
   - Autocomplete patient search
   - Used in: Appointments, Invoices, Reception

4. **EmptyState** (`components/empty-state.tsx`)
   - Consistent empty state UI
   - Used in: All list views with no data

5. **LoadingState** (`components/loading-state.tsx`)
   - Skeleton loading screens
   - Used in: All data fetching views

6. **StatCard** (`components/stat-card.tsx`)
   - Reusable KPI card component
   - Used in: All dashboards

---

## 🚀 Implementation Plan

### Phase 1: Cleanup & Setup (2 hours)
✅ Tasks:
1. Remove BILLING role from frontend:
   - Delete `billing-dashboard.tsx`
   - Remove from `app-sidebar.tsx`
   - Remove from `dashboard/page.tsx`
   - Update type definitions in `rbac.ts`
   
2. Create shared components:
   - `DataTable`
   - `StatCard`
   - `EmptyState`
   - `LoadingState`

3. Set up API client utilities:
   - Create `lib/api-client.ts` for fetch wrappers
   - Add error handling utilities
   - Add loading state management hooks

### Phase 2: Super Admin Dashboard (4 hours)
✅ Tasks:
1. Implement `/admin/tenants` page:
   - Fetch and display tenants table
   - Add search and filter
   - Create tenant modal
   
2. Implement dashboard KPIs:
   - Fetch real tenant count
   - Fetch real subscription count
   - Display revenue (mock for now if no endpoint)
   
3. Create tenant detail page:
   - Tenant info card
   - Subscription details
   - Usage metrics

### Phase 3: Org Admin Dashboard (4 hours)
✅ Tasks:
1. Implement `/org/staff` page:
   - Fetch org members
   - Display staff table with roles
   - Invite staff member form
   
2. Implement dashboard KPIs:
   - Fetch real staff count
   - Display subscription plan
   
3. Implement `/org/locations` page:
   - Location cards
   - Add/edit location forms

### Phase 4: Dentist Dashboard (5 hours)
✅ Tasks:
1. Implement `/schedule` page:
   - Calendar view
   - Fetch appointments by provider
   - Time slot grid
   
2. Implement `/patients` page:
   - Patient list table
   - Search functionality
   - Patient detail view
   
3. Update dashboard KPIs:
   - Today's appointment count
   - Active patients count
   - Next appointment time

### Phase 5: Reception Dashboard (5 hours)
✅ Tasks:
1. Implement `/appointments` page:
   - Full appointment calendar
   - Multi-provider view
   - Status filters
   
2. Implement `/appointments/new` page:
   - Patient search combobox
   - Provider selection
   - Date/time picker
   - Submit form to API
   
3. Implement `/patients/new` page:
   - Registration form
   - Submit to API
   
4. Update dashboard KPIs:
   - Today's appointments across all providers
   - Check-in queue

### Phase 6: Patient Dashboard (4 hours)
✅ Tasks:
1. Implement `/my-appointments` page:
   - Fetch patient appointments
   - Display cards with details
   
2. Implement `/my-billing` page:
   - Fetch patient invoices
   - Display invoice table
   - Payment button (modal)
   
3. Implement `/profile` page:
   - Display patient info
   - Edit form
   
4. Update dashboard KPIs:
   - Next appointment
   - Outstanding balance

### Phase 7: API Integration & Data Fetching (3 hours)
✅ Tasks:
1. Create API endpoint wrappers:
   - Tenant APIs
   - Patient APIs
   - Appointment APIs
   - Invoice APIs
   
2. Implement loading states:
   - Skeleton screens
   - Spinners
   
3. Implement error handling:
   - Toast notifications
   - Error boundaries
   - Retry logic

### Phase 8: Testing & QA (3 hours)
✅ Tasks:
1. Test each role login
2. Verify all sidebar links work
3. Verify all API calls succeed
4. Verify RBAC (403 on wrong role)
5. Check for console errors
6. Test forms (create patient, appointment, etc.)
7. Test responsive design
8. Capture HAR logs for API calls

---

## ✅ Acceptance Criteria

### Global:
- [ ] No console errors or warnings
- [ ] All network requests succeed (or show proper error states)
- [ ] No dummy/placeholder data displayed when API returns data
- [ ] UI layout remains identical to current design
- [ ] All Tailwind classes used (no inline styles or CSS files added)
- [ ] Proper loading states on all data fetching
- [ ] Proper error states with user-friendly messages
- [ ] Responsive design works on mobile, tablet, desktop

### SUPER_ADMIN:
- [ ] Dashboard shows real tenant count
- [ ] Dashboard shows real subscription count
- [ ] Tenants page displays list from API
- [ ] Can create new tenant via modal
- [ ] Tenant search works
- [ ] All sidebar links functional
- [ ] 403 error if non-SUPER_ADMIN accesses

### ORG_ADMIN:
- [ ] Dashboard shows real staff count
- [ ] Dashboard shows current subscription plan
- [ ] Staff page displays org members
- [ ] Can invite new staff member
- [ ] Locations page displays resources
- [ ] All sidebar links functional

### DENTIST:
- [ ] Dashboard shows today's appointment count
- [ ] Dashboard shows next appointment time
- [ ] Schedule page shows appointments for logged-in provider
- [ ] Patients page shows patient list with search
- [ ] Patient detail page displays full patient record
- [ ] All sidebar links functional

### RECEPTION:
- [ ] Dashboard shows today's appointments (all providers)
- [ ] Appointments page displays full calendar
- [ ] Can create new appointment
- [ ] Patient search works in appointment form
- [ ] Can register new patient
- [ ] All sidebar links functional

### PATIENT:
- [ ] Dashboard shows next appointment
- [ ] Dashboard shows outstanding balance
- [ ] My Appointments page displays patient's appointments
- [ ] My Billing page displays invoices
- [ ] Profile page shows patient info
- [ ] Can edit profile information
- [ ] All sidebar links functional

### BILLING (Removed):
- [ ] BILLING role removed from sidebar navigation
- [ ] BILLING dashboard component deleted
- [ ] BILLING user cannot login (should show error or redirect)
- [ ] No references to BILLING in frontend code

---

## 🧪 QA Checklist

### Pre-Testing Setup:
```bash
# Ensure database is seeded
npm run db:seed

# Start dev server
npm run dev
```

### Test Users (from seed.ts):
| Role | Email | Password |
|------|-------|----------|
| SUPER_ADMIN | superadmin@demo.com | super123 |
| ORG_ADMIN | orgadmin@demo.com | admin123 |
| DENTIST | dentist@demo.com | dentist123 |
| RECEPTION | reception@demo.com | reception123 |
| PATIENT | patient@demo.com | patient123 |
| ~~BILLING~~ | ~~billing@demo.com~~ | ~~billing123~~ (TO BE REMOVED) |

### Test Cases:

#### 1. Authentication
- [ ] Login with each valid role
- [ ] Verify redirect to correct dashboard
- [ ] Verify session persists on page refresh
- [ ] Logout works correctly
- [ ] Login with BILLING role (should fail or redirect)

#### 2. SUPER_ADMIN Tests
- [ ] Navigate to Dashboard - displays KPIs
- [ ] Navigate to Tenants - displays tenant list
- [ ] Search for "demo" in tenants table
- [ ] Click "Create Tenant" - modal opens
- [ ] Submit new tenant form - success toast
- [ ] Click tenant row - detail view opens
- [ ] Navigate to Plans - displays plan list
- [ ] Navigate to Settings - page loads
- [ ] Open browser DevTools Network tab - verify API calls return 200
- [ ] Capture HAR log

#### 3. ORG_ADMIN Tests
- [ ] Navigate to Dashboard - displays KPIs
- [ ] Navigate to Staff Management - displays staff list
- [ ] Click "Invite Staff Member" - form opens
- [ ] Navigate to Locations - displays locations
- [ ] Navigate to Billing - displays subscription info
- [ ] Navigate to Settings - page loads
- [ ] Verify all data is scoped to correct tenant
- [ ] Capture HAR log

#### 4. DENTIST Tests
- [ ] Navigate to Dashboard - displays today's appointments count
- [ ] Navigate to Schedule - displays calendar with appointments
- [ ] Navigate to Patients - displays patient list
- [ ] Search for patient by name
- [ ] Click patient row - detail view opens
- [ ] Navigate to Treatment Plans - page loads
- [ ] Navigate to Clinical Notes - page loads
- [ ] Verify only assigned appointments visible
- [ ] Capture HAR log

#### 5. RECEPTION Tests
- [ ] Navigate to Dashboard - displays KPIs
- [ ] Navigate to Appointments - displays calendar
- [ ] Click "Schedule New Appointment" - form opens
- [ ] Select patient from combobox - auto-populates
- [ ] Select provider from dropdown
- [ ] Select date and time
- [ ] Submit form - success toast
- [ ] Navigate to Patients - displays patient list
- [ ] Click "Register New Patient" - form opens
- [ ] Submit new patient form - success toast
- [ ] Navigate to Check-in - page loads
- [ ] Capture HAR log

#### 6. PATIENT Tests
- [ ] Navigate to Dashboard - displays next appointment
- [ ] Navigate to My Appointments - displays appointments list
- [ ] Navigate to Documents - displays documents list (may be empty)
- [ ] Navigate to Billing - displays invoices
- [ ] Navigate to Messages - page loads
- [ ] Navigate to Profile - displays patient information
- [ ] Click "Edit Profile" - form becomes editable
- [ ] Submit profile changes - success toast
- [ ] Verify cannot access other patients' data
- [ ] Capture HAR log

#### 7. RBAC Tests (Authorization)
- [ ] Login as PATIENT
- [ ] Manually navigate to `/admin/tenants` - should see 403 or redirect
- [ ] Manually navigate to `/org/staff` - should see 403 or redirect
- [ ] Login as DENTIST
- [ ] Manually navigate to `/admin/tenants` - should see 403 or redirect
- [ ] Login as ORG_ADMIN
- [ ] Manually navigate to `/admin/tenants` - should see 403 or redirect

#### 8. UI/UX Tests
- [ ] Test on mobile (< 768px) - sidebar collapses correctly
- [ ] Test on tablet (768-1024px) - layout adapts
- [ ] Test on desktop (> 1024px) - full layout displays
- [ ] Dark mode toggle works (if implemented)
- [ ] All buttons have hover states
- [ ] All forms show validation errors
- [ ] All tables are sortable (if implemented)
- [ ] All empty states display correctly
- [ ] All loading states display skeletons

#### 9. Error Handling Tests
- [ ] Stop backend server
- [ ] Try to load dashboard - displays error message
- [ ] Try to submit form - displays error message
- [ ] Start backend server again
- [ ] Click "Retry" - data loads successfully
- [ ] Submit invalid form data - displays validation errors

#### 10. Network Tests
- [ ] Open DevTools → Network tab
- [ ] Navigate through all pages
- [ ] Verify all API requests return 200 (or appropriate status)
- [ ] Verify no 404s for missing resources
- [ ] Verify no CORS errors
- [ ] Verify auth token included in headers
- [ ] Export HAR file for documentation

---

## 📦 Deliverables

### Code:
1. **Updated Dashboard Components** (`apps/web/src/components/dashboards/`)
   - ✅ `super-admin-dashboard.tsx` (connected to API)
   - ✅ `org-admin-dashboard.tsx` (connected to API)
   - ✅ `dentist-dashboard.tsx` (connected to API)
   - ✅ `reception-dashboard.tsx` (connected to API)
   - ✅ `patient-dashboard.tsx` (connected to API)
   - ❌ `billing-dashboard.tsx` (DELETED)

2. **New Page Routes** (`apps/web/src/app/`)
   - `/admin/tenants/page.tsx`
   - `/org/staff/page.tsx`
   - `/schedule/page.tsx`
   - `/patients/page.tsx`
   - `/appointments/page.tsx`
   - `/my-appointments/page.tsx`
   - `/my-billing/page.tsx`
   - `/profile/page.tsx`

3. **Shared Components** (`apps/web/src/components/`)
   - `data-table.tsx`
   - `stat-card.tsx`
   - `appointment-card.tsx`
   - `patient-search.tsx`
   - `empty-state.tsx`
   - `loading-state.tsx`

4. **API Client** (`apps/web/src/lib/`)
   - `api-client.ts` (fetch wrapper utilities)

5. **Updated Navigation** (`apps/web/src/components/`)
   - ✅ `app-sidebar.tsx` (BILLING removed)

6. **Updated Types** (`apps/web/src/lib/`)
   - ✅ `rbac.ts` (BILLING removed)

### Documentation:
1. **plan.md** (this file) ✅
2. **qa-results.md** (to be created after testing)
3. **HAR logs** (network traces for all role dashboards)
4. **Screenshots** (all dashboards in functional state)

### Git:
- **Branch:** `fe/dashboards-finalize-2024-10-31`
- **Commits:**
  - `feat: remove BILLING role from frontend`
  - `feat: create shared dashboard components`
  - `feat: implement super admin dashboard`
  - `feat: implement org admin dashboard`
  - `feat: implement dentist dashboard`
  - `feat: implement reception dashboard`
  - `feat: implement patient dashboard`
  - `feat: connect all dashboards to API`
  - `test: add QA validation for all roles`
  - `docs: add plan and QA results`

---

## 🚫 Restrictions (Reminder)

### ❌ Do NOT:
- Modify any file in `packages/db/src/schema/`
- Modify any file in `apps/web/src/app/api/`
- Modify database schema or migrations
- Create dummy data or mock API responses
- Change UI layout or design system
- Install new libraries (use existing shadcn components)
- Invent new API endpoints
- Modify authentication logic
- Change environment variables or config files

### ✅ DO:
- Only modify frontend code in `apps/web/src/app/` (pages)
- Only modify components in `apps/web/src/components/`
- Use existing shadcn/ui components
- Call existing API endpoints
- Display real data from API responses
- Implement proper loading and error states
- Follow existing code patterns
- Use TypeScript strictly
- Use Tailwind CSS for all styling

---

## 📊 Success Metrics

### Functionality:
- ✅ 100% of sidebar links functional
- ✅ 100% of dashboards display real data
- ✅ 100% of forms submit successfully
- ✅ 0 console errors
- ✅ 0 network errors (when backend running)
- ✅ BILLING role completely removed from frontend

### Code Quality:
- ✅ TypeScript strict mode (no `any` types)
- ✅ All components use proper TypeScript interfaces
- ✅ Reusable components extracted
- ✅ DRY principle followed
- ✅ Consistent naming conventions

### User Experience:
- ✅ Loading states on all async operations
- ✅ Error messages are user-friendly
- ✅ Empty states are informative
- ✅ Forms have validation
- ✅ Success feedback (toasts) on actions
- ✅ Responsive design works on all screen sizes

---

## 🔄 Next Steps After Approval

1. Create feature branch: `git checkout -b fe/dashboards-finalize-2024-10-31`
2. Begin Phase 1: Cleanup & Setup
3. Implement phases sequentially
4. Test each role after implementation
5. Generate `qa-results.md` with test results
6. Capture screenshots and HAR logs
7. Commit all changes with descriptive messages
8. Create pull request with plan + QA results

---

## 📞 Questions/Clarifications

None at this time. Plan is complete and awaiting approval to proceed.

---

**Status:** ✅ READY FOR APPROVAL

**Estimated Time:** 30 hours total implementation + testing

**Review Required:** Yes, before code implementation begins

---

*Generated on: October 31, 2024*

