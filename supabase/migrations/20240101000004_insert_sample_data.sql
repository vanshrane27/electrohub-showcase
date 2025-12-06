-- Insert sample data for warranties table
INSERT INTO public.warranties (serial_number, purchase_date, name, email, registered_at) VALUES
('NXT-123456789', '2024-01-15', 'John Smith', 'john.smith@example.com', NOW() - INTERVAL '30 days'),
('NXT-987654321', '2024-02-20', 'Sarah Johnson', 'sarah.johnson@example.com', NOW() - INTERVAL '25 days'),
('NXT-456789123', '2024-03-10', 'Michael Brown', 'michael.brown@example.com', NOW() - INTERVAL '15 days'),
('NXT-789123456', '2024-04-05', 'Emily Davis', 'emily.davis@example.com', NOW() - INTERVAL '10 days'),
('NXT-321654987', '2024-05-12', 'David Wilson', 'david.wilson@example.com', NOW() - INTERVAL '5 days');

-- Insert sample data for contact_forms table
INSERT INTO public.contact_forms (first_name, last_name, phone, message, status, submitted_at) VALUES
('Alice', 'Thompson', '+1-555-0101', 'I need help with my product setup. The device is not connecting to WiFi properly.', 'New', NOW() - INTERVAL '7 days'),
('Robert', 'Martinez', '+1-555-0102', 'My product stopped working after the latest update. Can you help me troubleshoot?', 'New', NOW() - INTERVAL '5 days'),
('Lisa', 'Anderson', '+1-555-0103', 'I would like to know more about your extended warranty options for my purchase.', 'New', NOW() - INTERVAL '3 days'),
('James', 'Taylor', '+1-555-0104', 'I am experiencing slow performance with my device. Is there a way to optimize it?', 'New', NOW() - INTERVAL '2 days'),
('Maria', 'Garcia', '+1-555-0105', 'I need assistance with product replacement. My device has a manufacturing defect.', 'New', NOW() - INTERVAL '1 day');
