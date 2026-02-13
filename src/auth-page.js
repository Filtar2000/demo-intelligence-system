import './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('auth-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submit-btn');
    const toggleBtn = document.getElementById('toggle-btn');
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const errorMsg = document.getElementById('auth-error');
    const successMsg = document.getElementById('auth-success');

    // State
    let isLogin = true;

    // Check if already logged in
    checkIfLoggedIn();

    async function checkIfLoggedIn() {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (session) {
            window.location.href = 'dashboard.html';
        }
    }

    // Toggle Mode
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLogin = !isLogin;

        if (isLogin) {
            title.textContent = "Welcome Back";
            subtitle.textContent = "Login to your producer dashboard";
            submitBtn.textContent = "Login";
            document.getElementById('toggle-text').textContent = "Don't have an account?";
            toggleBtn.textContent = "Sign Up";
        } else {
            title.textContent = "Create Account";
            subtitle.textContent = "Join the future of demo pitching";
            submitBtn.textContent = "Sign Up";
            document.getElementById('toggle-text').textContent = "Already have an account?";
            toggleBtn.textContent = "Login";
        }

        errorMsg.classList.add('hidden');
        successMsg.classList.add('hidden');
    });

    // Handle Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        errorMsg.classList.add('hidden');
        successMsg.classList.add('hidden');
        submitBtn.disabled = true;
        submitBtn.textContent = "Processing...";

        try {
            if (isLogin) {
                // LOGIN
                const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                window.location.href = 'dashboard.html';

            } else {
                // REGISTER
                const { data, error } = await window.supabaseClient.auth.signUp({
                    email,
                    password
                });

                if (error) throw error;

                if (data.session) {
                    // Immediate login (if email confirmation disabled)
                    window.location.href = 'dashboard.html';
                } else {
                    // Email confirmation needed
                    successMsg.textContent = "Check your email for the confirmation link!";
                    successMsg.classList.remove('hidden');
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Sign Up";
                }
            }
        } catch (err) {
            errorMsg.textContent = err.message;
            errorMsg.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = isLogin ? "Login" : "Sign Up";
        }
    });

    // Google Login
    document.getElementById('google-login-btn').addEventListener('click', async () => {
        const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/dashboard.html'
            }
        });
    });
});
