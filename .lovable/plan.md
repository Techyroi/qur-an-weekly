## Qur'an Khatm Planner — Auth, Landing & Multi-Plan Upgrade

### 1. Backend (Lovable Cloud)
Enable Lovable Cloud (Supabase) for auth + persistence. Create tables:
- `profiles` — id (FK auth.users), full_name, selected_plan ('7'|'15'|'30'|null), mushaf, reminder_time, reminder_enabled, theme, language, onboarded
- `plan_progress` — id, user_id, plan_type, day_number, title, start_surah, end_surah, estimated_pages, completed, completed_at, notes
- `user_stats` — user_id, current_streak, longest_streak, last_completion_date, cycles_completed

RLS: each user reads/writes only their rows. Auto-create profile + stats via trigger on signup. Email/password auth (no email confirmation for smooth dev UX).

### 2. Plan Data (`src/lib/khatm-data.ts`)
Keep existing 7-day Manzil. Add:
- `PLAN_15` — 15 sections balanced by page count (~40 pages each, surah ranges)
- `PLAN_30` — 30 Juz, one per day, with start/end surah+ayah
- Helper `getPlan(type)` returning the active plan array

### 3. Routes
```
src/routes/
  __root.tsx           — root layout, AuthProvider
  index.tsx            — public landing page (redirects to /dashboard if logged in)
  auth.tsx             — sign in / sign up tabs (with forgot password)
  reset-password.tsx   — set new password from recovery link
  _authenticated.tsx   — guard layout
  _authenticated/onboarding.tsx  — 4-step wizard
  _authenticated/dashboard.tsx   — main dashboard (refactor of current home)
  _authenticated/settings.tsx    — profile + preferences
```

### 4. Auth Layer
- `src/lib/auth-context.tsx` — supabase client, `useAuth()` hook with user/session/loading
- `onAuthStateChange` listener set up before `getSession()`
- Sign-up creates profile (trigger handles), redirects to `/onboarding`
- Sign-in checks `profile.onboarded` → routes to `/onboarding` or `/dashboard`

### 5. Landing Page (`/`)
Sections: hero (gradient + Arabic basmala), features grid (3 cards), benefits, plans comparison (3 plan cards), testimonials placeholder, FAQ accordion, footer with 54:17 quote. Mobile-first, gold/blue palette, geometric accents.

### 6. Onboarding Wizard
4 steps with progress dots: plan → mushaf → reminders → finish. On finish: writes to `profiles`, generates `plan_progress` rows for selected plan, navigates to `/dashboard`.

### 7. Dashboard
Refactor existing `Home` to read from Supabase instead of localStorage. Show today's portion (highlighted), progress ring, streak/cycles/ETA stats, plan grid with toggle/notes, quick actions (reset plan, change plan → re-runs onboarding step 1).

### 8. Settings Page
Form to update name, email, password, plan (regenerates progress), reminder time, theme, language placeholder.

### 9. UI Polish
Reuse design tokens in `src/styles.css`. Use shadcn `Tabs`, `Accordion`, `Switch`, `RadioGroup` for forms/FAQ. Keep gold/blue palette and Amiri font for Arabic.

### Technical notes
- Use `createServerFn` only where needed; mostly client-side Supabase calls with RLS.
- Local notifications via `Notification` API + `setTimeout` scheduler in a small hook.
- Existing localStorage `useKhatm` hook is removed — Supabase is source of truth.
- Existing `CircularProgress` and `DayCard` components are reused.