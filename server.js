const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
app.use(express.json()); // Add middleware to parse JSON bodies

console.log('Starting Quake Community server...');

// Check if public directory exists
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  console.log(`Public directory exists at: ${publicDir}`);
} else {
  console.log(`Public directory does not exist at: ${publicDir}`);
  // Create public directory if it doesn't exist
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`Created public directory at: ${publicDir}`);
}

// Serve static files from the 'public' directory
app.use(express.static(publicDir));
console.log('Set up static file serving from public directory');

// Basic middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// In-memory tournament data (simulated database)
const tournaments = [
  {
    id: "1",
    name: "Copa Quake 2 Latinoamérica 2025",
    game: "Quake 2",
    date: "2025-04-15T18:00:00Z",
    description: "Torneo 1v1 de Quake 2 para jugadores de Latinoamérica. Formato eliminación simple.",
    maxParticipants: 16,
    participants: [
      { id: "p1", name: "FragLord", email: "fraglord@example.com", nickname: "FragLord" },
      { id: "p2", name: "RocketQueen", email: "rocketqueen@example.com", nickname: "RocketQueen" }
    ],
    status: "upcoming",
    format: "single_elimination",
    brackets: [],
    matches: []
  },
  {
    id: "2",
    name: "Duelo de Campeones Quake Live",
    game: "Quake Live",
    date: "2025-05-10T20:00:00Z",
    description: "Torneo exclusivo para jugadores con experiencia previa en torneos. Premios para los tres primeros lugares.",
    maxParticipants: 8,
    participants: [
      { id: "p3", name: "RailMaster", email: "railmaster@example.com", nickname: "RailMaster" },
      { id: "p4", name: "LGKing", email: "lgking@example.com", nickname: "LGKing" },
      { id: "p5", name: "JumpGod", email: "jumpgod@example.com", nickname: "JumpGod" }
    ],
    status: "upcoming",
    format: "double_elimination",
    brackets: [],
    matches: []
  },
  {
    id: "3",
    name: "Torneo CTF Teams Quake Live",
    game: "Quake Live",
    date: "2025-06-05T19:00:00Z",
    description: "Torneo por equipos en modo Capture The Flag. Los equipos deben registrarse con 4 jugadores.",
    maxParticipants: 8,
    participants: [],
    status: "upcoming",
    format: "round_robin",
    brackets: [],
    matches: []
  }
];

// Routes for pages
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');
  console.log(`GET / - Serving file: ${filePath}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
    res.status(404).send('File not found');
  }
});

app.get('/quake2', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'quake2.html');
  console.log(`GET /quake2 - Serving file: ${filePath}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
    res.status(404).send('File not found');
  }
});

app.get('/quakelive', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'quakelive.html');
  console.log(`GET /quakelive - Serving file: ${filePath}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
    res.status(404).send('File not found');
  }
});

app.get('/rankings', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'rankings.html');
  console.log(`GET /rankings - Serving file: ${filePath}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
    res.status(404).send('File not found');
  }
});

app.get('/tournaments', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'tournaments.html');
  console.log(`GET /tournaments - Serving file: ${filePath}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
    res.status(404).send('File not found');
  }
});

app.get('/tournament', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'tournament-details.html');
  console.log(`GET /tournament - Serving file: ${filePath}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
    res.status(404).send('File not found');
  }
});

// API routes for tournaments
// Get all tournaments
app.get('/api/tournaments', (req, res) => {
  console.log('GET /api/tournaments - Returning all tournaments');
  res.json(tournaments);
});

// Get a specific tournament
app.get('/api/tournaments/:id', (req, res) => {
  const tournamentId = req.params.id;
  console.log(`GET /api/tournaments/${tournamentId} - Fetching tournament`);
  
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) {
    console.log(`Tournament not found: ${tournamentId}`);
    return res.status(404).json({ message: 'Tournament not found' });
  }
  
  res.json(tournament);
});

