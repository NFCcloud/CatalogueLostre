-- Check if the menu_items table exists and its structure
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    column_default,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'menu_items';

-- Count total items in the menu_items table
SELECT COUNT(*) as total_items FROM menu_items;

-- Count items by category and subcategory
SELECT 
    category,
    subcategory,
    COUNT(*) as item_count
FROM 
    menu_items
GROUP BY 
    category,
    subcategory
ORDER BY 
    category,
    subcategory;

-- Check for any duplicate items
SELECT 
    name,
    category,
    subcategory,
    COUNT(*) as duplicate_count
FROM 
    menu_items
GROUP BY 
    name,
    category,
    subcategory
HAVING 
    COUNT(*) > 1;

-- Check for any NULL or empty values in important columns
SELECT 
    'null_name' as check_type,
    COUNT(*) as count
FROM 
    menu_items 
WHERE 
    name IS NULL OR name = ''
UNION ALL
SELECT 
    'null_category',
    COUNT(*)
FROM 
    menu_items 
WHERE 
    category IS NULL OR category = ''
UNION ALL
SELECT 
    'null_price',
    COUNT(*)
FROM 
    menu_items 
WHERE 
    price IS NULL;

-- Check price ranges by category
SELECT 
    category,
    subcategory,
    MIN(price) as min_price,
    MAX(price) as max_price,
    AVG(price) as avg_price
FROM 
    menu_items
GROUP BY 
    category,
    subcategory
ORDER BY 
    category,
    subcategory;

-- Check sort_order sequence
SELECT 
    category,
    subcategory,
    name,
    sort_order
FROM 
    menu_items
ORDER BY 
    sort_order;

-- Check inactive items
SELECT 
    name,
    category,
    subcategory,
    price,
    sort_order
FROM 
    menu_items
WHERE 
    is_active = false;
