-- Insert salad items into menu_items table
INSERT INTO menu_items (name, description, price, category, is_active, sort_order) 
VALUES 
    ('Caesar''s', 'Iceberg, κοτόπουλο, μπέικον, κρουτόν, παρμεζάνα', 7.00, 'salads', true, 10),
    ('Greek salad', 'Πράσινα λαχανικά, ντοματίνια, παρμεζάνα, καρύδια', 7.00, 'salads', true, 20),
    ('Τονοσαλάτα', 'Πράσινα λαχανικά, τόνος, κρεμμύδι, ντοματίνια, καλαμπόκι, vinaigrette', 9.00, 'salads', true, 30);
