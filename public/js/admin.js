/**
 * Quake Community Website - Admin Panel JavaScript
 * Manages the admin interface for rankings data
 */

// Admin credentials (should match those in rankings.js)
const ADMIN_EMAIL = "admin@quakecommunity.com";
const ADMIN_LEGACY_USERNAME = "admin"; // For backward compatibility
const ADMIN_PASSWORD = "quakeadmin";

// Main data storage
let quake2Players = [];
let quakeliveUsers = [];
let originalQuake2Players = [];
let originalQuakeliveUsers = [];

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('quakeAdmin') === 'true';
    
    // Setup UI based on login status
    if (isLoggedIn) {
        showAdminPanel();
        // Fetch data from rankings page
        fetchRankingsData();
    } else {
        setupLoginForm();
    }
    
    // Set up tab switching
    setupTabs();
    
    // Add event listeners for admin actions
    setupEventListeners();
});

/**
 * Set up login form functionality
 */
function setupLoginForm() {
    const loginForm = document.getElementById('admin-login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if ((email === ADMIN_EMAIL || email === ADMIN_LEGACY_USERNAME) && password === ADMIN_PASSWORD) {
                // Login successful
                localStorage.setItem('quakeAdmin', 'true');
                localStorage.setItem('quakeAdminEmail', email);
                
                // Show success notification
                showNotification('Inicio de sesión exitoso', 'success');
                
                // Show admin panel
                showAdminPanel();
                
                // Fetch data from rankings page
                fetchRankingsData();
            } else {
                // Login failed
                showNotification('Correo o contraseña incorrectos', 'error');
            }
        });
    }
}

/**
 * Show admin panel and hide login form
 */
function showAdminPanel() {
    const loginSection = document.getElementById('login-section');
    const adminPanel = document.getElementById('admin-panel');
    
    if (loginSection && adminPanel) {
        loginSection.style.display = 'none';
        adminPanel.style.display = 'block';
        
        // Display admin email if available
        const adminEmail = localStorage.getItem('quakeAdminEmail');
        if (adminEmail) {
            // Create admin badge or update UI to show who is logged in
            const logoutBtn = document.getElementById('admin-logout');
            if (logoutBtn) {
                logoutBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Cerrar Sesión (${adminEmail})`;
            }
        }
    }
}

/**
 * Set up tab switching functionality
 */
function setupTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all tab content
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show corresponding tab content
            const tabId = tab.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

/**
 * Set up event listeners for admin actions
 */
function setupEventListeners() {
    // Add row buttons
    const addQuake2RowBtn = document.getElementById('add-quake2-row');
    const addQuakeliveRowBtn = document.getElementById('add-quakelive-row');
    
    if (addQuake2RowBtn) {
        addQuake2RowBtn.addEventListener('click', () => {
            addPlayerRow('quake2');
        });
    }
    
    if (addQuakeliveRowBtn) {
        addQuakeliveRowBtn.addEventListener('click', () => {
            addPlayerRow('quakelive');
        });
    }
    
    // Save buttons
    const saveQuake2Btn = document.getElementById('save-quake2');
    const saveQuakeliveBtn = document.getElementById('save-quakelive');
    
    if (saveQuake2Btn) {
        saveQuake2Btn.addEventListener('click', () => {
            saveRankingsData('quake2');
        });
    }
    
    if (saveQuakeliveBtn) {
        saveQuakeliveBtn.addEventListener('click', () => {
            saveRankingsData('quakelive');
        });
    }
    
    // Reset buttons
    const resetQuake2Btn = document.getElementById('reset-quake2');
    const resetQuakeliveBtn = document.getElementById('reset-quakelive');
    
    if (resetQuake2Btn) {
        resetQuake2Btn.addEventListener('click', () => {
            resetRankingsData('quake2');
        });
    }
    
    if (resetQuakeliveBtn) {
        resetQuakeliveBtn.addEventListener('click', () => {
            resetRankingsData('quakelive');
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('admin-logout');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout();
        });
    }
}

/**
 * Add a new player row to the specified table
 */
function addPlayerRow(game) {
    const tableBody = document.querySelector(`#${game}-rankings-table tbody`);
    
    if (!tableBody) return;
    
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-new', 'true');
    newRow.classList.add('new-row');
    
    // Default empty player data
    const newPlayer = {
        name: '',
        victories: 0,
        defeats: 0,
        mapsPlayed: 0,
        mapsLost: 0,
        rating: game === 'quake2' ? 1.00 : 100.0
    };
    
    // Create row HTML
    newRow.innerHTML = `
        <td>
            <i class="fas fa-grip-vertical move-row" title="Arrastrar para reordenar"></i>
            <i class="fas fa-trash delete-row" title="Eliminar jugador"></i>
        </td>
        <td><input type="text" class="player-name" value="${newPlayer.name}" placeholder="Nombre de jugador" required></td>
        <td><input type="number" class="victories" value="${newPlayer.victories}" min="0" onchange="recalculateStats(this)"></td>
        <td><input type="number" class="defeats" value="${newPlayer.defeats}" min="0" onchange="recalculateStats(this)"></td>
        <td><input type="number" class="maps-played" value="${newPlayer.mapsPlayed}" min="0" onchange="recalculateStats(this)"></td>
        <td><input type="number" class="maps-lost" value="${newPlayer.mapsLost}" min="0" onchange="recalculateStats(this)"></td>
        <td><input type="number" class="rating" value="${newPlayer.rating}" min="0" step="0.01" readonly></td>
    `;
    
    tableBody.appendChild(newRow);
    
    // Add event listener for delete button
    const deleteBtn = newRow.querySelector('.delete-row');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            deletePlayerRow(e.target.closest('tr'));
        });
    }
    
    // Add event listeners for drag-and-drop reordering
    setupDragAndDrop(newRow);
    
    // Focus on the name input
    const nameInput = newRow.querySelector('.player-name');
    if (nameInput) {
        nameInput.focus();
    }
    
    // Show notification
    showNotification('Jugador agregado. Complete los datos y guarde los cambios.', 'info');
}

