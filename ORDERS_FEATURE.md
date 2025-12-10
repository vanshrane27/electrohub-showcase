# Orders Feature Documentation

This document describes the Order Status feature implemented for the Admin Dashboard and Support Dashboard.

## Overview

The Orders feature allows:
- Admins to view all orders and update their status
- Support Dashboard to view all orders and their current status
- Orders are stored in Supabase with full tracking

## Database Schema

### Orders Table

Created via migration: `supabase/migrations/20240101000008_create_orders_table.sql`

**Fields:**
- `id` (UUID) - Primary key
- `order_number` (TEXT) - Unique order identifier
- `customer_name` (TEXT) - Customer's full name
- `customer_email` (TEXT) - Customer's email
- `customer_phone` (TEXT, nullable) - Customer's phone number
- `total_amount` (DECIMAL) - Order total amount
- `status` (TEXT) - Order status (not_dispatched, dispatched, shipped, delivered)
- `items` (JSONB) - Order items as JSON
- `shipping_address` (TEXT, nullable) - Shipping address
- `created_at` (TIMESTAMPTZ) - Order creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

### Order Status Values

1. **not_dispatched** - Order received but not yet dispatched
2. **dispatched** - Order has been dispatched from warehouse
3. **shipped** - Order is in transit
4. **delivered** - Order has been delivered to customer

## Features Implemented

### 1. Admin Dashboard - Order Management

**Location:** `/admin` → Orders Tab

**Features:**
- View all orders in a table
- Update order status using dropdown selector
- See order details: order number, customer info, total, status, date
- Stats cards showing counts by status
- Refresh button to reload orders

**Status Update:**
- Admins can change status using a Select dropdown
- Changes are saved immediately to Supabase
- Toast notification confirms status update

### 2. Support Dashboard - Order Viewing

**Location:** `/support-dashboard` → Orders Tab

**Features:**
- View all orders (read-only)
- See order status with color-coded badges
- View customer information
- See order totals and dates
- Orders tab added to navigation

**Stats:**
- Total Orders count displayed in stats cards

### 3. Support Page - Contact Buttons

**Location:** `/support` → Contact Support section

**Features:**
- WhatsApp button (disabled, no functionality)
- Call Us button (disabled, no functionality)
- Buttons placed below the contact form
- Responsive layout (stacked on mobile, side-by-side on desktop)

## Usage

### For Admins

1. **View Orders:**
   - Go to Admin Dashboard
   - Click "Orders" tab
   - See all orders in table format

2. **Update Order Status:**
   - Find the order in the table
   - Click the status dropdown
   - Select new status (not_dispatched, dispatched, shipped, delivered)
   - Status updates automatically

3. **Refresh Orders:**
   - Click "Refresh" button to reload orders from database

### For Support Team

1. **View Orders:**
   - Go to Support Dashboard
   - Click "Orders" tab
   - View all orders and their current status

## Database Setup

### Run Migration

Execute the SQL migration in Supabase SQL Editor:

```sql
-- File: supabase/migrations/20240101000008_create_orders_table.sql
```

This creates:
- `orders` table
- Indexes for performance
- RLS policies for security
- Auto-update trigger for `updated_at` timestamp

### RLS Policies

- **Authenticated users (admins)**: Full access (SELECT, INSERT, UPDATE)
- **Anonymous users**: Can INSERT orders (for checkout)

## Sample Data

To test the feature, you can insert sample orders:

```sql
INSERT INTO public.orders (order_number, customer_name, customer_email, customer_phone, total_amount, status, items) VALUES
('ORD-001', 'John Doe', 'john@example.com', '+1234567890', 149999.00, 'not_dispatched', '[]'::jsonb),
('ORD-002', 'Jane Smith', 'jane@example.com', '+1234567891', 74999.00, 'dispatched', '[]'::jsonb),
('ORD-003', 'Bob Johnson', 'bob@example.com', '+1234567892', 89999.00, 'shipped', '[]'::jsonb),
('ORD-004', 'Alice Brown', 'alice@example.com', '+1234567893', 49999.00, 'delivered', '[]'::jsonb);
```

## Status Badge Colors

- **Not Dispatched**: Yellow/Warning
- **Dispatched**: Blue/Primary
- **Shipped**: Accent color
- **Delivered**: Green/Success

## Integration Points

### Checkout Flow (Future)

When implementing checkout, orders should be created like this:

```typescript
const { data, error } = await supabase
  .from('orders')
  .insert({
    order_number: `ORD-${Date.now()}`,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    total_amount: totalAmount,
    status: 'not_dispatched',
    items: orderItems, // JSON array
    shipping_address: shippingAddress,
  });
```

## TypeScript Types

The `orders` table is fully typed in `src/integrations/supabase/types.ts`:

```typescript
orders: {
  Row: {
    id: string
    order_number: string
    customer_name: string
    customer_email: string
    customer_phone: string | null
    total_amount: number
    status: string
    items: Json
    shipping_address: string | null
    created_at: string | null
    updated_at: string | null
  }
  // ... Insert and Update types
}
```

## Future Enhancements

- Order details modal/view
- Order search and filtering
- Export orders to CSV
- Order history timeline
- Email notifications on status change
- Integration with shipping providers
- Order cancellation functionality
