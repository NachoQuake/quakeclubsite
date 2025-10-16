/**
 * Quake Community Website - Tournaments JavaScript
 * Handles tournament-related functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // Load upcoming tournaments on home page
  const upcomingTournamentsContainer = document.getElementById('upcoming-tournaments');
  if (upcomingTournamentsContainer) {
    loadUpcomingTournaments(upcomingTournamentsContainer);
  }
  
  // Load all tournaments on tournaments page
  const allTournamentsContainer = document.getElementById('all-tournaments');
  if (allTournamentsContainer) {
    loadAllTournaments(allTournamentsContainer);
  }
  
  // Load tournament details on tournament details page
  const tournamentDetailsContainer = document.getElementById('tournament-details-container');
  if (tournamentDetailsContainer) {
    loadTournamentDetails(tournamentDetailsContainer);
  }
  
  // Initialize tournament registration form
  const registrationForm = document.getElementById('registration-form');
  if (registrationForm) {
    initializeRegistrationForm(registrationForm);
  }
  
  // Initialize tournament creation form
  const tournamentCreateForm = document.getElementById('tournament-create-form');
  if (tournamentCreateForm) {
    initializeTournamentCreateForm(tournamentCreateForm);
  }
  
  // Initialize bracket generation
  const generateBracketsBtn = document.getElementById('generate-brackets-btn');
  if (generateBracketsBtn) {
    initializeBracketGeneration(generateBracketsBtn);
  }
});

/**
 * Load upcoming tournaments for the home page
 */
function loadUpcomingTournaments(container) {
  container.innerHTML = '<div class="loading">Cargando torneos...</div>';
  
  // Crear manualmente los tres torneos específicos
  const upcomingTournaments = [
    {
      id: "1",
      name: "Liga Clan Arena DPR Octubre 2025",
      game: "Quake Live",
      date: "2025-10-06T18:00:00Z",
      description: "Competición por equipos en modo Clan Arena. 6 equipos participantes.",
      maxParticipants: 6,
      participants: Array(6).fill().map((_, i) => ({ id: `p${i+1}`, name: `Equipo ${i+1}`, email: `equipo${i+1}@example.com`, nickname: `Equipo ${i+1}` })),
      status: "upcoming",
      format: "double_elimination"
    },
    {
      id: "2",
      name: "Torneo TDM 2v2 Noviembre 2025",
      game: "Quake Live",
      date: "2025-11-01T00:00:00Z", // Solo para que formatee "Noviembre de 2025"
      description: "Torneo por equipos en modo Team Deathmatch 2v2. Participantes por determinar.",
      maxParticipants: 8,
      participants: [],
      status: "upcoming",
      format: "single_elimination",
      customParticipantsText: "TBD" // Campo personalizado para mostrar TBD
    },
    {
      id: "3",
      name: "Torneo CTF Clausura Noviembre 2025",
      game: "Quake Live",
      date: "2025-11-01T00:00:00Z", // Solo para que formatee "Noviembre de 2025"
      description: "Torneo de cierre del año en modo Capture The Flag. Participantes por determinar.",
      maxParticipants: 8,
      participants: [],
      status: "upcoming",
      format: "double_elimination",
      customParticipantsText: "TBD" // Campo personalizado para mostrar TBD
    }
  ];
  
  // Mostrar los torneos
  container.innerHTML = '';
  upcomingTournaments.forEach(tournament => {
    container.appendChild(createTournamentCard(tournament));
  });
}

/**
 * Override de formatDate para casos especiales
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
  // Si es para los torneos de noviembre sin día específico
  if (dateString.startsWith('2025-11-01T00:00:00')) {
    return "Noviembre de 2025";
  }
  
  return date.toLocaleDateString('es-ES', options);
}

/**
 * Load all tournaments for the tournaments page
 */
function loadAllTournaments(container) {
  container.innerHTML = '<div class="loading">Cargando torneos...</div>';
  
  fetch('/api/tournaments')
    .then(response => response.json())
    .then(tournaments => {
      if (tournaments.length === 0) {
        container.innerHTML = '<p class="no-tournaments">No hay torneos disponibles actualmente.</p>';
        return;
      }
      
      // Group tournaments by status
      const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming');
      const inProgressTournaments = tournaments.filter(t => t.status === 'in_progress');
      const completedTournaments = tournaments.filter(t => t.status === 'completed');
      
      container.innerHTML = '';
      
      // Upcoming tournaments section
      if (upcomingTournaments.length > 0) {
        const upcomingSection = document.createElement('div');
        upcomingSection.classList.add('tournaments-section');
        
        const upcomingTitle = document.createElement('h3');
        upcomingTitle.textContent = 'Próximos Torneos';
        upcomingSection.appendChild(upcomingTitle);
        
        const upcomingGrid = document.createElement('div');
        upcomingGrid.classList.add('tournaments-grid');
        
        upcomingTournaments.forEach(tournament => {
          upcomingGrid.appendChild(createTournamentCard(tournament));
        });
        
        upcomingSection.appendChild(upcomingGrid);
        container.appendChild(upcomingSection);
      }
      
      // In progress tournaments section
      if (inProgressTournaments.length > 0) {
        const inProgressSection = document.createElement('div');
        inProgressSection.classList.add('tournaments-section');
        
        const inProgressTitle = document.createElement('h3');
        inProgressTitle.textContent = 'Torneos en Curso';
        inProgressSection.appendChild(inProgressTitle);
        
        const inProgressGrid = document.createElement('div');
        inProgressGrid.classList.add('tournaments-grid');
        
        inProgressTournaments.forEach(tournament => {
          inProgressGrid.appendChild(createTournamentCard(tournament));
        });
        
        inProgressSection.appendChild(inProgressGrid);
        container.appendChild(inProgressSection);
      }
      
      // Completed tournaments section
      if (completedTournaments.length > 0) {
        const completedSection = document.createElement('div');
        completedSection.classList.add('tournaments-section');
        
        const completedTitle = document.createElement('h3');
        completedTitle.textContent = 'Torneos Completados';
        completedSection.appendChild(completedTitle);
        
        const completedGrid = document.createElement('div');
        completedGrid.classList.add('tournaments-grid');
        
        completedTournaments.forEach(tournament => {
          completedGrid.appendChild(createTournamentCard(tournament));
        });
        
        completedSection.appendChild(completedGrid);
        container.appendChild(completedSection);
      }
    })
    .catch(error => {
      console.error('Error fetching tournaments:', error);
      container.innerHTML = '<p class="error">Error al cargar los torneos. Por favor, intenta de nuevo más tarde.</p>';
    });
}

