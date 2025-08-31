import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wwoejvzxdcrhxhdjeqqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3b2Vqdnp4ZGNyaHhoZGplcXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTYzNzQsImV4cCI6MjA3MjIzMjM3NH0.xoKLN1_AyP-KG_x977PTiuumYlLtkk5-FM3LGaWhzdk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    console.log('🔍 Running Database Diagnostics...\n');

    // Test basic connection
    try {
        const { data: testData, error: testError } = await supabase
            .from('menu_items')
            .select('*', { count: 'exact' });

        if (testError) {
            console.error('❌ Database Connection Error:', testError);
            return;
        }
        console.log('✅ Database Connection Successful\n');

        // Get all menu items
        const { data: items, error: itemsError } = await supabase
            .from('menu_items')
            .select('*')
            .order('sort_order');

        if (itemsError) {
            console.error('❌ Error fetching menu items:', itemsError);
            return;
        }

        // Print statistics
        console.log('📊 Database Statistics:');
        console.log(`Total Items: ${items.length}`);

        // Group by category
        const categories = {};
        items.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = {
                    total: 0,
                    subcategories: {}
                };
            }
            categories[item.category].total++;

            if (item.subcategory) {
                if (!categories[item.category].subcategories[item.subcategory]) {
                    categories[item.category].subcategories[item.subcategory] = 0;
                }
                categories[item.category].subcategories[item.subcategory]++;
            }
        });

        console.log('\n📑 Category Breakdown:');
        for (const [category, data] of Object.entries(categories)) {
            console.log(`\n${category}: ${data.total} items`);
            for (const [subcategory, count] of Object.entries(data.subcategories)) {
                console.log(`  └─ ${subcategory}: ${count} items`);
            }
        }

        // Check for potential issues
        console.log('\n🔍 Checking for potential issues...');
        
        // Check for items without subcategories
        const noSubcategory = items.filter(item => !item.subcategory);
        if (noSubcategory.length > 0) {
            console.log('\n⚠️ Items without subcategories:');
            noSubcategory.forEach(item => {
                console.log(`  - ${item.name} (${item.category})`);
            });
        }

        // Check for duplicate sort_orders
        const sortOrders = {};
        items.forEach(item => {
            if (!sortOrders[item.sort_order]) {
                sortOrders[item.sort_order] = [];
            }
            sortOrders[item.sort_order].push(item);
        });

        const duplicateSortOrders = Object.entries(sortOrders)
            .filter(([order, items]) => items.length > 1);

        if (duplicateSortOrders.length > 0) {
            console.log('\n⚠️ Duplicate sort orders found:');
            duplicateSortOrders.forEach(([order, items]) => {
                console.log(`  Sort order ${order}:`);
                items.forEach(item => {
                    console.log(`    - ${item.name} (${item.category})`);
                });
            });
        }

        // Check for inactive items
        const inactiveItems = items.filter(item => !item.is_active);
        if (inactiveItems.length > 0) {
            console.log('\n📝 Inactive items:');
            inactiveItems.forEach(item => {
                console.log(`  - ${item.name} (${item.category})`);
            });
        }

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

checkDatabase();