/**
 * Delete a player row
 */
function deletePlayerRow(row) {
    if (row) {
        // Ask for confirmation
        if (confirm('¿Estás seguro de que deseas eliminar este jugador?')) {
            // Add fade-out animation
            row.classList.add('fade-out');
            
            // Remove after animation completes
            setTimeout(() => {
                row.remove();
            }, 300);
            
            showNotification('Jugador eliminado. Recuerde guardar los cambios.', 'warning');
        }
    }
}

/**
 * Recalculate player statistics when input values change
 */
function recalculateStats(input) {
    if (!input) return;
    
    const row = input.closest('tr');
    if (!row) return;
    
    const game = row.closest('table').id.includes('quake2') ? 'quake2' : 'quakelive';
    
    // Get input values
    const victoriesInput = row.querySelector('.victories');
    const defeatsInput = row.querySelector('.defeats');
    const mapsPlayedInput = row.querySelector('.maps-played');
    const mapsLostInput = row.querySelector('.maps-lost');
    const ratingInput = row.querySelector('.rating');
    
    if (!victoriesInput || !defeatsInput || !mapsPlayedInput || !mapsLostInput || !ratingInput) return;
    
    const victories = parseInt(victoriesInput.value) || 0;
    const defeats = parseInt(defeatsInput.value) || 0;
    const mapsPlayed = parseInt(mapsPlayedInput.value) || 0;
    const mapsLost = parseInt(mapsLostInput.value) || 0;
    
    // Calculate rating based on game type
    let rating = 0;
    
    if (game === 'quake2') {
        // For Quake 2: Frags Per Round (FPR)
        rating = victories > 0 ? parseFloat((mapsPlayed / victories).toFixed(2)) : 0;
    } else {
        // For Quake Live: Damage Per Round (DPR)
        rating = victories > 0 ? parseFloat((mapsPlayed / victories).toFixed(2)) : 0;
    }
    
    // Update rating field
    ratingInput.value = rating;
    
    // Highlight the row to indicate changes
    row.classList.add('modified');
    setTimeout(() => {
        row.classList.remove('modified');
    }, 2000);
    
    // Validate inputs
    validateRow(row);
}

/**
 * Validate a player row's data
 */
