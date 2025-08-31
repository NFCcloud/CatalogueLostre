-- Update existing menu items with sample images
UPDATE menu_items 
SET image_url = CASE 
    -- Salads
    WHEN name = 'Caesar''s' THEN 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500'
    WHEN name = 'Greek salad' THEN 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500'
    WHEN name = 'Τονοσαλάτα' THEN 'https://images.unsplash.com/photo-1511994714008-b6d68a8b32a2?w=500'
    
    -- Pizzas
    WHEN name = 'Μαργαρίτα' THEN 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500'
    WHEN name = 'Greek pizza' THEN 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500'
    WHEN name = 'Special' THEN 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'
    
    -- Brunch
    WHEN name = 'Ομελέτα κλασική' THEN 'https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=500'
    WHEN name = 'Ομελέτα special' THEN 'https://images.unsplash.com/photo-1637937832091-33ec12e48e8f?w=500'
    WHEN name = 'Ομελέτα healthy' THEN 'https://images.unsplash.com/photo-1642666223743-337d4af23a30?w=500'
    WHEN name = 'Αυγά scrambled' THEN 'https://images.unsplash.com/photo-1648398113916-12397c2b8d18?w=500'
    WHEN name = 'Pancake chick''n bacon' THEN 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500'
    WHEN name = 'Pancake club''n mayo' THEN 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500'
    
    -- Sweet Pancakes
    WHEN name = 'Pancake με αμύγδαλο & καρύδια' THEN 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500'
    WHEN name = 'Pancake lila pause' THEN 'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?w=500'
    WHEN name = 'Pancake bueno' THEN 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=500'
    WHEN name = 'Pancake σοκολάτας' THEN 'https://images.unsplash.com/photo-1648639122655-5b869c4a6bcc?w=500'
    
    -- Desserts
    WHEN name = 'Σουφλέ σοκολάτας' THEN 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500'
    WHEN name = 'Μηλόπιτα' THEN 'https://images.unsplash.com/photo-1568571780765-9276210e9267?w=500'
    
    ELSE 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500' -- Default food image
END;