/**
 * Create a tournament card element
 */
function createTournamentCard(tournament) {
  const card = document.createElement('div');
  card.classList.add('tournament-card');
  
  const header = document.createElement('div');
  header.classList.add('tournament-header');
  
  const gameTag = document.createElement('span');
  gameTag.classList.add('tournament-game');
  gameTag.textContent = tournament.game;
  
  const title = document.createElement('h3');
  title.textContent = tournament.name;
  
  header.appendChild(gameTag);
  header.appendChild(title);
  
  const content = document.createElement('div');
  content.classList.add('tournament-content');
  
  const date = document.createElement('div');
  date.classList.add('tournament-date');
  date.innerHTML = `<i class="far fa-calendar-alt"></i> ${formatDate(tournament.date)}`;
  
  const participants = document.createElement('div');
  participants.classList.add('tournament-participants');
  
  // Si el torneo tiene texto personalizado para participantes, usarlo
  if (tournament.customParticipantsText) {
    participants.innerHTML = `<i class="fas fa-users"></i> ${tournament.customParticipantsText}`;
  } else {
    participants.innerHTML = `<i class="fas fa-users"></i> ${tournament.participants.length}/${tournament.maxParticipants} participantes`;
  }
  
  const description = document.createElement('p');
  description.textContent = tournament.description;
  
  const statusBadge = document.createElement('div');
  statusBadge.classList.add('tournament-status', tournament.status);
  
  switch (tournament.status) {
    case 'upcoming':
      statusBadge.textContent = 'Próximamente';
      break;
    case 'in_progress':
      statusBadge.textContent = 'En Curso';
      break;
    case 'completed':
      statusBadge.textContent = 'Completado';
      break;
  }
  
  const link = document.createElement('a');
  link.href = `/tournament/${tournament.id}`;
  link.classList.add('btn-secondary');
  link.textContent = 'Ver Detalles';
  
  content.appendChild(date);
  content.appendChild(participants);
  content.appendChild(description);
  content.appendChild(statusBadge);
  content.appendChild(link);
  
  card.appendChild(header);
  card.appendChild(content);
  
  return card;
}

/**
 * Load tournament details for the tournament details page
 */
