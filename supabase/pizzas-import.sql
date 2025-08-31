-- Insert pizza items into menu_items table
INSERT INTO menu_items (name, description, price, category, is_active, sort_order) 
VALUES 
    ('Μαργαρίτα', 'Σάλτσα ντομάτας, μοτσαρέλα, παρμεζάνα', 9.00, 'pizzas', true, 10),
    ('Greek pizza', 'Ντομάτα, ελιές, ρίγανη, ελαιόλαδο', 10.00, 'pizzas', true, 20),
    ('Special', 'Σάλτσα ντομάτας, μοτσαρέλα, πιπεριά, κρεμμύδι, ντομάτα', 11.00, 'pizzas', true, 30);
