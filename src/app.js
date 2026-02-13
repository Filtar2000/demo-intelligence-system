
// Supabase Configuration
const SUPABASE_URL = 'https://savatftagnbppbfelemw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhdmF0ZnRhZ25icHBiZmVsZW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NzgzMzcsImV4cCI6MjA4NjU1NDMzN30.0eTNpGnegrKKW3dlYh3tWkr9tdOH3Ppxd5mgt6TYgE8';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Export for other modules
window.supabaseClient = supabase;

// Auth Logic
const loginBtn = document.getElementById('loginBtn');

async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error);
    else window.location.href = 'auth.html';
}

async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();

    // Route Protection
    const path = window.location.pathname;
    const isProtected = path.includes('dashboard.html') || path.includes('crm.html');

    if (isProtected && !user) {
        window.location.href = 'auth.html';
        return;
    }

    // Navbar Update
    if (user && loginBtn) {
        loginBtn.textContent = 'Logout';
        loginBtn.href = '#';
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });

        // Update welcome message if present
        const welcomeMsg = document.getElementById('welcome-msg');
        if (welcomeMsg) {
            welcomeMsg.textContent = `Welcome, ${user.email.split('@')[0]}`;
        }
    } else if (!user && loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.href = 'auth.html';
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    checkUser();
});
