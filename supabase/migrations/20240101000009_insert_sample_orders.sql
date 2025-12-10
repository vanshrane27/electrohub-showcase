-- Insert 5 sample orders with different statuses
INSERT INTO public.orders (order_number, customer_name, customer_email, customer_phone, total_amount, status, items, shipping_address) VALUES
('ORD-2024-001', 'Rahul Sharma', 'rahul.sharma@example.com', '+91 98765 43210', 149999.00, 'not_dispatched', 
 '[
   {"id": "1", "name": "NexaBook Pro 15", "quantity": 1, "price": 74999},
   {"id": "2", "name": "NexaVision 55\" 4K TV", "quantity": 1, "price": 75000}
 ]'::jsonb,
 '123 MG Road, Bangalore, Karnataka 560001'),

('ORD-2024-002', 'Priya Patel', 'priya.patel@example.com', '+91 98765 43211', 89999.00, 'dispatched',
 '[
   {"id": "3", "name": "NexaTower Gaming PC", "quantity": 1, "price": 89999}
 ]'::jsonb,
 '456 Connaught Place, New Delhi, Delhi 110001'),

('ORD-2024-003', 'Amit Kumar', 'amit.kumar@example.com', '+91 98765 43212', 49999.00, 'shipped',
 '[
   {"id": "4", "name": "NexaBook Air 13", "quantity": 1, "price": 49999}
 ]'::jsonb,
 '789 Park Street, Kolkata, West Bengal 700016'),

('ORD-2024-004', 'Sneha Reddy', 'sneha.reddy@example.com', '+91 98765 43213', 124998.00, 'delivered',
 '[
   {"id": "5", "name": "NexaVision 65\" 4K TV", "quantity": 1, "price": 99999},
   {"id": "6", "name": "NexaSound Wireless Headphones", "quantity": 1, "price": 24999}
 ]'::jsonb,
 '321 Anna Salai, Chennai, Tamil Nadu 600002'),

('ORD-2024-005', 'Vikram Singh', 'vikram.singh@example.com', '+91 98765 43214', 74999.00, 'not_dispatched',
 '[
   {"id": "7", "name": "NexaBook Pro 15", "quantity": 1, "price": 74999}
 ]'::jsonb,
 '555 Marine Drive, Mumbai, Maharashtra 400001');