// Create a new tournament
app.post('/api/tournaments', (req, res) => {
  console.log('POST /api/tournaments - Creating new tournament');
  
  const { name, game, date, description, maxParticipants, format } = req.body;
  
  // Validate required fields
  if (!name || !game || !date || !description || !maxParticipants || !format) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Validate format
  const validFormats = ['single_elimination', 'double_elimination', 'round_robin'];
  if (!validFormats.includes(format)) {
    return res.status(400).json({ message: 'Invalid tournament format' });
  }
  
  // Create new tournament
  const newTournament = {
    id: (tournaments.length + 1).toString(),
    name,
    game,
    date,
    description,
    maxParticipants: parseInt(maxParticipants),
    participants: [],
    status: 'upcoming',
    format,
    brackets: [],
    matches: []
  };
  
  tournaments.push(newTournament);
  
  res.status(201).json(newTournament);
});

// Register for a tournament
app.post('/api/tournaments/:id/register', (req, res) => {
  const tournamentId = req.params.id;
  console.log(`POST /api/tournaments/${tournamentId}/register - Registering for tournament`);
  
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) {
    return res.status(404).json({ message: 'Tournament not found' });
  }
  
  // Check if tournament is open for registration
  if (tournament.status !== 'upcoming') {
    return res.status(400).json({ message: 'Tournament is not open for registration' });
  }
  
  // Check if tournament is full
  if (tournament.participants.length >= tournament.maxParticipants) {
    return res.status(400).json({ message: 'Tournament is full' });
  }
  
  const { name, email, nickname } = req.body;
  
  // Validate required fields
  if (!name || !email || !nickname) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Check if user is already registered
  if (tournament.participants.some(p => p.email === email)) {
    return res.status(400).json({ message: 'You are already registered for this tournament' });
  }
  
  // Add participant
  const newParticipant = {
    id: `p${Date.now()}`,
    name,
    email,
    nickname
  };
  
  tournament.participants.push(newParticipant);
  
  res.json({ message: 'Registration successful', participant: newParticipant });
});

// Generate brackets for a tournament
app.post('/api/tournaments/:id/generate-brackets', (req, res) => {
  const tournamentId = req.params.id;
  console.log(`POST /api/tournaments/${tournamentId}/generate-brackets - Generating brackets`);
  
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) {
    return res.status(404).json({ message: 'Tournament not found' });
  }
  
  // Check if tournament has enough participants
  if (tournament.participants.length < 2) {
    return res.status(400).json({ message: 'Tournament needs at least 2 participants' });
  }
  
  // Check if brackets already exist
  if (tournament.brackets.length > 0) {
    return res.status(400).json({ message: 'Brackets already generated' });
  }
  
  // Generate brackets based on tournament format
  const participants = [...tournament.participants];
  // Shuffle participants
  for (let i = participants.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [participants[i], participants[j]] = [participants[j], participants[i]];
  }
  
  let brackets = [];
  let matches = [];
  
  switch (tournament.format) {
    case 'single_elimination':
      ({ brackets, matches } = generateSingleEliminationBrackets(participants));
      break;
    case 'double_elimination':
      ({ brackets, matches } = generateDoubleEliminationBrackets(participants));
      break;
    case 'round_robin':
      ({ brackets, matches } = generateRoundRobinBrackets(participants));
      break;
    default:
      return res.status(400).json({ message: 'Invalid tournament format' });
  }
  
  tournament.brackets = brackets;
  tournament.matches = matches;
  tournament.status = 'in_progress';
  
  res.json({ 
    message: `${tournament.format.replace('_', ' ')} brackets generated successfully`, 
    brackets,
    matches 
  });
});

// Function to generate single elimination brackets
function generateSingleEliminationBrackets(participants) {
  const brackets = [];
  const matches = [];
  
  // Create first round matches
  for (let i = 0; i < participants.length; i += 2) {
    const matchId = `m${brackets.length + 1}`;
    const match = {
      id: matchId,
      round: 1,
      player1: participants[i],
      player2: i + 1 < participants.length ? participants[i + 1] : null,
      winner: null,
      score: null
    };
    brackets.push(match);
    
    // Also add to matches array for tracking
    matches.push({
      id: matchId,
      round: 1,
      player1Id: participants[i].id,
      player2Id: i + 1 < participants.length ? participants[i + 1].id : null,
      winnerId: null,
      player1Score: 0,
      player2Score: 0,
      status: 'scheduled'
    });
  }
  
  // Create subsequent rounds (empty)
  let currentRound = 1;
  let matchesInCurrentRound = Math.ceil(participants.length / 2);
  
  while (matchesInCurrentRound > 1) {
    currentRound++;
    matchesInCurrentRound = Math.ceil(matchesInCurrentRound / 2);
    
    for (let i = 0; i < matchesInCurrentRound; i++) {
      const matchId = `m${brackets.length + 1}`;
      brackets.push({
        id: matchId,
        round: currentRound,
        player1: null,
        player2: null,
        winner: null,
        score: null
      });
      
      // Add to matches array as well
      matches.push({
        id: matchId,
        round: currentRound,
        player1Id: null,
        player2Id: null,
        winnerId: null,
        player1Score: 0,
        player2Score: 0,
        status: 'pending'
      });
    }
  }
  
  return { brackets, matches };
}