function validateRow(row) {
    if (!row) return;
    
    const nameInput = row.querySelector('.player-name');
    const victoriesInput = row.querySelector('.victories');
    const mapsPlayedInput = row.querySelector('.maps-played');
    const defeatsInput = row.querySelector('.defeats');
    const mapsLostInput = row.querySelector('.maps-lost');
    
    if (!nameInput || !victoriesInput || !mapsPlayedInput || !defeatsInput || !mapsLostInput) return;
    
    // Reset validation classes
    nameInput.classList.remove('invalid');
    victoriesInput.classList.remove('invalid');
    mapsPlayedInput.classList.remove('invalid');
    defeatsInput.classList.remove('invalid');
    mapsLostInput.classList.remove('invalid');
    
    // Validate name
    if (nameInput.value.trim() === '') {
        nameInput.classList.add('invalid');
    }
    
    // Validate statistics
    const victories = parseInt(victoriesInput.value) || 0;
    const defeats = parseInt(defeatsInput.value) || 0;
    const mapsPlayed = parseInt(mapsPlayedInput.value) || 0;
    const mapsLost = parseInt(mapsLostInput.value) || 0;
    
    // Maps played should be at least equal to victories
    if (mapsPlayed < victories) {
        mapsPlayedInput.classList.add('invalid');
    }
    
    // Maps lost should be at least equal to defeats
    if (mapsLost < defeats) {
        mapsLostInput.classList.add('invalid');
    }
}

/**
 * Set up drag and drop functionality for reordering rows
 */
function setupDragAndDrop(row) {
    const moveHandle = row.querySelector('.move-row');
    
    if (!moveHandle) return;
    
    moveHandle.addEventListener('mousedown', (e) => {
        const tr = e.target.closest('tr');
        const table = tr.closest('table');
        const tbody = table.querySelector('tbody');
        
        // Create ghost element for drag feedback
        const ghost = tr.cloneNode(true);
        ghost.style.position = 'absolute';
        ghost.style.zIndex = 1000;
        ghost.style.width = `${tr.offsetWidth}px`;
        ghost.style.opacity = '0.5';
        ghost.style.pointerEvents = 'none';
        ghost.style.backgroundColor = 'var(--dark-color-light)';
        document.body.appendChild(ghost);
        
        // Initial position
        const startY = e.clientY;
        const startRowIndex = Array.from(tbody.children).indexOf(tr);
        let currentRowIndex = startRowIndex;
        
        // Position ghost initially
        updateGhostPosition(ghost, e.clientX, e.clientY);
        
        // Add style to indicate row is being dragged
        tr.style.opacity = '0.3';
        
        // Mouse move handler
        function onMouseMove(e) {
            updateGhostPosition(ghost, e.clientX, e.clientY);
            
            // Find row under cursor
            const rows = Array.from(tbody.children);
            
            rows.forEach((row, index) => {
                if (index !== startRowIndex) {
                    const rect = row.getBoundingClientRect();
                    
                    if (e.clientY > rect.top && e.clientY < rect.bottom) {
                        // Cursor is over this row
                        if (currentRowIndex !== index) {
                            currentRowIndex = index;
                            
                            // Move the actual row
                            if (index < startRowIndex) {
                                tbody.insertBefore(tr, row);
                            } else {
                                tbody.insertBefore(tr, row.nextSibling);
                            }
                            
                            // Update positions for all rows
                            updatePositions(tbody);
                        }
                    }
                }
            });
        }
        
        // Mouse up handler
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            
            // Remove ghost
            ghost.remove();
            
            // Restore row style
            tr.style.opacity = '';
            
            // Update final positions
            updatePositions(tbody);
            
            // Show notification if position changed
            if (startRowIndex !== currentRowIndex) {
                showNotification('Orden actualizado. Recuerde guardar los cambios.', 'info');
            }
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        
        // Prevent default behaviors
        e.preventDefault();
    });
}

/**
 * Update ghost element position during drag
 */
function updateGhostPosition(ghost, x, y) {
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;
}

/**
 * Update position numbers for all rows in a table
 */
function updatePositions(tbody) {
    // In the admin interface we don't show position numbers
    // They will be calculated when saved
}

