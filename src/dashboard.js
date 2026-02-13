import './app.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Stats Elements
    const statAnalyses = document.getElementById('stat-analyses');
    const statSubmissions = document.getElementById('stat-submissions');
    const statReplied = document.getElementById('stat-replied');

    // List Elements
    const recentAnalysesList = document.getElementById('recent-analyses-list');
    const recentSubmissionsList = document.getElementById('recent-submissions-list');

    // Modal Control
    const btnRegister = document.getElementById('btn-register-submission');
    const modal = document.getElementById('submission-modal');
    const closeModal = document.getElementById('close-submission-modal');
    const subForm = document.getElementById('submission-form');

    if (!window.supabaseClient) return;

    // 1. Fetch User
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    if (!user) return; // app.js handles redirect

    // 2. Fetch Data
    await loadDashboardData();

    // 3. Modal Events
    btnRegister.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // 4. Handle Submission Registration
    subForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const labelName = document.getElementById('sub-label').value;
        const trackName = document.getElementById('sub-track').value;
        const status = document.getElementById('sub-status').value;

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

            // Success
            modal.classList.add('hidden');
            subForm.reset();
            // Reload data to show new submission
            await loadDashboardData();

        } catch (err) {
            console.error('Error adding submission:', err);
            alert('Failed to add submission');
        }
    });


    async function loadDashboardData() {
        try {
            // Fetch Analyses
            const { data: analyses, error: errA } = await window.supabaseClient
                .from('analyses')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (errA) throw errA;

            // Fetch Submissions
            const { data: submissions, error: errS } = await window.supabaseClient
                .from('submissions')
                .select('*')
                .eq('user_id', user.id)
                .order('sent_at', { ascending: false });

            if (errS) throw errS;

            // --- UPDATE STATS ---
            statAnalyses.textContent = analyses.length;
            statSubmissions.textContent = submissions.length;

            const repliedCount = submissions.filter(s => s.status === 'replied').length;
            statReplied.textContent = repliedCount;


            // --- RENDER LISTS ---
            renderAnalysesList(analyses.slice(0, 5));
            renderSubmissionsList(submissions.slice(0, 5));

            // --- RENDER CHART ---
            renderChart(analyses.slice(0, 10).reverse());

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }

    function renderAnalysesList(items) {
        recentAnalysesList.innerHTML = '';
        if (items.length === 0) {
            recentAnalysesList.innerHTML = '<div class="loading-text">No analyses yet.</div>';
            return;
        }

        items.forEach(item => {
            const date = new Date(item.created_at).toLocaleDateString();
            const score = item.score;
            let color = '#f44336'; // Red < 40
            if (score > 40) color = '#ffc107'; // Yellow 40-70
            if (score > 70) color = '#4caf50'; // Green > 70

            const div = document.createElement('div');
            div.className = 'activity-item';
            div.innerHTML = `
                <div class="activity-info">
                    <h4>${item.filename}</h4>
                    <p>${date}</p>
                </div>
                <div class="score-pip" style="color: ${color}; border: 1px solid ${color}; background: rgba(0,0,0,0.2);">
                    ${score}
                </div>
            `;
            recentAnalysesList.appendChild(div);
        });
    }

    function renderSubmissionsList(items) {
        recentSubmissionsList.innerHTML = '';
        if (items.length === 0) {
            recentSubmissionsList.innerHTML = '<div class="loading-text">No registered submissions.</div>';
            return;
        }

        items.forEach(item => {
            const date = new Date(item.sent_at).toLocaleDateString();
            let badgeClass = 'status-sent';
            let statusLabel = item.status;

            if (item.status === 'replied') { badgeClass = 'status-replied'; statusLabel = 'Replied'; }
            else if (item.status === 'signed') { badgeClass = 'status-signed'; statusLabel = 'Signed'; }
            else if (item.status === 'rejected') { badgeClass = 'status-rejected'; statusLabel = 'Rejected'; }
            else { badgeClass = 'status-sent'; statusLabel = 'Sent'; }

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
        // Destroy existing chart if any (to prevent overlap on reload)
        const canvas = document.getElementById('scoreChart');
        if (!canvas) return;

        // Reset canvas if needed for Chart.js 
        // (Simpler: just create new one if the ID logic handles it, 
        // but Chart.js attaches to canvas. We should check if window.myChart exists)

        if (window.myDashboardChart) {
            window.myDashboardChart.destroy();
        }

        const labels = items.map(item => item.filename.substring(0, 15) + (item.filename.length > 15 ? '...' : ''));
        const data = items.map(item => item.score);

        window.myDashboardChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Score',
                    data: data,
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#888' }
                    },
                    x: {
                        ticks: { color: '#888', font: { size: 10 } }
                    }
                }
            }
        });
    }
});
