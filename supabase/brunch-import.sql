-- Insert brunch items into menu_items table
INSERT INTO menu_items (name, description, price, category, is_active, sort_order) 
VALUES 
    ('Ομελέτα κλασική', '3 αυγά ολόκληρα, συνοδεύεται με σαλάτα', 5.50, 'brunch', true, 10),
    ('Ομελέτα special', '3 αυγά ολόκληρα, πιπεριά, κρεμμύδι, μοτσαρέλα, παρμεζάνα, μπέικον, ντοματίνια, συνοδεύεται με σαλάτα', 7.00, 'brunch', true, 20),
    ('Ομελέτα healthy', '3 ολόκληρα αυγά, κρέμα γάλακτος, βούτυρο, ψωμί', 7.00, 'brunch', true, 30),
    ('Αυγά scrambled', 'Τηγανητό ψωμί, συνοδεύεται με σαλάτα', 7.50, 'brunch', true, 40),
    ('Pancake chick''n bacon', 'Κοτόπουλο, μαγιονέζα, μοτσαρέλα, σαλάτα, ντομάτα', 9.80, 'brunch', true, 50),
    ('Pancake club''n mayo', 'Κοτόπουλο, σπεσιαλ σως, μπέικον, αυγό, σάλτσα cheddar', 7.50, 'brunch', true, 60);
