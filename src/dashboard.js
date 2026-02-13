import './app.js';

document.addEventListener('DOMContentLoaded', async () => {
    const statAnalyses = document.getElementById('stat-analyses');
    const statSubmissions = document.getElementById('stat-submissions');
    const statReplied = document.getElementById('stat-replied');

    const recentAnalysesList = document.getElementById('recent-analyses-list');
    const recentSubmissionsList = document.getElementById('recent-submissions-list');

    const btnRegister = document.getElementById('btn-register-submission');
    const modal = document.getElementById('submission-modal');
    const closeModal = document.getElementById('close-submission-modal');
    const subForm = document.getElementById('submission-form');

    if (!window.supabaseClient) return;

    const { data: { user } } = await window.supabaseClient.auth.getUser();
    if (!user) return;

    // Welcome message
    const welcomeMsg = document.getElementById('welcome-msg');
    if (welcomeMsg && user.email) {
        const name = user.email.split('@')[0];
        welcomeMsg.textContent = `Welcome, ${name}`;
    }

    await loadDashboardData();

    // Modal
    btnRegister.addEventListener('click', () => modal.classList.remove('hidden'));
    closeModal.addEventListener('click', () => modal.classList.add('hidden'));

    // Outside click to close modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    subForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const labelName = document.getElementById('sub-label').value;
        const trackName = document.getElementById('sub-track').value;
        const status = document.getElementById('sub-status').value;

        const submitBtn = subForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const { error } = await window.supabaseClient
                .from('submissions')
                .insert({
                    user_id: user.id,
                    label_name: labelName,
                    track_name: trackName,
                    status: status
                });

            if (error) throw error;

            modal.classList.add('hidden');
            subForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save';
            await loadDashboardData();

        } catch (err) {
            console.error('Error adding submission:', err);
            alert('Failed to add submission');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save';
        }
    });

    async function loadDashboardData() {
        try {
            const { data: analyses, error: errA } = await window.supabaseClient
                .from('analyses')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (errA) throw errA;

            const { data: submissions, error: errS } = await window.supabaseClient
                .from('submissions')
                .select('*')
                .eq('user_id', user.id)
                .order('sent_at', { ascending: false });

            if (errS) throw errS;

            // Stats
            statAnalyses.textContent = analyses.length;
            statSubmissions.textContent = submissions.length;
            statReplied.textContent = submissions.filter(s => s.status === 'replied').length;

            // Lists
            renderAnalysesList(analyses.slice(0, 5));
            renderSubmissionsList(submissions.slice(0, 5));

            // Chart
            renderChart(analyses.slice(0, 10).reverse());

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }

    function renderAnalysesList(items) {
        recentAnalysesList.innerHTML = '';
        if (items.length === 0) {
            recentAnalysesList.innerHTML = '<div class="loading-text">No analyses yet. Start by analyzing a track.</div>';
            return;
        }

        items.forEach(item => {
            const date = new Date(item.created_at).toLocaleDateString();
            const score = item.score;

            // Use design system colors
            let color, bg;
            if (score > 70) {
                color = '#3ecf8e'; bg = 'rgba(62, 207, 142, 0.1)';
            } else if (score > 40) {
                color = '#e8aa42'; bg = 'rgba(232, 170, 66, 0.1)';
            } else {
                color = '#e54d5e'; bg = 'rgba(229, 77, 94, 0.1)';
            }

            const div = document.createElement('div');
            div.className = 'activity-item';
            div.innerHTML = `
                <div class="activity-info">
                    <h4>${item.filename}</h4>
                    <p>${date}</p>
                </div>
                <div class="score-pip" style="color: ${color}; background: ${bg};">
                    ${score}
                </div>
            `;
            recentAnalysesList.appendChild(div);
        });
    }

    function renderSubmissionsList(items) {
        recentSubmissionsList.innerHTML = '';
        if (items.length === 0) {
            recentSubmissionsList.innerHTML = '<div class="loading-text">No submissions registered yet.</div>';
            return;
        }

        items.forEach(item => {
            const date = new Date(item.sent_at).toLocaleDateString();
            let badgeClass = 'status-sent';
            let statusLabel = 'Sent';

            if (item.status === 'replied') { badgeClass = 'status-replied'; statusLabel = 'Replied'; }
            else if (item.status === 'signed') { badgeClass = 'status-signed'; statusLabel = 'Signed'; }
            else if (item.status === 'rejected') { badgeClass = 'status-rejected'; statusLabel = 'Rejected'; }

            const div = document.createElement('div');
            div.className = 'activity-item';
            div.innerHTML = `
                <div class="activity-info">
                    <h4>${item.label_name}</h4>
                    <p>${date}</p>
                </div>
                <span class="${badgeClass}">${statusLabel}</span>
            `;
            recentSubmissionsList.appendChild(div);
        });
    }

    function renderChart(items) {
        const canvas = document.getElementById('scoreChart');
        if (!canvas) return;

        if (window.myDashboardChart) {
            window.myDashboardChart.destroy();
        }

        if (items.length === 0) {
            canvas.parentElement.querySelector('.panel-header .panel-title').textContent = 'Score History';
            return;
        }

        const labels = items.map(item => {
            const name = item.filename || 'track';
            return name.length > 12 ? name.substring(0, 12) + '…' : name;
        });
        const data = items.map(item => item.score);

        window.myDashboardChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Score',
                    data: data,
                    borderColor: '#e8aa42',
                    backgroundColor: 'rgba(232, 170, 66, 0.08)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#e8aa42',
                    pointBorderColor: '#0a0c10',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1d2230',
                        titleColor: '#eaedf3',
                        bodyColor: '#8a90a0',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 10
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: { color: '#555b6e', font: { size: 11 } },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#555b6e', font: { size: 10 } },
                        border: { display: false }
                    }
                }
            }
        });
    }
});