// Function to generate double elimination brackets
function generateDoubleEliminationBrackets(participants) {
  const brackets = [];
  const matches = [];
  
  // Winners bracket (upper bracket)
  const upperBrackets = [];
  let upperRound = 1;
  
  // First round of upper bracket
  for (let i = 0; i < participants.length; i += 2) {
    const matchId = `m${brackets.length + 1}`;
    const match = {
      id: matchId,
      bracket: 'upper',
      round: upperRound,
      player1: participants[i],
      player2: i + 1 < participants.length ? participants[i + 1] : null,
      winner: null,
      score: null
    };
    upperBrackets.push(match);
    brackets.push(match);
    
    // Add to matches array
    matches.push({
      id: matchId,
      bracket: 'upper',
      round: upperRound,
      player1Id: participants[i].id,
      player2Id: i + 1 < participants.length ? participants[i + 1].id : null,
      winnerId: null,
      player1Score: 0,
      player2Score: 0,
      status: 'scheduled'
    });
  }
  
  // Rest of upper bracket
  let matchesInCurrentRound = Math.ceil(participants.length / 2);
  while (matchesInCurrentRound > 1) {
    upperRound++;
    matchesInCurrentRound = Math.ceil(matchesInCurrentRound / 2);
    
    for (let i = 0; i < matchesInCurrentRound; i++) {
      const matchId = `m${brackets.length + 1}`;
      const match = {
        id: matchId,
        bracket: 'upper',
        round: upperRound,
        player1: null,
        player2: null,
        winner: null,
        score: null
      };
      upperBrackets.push(match);
      brackets.push(match);
      
      // Add to matches array
      matches.push({
        id: matchId,
        bracket: 'upper',
        round: upperRound,
        player1Id: null,
        player2Id: null,
        winnerId: null,
        player1Score: 0,
        player2Score: 0,
        status: 'pending'
      });
    }
  }
  
  // Losers bracket (lower bracket)
  const lowerBrackets = [];
  let lowerRound = 1;
  
  // Calculate number of rounds in lower bracket
  // In double elimination, if we have n participants, we need log2(n) rounds in the upper bracket
  // and 2*log2(n)-1 rounds in the lower bracket
  const totalRounds = Math.ceil(Math.log2(participants.length));
  const lowerBracketRounds = 2 * totalRounds - 1;
  
  // Generate rounds for lower bracket
  for (let r = 1; r <= lowerBracketRounds; r++) {
    // Number of matches in this round depends on the round number and total participants
    let matchesInRound;
    if (r % 2 === 1) {
      // Odd-numbered rounds handle dropdowns from the upper bracket
      matchesInRound = Math.floor(participants.length / Math.pow(2, Math.floor((r + 1) / 2)));
    } else {
      // Even-numbered rounds are internal to the lower bracket
      matchesInRound = Math.floor(participants.length / Math.pow(2, Math.floor(r / 2)));
    }
    
    // Ensure at least one match in final rounds
    matchesInRound = Math.max(1, matchesInRound);
    
    for (let i = 0; i < matchesInRound; i++) {
      const matchId = `m${brackets.length + 1}`;
      const match = {
        id: matchId,
        bracket: 'lower',
        round: r,
        player1: null,
        player2: null,
        winner: null,
        score: null
      };
      lowerBrackets.push(match);
      brackets.push(match);
      
      // Add to matches array
      matches.push({
        id: matchId,
        bracket: 'lower',
        round: r,
        player1Id: null,
        player2Id: null,
        winnerId: null,
        player1Score: 0,
        player2Score: 0,
        status: 'pending'
      });
    }
  }
  
  // Grand finals (potentially two matches if loser's bracket winner wins first)
  const grandFinalId = `m${brackets.length + 1}`;
  const grandFinal = {
    id: grandFinalId,
    bracket: 'grand',
    round: 1,
    player1: null, // Winner of upper bracket
    player2: null, // Winner of lower bracket
    winner: null,
    score: null
  };
  brackets.push(grandFinal);
  
  // Add to matches array
  matches.push({
    id: grandFinalId,
    bracket: 'grand',
    round: 1,
    player1Id: null,
    player2Id: null,
    winnerId: null,
    player1Score: 0,
    player2Score: 0,
    status: 'pending'
  });
  
  // Potential second grand finals (if lower bracket winner wins first match)
  const secondGrandFinalId = `m${brackets.length + 1}`;
  const secondGrandFinal = {
    id: secondGrandFinalId,
    bracket: 'grand',
    round: 2,
    player1: null,
    player2: null,
    winner: null,
    score: null,
    conditional: true
  };
  brackets.push(secondGrandFinal);
  
  // Add to matches array
  matches.push({
    id: secondGrandFinalId,
    bracket: 'grand',
    round: 2,
    player1Id: null,
    player2Id: null,
    winnerId: null,
    player1Score: 0,
    player2Score: 0,
    status: 'pending',
    conditional: true
  });
  
  return { brackets, matches };
}