function loadTournamentDetails(container) {
  container.innerHTML = '<div class="loading">Cargando detalles del torneo...</div>';
  
  // Get tournament ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const tournamentId = urlParams.get('id');
  
  if (!tournamentId) {
    container.innerHTML = '<p class="error">ID de torneo no especificado.</p>';
    return;
  }
  
  fetch(`/api/tournaments/${tournamentId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Tournament not found');
      }
      return response.json();
    })
    .then(tournament => {
      renderTournamentDetails(container, tournament);
    })
    .catch(error => {
      console.error('Error fetching tournament details:', error);
      container.innerHTML = '<p class="error">Error al cargar los detalles del torneo. El torneo puede no existir o ha ocurrido un error.</p>';
    });
}

/**
 * Render tournament details
 */
function renderTournamentDetails(container, tournament) {
  container.innerHTML = '';
  
  // Tournament header
  const header = document.createElement('div');
  header.classList.add('tournament-header-large');
  
  const gameTag = document.createElement('span');
  gameTag.classList.add('tournament-game');
  gameTag.textContent = tournament.game;
  
  const title = document.createElement('h2');
  title.textContent = tournament.name;
  
  const meta = document.createElement('div');
  meta.classList.add('tournament-meta');
  
  const dateItem = document.createElement('div');
  dateItem.classList.add('tournament-meta-item');
  dateItem.innerHTML = `<i class="far fa-calendar-alt"></i> ${formatDate(tournament.date)}`;
  
  const participantsItem = document.createElement('div');
  participantsItem.classList.add('tournament-meta-item');
  participantsItem.innerHTML = `<i class="fas fa-users"></i> ${tournament.participants.length}/${tournament.maxParticipants} participantes`;
  
  // Add format info
  const formatItem = document.createElement('div');
  formatItem.classList.add('tournament-meta-item');
  
  let formatText = '';
  switch (tournament.format) {
    case 'single_elimination':
      formatText = 'Eliminación Simple';
      break;
    case 'double_elimination':
      formatText = 'Eliminación Doble';
      break;
    case 'round_robin':
      formatText = 'Round Robin';
      break;
    default:
      formatText = 'Formato Desconocido';
  }
  
  formatItem.innerHTML = `<i class="fas fa-sitemap"></i> ${formatText}`;
  
  const statusItem = document.createElement('div');
  statusItem.classList.add('tournament-meta-item');
  
  let statusText = '';
  let statusIcon = '';
  
  switch (tournament.status) {
    case 'upcoming':
      statusText = 'Próximamente';
      statusIcon = 'far fa-clock';
      break;
    case 'in_progress':
      statusText = 'En Curso';
      statusIcon = 'fas fa-play';
      break;
    case 'completed':
      statusText = 'Completado';
      statusIcon = 'fas fa-check-circle';
      break;
  }
  
  statusItem.innerHTML = `<i class="${statusIcon}"></i> ${statusText}`;
  
  meta.appendChild(dateItem);
  meta.appendChild(participantsItem);
  meta.appendChild(formatItem);
  meta.appendChild(statusItem);
  
  const actions = document.createElement('div');
  actions.classList.add('tournament-actions');
  
  // Only show register button if tournament is upcoming and not full
  if (tournament.status === 'upcoming' && tournament.participants.length < tournament.maxParticipants) {
    const registerBtn = document.createElement('a');
    registerBtn.href = '#registration-section';
    registerBtn.classList.add('btn-primary');
    registerBtn.textContent = 'Registrarse';
    actions.appendChild(registerBtn);
  }
  
  // Only show generate brackets button for admins if tournament has participants but no brackets
  if (tournament.participants.length >= 2 && tournament.brackets.length === 0) {
    const generateBracketsBtn = document.createElement('button');
    generateBracketsBtn.id = 'generate-brackets-btn';
    generateBracketsBtn.classList.add('btn-secondary');
    generateBracketsBtn.textContent = 'Generar Brackets';
    generateBracketsBtn.dataset.tournamentId = tournament.id;
    actions.appendChild(generateBracketsBtn);
  }
  
  header.appendChild(gameTag);
  header.appendChild(title);
  header.appendChild(meta);
  header.appendChild(actions);
  
  container.appendChild(header);
  
  // Tournament description
  const description = document.createElement('div');
  description.classList.add('tournament-description');
  
  const descriptionTitle = document.createElement('h3');
  descriptionTitle.textContent = 'Descripción';
  
  const descriptionText = document.createElement('p');
  descriptionText.textContent = tournament.description;
  
  description.appendChild(descriptionTitle);
  description.appendChild(descriptionText);
  
  container.appendChild(description);
  
  // Participants section
  const participantsSection = document.createElement('div');
  participantsSection.classList.add('tournament-section');
  
  const participantsTitle = document.createElement('h3');
  participantsTitle.textContent = 'Participantes';
  
  const participantsList = document.createElement('div');
  participantsList.classList.add('participants-list');
  
  if (tournament.participants.length === 0) {
    const noParticipants = document.createElement('p');
    noParticipants.textContent = 'No hay participantes registrados aún.';
    participantsList.appendChild(noParticipants);
  } else {
    tournament.participants.forEach(participant => {
      const participantCard = document.createElement('div');
      participantCard.classList.add('participant-card');
      participantCard.textContent = participant.name;
      participantsList.appendChild(participantCard);
    });
  }
  
  participantsSection.appendChild(participantsTitle);
  participantsSection.appendChild(participantsList);
  
  container.appendChild(participantsSection);
  
  // Brackets section (if tournament has brackets)
  if (tournament.brackets && tournament.brackets.length > 0) {
    const bracketsSection = document.createElement('div');
    bracketsSection.classList.add('tournament-section');
    
    const bracketsTitle = document.createElement('h3');
    bracketsTitle.textContent = 'Brackets del Torneo';
    
    const bracketsContainer = document.createElement('div');
    bracketsContainer.classList.add('brackets-container');
    bracketsContainer.id = 'brackets-container';
    
    bracketsSection.appendChild(bracketsTitle);
    bracketsSection.appendChild(bracketsContainer);
    
    container.appendChild(bracketsSection);
    
    // Render brackets based on tournament format
    switch (tournament.format) {
      case 'single_elimination':
        renderSingleEliminationBrackets(bracketsContainer, tournament);
        break;
      case 'double_elimination':
        renderDoubleEliminationBrackets(bracketsContainer, tournament);
        break;
      case 'round_robin':
        renderRoundRobinMatches(bracketsContainer, tournament);
        break;
      default:
        renderBrackets(bracketsContainer, tournament.brackets);
    }
    
    // If tournament is in progress or completed, add match results section
    if (tournament.status === 'in_progress' || tournament.status === 'completed') {
      const matchesSection = document.createElement('div');
      matchesSection.classList.add('tournament-section');
      
      const matchesTitle = document.createElement('h3');
      matchesTitle.textContent = 'Resultados de Partidas';
      
      const matchesContainer = document.createElement('div');
      matchesContainer.classList.add('matches-container');
      
      // Group matches by status
      const scheduledMatches = tournament.matches.filter(m => m.status === 'scheduled');
      const completedMatches = tournament.matches.filter(m => m.status === 'completed');
      
      if (scheduledMatches.length > 0) {
        const scheduledSection = document.createElement('div');
        scheduledSection.classList.add('matches-section');
        
        const scheduledTitle = document.createElement('h4');
        scheduledTitle.textContent = 'Partidas Programadas';
        scheduledSection.appendChild(scheduledTitle);
        
        scheduledMatches.forEach(match => {
          const matchCard = createMatchCard(match, tournament);
          scheduledSection.appendChild(matchCard);
        });
        
        matchesContainer.appendChild(scheduledSection);
      }
      
      if (completedMatches.length > 0) {
        const completedSection = document.createElement('div');
        completedSection.classList.add('matches-section');
        
        const completedTitle = document.createElement('h4');
        completedTitle.textContent = 'Partidas Completadas';
        completedSection.appendChild(completedTitle);
        
        completedMatches.forEach(match => {
          const matchCard = createMatchCard(match, tournament);
          completedSection.appendChild(matchCard);
        });
        
        matchesContainer.appendChild(completedSection);
      }
      
      matchesSection.appendChild(matchesTitle);
      matchesSection.appendChild(matchesContainer);
      
      container.appendChild(matchesSection);
    }
    
    // If round robin format, show standings
    if (tournament.format === 'round_robin') {
      const standingsSection = document.createElement('div');
      standingsSection.classList.add('tournament-section');
      
      const standingsTitle = document.createElement('h3');
      standingsTitle.textContent = 'Clasificación';
      
      const standingsContainer = document.createElement('div');
      standingsContainer.classList.add('standings-container');
      standingsContainer.id = 'standings-container';
      
      standingsSection.appendChild(standingsTitle);
      standingsSection.appendChild(standingsContainer);
      
      container.appendChild(standingsSection);
      
      // Load standings
      loadTournamentStandings(standingsContainer, tournament.id);
    }
  }
  
  // Registration section (if tournament is upcoming and not full)
  if (tournament.status === 'upcoming' && tournament.participants.length < tournament.maxParticipants) {
    const registrationSection = document.createElement('div');
    registrationSection.classList.add('tournament-section');
    registrationSection.id = 'registration-section';
    
    const registrationTitle = document.createElement('h3');
    registrationTitle.textContent = 'Registro para el Torneo';
    
    const registrationForm = document.createElement('form');
    registrationForm.id = 'registration-form';
    registrationForm.classList.add('registration-form');
    
    registrationForm.innerHTML = `
      <div class="form-group">
        <label for="name">Nombre Completo</label>
        <input type="text" id="name" name="name" required>
      </div>
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="nickname">Nickname en el Juego</label>
        <input type="text" id="nickname" name="nickname" required>
      </div>
      <div class="form-submit">
        <button type="submit" class="btn-primary">Registrarse</button>
      </div>
    `;
    
    registrationSection.appendChild(registrationTitle);
    registrationSection.appendChild(registrationForm);
    
    container.appendChild(registrationSection);
  }
}

/**
 * Create a match card element
 */
function createMatchCard(match, tournament) {
  const matchCard = document.createElement('div');
  matchCard.classList.add('match-card');
  
  // Find players
  const player1 = tournament.participants.find(p => p.id === match.player1Id);
  const player2 = tournament.participants.find(p => p.id === match.player2Id);
  
  const matchHeader = document.createElement('div');
  matchHeader.classList.add('match-header');
  
  let matchTitle = 'Partida';
  if (tournament.format === 'double_elimination') {
    if (match.bracket === 'upper') {
      matchTitle = `Bracket Superior - Ronda ${match.round}`;
    } else if (match.bracket === 'lower') {
      matchTitle = `Bracket Inferior - Ronda ${match.round}`;
    } else if (match.bracket === 'grand') {
      matchTitle = match.round === 1 ? 'Gran Final' : 'Gran Final - Partida 2';
    }
  } else {
    matchTitle = `Ronda ${match.round}`;
  }
  
  matchHeader.textContent = matchTitle;
  
  const matchContent = document.createElement('div');
  matchContent.classList.add('match-content');
  
  const player1Element = document.createElement('div');
  player1Element.classList.add('match-player');
  player1Element.textContent = player1 ? player1.name : 'TBD';
  
  const player2Element = document.createElement('div');
  player2Element.classList.add('match-player');
  player2Element.textContent = player2 ? player2.name : 'TBD';
  
  const scoreElement = document.createElement('div');
  scoreElement.classList.add('match-score');
  
  if (match.status === 'completed') {
    // Show match result
    scoreElement.textContent = `${match.player1Score} - ${match.player2Score}`;
    
    // Highlight winner
    if (match.winnerId === match.player1Id) {
      player1Element.classList.add('winner');
    } else {
      player2Element.classList.add('winner');
    }
  } else if (match.status === 'scheduled' && player1 && player2) {
    // Show buttons to record result if match is scheduled
    scoreElement.classList.add('match-actions');
    
    const recordButton = document.createElement('button');
    recordButton.classList.add('btn-secondary', 'btn-small');
    recordButton.textContent = 'Registrar Resultado';
    recordButton.dataset.matchId = match.id;
    recordButton.dataset.tournamentId = tournament.id;
    
    recordButton.addEventListener('click', () => {
      showScoreForm(tournament.id, match.id, player1.name, player2.name);
    });
    
    scoreElement.appendChild(recordButton);
  } else {
    scoreElement.textContent = 'Pendiente';
  }
  
  matchContent.appendChild(player1Element);
  matchContent.appendChild(scoreElement);
  matchContent.appendChild(player2Element);
  
  matchCard.appendChild(matchHeader);
  matchCard.appendChild(matchContent);
  
  return matchCard;
}

/**
 * Show form to record match score
 */
function showScoreForm(tournamentId, matchId, player1Name, player2Name) {
  // Create modal for score input
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.style.display = 'flex';
  
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  
  const closeButton = document.createElement('span');
  closeButton.classList.add('modal-close');
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  const title = document.createElement('h3');
  title.textContent = 'Registrar Resultado de Partida';
  
  const form = document.createElement('form');
  form.classList.add('score-form');
  
  const matchInfo = document.createElement('div');
  matchInfo.classList.add('match-info');
  matchInfo.textContent = `${player1Name} vs ${player2Name}`;
  
  const scoreContainer = document.createElement('div');
  scoreContainer.classList.add('score-container');
  
  const player1ScoreGroup = document.createElement('div');
  player1ScoreGroup.classList.add('form-group');
  
  const player1ScoreLabel = document.createElement('label');
  player1ScoreLabel.textContent = `${player1Name}:`;
  player1ScoreLabel.htmlFor = 'player1Score';
  
  const player1ScoreInput = document.createElement('input');
  player1ScoreInput.type = 'number';
  player1ScoreInput.id = 'player1Score';
  player1ScoreInput.name = 'player1Score';
  player1ScoreInput.min = '0';
  player1ScoreInput.required = true;
  
  player1ScoreGroup.appendChild(player1ScoreLabel);
  player1ScoreGroup.appendChild(player1ScoreInput);
  
  const player2ScoreGroup = document.createElement('div');
  player2ScoreGroup.classList.add('form-group');
  
  const player2ScoreLabel = document.createElement('label');
  player2ScoreLabel.textContent = `${player2Name}:`;
  player2ScoreLabel.htmlFor = 'player2Score';
  
  const player2ScoreInput = document.createElement('input');
  player2ScoreInput.type = 'number';
  player2ScoreInput.id = 'player2Score';
  player2ScoreInput.name = 'player2Score';
  player2ScoreInput.min = '0';
  player2ScoreInput.required = true;
  
  player2ScoreGroup.appendChild(player2ScoreLabel);
  player2ScoreGroup.appendChild(player2ScoreInput);
  
  scoreContainer.appendChild(player1ScoreGroup);
  scoreContainer.appendChild(player2ScoreGroup);
  
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.classList.add('btn-primary');
  submitButton.textContent = 'Guardar Resultado';
  
  form.appendChild(matchInfo);
  form.appendChild(scoreContainer);
  form.appendChild(submitButton);
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const player1Score = parseInt(player1ScoreInput.value);
    const player2Score = parseInt(player2ScoreInput.value);
    
    if (player1Score === player2Score) {
      alert('El resultado no puede ser un empate. Por favor ingrese un ganador.');
      return;
    }
    
    // Submit match result
    submitMatchResult(tournamentId, matchId, player1Score, player2Score, () => {
      document.body.removeChild(modal);
      // Reload the page to show updated brackets
      window.location.reload();
    });
  });
  
  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(form);
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

/**
 * Submit match result to the server
 */
function submitMatchResult(tournamentId, matchId, player1Score, player2Score, callback) {
  fetch(`/api/tournaments/${tournamentId}/matches/${matchId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      player1Score,
      player2Score
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      showNotification('Resultado registrado exitosamente', 'success');
      if (callback) callback();
    } else {
      showNotification(`Error: ${data.message}`, 'error');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showNotification('Error al registrar el resultado. Inténtalo de nuevo.', 'error');
  });
}

