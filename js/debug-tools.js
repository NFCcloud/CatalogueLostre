const SupabaseDebugger = {
    logAuthAttempts: true,
    logStorageOps: true,
    logDatabaseOps: true,
    
    async checkSupabaseConnection(supabase) {
        console.group('🔍 Supabase Connection Check');
        try {
            const { data, error } = await supabase.from('profiles').select('count').single();
            console.log('Connection Status:', error ? '❌ Failed' : '✅ Success');
            console.log('Project URL:', supabase.supabaseUrl);
            console.log('Auth Configuration:', {
                autoRefreshToken: supabase.auth.autoRefreshToken,
                persistSession: supabase.auth.persistSession,
                storageKey: supabase.auth.storageKey
            });

            if (error) {
                console.error('Connection Error:', error);
                throw error;
            }
        } catch (err) {
            console.error('Connection Check Failed:', err);
            throw new Error('Αδυναμία σύνδεσης με τον διακομιστή. Παρακαλώ δοκιμάστε ξανά.');
        } finally {
            console.groupEnd();
        }
    },

    async validateAuthSetup(supabase) {
        console.group('🔐 Auth Configuration Validation');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            console.log('Current Session:', session ? '✅ Active' : '❌ None');
            
            if (session?.user) {
                console.log('User State:', {
                    loggedIn: true,
                    email: session.user.email,
                    id: session.user.id,
                    lastSignIn: session.user.last_sign_in_at
                });
            }

            // Check for common configuration issues
            const authConfig = {
                url: supabase.supabaseUrl + '/auth/v1',
                headers: supabase.headers,
                autoRefreshToken: supabase.auth.autoRefreshToken
            };
            console.log('Auth Configuration:', authConfig);
        } catch (err) {
            console.error('Auth Validation Error:', err);
        }
        console.groupEnd();
    },

    monitorAuthEvents(supabase) {
        supabase.auth.onAuthStateChange((event, session) => {
            console.group(`🔄 Auth State Change: ${event}`);
            console.log('Event Type:', event);
            console.log('Session:', session);
            console.log('Timestamp:', new Date().toISOString());
            if (session?.user) {
                console.log('User:', {
                    id: session.user.id,
                    email: session.user.email,
                    role: session.user.role
                });
            }
            console.groupEnd();
        });
    },

    setupNetworkMonitoring() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const [url, options] = args;
            const requestId = Math.random().toString(36).substring(7);
            
            console.group(`🌐 Supabase API Request (${requestId})`);
            console.log('URL:', url);
            console.log('Method:', options?.method || 'GET');
            console.log('Headers:', options?.headers);
            
            const startTime = performance.now();
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                
                console.log('Response Time:', Math.round(endTime - startTime) + 'ms');
                console.log('Status:', response.status);
                console.log('OK:', response.ok);

                const clone = response.clone();
                try {
                    const data = await clone.json();
                    console.log('Response Data:', data);
                } catch (e) {
                    console.log('Response is not JSON');
                }

                console.groupEnd();
                return response;
            } catch (error) {
                console.error('Request Failed:', error);
                console.groupEnd();
                throw error;
            }
        };
    }
};

// Add to window for console access
window.SupabaseDebugger = SupabaseDebugger;