// Function to generate round robin brackets
function generateRoundRobinBrackets(participants) {
  const brackets = [];
  const matches = [];
  
  // In round robin, each participant plays against every other participant
  // For n participants, we need n(n-1)/2 matches
  
  let matchId = 1;
  
  // Create round robin schedule
  for (let i = 0; i < participants.length; i++) {
    for (let j = i + 1; j < participants.length; j++) {
      const currentMatchId = `m${matchId}`;
      
      // Create bracket entry
      const match = {
        id: currentMatchId,
        round: 1, // All matches are considered "round 1" in round robin
        player1: participants[i],
        player2: participants[j],
        winner: null,
        score: null
      };
      brackets.push(match);
      
      // Add to matches array
      matches.push({
        id: currentMatchId,
        round: 1,
        player1Id: participants[i].id,
        player2Id: participants[j].id,
        winnerId: null,
        player1Score: 0,
        player2Score: 0,
        status: 'scheduled'
      });
      
      matchId++;
    }
  }
  
  return { brackets, matches };
}

// Record match result
app.post('/api/tournaments/:id/matches/:matchId', (req, res) => {
  const tournamentId = req.params.id;
  const matchId = req.params.matchId;
  
  console.log(`POST /api/tournaments/${tournamentId}/matches/${matchId} - Recording match result`);
  
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) {
    return res.status(404).json({ message: 'Tournament not found' });
  }
  
  // Find the match
  const match = tournament.matches.find(m => m.id === matchId);
  
  if (!match) {
    return res.status(404).json({ message: 'Match not found' });
  }
  
  // Validate match status
  if (match.status !== 'scheduled') {
    return res.status(400).json({ message: 'Match is not scheduled or already completed' });
  }
  
  const { player1Score, player2Score } = req.body;
  
  // Validate scores
  if (player1Score === undefined || player2Score === undefined) {
    return res.status(400).json({ message: 'Both player scores are required' });
  }
  
  if (player1Score === player2Score) {
    return res.status(400).json({ message: 'Match cannot end in a tie' });
  }
  
  // Update match result
  match.player1Score = player1Score;
  match.player2Score = player2Score;
  match.status = 'completed';
  match.winnerId = player1Score > player2Score ? match.player1Id : match.player2Id;
  
  // Update the bracket entry as well
  const bracketEntry = tournament.brackets.find(b => b.id === matchId);
  if (bracketEntry) {
    const winner = tournament.participants.find(p => p.id === match.winnerId);
    bracketEntry.winner = winner;
    bracketEntry.score = `${player1Score}-${player2Score}`;
  }
  
  // Handle advancement based on tournament format
  if (tournament.format === 'single_elimination' || tournament.format === 'double_elimination') {
    advanceParticipants(tournament, match);
  } else if (tournament.format === 'round_robin') {
    updateStandings(tournament);
  }
  
  // Check if tournament is completed
  checkTournamentCompletion(tournament);
  
  res.json({ 
    message: 'Match result recorded successfully', 
    match,
    tournament: {
      id: tournament.id,
      status: tournament.status
    }
  });
});

