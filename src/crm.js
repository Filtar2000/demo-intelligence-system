import './app.js';
import { generateFollowUp } from './demo-generator.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Elements
    const searchInput = document.getElementById('search-input');
    const filterStatus = document.getElementById('filter-status');
    const tableBody = document.getElementById('crm-table-body');
    const loading = document.getElementById('loading-indicator');

    // Modals
    const subModal = document.getElementById('submission-modal');
    const subForm = document.getElementById('submission-form');
    const btnAdd = document.getElementById('btn-add-submission');
    const btnCloseSub = document.getElementById('close-sub-modal');

    const aiModal = document.getElementById('followup-modal');
    const btnCloseAi = document.getElementById('close-followup-modal');
    const aiSubject = document.getElementById('ai-subject');
    const aiBody = document.getElementById('ai-body');
    const btnCopyAi = document.getElementById('btn-copy-followup');

    // Data State
    let allSubmissions = [];
    let currentUser = null;

    if (!window.supabaseClient) return;

    // 1. Init
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    if (!user) return; // Autos to login/dashboard normally
    currentUser = user;

    loadSubmissions();
    setDateToday(); // for modal

    // 2. Events: Filters
    searchInput.addEventListener('input', renderTable);
    filterStatus.addEventListener('change', renderTable);

    // 3. Events: Modal Add
    btnAdd.addEventListener('click', () => subModal.classList.remove('hidden'));
    btnCloseSub.addEventListener('click', () => subModal.classList.add('hidden'));

    // 4. Events: Save Submission
    subForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const label = document.getElementById('inp-label').value;
        const track = document.getElementById('inp-track').value;
        const date = document.getElementById('inp-date').value;
        const status = document.getElementById('inp-status').value;
        const notes = document.getElementById('inp-notes').value;

        // Simple Insert
        const { error } = await window.supabaseClient
            .from('submissions')
            .insert({
                user_id: currentUser.id,
                label_name: label,
                track_name: track,
                sent_date: date,
                status: status,
                notes: notes
            });

        if (error) {
            alert('Error adding submission: ' + error.message);
        } else {
            subModal.classList.add('hidden');
            subForm.reset();
            setDateToday();
            loadSubmissions();
        }
    });

    // 5. Events: AI Modal
    btnCloseAi.addEventListener('click', () => aiModal.classList.add('hidden'));
    btnCopyAi.addEventListener('click', () => {
        const text = `Subject: ${aiSubject.textContent.replace('Subject: ', '')}\n\n${aiBody.textContent}`;
        navigator.clipboard.writeText(text);
        btnCopyAi.textContent = "Copied!";
        setTimeout(() => btnCopyAi.textContent = "Copy Email", 2000);
    });

    // --- FUNCTIONS ---

    async function loadSubmissions() {
        loading.classList.remove('hidden');
        tableBody.innerHTML = '';

        const { data, error } = await window.supabaseClient
            .from('submissions')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('sent_date', { ascending: false });

        loading.classList.add('hidden');

        if (error) {
            console.error(error);
            return;
        }

        allSubmissions = data;
        renderTable();
    }

    function renderTable() {
        const query = searchInput.value.toLowerCase();
        const statusFilter = filterStatus.value;

        tableBody.innerHTML = '';

        const filtered = allSubmissions.filter(sub => {
            const matchesQuery = sub.label_name.toLowerCase().includes(query) || (sub.track_name || '').toLowerCase().includes(query);
            const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
            return matchesQuery && matchesStatus;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#666;">No submissions found.</td></tr>';
            return;
        }

        filtered.forEach(sub => {
            const tr = document.createElement('tr');

            // Status Select Logic
            const statusClass = `status-${sub.status}`;

            tr.innerHTML = `
                <td><strong>${sub.label_name}</strong></td>
                <td>${sub.track_name || '--'}</td>
                <td>${sub.sent_date}</td>
                <td>
                    <select class="status-select ${statusClass}" data-id="${sub.id}">
                        <option value="sent" ${sub.status === 'sent' ? 'selected' : ''}>Sent</option>
                        <option value="opened" ${sub.status === 'opened' ? 'selected' : ''}>Opened</option>
                        <option value="replied" ${sub.status === 'replied' ? 'selected' : ''}>Replied</option>
                        <option value="signed" ${sub.status === 'signed' ? 'selected' : ''}>Signed</option>
                        <option value="rejected" ${sub.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </td>
                <td>${sub.follow_up_date || '--'}</td>
                <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${sub.notes || ''}">${sub.notes || '--'}</td>
                <td>
                    <button class="action-btn text-accent btn-followup" title="Generate Follow-up" data-id="${sub.id}">🤖</button>
                    <button class="action-btn text-danger btn-delete" title="Delete" data-id="${sub.id}">&times;</button>
                </td>
            `;

            // Attach Inline Events
            const select = tr.querySelector('.status-select');
            select.addEventListener('change', (e) => updateStatus(sub.id, e.target.value, e.target));

            const btnDel = tr.querySelector('.btn-delete');
            btnDel.addEventListener('click', () => deleteSubmission(sub.id));

            const btnAi = tr.querySelector('.btn-followup');
            btnAi.addEventListener('click', () => openAiFollowup(sub));

            tableBody.appendChild(tr);
        });
    }

    async function updateStatus(id, newStatus, selectEl) {
        // Optimistic UI Update for color
        selectEl.className = `status-select status-${newStatus}`;

        const { error } = await window.supabaseClient
            .from('submissions')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error('Update failed:', error);
            alert('Failed to update status');
            loadSubmissions(); // Revert
        } else {
            // Update local state
            const item = allSubmissions.find(s => s.id === id);
            if (item) item.status = newStatus;
        }
    }

    async function deleteSubmission(id) {
        if (!confirm('Are you sure you want to delete this record?')) return;

        const { error } = await window.supabaseClient
            .from('submissions')
            .delete()
            .eq('id', id);

        if (error) alert('Error deleting: ' + error.message);
        else {
            allSubmissions = allSubmissions.filter(s => s.id !== id);
            renderTable();
        }
    }

    async function openAiFollowup(sub) {
        aiModal.classList.remove('hidden');
        aiSubject.textContent = "Subject: ...";
        aiBody.textContent = "Generating AI follow-up...";
        btnCopyAi.disabled = true;

        try {
            const email = await generateFollowUp(sub.label_name, sub.track_name);
            aiSubject.textContent = `Subject: ${email.subject}`;
            aiBody.textContent = email.body;
            btnCopyAi.disabled = false;
        } catch (e) {
            aiBody.textContent = "Error generating email.";
        }
    }

    function setDateToday() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('inp-date').value = today;
    }
});
