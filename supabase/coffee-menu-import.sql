-- Add subcategory column to menu_items table
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS subcategory varchar(255);

-- Insert Coffee Menu items
INSERT INTO menu_items (name, description, price, category, subcategory, is_active, sort_order) 
VALUES 
    -- Coffee
    ('Espresso single', '', 3.00, 'coffee_menu', 'coffee', true, 10),
    ('Espresso double', '', 4.00, 'coffee_menu', 'coffee', true, 20),
    ('Espresso americano', '', 4.00, 'coffee_menu', 'coffee', true, 30),
    ('Freddo espresso', '', 4.00, 'coffee_menu', 'coffee', true, 40),
    ('Freddo cappuccino', '', 4.30, 'coffee_menu', 'coffee', true, 50),
    ('Freddo cappuccino latte', '', 4.40, 'coffee_menu', 'coffee', true, 60),
    ('Flat white', '', 4.30, 'coffee_menu', 'coffee', true, 70),
    ('Cappuccino single', '', 4.00, 'coffee_menu', 'coffee', true, 80),
    ('Cappuccino double', '', 4.30, 'coffee_menu', 'coffee', true, 90),
    ('Cappuccino latte', '', 4.30, 'coffee_menu', 'coffee', true, 100),
    ('Nescafe', '', 4.00, 'coffee_menu', 'coffee', true, 110),
    ('Filter coffee', '', 4.00, 'coffee_menu', 'coffee', true, 120),
    ('Nescafe frappe', '', 4.00, 'coffee_menu', 'coffee', true, 130),
    ('Greek coffee single', '', 2.50, 'coffee_menu', 'coffee', true, 140),
    ('Greek coffee double', '', 3.50, 'coffee_menu', 'coffee', true, 150),

    -- Extras
    ('Extra dose', '', 0.50, 'coffee_menu', 'extras', true, 160),
    ('Syrup flavor', '', 0.40, 'coffee_menu', 'extras', true, 170),
    ('Whipped cream', '', 0.50, 'coffee_menu', 'extras', true, 180),

    -- Juice
    ('Fresh orange juice', '', 4.50, 'coffee_menu', 'juice', true, 190),
    ('Bfresh handmade juice (lemon-ginger)', '', 4.50, 'coffee_menu', 'juice', true, 200),
    ('Amita motion', '', 3.50, 'coffee_menu', 'juice', true, 210),

    -- Soft Drinks
    ('Coca cola', '', 3.50, 'coffee_menu', 'soft_drinks', true, 220),
    ('Coca cola zero', '', 3.50, 'coffee_menu', 'soft_drinks', true, 230),
    ('Soda', '', 3.50, 'coffee_menu', 'soft_drinks', true, 240),
    ('Pink grapefruit soda', '', 4.00, 'coffee_menu', 'soft_drinks', true, 250),
    ('Sparkling water', '', 4.00, 'coffee_menu', 'soft_drinks', true, 260),
    ('Ginger beer', '', 4.00, 'coffee_menu', 'soft_drinks', true, 270),
    ('Mango soda', '', 4.00, 'coffee_menu', 'soft_drinks', true, 280),
    ('Red bull', '', 5.00, 'coffee_menu', 'soft_drinks', true, 290),

    -- Beverages
    ('Chocolate (hot | cold)', '', 4.50, 'coffee_menu', 'beverages', true, 300),
    ('White chocolate (hot | cold)', '', 4.50, 'coffee_menu', 'beverages', true, 310),
    ('Flavour+', '', 4.50, 'coffee_menu', 'beverages', true, 320),

    -- Tea
    ('Organic iced tea', 'lemon, green, peach, white, rooibos-cranberry', 4.70, 'coffee_menu', 'tea', true, 330);