/**
 * Load tournament standings
 */
function loadTournamentStandings(container, tournamentId) {
  container.innerHTML = '<div class="loading">Cargando clasificación...</div>';
  
  fetch(`/api/tournaments/${tournamentId}/standings`)
    .then(response => response.json())
    .then(data => {
      renderStandings(container, data);
    })
    .catch(error => {
      console.error('Error fetching standings:', error);
      container.innerHTML = '<p class="error">Error al cargar la clasificación. Por favor, intenta de nuevo más tarde.</p>';
    });
}

/**
 * Render tournament standings
 */
function renderStandings(container, data) {
  container.innerHTML = '';
  
  if (data.format === 'round_robin') {
    // Render round robin standings table
    const table = document.createElement('table');
    table.classList.add('standings-table');
    
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Posición</th>
        <th>Jugador</th>
        <th>Ganados</th>
        <th>Perdidos</th>
        <th>Puntos</th>
      </tr>
    `;
    
    const tbody = document.createElement('tbody');
    
    if (data.standings && data.standings.length > 0) {
      data.standings.forEach((standing, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${standing.participant.name}</td>
          <td>${standing.wins}</td>
          <td>${standing.losses}</td>
          <td>${standing.points}</td>
        `;
        
        // Highlight leader
        if (index === 0) {
          row.classList.add('leader');
        }
        
        tbody.appendChild(row);
      });
    } else {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="5">No hay datos de clasificación disponibles.</td>';
      tbody.appendChild(row);
    }
    
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
  } else {
    // For elimination formats, show progress
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('tournament-progress');
    
    const progressInfo = document.createElement('div');
    progressInfo.classList.add('progress-info');
    
    const matchesInfo = document.createElement('p');
    matchesInfo.textContent = `Partidas completadas: ${data.matchesCompleted} de ${data.totalMatches}`;
    
    const statusInfo = document.createElement('p');
    statusInfo.textContent = `Estado: ${data.status === 'in_progress' ? 'En curso' : 'Completado'}`;
    
    progressInfo.appendChild(matchesInfo);
    progressInfo.appendChild(statusInfo);
    
    if (data.winner) {
      const winnerInfo = document.createElement('div');
      winnerInfo.classList.add('winner-info');
      winnerInfo.innerHTML = `<h4>Ganador del Torneo</h4><p>${data.winner.name}</p>`;
      progressContainer.appendChild(winnerInfo);
    }
    
    progressContainer.appendChild(progressInfo);
    container.appendChild(progressContainer);
  }
}