// Helper function to advance participants to next rounds (for elimination formats)
function advanceParticipants(tournament, completedMatch) {
  // Find the winner
  const winner = tournament.participants.find(p => p.id === completedMatch.winnerId);
  
  if (!winner) {
    console.error('Winner not found in participants list');
    return;
  }
  
  if (tournament.format === 'single_elimination') {
    // Find the next match in the bracket
    const currentRound = completedMatch.round;
    const nextRound = currentRound + 1;
    
    // Find which position in the next round this winner should go to
    const matchesInCurrentRound = tournament.brackets.filter(b => b.round === currentRound);
    const indexInCurrentRound = matchesInCurrentRound.findIndex(m => m.id === completedMatch.id);
    const positionInNextRound = Math.floor(indexInCurrentRound / 2);
    
    // Find the next match
    const nextMatches = tournament.brackets.filter(b => b.round === nextRound);
    
    if (nextMatches.length > 0) {
      const nextMatch = nextMatches[positionInNextRound];
      
      // Place winner in the next match
      if (!nextMatch.player1) {
        nextMatch.player1 = winner;
        
        // Update the match entry as well
        const matchEntry = tournament.matches.find(m => m.id === nextMatch.id);
        if (matchEntry) {
          matchEntry.player1Id = winner.id;
          matchEntry.status = nextMatch.player2 ? 'scheduled' : 'pending';
        }
      } else {
        nextMatch.player2 = winner;
        
        // Update the match entry as well
        const matchEntry = tournament.matches.find(m => m.id === nextMatch.id);
        if (matchEntry) {
          matchEntry.player2Id = winner.id;
          matchEntry.status = 'scheduled';
        }
      }
    }
  } 
  else if (tournament.format === 'double_elimination') {
    // Handle advancement in double elimination format
    const loser = tournament.participants.find(p => 
      p.id === (completedMatch.player1Id === completedMatch.winnerId ? 
        completedMatch.player2Id : completedMatch.player1Id));
        
    if (completedMatch.bracket === 'upper') {
      // Winner stays in upper bracket
      const currentRound = completedMatch.round;
      const nextRound = currentRound + 1;
      
      // Find upper bracket matches in the current round
      const matchesInCurrentRound = tournament.brackets.filter(
        b => b.bracket === 'upper' && b.round === currentRound
      );
      
      const indexInCurrentRound = matchesInCurrentRound.findIndex(m => m.id === completedMatch.id);
      const positionInNextRound = Math.floor(indexInCurrentRound / 2);
      
      // Find the next match in upper bracket
      const nextMatches = tournament.brackets.filter(
        b => b.bracket === 'upper' && b.round === nextRound
      );
      
      if (nextMatches.length > 0) {
        const nextMatch = nextMatches[positionInNextRound];
        
        // Place winner in the next match
        if (!nextMatch.player1) {
          nextMatch.player1 = winner;
          
          // Update the match entry
          const matchEntry = tournament.matches.find(m => m.id === nextMatch.id);
          if (matchEntry) {
            matchEntry.player1Id = winner.id;
            matchEntry.status = nextMatch.player2 ? 'scheduled' : 'pending';
          }
        } else {
          nextMatch.player2 = winner;
          
          // Update the match entry
          const matchEntry = tournament.matches.find(m => m.id === nextMatch.id);
          if (matchEntry) {
            matchEntry.player2Id = winner.id;
            matchEntry.status = 'scheduled';
          }
        }
      } else {
        // Winner reached the end of upper bracket, advance to grand finals
        const grandFinals = tournament.brackets.find(b => b.bracket === 'grand' && b.round === 1);
        if (grandFinals) {
          grandFinals.player1 = winner;
          
          // Update the match entry
          const matchEntry = tournament.matches.find(m => m.id === grandFinals.id);
          if (matchEntry) {
            matchEntry.player1Id = winner.id;
            matchEntry.status = grandFinals.player2 ? 'scheduled' : 'pending';
          }
        }
      }
      
      // Loser drops to lower bracket
      // Figure out which lower bracket match they go to
      const dropToLowerRound = currentRound * 2 - 1; // Formula for determining which lower round to drop to
      
      const lowerMatches = tournament.brackets.filter(
        b => b.bracket === 'lower' && b.round === dropToLowerRound
      );
      
      if (lowerMatches.length > 0) {
        // Determine position in lower bracket
        const positionInLowerBracket = indexInCurrentRound;
        const lowerMatch = lowerMatches[positionInLowerBracket % lowerMatches.length];
        
        if (!lowerMatch.player1) {
          lowerMatch.player1 = loser;
          
          // Update the match entry
          const matchEntry = tournament.matches.find(m => m.id === lowerMatch.id);
          if (matchEntry) {
            matchEntry.player1Id = loser.id;
            matchEntry.status = lowerMatch.player2 ? 'scheduled' : 'pending';
          }
        } else {
          lowerMatch.player2 = loser;
          
          // Update the match entry
          const matchEntry = tournament.matches.find(m => m.id === lowerMatch.id);
          if (matchEntry) {
            matchEntry.player2Id = loser.id;
            matchEntry.status = 'scheduled';
          }
        }
      }
    } 
    else if (completedMatch.bracket === 'lower') {
      // Winner advances in lower bracket
      const currentRound = completedMatch.round;
      const nextRound = currentRound + 1;
      
      // Find the next match in lower bracket
      const nextMatches = tournament.brackets.filter(
        b => b.bracket === 'lower' && b.round === nextRound
      );
      
      if (nextMatches.length > 0) {
        // Determine position in next round
        const matchesInCurrentRound = tournament.brackets.filter(
          b => b.bracket === 'lower' && b.round === currentRound
        );
        
        const indexInCurrentRound = matchesInCurrentRound.findIndex(m => m.id === completedMatch.id);
        const positionInNextRound = Math.floor(indexInCurrentRound / 2);
        
        const nextMatch = nextMatches[positionInNextRound];
        
        if (!nextMatch.player1) {
          nextMatch.player1 = winner;
          
          // Update the match entry
          const matchEntry = tournament.matches.find(m => m.id === nextMatch.id);
          if (matchEntry) {
            matchEntry.player1Id = winner.id;
            matchEntry.status = nextMatch.player2 ? 'scheduled' : 'pending';
          }
        } else {
          nextMatch.player2 = winner;
          
          // Update the match entry
          const matchEntry = tournament.matches.find(m => m.id === nextMatch.id);
          if (matchEntry) {
            matchEntry.player2Id = winner.id;
            matchEntry.status = 'scheduled';
          }
        }
      } else {
        // Winner reached the end of lower bracket, advance to grand finals
        const grandFinals = tournament.brackets.find(b => b.bracket === 'grand' && b.round === 1);
        if (grandFinals) {
          grandFinals.player2 = winner;
          
          // Update the match entry
          const matchEntry = tournament.matches.find(m => m.id === grandFinals.id);
          if (matchEntry) {
            matchEntry.player2Id = winner.id;
            matchEntry.status = grandFinals.player1 ? 'scheduled' : 'pending';
          }
        }
      }
      
      // Loser is eliminated
    }
    else if (completedMatch.bracket === 'grand') {
      // Check if this is the first or potential second grand final
      if (completedMatch.round === 1) {
        const upperBracketWinner = completedMatch.player1;
        const lowerBracketWinner = completedMatch.player2;
        
        // If lower bracket player won, we need a second grand final
        if (completedMatch.winnerId === lowerBracketWinner.id) {
          // Set up the second grand final
          const secondGrandFinal = tournament.brackets.find(b => b.bracket === 'grand' && b.round === 2);
          if (secondGrandFinal) {
            secondGrandFinal.player1 = upperBracketWinner;
            secondGrandFinal.player2 = lowerBracketWinner;
            secondGrandFinal.conditional = false; // No longer conditional
            
            // Update the match entry
            const matchEntry = tournament.matches.find(m => m.id === secondGrandFinal.id);
            if (matchEntry) {
              matchEntry.player1Id = upperBracketWinner.id;
              matchEntry.player2Id = lowerBracketWinner.id;
              matchEntry.status = 'scheduled';
              matchEntry.conditional = false;
            }
          }
        }
        // Otherwise upper bracket winner is the tournament winner
      }
      // If this is the second grand final, winner is the tournament winner
    }
  }
}