/**
 * Fetch rankings data from rankings.html
 */
function fetchRankingsData() {
    // In a real application, this would be done via an API
    // For this demo, we'll directly scrape the data from the rankings page
    fetch('/rankings')
        .then(response => response.text())
        .then(html => {
            // Parse HTML to extract player data
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract Quake 2 rankings
            const quake2Rows = doc.querySelectorAll('#quake2-rankings tbody tr');
            quake2Players = Array.from(quake2Rows).map(row => ({
                name: row.querySelector('.player-name').textContent.trim(),
                victories: parseInt(row.cells[2].textContent),
                defeats: parseInt(row.cells[3].textContent),
                mapsPlayed: parseInt(row.cells[4].textContent),
                mapsLost: parseInt(row.cells[5].textContent),
                winRate: row.cells[6].textContent.trim(),
                rating: parseFloat(row.cells[7].textContent)
            }));
            
            // Extract Quake Live rankings
            const quakeliveRows = doc.querySelectorAll('#quakelive-rankings tbody tr');
            quakeliveUsers = Array.from(quakeliveRows).map(row => ({
                name: row.querySelector('.player-name').textContent.trim(),
                victories: parseInt(row.cells[2].textContent),
                defeats: parseInt(row.cells[3].textContent),
                mapsPlayed: parseInt(row.cells[4].textContent),
                mapsLost: parseInt(row.cells[5].textContent),
                winRate: row.cells[6].textContent.trim(),
                rating: parseFloat(row.cells[7].textContent)
            }));
            
            // Make copies for reset functionality
            originalQuake2Players = JSON.parse(JSON.stringify(quake2Players));
            originalQuakeliveUsers = JSON.parse(JSON.stringify(quakeliveUsers));
            
            // Populate tables
            populateRankingsTable('quake2', quake2Players);
            populateRankingsTable('quakelive', quakeliveUsers);
            
            showNotification('Datos de rankings cargados correctamente', 'success');
        })
        .catch(error => {
            console.error('Error fetching rankings data:', error);
            showNotification('Error al cargar los datos de rankings', 'error');
        });
}

/**
 * Populate a rankings table with player data
 */