/**
 * Render single elimination brackets
 */
function renderSingleEliminationBrackets(container, tournament) {
  // Group brackets by round
  const roundsMap = new Map();
  
  tournament.brackets.forEach(match => {
    if (!roundsMap.has(match.round)) {
      roundsMap.set(match.round, []);
    }
    roundsMap.get(match.round).push(match);
  });
  
  // Sort rounds
  const rounds = Array.from(roundsMap.keys()).sort((a, b) => a - b);
  
  // Create bracket structure
  const bracketElement = document.createElement('div');
  bracketElement.classList.add('tournament-bracket', 'single-elimination');
  
  rounds.forEach(roundNumber => {
    const roundElement = document.createElement('div');
    roundElement.classList.add('bracket-round');
    
    // Set round title based on position
    let roundTitle;
    if (roundNumber === rounds.length) {
      roundTitle = 'Final';
    } else if (roundNumber === rounds.length - 1) {
      roundTitle = 'Semifinales';
    } else if (roundNumber === rounds.length - 2) {
      roundTitle = 'Cuartos de Final';
    } else {
      roundTitle = `Ronda ${roundNumber}`;
    }
    
    roundElement.innerHTML = `<h4>${roundTitle}</h4>`;
    
    const matchesElement = document.createElement('div');
    matchesElement.classList.add('bracket-matches');
    
    roundsMap.get(roundNumber).forEach(match => {
      const matchElement = document.createElement('div');
      matchElement.classList.add('bracket-match');
      
      const player1Element = document.createElement('div');
      player1Element.classList.add('bracket-player');
      player1Element.textContent = match.player1 ? match.player1.name : 'TBD';
      
      const player2Element = document.createElement('div');
      player2Element.classList.add('bracket-player');
      player2Element.textContent = match.player2 ? match.player2.name : 'TBD';
      
      if (match.winner) {
        if (match.player1 && match.winner.name === match.player1.name) {
          player1Element.classList.add('winner');
        } else if (match.player2 && match.winner.name === match.player2.name) {
          player2Element.classList.add('winner');
        }
      }
      
      const scoreElement = document.createElement('div');
      scoreElement.classList.add('bracket-score');
      scoreElement.textContent = match.score || '-';
      
      matchElement.appendChild(player1Element);
      matchElement.appendChild(player2Element);
      matchElement.appendChild(scoreElement);
      
      // Add edit button for scheduled matches
      const matchData = tournament.matches.find(m => m.id === match.id);
      if (matchData && matchData.status === 'scheduled') {
        const actionElement = document.createElement('div');
        actionElement.classList.add('bracket-action');
        
        const editButton = document.createElement('button');
        editButton.classList.add('btn-secondary', 'btn-small');
        editButton.textContent = 'Registrar';
        editButton.dataset.matchId = match.id;
        editButton.dataset.tournamentId = tournament.id;
        
        editButton.addEventListener('click', () => {
          const player1 = match.player1 ? match.player1.name : 'TBD';
          const player2 = match.player2 ? match.player2.name : 'TBD';
          showScoreForm(tournament.id, match.id, player1, player2);
        });
        
        actionElement.appendChild(editButton);
        matchElement.appendChild(actionElement);
      }
      
      matchesElement.appendChild(matchElement);
    });
    
    roundElement.appendChild(matchesElement);
    bracketElement.appendChild(roundElement);
  });
  
  container.appendChild(bracketElement);
}

