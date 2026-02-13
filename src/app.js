
// Supabase Configuration
const SUPABASE_URL = 'https://savatftagnbppbfelemw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhdmF0ZnRhZ25icHBiZmVsZW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NzgzMzcsImV4cCI6MjA4NjU1NDMzN30.0eTNpGnegrKKW3dlYh3tWkr9tdOH3Ppxd5mgt6TYgE8';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Export for other modules if needed (though we're using raw scripts mostly)
window.supabaseClient = supabase;

// Auth Logic
const loginBtn = document.getElementById('loginBtn');

async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google', // Defaulting to Google as it's common
        options: {
            redirectTo: window.location.href
        }
    });
    if (error) console.error('Login error:', error);
}

async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error);
    else window.location.href = 'auth.html';
}

async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();

    // Route Protection
    const path = window.location.pathname;
    const isProtected = path.includes('dashboard.html') || path.includes('analysis.html') || path.includes('label-fit.html');

    if (isProtected && !user) {
        window.location.href = 'auth.html';
        return;
    }

    // Navbar Update
    if (user) {
        // Update generic Login button if present
        if (loginBtn) {
            loginBtn.textContent = 'Logout';
            loginBtn.classList.add('logged-in');
            loginBtn.removeEventListener('click', handleLogin);
            loginBtn.addEventListener('click', handleLogout);
        }

        // Update generic username display if present
        const welcomeMsg = document.getElementById('welcome-msg');
        if (welcomeMsg) {
            welcomeMsg.textContent = `Welcome, ${user.email.split('@')[0]}`;
        }
    } else {
        if (loginBtn) {
            loginBtn.textContent = 'Login';
            loginBtn.classList.remove('logged-in');
            loginBtn.removeEventListener('click', handleLogout);
            loginBtn.addEventListener('click', () => window.location.href = 'auth.html');
        }
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    checkUser();

    // Page Navigation (Simple)
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Allow default navigation for actual links like analysis.html
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#')) return;

            e.preventDefault();
            // Simple active state toggle
            document.querySelector('.active')?.classList.remove('active');
            link.classList.add('active');

            const page = link.getAttribute('data-page');
            if (page) console.log(`Navigating to ${page}...`);
        });
    });
});
