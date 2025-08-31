// Debug utility for Supabase operations
const supabaseDebug = {
  async testConnection() {
    try {
      const { data, error } = await window.supabaseClient.from('menu_items').select('count(*)');
      
      if (error) {
        console.error('🔴 Database Connection Error:', error);
        return {
          success: false,
          error: error.message,
          details: {
            code: error.code,
            hint: error.hint,
            details: error.details
          }
        };
      }

      console.log('🟢 Database Connection Successful');
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('🔴 Supabase Client Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async testTableAccess() {
    try {
      const tables = ['menu_items'];
      const results = {};

      for (const table of tables) {
        console.log(`Testing access to ${table} table...`);
        
        // Test SELECT
        const { data: selectData, error: selectError } = await window.supabaseClient
          .from(table)
          .select('*')
          .limit(1);
        
        results[table] = {
          select: { success: !selectError, error: selectError?.message },
          structure: await this.getTableStructure(table)
        };
      }

      console.log('📊 Table Access Test Results:', results);
      return results;
    } catch (error) {
      console.error('🔴 Table Access Test Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getTableStructure(tableName) {
    try {
      // This requires database admin privileges
      const { data, error } = await window.supabaseClient.rpc('get_table_structure', {
        table_name: tableName
      });

      if (error) {
        console.error(`🔴 Unable to get ${tableName} structure:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`🔴 Error getting ${tableName} structure:`, error);
      return null;
    }
  },

  async testQueries() {
    try {
      // Test basic queries
      const queries = [
        {
          name: 'Basic Select',
          fn: () => window.supabaseClient.from('menu_items').select('*').limit(1)
        },
        {
          name: 'Filter Active Items',
          fn: () => window.supabaseClient.from('menu_items').select('*').eq('is_active', true).limit(1)
        },
        {
          name: 'Category Group',
          fn: () => window.supabaseClient.from('menu_items').select('category').eq('is_active', true)
        },
        {
          name: 'Subcategory Filter',
          fn: () => window.supabaseClient.from('menu_items').select('*').eq('category', 'coffee_menu').eq('subcategory', 'coffee').limit(1)
        }
      ];

      const results = {};
      for (const query of queries) {
        console.log(`Testing ${query.name}...`);
        const { data, error } = await query.fn();
        
        results[query.name] = {
          success: !error,
          error: error?.message,
          hasData: Boolean(data?.length)
        };
      }

      console.log('🔍 Query Test Results:', results);
      return results;
    } catch (error) {
      console.error('🔴 Query Test Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Utility to monitor real-time subscription
  monitorRealtimeSubscription() {
    try {
      console.log('🔄 Setting up realtime monitoring...');
      
      const subscription = window.supabaseClient
        .channel('menu_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'menu_items'
          }, 
          (payload) => {
            console.log('📡 Realtime Event Received:', {
              event: payload.eventType,
              new: payload.new,
              old: payload.old,
              timestamp: new Date().toISOString()
            });
          }
        )
        .subscribe((status) => {
          console.log('📡 Subscription Status:', status);
        });

      return subscription;
    } catch (error) {
      console.error('🔴 Realtime Subscription Error:', error);
      return null;
    }
  }
};

// Add debug commands to window for easy console access
window.supabaseDebug = supabaseDebug;

// Auto-run basic tests when included
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🔍 Running Supabase Diagnostics...');
  
  // Test connection
  const connectionTest = await supabaseDebug.testConnection();
  if (!connectionTest.success) {
    console.error('⚠️ Connection Test Failed:', connectionTest.error);
    return;
  }

  // Test table access
  const accessTest = await supabaseDebug.testTableAccess();
  if (!accessTest.menu_items?.select.success) {
    console.error('⚠️ Table Access Test Failed:', accessTest);
    return;
  }

  // Test queries
  const queryTests = await supabaseDebug.testQueries();
  const failedQueries = Object.entries(queryTests)
    .filter(([, result]) => !result.success)
    .map(([name]) => name);

  if (failedQueries.length > 0) {
    console.error('⚠️ Failed Queries:', failedQueries);
    return;
  }

  // Start monitoring realtime events
  const realtimeSub = supabaseDebug.monitorRealtimeSubscription();
  if (!realtimeSub) {
    console.error('⚠️ Failed to set up realtime monitoring');
    return;
  }

  console.log('✅ All diagnostics completed successfully');
});