// Helper function to update standings for round robin tournaments
function updateStandings(tournament) {
  // Create a map to track wins and losses
  const standings = new Map();
  
  // Initialize standings for all participants
  tournament.participants.forEach(participant => {
    standings.set(participant.id, {
      participant,
      wins: 0,
      losses: 0,
      points: 0
    });
  });
  
  // Update standings based on completed matches
  tournament.matches.forEach(match => {
    if (match.status === 'completed') {
      const winner = standings.get(match.winnerId);
      const loserId = match.player1Id === match.winnerId ? match.player2Id : match.player1Id;
      const loser = standings.get(loserId);
      
      if (winner) {
        winner.wins += 1;
        winner.points += 3; // 3 points for a win
      }
      
      if (loser) {
        loser.losses += 1;
        loser.points += 0; // 0 points for a loss
      }
    }
  });
  
  // Store standings in tournament object
  tournament.standings = Array.from(standings.values())
    .sort((a, b) => b.points - a.points || b.wins - a.wins);
}

// Helper function to check if tournament is completed
function checkTournamentCompletion(tournament) {
  // Check if all matches are completed
  const allMatchesCompleted = tournament.matches.every(match => 
    match.status === 'completed' || (match.conditional === true)
  );
  
  if (allMatchesCompleted) {
    tournament.status = 'completed';
    
    // Determine the tournament winner
    if (tournament.format === 'single_elimination') {
      // Get the final match
      const finalMatch = tournament.matches.reduce((latest, match) => {
        if (!latest || match.round > latest.round) {
          return match;
        }
        return latest;
      }, null);
      
      if (finalMatch && finalMatch.winnerId) {
        tournament.winner = tournament.participants.find(p => p.id === finalMatch.winnerId);
      }
    } 
    else if (tournament.format === 'double_elimination') {
      // Check if there was a second grand final
      const secondGrandFinal = tournament.matches.find(m => 
        m.bracket === 'grand' && m.round === 2 && m.status === 'completed'
      );
      
      if (secondGrandFinal) {
        tournament.winner = tournament.participants.find(p => p.id === secondGrandFinal.winnerId);
      } else {
        // Get the first grand final
        const grandFinal = tournament.matches.find(m => 
          m.bracket === 'grand' && m.round === 1 && m.status === 'completed'
        );
        
        if (grandFinal) {
          tournament.winner = tournament.participants.find(p => p.id === grandFinal.winnerId);
        }
      }
    } 
    else if (tournament.format === 'round_robin') {
      // Winner is the participant with the most points/wins
      if (tournament.standings && tournament.standings.length > 0) {
        tournament.winner = tournament.standings[0].participant;
      }
    }
  }
}

