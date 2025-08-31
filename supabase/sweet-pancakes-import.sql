-- Insert sweet pancake items into menu_items table
INSERT INTO menu_items (name, description, price, category, is_active, sort_order) 
VALUES 
    ('Pancake με αμύγδαλο & καρύδια', 'Πραλίνα φουντουκιού, πραλίνα φράουλας, αμύγδαλο, καρύδια', 7.50, 'sweet_pancakes', true, 10),
    ('Pancake lila pause', 'Πραλίνα φουντουκιού, πραλίνα φράουλας, μπισκότο oreo', 7.20, 'sweet_pancakes', true, 20),
    ('Pancake bueno', 'Λευκή πραλίνα φουντουκιού, μπισκότο', 7.50, 'sweet_pancakes', true, 30),
    ('Pancake σοκολάτας', 'Πραλίνα σοκολάτας, μπισκότο πτι-μπερ, μπανάνα', 7.50, 'sweet_pancakes', true, 40);
