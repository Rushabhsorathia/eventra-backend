# Eventra - Project Plan & Execution

## Overview
Event discovery and management platform. Browse events, buy tickets, organizers manage their events.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 10 (PHP 8.1) |
| Frontend | React 18 + Vite + Tailwind CSS |
| Database | MySQL |
| Auth | Laravel Sanctum (API tokens) |
| State | Zustand (frontend) |

---

## Current Architecture

```
eventra/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── AuthController.php
│   │   ├── EventController.php
│   │   └── TicketController.php
│   └── Models/
│       ├── User.php
│       ├── Event.php
│       └── Ticket.php
├── database/
│   └── seeders/
│       └── EventSeeder.php
├── routes/
│   └── api.php
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── stores/
│   └── package.json
└── docs/
    └── PLAN.md
```

---

## Current Status

### Working
- Event listing page (public)
- Event detail page with static data
- User registration & login
- JWT auth flow
- Static event data (seeder)

### Issues Found

#### 1. Event Model Not Found (CRITICAL)
```
"No query results for model [App\Models\Event] 1"
```
- Event with ID=1 doesn't exist in database
- EventSeeder ran but data may not have persisted
- The error occurs when accessing `/events/{id}` route

**Fix needed:**
1. Check if events exist in DB: `SELECT * FROM events;`
2. Re-run seeder if empty
3. Check for soft delete issues

#### 2. Mostly Static Data
- Event detail page shows hardcoded "Summer Music Festival 2026"
- Not fetching from API or DB
- Need to connect EventDetail page to `/api/events/{id}` endpoint

#### 3. Ticket Purchase Flow
- "Buy Ticket Now" button present but no backend implementation
- Need `POST /api/events/{id}/book` endpoint
- Need payment integration (Razorpay/Stripe)

#### 4. Organizer Dashboard
- Route exists but no real CRUD
- Need full event management (create, edit, delete)

#### 5. Frontend API Integration
- React pages not consistently calling Laravel API
- Need `axios` interceptor for auth tokens
- Need proper error handling for 401/403/404

---

## Execution Plan

### Phase 1: Fix Critical Bug
- [ ] Verify MySQL connection and events table
- [ ] Re-run `php artisan db:seed --class=EventSeeder`
- [ ] Verify event exists: `SELECT id, title FROM events LIMIT 5;`
- [ ] Fix EventController show() method for 404 handling

### Phase 2: Connect Frontend to API
- [ ] Create `/frontend/src/services/api.js` (axios instance)
- [ ] Fix EventCard to fetch from `/api/events`
- [ ] Fix EventDetail page to load from API
- [ ] Add auth token to all requests
- [ ] Add loading states and error handling

### Phase 3: Ticket Booking Flow
- [ ] Create `BookingController`
- [ ] `POST /api/events/{id}/book` - reserve ticket
- [ ] `GET /api/bookings` - list user bookings
- [ ] Add ticket quantity validation
- [ ] Create booking confirmation page

### Phase 4: Organizer Dashboard
- [ ] `POST /api/events` - create event
- [ ] `PUT /api/events/{id}` - update event
- [ ] `DELETE /api/events/{id}` - delete event
- [ ] Dashboard event management UI
- [ ] Image upload for events

### Phase 5: Polish & Production
- [ ] Email notifications on booking
- [ ] Razorpay/Stripe payment integration
- [ ] QR code for tickets
- [ ] Mobile responsive audit
- [ ] Performance optimization

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/events | No | List all events |
| GET | /api/events/{id} | No | Event details |
| POST | /api/register | No | Register user |
| POST | /api/login | No | Login |
| GET | /api/user | Yes | Current user |
| POST | /api/events/{id}/book | Yes | Book ticket |
| GET | /api/bookings | Yes | My bookings |
| POST | /api/events | Yes | Create event |
| PUT | /api/events/{id} | Yes | Update event |
| DELETE | /api/events/{id} | Yes | Delete event |

---

## Database Schema

### events
- id, title, description, date, time, location, capacity, price, image_url
- category_id, organizer_id, created_at, updated_at

### users
- id, name, email, password, role (user/organizer/admin)
- created_at, updated_at

### bookings
- id, user_id, event_id, quantity, total_price, status
- created_at, updated_at

---

## Notes

- Frontend runs on port 8210 (Vite dev)
- Backend runs on port 8201 (Laravel)
- Nginx reverse proxy on eventra.hbsys.net
- API base URL: `http://127.0.0.1:8201/api`