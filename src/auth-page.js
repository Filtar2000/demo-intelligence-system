import './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('auth-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleBtn = document.getElementById('auth-toggle-btn');
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const toggleText = document.getElementById('auth-toggle-text');
    const messageEl = document.getElementById('auth-message');

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

    function showMessage(text, type) {
        messageEl.textContent = text;
        messageEl.className = `auth-message ${type}`;
        messageEl.classList.remove('hidden');
    }

    function hideMessage() {
        messageEl.classList.add('hidden');
    }

    // Toggle Mode
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLogin = !isLogin;

        if (isLogin) {
            title.textContent = "Welcome back";
            subtitle.textContent = "Sign in to your account";
            submitBtn.textContent = "Sign In";
            toggleText.textContent = "Don't have an account?";
            toggleBtn.textContent = "Sign Up";
        } else {
            title.textContent = "Create account";
            subtitle.textContent = "Start managing your demos";
            submitBtn.textContent = "Create Account";
            toggleText.textContent = "Already have an account?";
            toggleBtn.textContent = "Sign In";
        }

        hideMessage();
    });

    // Handle Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        hideMessage();
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Processing...";

        try {
            if (isLogin) {
                const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;
                window.location.href = 'dashboard.html';

            } else {
                const { data, error } = await window.supabaseClient.auth.signUp({
                    email,
                    password
                });

                if (error) throw error;

                if (data.session) {
                    window.location.href = 'dashboard.html';
                } else {
                    showMessage("Check your email for the confirmation link.", "success");
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }
        } catch (err) {
            showMessage(err.message, "error");
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // Google Login
    document.getElementById('google-login-btn').addEventListener('click', async () => {
        try {
            const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/dashboard.html'
                }
            });
            if (error) {
                if (error.message && error.message.toLowerCase().includes('provider')) {
                    showMessage("Google login isn't available yet. Use email & password for now.", "error");
                } else {
                    showMessage(error.message, "error");
                }
            }
        } catch (err) {
            showMessage("Something went wrong with Google login. Try email & password instead.", "error");
        }
    });
});
