
// Get voted ideas from localStorage (to prevent multiple votes from same browser)
function getVotedIdeas() {
    const voted = localStorage.getItem('bibleTrackerVotedIdeas');
    return voted ? JSON.parse(voted) : [];
}

// Save voted idea to localStorage
function saveVotedIdea(ideaId) {
    const voted = getVotedIdeas();
    if (!voted.includes(ideaId)) {
        voted.push(ideaId);
        localStorage.setItem('bibleTrackerVotedIdeas', JSON.stringify(voted));
    }
}

// Check if user has voted for an idea
function hasVoted(ideaId) {
    return getVotedIdeas().includes(ideaId);
}

// Format timestamp to relative time
function formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
}

// Get category label
function getCategoryLabel(category) {
    const labels = {
        reading: 'Reading Tracker',
        memorization: 'Memorization',
        themes: 'Themes & Design',
        reminders: 'Reminders',
        sync: 'iCloud Sync',
        other: 'Other'
    };
    return labels[category] || 'Other';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get status badge HTML
function getStatusBadge(status) {
    if (!status || status === 'pending') return '';
    const labels = {
        'in-progress': 'In Progress',
        'done': 'Done'
    };
    const label = labels[status] || status;
    return `<span class="idea-status idea-status-${status}">${label}</span>`;
}

// Render a single idea card
function renderIdeaCard(idea) {
    const voted = hasVoted(idea.id);
    const votedClass = voted ? 'voted' : '';

    return `
        <div class="idea-card" data-category="${idea.category}" data-id="${idea.id}">
            <div class="idea-vote ${votedClass}">
                <button class="vote-btn ${votedClass}" onclick="handleVote('${idea.id}')" ${voted ? 'disabled' : ''} aria-label="Upvote this idea">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 19V5M5 12l7-7 7 7"/>
                    </svg>
                </button>
                <span class="vote-count">${idea.votes || 0}</span>
            </div>
            <div class="idea-content">
                <div class="idea-meta">
                    <span class="idea-category">${getCategoryLabel(idea.category)}</span>
                    ${getStatusBadge(idea.status)}
                    <span class="idea-time">${formatTime(idea.timestamp)}</span>
                </div>
                <h3 class="idea-title">${escapeHtml(idea.title)}</h3>
                <p class="idea-description">${escapeHtml(idea.description)}</p>
                <div class="idea-author">Submitted by ${escapeHtml(idea.name || 'Anonymous')}</div>
            </div>
        </div>
    `;
}

// Current state
let allIdeas = [];
let currentFilter = 'all';
let currentSort = 'votes';

// Fetch ideas from Firebase
function fetchIdeas() {
    if (isFirebaseReady()) {
        getDatabase().ref('ideas').orderByChild('votes').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                allIdeas = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
            } else {
                allIdeas = [];
            }
            renderIdeas();
        }, (error) => {
            console.error('Error fetching ideas:', error);
            allIdeas = [];
            renderIdeas();
        });
    } else {
        // Wait for Firebase to initialize
        setTimeout(fetchIdeas, 100);
    }
}

// Sort ideas
function sortIdeas(ideas) {
    const sorted = [...ideas];
    switch (currentSort) {
        case 'votes':
            sorted.sort((a, b) => (b.votes || 0) - (a.votes || 0));
            break;
        case 'newest':
            sorted.sort((a, b) => b.timestamp - a.timestamp);
            break;
        case 'oldest':
            sorted.sort((a, b) => a.timestamp - b.timestamp);
            break;
    }
    return sorted;
}

// Filter ideas (only show approved ideas to public)
function filterIdeas(ideas) {
    let filtered = ideas.filter(idea => idea.approved === true);
    if (currentFilter === 'all') return filtered;
    return filtered.filter(idea => idea.category === currentFilter);
}

// Render ideas list
function renderIdeas() {
    const container = document.getElementById('ideasList');
    const noIdeas = document.getElementById('noIdeas');

    if (!container) return;

    let filtered = filterIdeas(allIdeas);
    let sorted = sortIdeas(filtered);

    if (sorted.length === 0) {
        container.innerHTML = '';
        if (noIdeas) noIdeas.style.display = 'block';
    } else {
        if (noIdeas) noIdeas.style.display = 'none';
        container.innerHTML = sorted.map(renderIdeaCard).join('');
    }
}

// Handle vote
async function handleVote(ideaId) {
    if (hasVoted(ideaId)) return;

    // Optimistically update UI
    const card = document.querySelector(`[data-id="${ideaId}"]`);
    if (!card) return;

    const voteBtn = card.querySelector('.vote-btn');
    const voteCount = card.querySelector('.vote-count');
    const voteContainer = card.querySelector('.idea-vote');

    voteBtn.disabled = true;
    voteBtn.classList.add('voted');
    voteContainer.classList.add('voted');

    const currentVotes = parseInt(voteCount.textContent) || 0;
    voteCount.textContent = currentVotes + 1;

    // Save to localStorage to prevent duplicate votes
    saveVotedIdea(ideaId);

    // Update in Firebase
    if (isFirebaseReady()) {
        try {
            const ideaRef = getDatabase().ref(`ideas/${ideaId}/votes`);
            await ideaRef.transaction(votes => (votes || 0) + 1);
        } catch (error) {
            console.error('Error updating vote:', error);
        }
    }

    // Update local state
    const idea = allIdeas.find(i => i.id === ideaId);
    if (idea) idea.votes = (idea.votes || 0) + 1;
}

// Initialize filters
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderIdeas();
        });
    });
}

// Initialize sort
function initSort() {
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            renderIdeas();
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase first
    initFirebase();

    initFilters();
    initSort();
    fetchIdeas();
});
