/**
 * Quake Community Website - Rankings JavaScript
 * Handles ranking tables and loads data
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if there's data from the admin panel to load
    loadRankingsData();
    
    // Setup event listeners for tab switching
    setupTabSwitching();
});

/**
 * Load rankings data from localStorage if available
 */
function loadRankingsData() {
    // Check for Quake 2 rankings data
    const quake2Data = localStorage.getItem('quake2RankingsData');
    if (quake2Data) {
        try {
            const players = JSON.parse(quake2Data);
            updateRankingsTable('quake2', players);
        } catch (error) {
            console.error('Error parsing Quake 2 rankings data:', error);
        }
    }
    
    // Check for Quake Live rankings data
    const quakeliveData = localStorage.getItem('quakeliveRankingsData');
    if (quakeliveData) {
        try {
            const players = JSON.parse(quakeliveData);
            updateRankingsTable('quakelive', players);
        } catch (error) {
            console.error('Error parsing Quake Live rankings data:', error);
        }
    }
}

/**
 * Update rankings table with player data
 */
function updateRankingsTable(game, players) {
    const tableId = `${game}-rankings`;
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Add rows for each player
    players.forEach((player, index) => {
        const position = index + 1;
        const row = document.createElement('tr');
        
        // Determine rating class based on values
        let ratingClass = '';
        if (game === 'quake2') {
            if (player.rating >= 1.5) ratingClass = 'rating-high';
            else if (player.rating >= 1.2) ratingClass = 'rating-medium';
            else ratingClass = 'rating-low';
        } else {
            if (player.rating >= 130) ratingClass = 'rating-high';
            else if (player.rating >= 115) ratingClass = 'rating-medium';
            else ratingClass = 'rating-low';
        }
        
        row.innerHTML = `
            <td>${position}</td>
            <td class="player-name">${player.name}</td>
            <td>${player.victories}</td>
            <td>${player.defeats}</td>
            <td>${player.mapsPlayed}</td>
            <td>${player.mapsLost}</td>
            <td class="win-rate">${player.winRate}</td>
            <td class="${ratingClass}">${player.rating}</td>
        `;
        
        tbody.appendChild(row);
    });
}

/**
 * Setup tab switching between Quake 2 and Quake Live rankings
 */
function setupTabSwitching() {
    const quake2Tab = document.getElementById('quake2-tab');
    const quakeliveTab = document.getElementById('quakelive-tab');
    const quake2Rankings = document.getElementById('quake2-rankings');
    const quakeliveRankings = document.getElementById('quakelive-rankings');
    
    if (quake2Tab && quakeliveTab && quake2Rankings && quakeliveRankings) {
        quake2Tab.addEventListener('click', () => {
            quake2Tab.classList.add('active');
            quakeliveTab.classList.remove('active');
            quake2Rankings.style.display = 'block';
            quakeliveRankings.style.display = 'none';
        });
        
        quakeliveTab.addEventListener('click', () => {
            quakeliveTab.classList.add('active');
            quake2Tab.classList.remove('active');
            quakeliveRankings.style.display = 'block';
            quake2Rankings.style.display = 'none';
        });
    }
}