// Get tournament standings
app.get('/api/tournaments/:id/standings', (req, res) => {
  const tournamentId = req.params.id;
  
  console.log(`GET /api/tournaments/${tournamentId}/standings - Getting tournament standings`);
  
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) {
    return res.status(404).json({ message: 'Tournament not found' });
  }
  
  if (tournament.format === 'round_robin') {
    if (!tournament.standings) {
      updateStandings(tournament);
    }
    
    res.json({
      tournamentId: tournament.id,
      format: tournament.format,
      standings: tournament.standings
    });
  } else {
    // For elimination formats, return the brackets/matches info
    const completedMatches = tournament.matches.filter(m => m.status === 'completed');
    
    res.json({
      tournamentId: tournament.id,
      format: tournament.format,
      matchesCompleted: completedMatches.length,
      totalMatches: tournament.matches.filter(m => !m.conditional).length,
      status: tournament.status,
      winner: tournament.winner || null
    });
  }
});

// Fallback route for any other requests
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.url}`);
  res.status(404).send('404 - Page Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('500 - Internal Server Error');
});

// Start the server
const PORT = process.env.PORT || 3000; // Using port 3000
try {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the website`);
    
    // List all available network interfaces
    const networkInterfaces = require('os').networkInterfaces();
    console.log('Available network interfaces:');
    for (const name of Object.keys(networkInterfaces)) {
      for (const net of networkInterfaces[name]) {
        // Skip over non-IPv4 and internal (loopback) addresses
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`  - ${name}: ${net.address}`);
        }
      }
    }
  });
  
  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Try a different port.`);
    } else {
      console.error('Server error:', error);
    }
  });
} catch (error) {
  console.error('Error starting server:', error);
}