/**
 * Render double elimination brackets
 */
function renderDoubleEliminationBrackets(container, tournament) {
  // Group brackets by bracket type and round
  const upperBracket = tournament.brackets.filter(match => match.bracket === 'upper');
  const lowerBracket = tournament.brackets.filter(match => match.bracket === 'lower');
  const grandFinals = tournament.brackets.filter(match => match.bracket === 'grand');
  
  const bracketElement = document.createElement('div');
  bracketElement.classList.add('tournament-bracket', 'double-elimination');
  
  // Upper bracket
  const upperElement = document.createElement('div');
  upperElement.classList.add('bracket-section', 'upper-bracket');
  upperElement.innerHTML = '<h4 class="bracket-title">Bracket Superior</h4>';
  
  // Render upper bracket rounds
  renderBracketSection(upperElement, upperBracket, tournament);
  
  // Lower bracket
  const lowerElement = document.createElement('div');
  lowerElement.classList.add('bracket-section', 'lower-bracket');
  lowerElement.innerHTML = '<h4 class="bracket-title">Bracket Inferior</h4>';
  
  // Render lower bracket rounds
  renderBracketSection(lowerElement, lowerBracket, tournament);
  
  // Grand finals
  const finalsElement = document.createElement('div');
  finalsElement.classList.add('bracket-section', 'grand-finals');
  finalsElement.innerHTML = '<h4 class="bracket-title">Finales</h4>';
  
  // Render grand finals
  renderBracketSection(finalsElement, grandFinals, tournament);
  
  bracketElement.appendChild(upperElement);
  bracketElement.appendChild(lowerElement);
  bracketElement.appendChild(finalsElement);
  
  container.appendChild(bracketElement);
}