function populateRankingsTable(game, players) {
    const tableBody = document.querySelector(`#${game}-rankings-table tbody`);
    
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add rows for each player
    players.forEach(player => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <i class="fas fa-grip-vertical move-row" title="Arrastrar para reordenar"></i>
                <i class="fas fa-trash delete-row" title="Eliminar jugador"></i>
            </td>
            <td><input type="text" class="player-name" value="${player.name}" required></td>
            <td><input type="number" class="victories" value="${player.victories}" min="0" onchange="recalculateStats(this)"></td>
            <td><input type="number" class="defeats" value="${player.defeats}" min="0" onchange="recalculateStats(this)"></td>
            <td><input type="number" class="maps-played" value="${player.mapsPlayed}" min="0" onchange="recalculateStats(this)"></td>
            <td><input type="number" class="maps-lost" value="${player.mapsLost}" min="0" onchange="recalculateStats(this)"></td>
            <td><input type="number" class="rating" value="${player.rating}" min="0" step="0.01" readonly></td>
        `;
        
        tableBody.appendChild(row);
        
        // Add event listener for delete button
        const deleteBtn = row.querySelector('.delete-row');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                deletePlayerRow(e.target.closest('tr'));
            });
        }
        
        // Add event listeners for drag-and-drop reordering
        setupDragAndDrop(row);
    });
}

/**
 * Save rankings data to localStorage and update rankings.html
 */
function saveRankingsData(game) {
    // Collect data from the table
    const tableBody = document.querySelector(`#${game}-rankings-table tbody`);
    
    if (!tableBody) return;
    
    // Validate all rows first
    const rows = tableBody.querySelectorAll('tr');
    let hasErrors = false;
    
    rows.forEach(row => {
        validateRow(row);
        if (row.querySelector('.invalid')) {
            hasErrors = true;
        }
    });
    
    if (hasErrors) {
        showNotification('Por favor corrija los errores antes de guardar', 'error');
        return;
    }
    
    // Collect data if validation passed
    const updatedPlayers = [];
    
    rows.forEach((row, index) => {
        const nameInput = row.querySelector('.player-name');
        const victoriesInput = row.querySelector('.victories');
        const defeatsInput = row.querySelector('.defeats');
        const mapsPlayedInput = row.querySelector('.maps-played');
        const mapsLostInput = row.querySelector('.maps-lost');
        const ratingInput = row.querySelector('.rating');
        
        if (nameInput && victoriesInput && defeatsInput && mapsPlayedInput && mapsLostInput && ratingInput) {
            const name = nameInput.value.trim();
            const victories = parseInt(victoriesInput.value) || 0;
            const defeats = parseInt(defeatsInput.value) || 0;
            const mapsPlayed = parseInt(mapsPlayedInput.value) || 0;
            const mapsLost = parseInt(mapsLostInput.value) || 0;
            const rating = parseFloat(ratingInput.value) || 0;
            
            // Calculate win rate
            const totalMatches = victories + defeats;
            const winRate = totalMatches > 0 ? Math.round((victories / totalMatches) * 100) : 0;
            
            updatedPlayers.push({
                name,
                victories,
                defeats,
                mapsPlayed,
                mapsLost,
                winRate: `${winRate}%`,
                rating
            });
        }
    });
    
    // Update our in-memory data
    if (game === 'quake2') {
        quake2Players = updatedPlayers;
        originalQuake2Players = JSON.parse(JSON.stringify(updatedPlayers));
    } else {
        quakeliveUsers = updatedPlayers;
        originalQuakeliveUsers = JSON.parse(JSON.stringify(updatedPlayers));
    }
    
    // Save to localStorage for rankings.html to use
    localStorage.setItem(`${game}RankingsData`, JSON.stringify(updatedPlayers));
    
    // Show notification
    showNotification('Datos guardados correctamente. Los cambios se verán reflejados en la página de rankings.', 'success');
}

// Add CSS styles for validation and animations
function addAdminStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .invalid {
            border: 2px solid #ff4444 !important;
            background-color: rgba(255, 68, 68, 0.1) !important;
        }
        
        .modified {
            animation: highlight 2s;
        }
        
        .new-row {
            animation: fadeIn 0.5s;
        }
        
        .fade-out {
            animation: fadeOut 0.3s;
            opacity: 0;
        }
        
        @keyframes highlight {
            0% { background-color: transparent; }
            25% { background-color: rgba(255, 255, 0, 0.2); }
            100% { background-color: transparent; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(10px); }
        }
    `;
    document.head.appendChild(styleEl);
}

/**
 * Reset rankings data to original state
 */
function resetRankingsData(game) {
    // Ask for confirmation
    if (!confirm('¿Estás seguro de que deseas descartar todos los cambios?')) {
        return;
    }
    
    // Reset data to original state
    if (game === 'quake2') {
        quake2Players = JSON.parse(JSON.stringify(originalQuake2Players));
        populateRankingsTable('quake2', quake2Players);
    } else {
        quakeliveUsers = JSON.parse(JSON.stringify(originalQuakeliveUsers));
        populateRankingsTable('quakelive', quakeliveUsers);
    }
    
    // Show notification
    showNotification('Datos restablecidos al estado original', 'info');
}

/**
 * Log out of the admin panel
 */
function logout() {
    // Ask for confirmation
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Remove admin flags from localStorage
        localStorage.removeItem('quakeAdmin');
        localStorage.removeItem('quakeAdminEmail');
        
        // Show notification
        showNotification('Sesión cerrada correctamente', 'info');
        
        // Reload the page to reset the UI
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Add global functions for use in HTML events
window.recalculateStats = recalculateStats;
window.validateRow = validateRow;

// Add styles when DOM is loaded
document.addEventListener('DOMContentLoaded', addAdminStyles);

/**
 * Show notification message
 * Reuses the function from main.js if available or creates a new implementation
 */
function showNotification(message, type = 'info') {
    // Try to use the existing showNotification function from main.js
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback implementation if main.js function is not available
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('span');
    closeButton.classList.add('notification-close');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    notification.appendChild(closeButton);
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}