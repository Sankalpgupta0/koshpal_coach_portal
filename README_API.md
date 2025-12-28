# Coach Portal API Integration

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure the API URL in `.env`:
   ```
   VITE_API_URL=http://localhost:3000/api/v1
   ```

## API Services

All API services are located in `src/api/` directory:

### Auth API (`src/api/auth.js`)
- `login(email, password)` - Login user
- `logout()` - Logout user  
- `getCurrentUser()` - Get current authenticated user
- `refreshToken()` - Refresh access token
- `changePassword(currentPassword, newPassword)` - Change password
- `forgotPassword(email)` - Request password reset
- `resetPassword(token, newPassword)` - Reset password with token

### Coach API (`src/api/coach.js`)
- `createSlots(date, timeSlots)` - Create availability slots
- `getMySlots(date)` - Get coach's availability slots
- `getMyConsultations(filter)` - Get coach's consultations
  - Filters: `past`, `upcoming`, `thisMonth`
- `getConsultationStats()` - Get consultation statistics
- `cancelConsultation(consultationId, reason)` - Cancel a consultation
- `updateConsultationStatus(consultationId, status)` - Update consultation status
- `deleteSlot(slotId)` - Delete an availability slot
- `getMyProfile()` - Get coach profile
- `updateMyProfile(profileData)` - Update coach profile
- `getPayments(params)` - Get payment records
- `getPaymentStats()` - Get payment statistics
- `generateInvoice(invoiceData)` - Generate invoice
- `getInvoices(params)` - Get invoices list

## Usage Example

```javascript
import { getMyConsultations, getConsultationStats } from '../api';

// In component
const fetchData = async () => {
  try {
    const consultations = await getMyConsultations('upcoming');
    const stats = await getConsultationStats();
    console.log('Consultations:', consultations);
    console.log('Stats:', stats);
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

## Authentication

The axios instance automatically:
- Adds `Authorization: Bearer {token}` header from localStorage
- Handles 401 errors by redirecting to login
- Logs API errors for debugging

## Pages with API Integration

### Dashboard (`src/pages/Dashboard.jsx`)
- ✅ Fetches today's consultations
- ✅ Fetches consultation statistics
- ✅ Displays upcoming sessions
- ✅ Shows real-time stats (earnings, sessions, ratings)

### Clients (`src/pages/Clients.jsx`)
- ✅ Fetches all consultations
- ✅ Extracts unique clients
- ✅ Shows last and next session dates

### Payments (`src/pages/Payments.jsx`)
- ✅ Fetches payment statistics
- ✅ Fetches invoices list
- ✅ Displays earnings and pending amounts

### Availability (`src/pages/Availability.jsx`)
- ✅ Loads existing slots
- ✅ Creates new availability slots
- ✅ Publishes weekly availability

### Settings (`src/pages/Settings.jsx`)
- ✅ Loads coach profile
- ✅ Updates profile information
- ✅ Handles logout with API call

## Backend API Documentation

Full API documentation is available at:
`koshpal-backend/API_DOCUMENTATION_V1.md`

Key endpoints for Coach Portal:
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/coach/slots` - Create slots
- `GET /api/v1/coach/slots` - Get slots
- `GET /api/v1/coach/consultations` - Get consultations
- `GET /api/v1/coach/consultations/stats` - Get stats
- `PATCH /api/v1/coach/consultations/:id/cancel` - Cancel consultation
- `GET /api/v1/coach/profile` - Get profile
- `PATCH /api/v1/coach/profile` - Update profile
- `GET /api/v1/coach/payments/stats` - Get payment stats
- `GET /api/v1/coach/invoices` - Get invoices

## Error Handling

All API calls include try-catch blocks with:
- Loading states
- Error states with retry buttons
- Fallback to mock data when appropriate
- User-friendly error messages

## Testing

To test the API integration:

1. Start the backend server:
   ```bash
   cd koshpal-backend
   npm run dev
   ```

2. Start the coach portal:
   ```bash
   cd coach_portal
   npm run dev
   ```

3. Login with a COACH role account
4. Test each page functionality

## Notes

- All dates are in ISO format (YYYY-MM-DD)
- Times are in 24-hour format (HH:MM)
- Token is stored in localStorage as 'token'
- User info is stored in localStorage as 'user'
- API automatically handles token refresh
- Rate limiting is disabled in development