/**
 * Render bracket section for double elimination
 */
function renderBracketSection(container, brackets, tournament) {
  // Group by round
  const roundsMap = new Map();
  
  brackets.forEach(match => {
    if (!roundsMap.has(match.round)) {
      roundsMap.set(match.round, []);
    }
    roundsMap.get(match.round).push(match);
  });
  
  // Sort rounds
  const rounds = Array.from(roundsMap.keys()).sort((a, b) => a - b);
  
  rounds.forEach(roundNumber => {
    const roundElement = document.createElement('div');
    roundElement.classList.add('bracket-round');
    
    let roundTitle = `Ronda ${roundNumber}`;
    if (brackets[0] && brackets[0].bracket === 'grand') {
      roundTitle = roundNumber === 1 ? 'Gran Final' : 'Gran Final - Partida 2';
    }
    
    roundElement.innerHTML = `<h5>${roundTitle}</h5>`;
    
    const matchesElement = document.createElement('div');
    matchesElement.classList.add('bracket-matches');
    
    roundsMap.get(roundNumber).forEach(match => {
      // Skip conditional matches unless they're active
      if (match.conditional === true && match.player1 === null) {
        return;
      }
      
      const matchElement = document.createElement('div');
      matchElement.classList.add('bracket-match');
      
      const player1Element = document.createElement('div');
      player1Element.classList.add('bracket-player');
      player1Element.textContent = match.player1 ? match.player1.name : 'TBD';
      
      const player2Element = document.createElement('div');
      player2Element.classList.add('bracket-player');
      player2Element.textContent = match.player2 ? match.player2.name : 'TBD';
      
      if (match.winner) {
        if (match.player1 && match.winner.name === match.player1.name) {
          player1Element.classList.add('winner');
        } else if (match.player2 && match.winner.name === match.player2.name) {
          player2Element.classList.add('winner');
        }
      }
      
      const scoreElement = document.createElement('div');
      scoreElement.classList.add('bracket-score');
      scoreElement.textContent = match.score || '-';
      
      matchElement.appendChild(player1Element);
      matchElement.appendChild(player2Element);
      matchElement.appendChild(scoreElement);
      
      // Add edit button for scheduled matches
      const matchData = tournament.matches.find(m => m.id === match.id);
      if (matchData && matchData.status === 'scheduled') {
        const actionElement = document.createElement('div');
        actionElement.classList.add('bracket-action');
        
        const editButton = document.createElement('button');
        editButton.classList.add('btn-secondary', 'btn-small');
        editButton.textContent = 'Registrar';
        editButton.dataset.matchId = match.id;
        editButton.dataset.tournamentId = tournament.id;
        
        editButton.addEventListener('click', () => {
          const player1 = match.player1 ? match.player1.name : 'TBD';
          const player2 = match.player2 ? match.player2.name : 'TBD';
          showScoreForm(tournament.id, match.id, player1, player2);
        });
        
        actionElement.appendChild(editButton);
        matchElement.appendChild(actionElement);
      }
      
      matchesElement.appendChild(matchElement);
    });
    
    roundElement.appendChild(matchesElement);
    container.appendChild(roundElement);
  });
}

/**
 * Render round robin matches
 */
function renderRoundRobinMatches(container, tournament) {
  const matchesElement = document.createElement('div');
  matchesElement.classList.add('round-robin-matches');
  
  const tableElement = document.createElement('table');
  tableElement.classList.add('matches-table');
  
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Jugador 1</th>
      <th>Resultado</th>
      <th>Jugador 2</th>
      <th>Estado</th>
      <th>Acciones</th>
    </tr>
  `;
  
  const tbody = document.createElement('tbody');
  
  tournament.brackets.forEach(match => {
    const row = document.createElement('tr');
    
    const player1Cell = document.createElement('td');
    player1Cell.textContent = match.player1 ? match.player1.name : 'TBD';
    
    const resultCell = document.createElement('td');
    resultCell.classList.add('match-result');
    resultCell.textContent = match.score || '-';
    
    const player2Cell = document.createElement('td');
    player2Cell.textContent = match.player2 ? match.player2.name : 'TBD';
    
    const statusCell = document.createElement('td');
    
    const matchData = tournament.matches.find(m => m.id === match.id);
    let status = 'Pendiente';
    
    if (matchData) {
      if (matchData.status === 'completed') {
        status = 'Completado';
        // Highlight winner
        if (match.winner) {
          if (match.winner.name === match.player1.name) {
            player1Cell.classList.add('winner');
          } else {
            player2Cell.classList.add('winner');
          }
        }
      } else if (matchData.status === 'scheduled') {
        status = 'Programado';
      }
    }
    
    statusCell.textContent = status;
    
    const actionsCell = document.createElement('td');
    
    if (matchData && matchData.status === 'scheduled') {
      const recordButton = document.createElement('button');
      recordButton.classList.add('btn-secondary', 'btn-small');
      recordButton.textContent = 'Registrar';
      recordButton.dataset.matchId = match.id;
      recordButton.dataset.tournamentId = tournament.id;
      
      recordButton.addEventListener('click', () => {
        const player1 = match.player1 ? match.player1.name : 'TBD';
        const player2 = match.player2 ? match.player2.name : 'TBD';
        showScoreForm(tournament.id, match.id, player1, player2);
      });
      
      actionsCell.appendChild(recordButton);
    }
    
    row.appendChild(player1Cell);
    row.appendChild(resultCell);
    row.appendChild(player2Cell);
    row.appendChild(statusCell);
    row.appendChild(actionsCell);
    
    tbody.appendChild(row);
  });
  
  tableElement.appendChild(thead);
  tableElement.appendChild(tbody);
  matchesElement.appendChild(tableElement);
  container.appendChild(matchesElement);
}

/**
 * Original bracket rendering function (fallback)
 */
function renderBrackets(container, brackets) {
  // Group brackets by round
  const roundsMap = new Map();
  
  brackets.forEach(match => {
    if (!roundsMap.has(match.round)) {
      roundsMap.set(match.round, []);
    }
    roundsMap.get(match.round).push(match);
  });
  
  // Sort rounds
  const rounds = Array.from(roundsMap.keys()).sort((a, b) => a - b);
  
  // Create bracket structure
  const bracketElement = document.createElement('div');
  bracketElement.classList.add('tournament-bracket');
  
  rounds.forEach(roundNumber => {
    const roundElement = document.createElement('div');
    roundElement.classList.add('bracket-round');
    roundElement.innerHTML = `<h4>Ronda ${roundNumber}</h4>`;
    
    const matchesElement = document.createElement('div');
    matchesElement.classList.add('bracket-matches');
    
    roundsMap.get(roundNumber).forEach(match => {
      const matchElement = document.createElement('div');
      matchElement.classList.add('bracket-match');
      
      const player1Element = document.createElement('div');
      player1Element.classList.add('bracket-player');
      player1Element.textContent = match.player1 ? match.player1.name : 'TBD';
      
      const player2Element = document.createElement('div');
      player2Element.classList.add('bracket-player');
      player2Element.textContent = match.player2 ? match.player2.name : 'TBD';
      
      if (match.winner) {
        if (match.player1 && match.winner.name === match.player1.name) {
          player1Element.classList.add('winner');
        } else if (match.player2 && match.winner.name === match.player2.name) {
          player2Element.classList.add('winner');
        }
      }
      
      const scoreElement = document.createElement('div');
      scoreElement.classList.add('bracket-score');
      scoreElement.textContent = match.score || '-';
      
      matchElement.appendChild(player1Element);
      matchElement.appendChild(player2Element);
      matchElement.appendChild(scoreElement);
      
      matchesElement.appendChild(matchElement);
    });
    
    roundElement.appendChild(matchesElement);
    bracketElement.appendChild(roundElement);
  });
  
  container.appendChild(bracketElement);
}

/**
 * Initialize tournament registration form
 */
function initializeRegistrationForm(form) {
  // Form is handled by the main.js handleFormSubmissions function
  console.log('Registration form initialized');
}

/**
 * Initialize tournament creation form
 */
function initializeTournamentCreateForm(form) {
  // Form is handled by the main.js handleFormSubmissions function
  console.log('Tournament creation form initialized');
}

/**
 * Initialize bracket generation
 */
function initializeBracketGeneration(button) {
  button.addEventListener('click', () => {
    const tournamentId = button.dataset.tournamentId;
    
    if (!tournamentId) {
      showNotification('Error: ID de torneo no encontrado', 'error');
      return;
    }
    
    // Confirm before generating brackets
    if (!confirm('¿Estás seguro de que deseas generar los brackets del torneo? Esta acción no se puede deshacer.')) {
      return;
    }
    
    fetch(`/api/tournaments/${tournamentId}/generate-brackets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.brackets) {
        showNotification('Brackets generados exitosamente', 'success');
        
        // Reload page to show brackets
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showNotification(`Error: ${data.message}`, 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showNotification('Error al generar los brackets. Inténtalo de nuevo.', 'error');
    });
  });
}

/**
 * Format date to local format
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

/**
 * Show notification message (uses the function from main.js)
 */
function showNotification(message, type = 'info') {
  // Check if the function exists in the global scope (defined in main.js)
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
  } else {
    // Fallback if the function is not available
    alert(message);
  }
}