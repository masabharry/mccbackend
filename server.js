const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("DB Connection Error:", err));

// Player Schema
const playerSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    unique: true,
  },
  password: String,
  teamId: {
    type: Number,
    required: true,
  },
  photoUrl: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "guest",
  }, // Default role to 'guest'
  stats: {
    t10: {
      scores: {
        type: Number,
        default: 0,
      },
      wickets: {
        type: Number,
        default: 0,
      },
      fifties: {
        type: Number,
        default: 0,
      },
      centuries: {
        type: Number,
        default: 0,
      },
      hatricks: {
        type: Number,
        default: 0,
      },
      matches: {
        type: Number,
        default: 0,
      },
      bowledmatches: {
        type: Number,
        default: 0,
      },
      hsr: {
        type: Number,
        default: 0,
      }, // Highest Score
      hsw: {
        type: Number,
        default: 0,
      }, // Highest Wicket
      four: {
        type: Number,
        default: 0,
      }, // Fours
      six: {
        type: Number,
        default: 0,
      }, // Sixes
      totalBallsPlayed: {
        type: Number,
        default: 0,
      },
      totalBallsBowled: {
        type: Number,
        default: 0,
      },
      runconceded: {
        type: Number,
        default: 0,
      },
      overbowled: {
        type: Number,
        default: 0,
      },
    },
    t15: {
      scores: {
        type: Number,
        default: 0,
      },
      wickets: {
        type: Number,
        default: 0,
      },
      fifties: {
        type: Number,
        default: 0,
      },
      centuries: {
        type: Number,
        default: 0,
      },
      hatricks: {
        type: Number,
        default: 0,
      },
      matches: {
        type: Number,
        default: 0,
      },
      bowledmatches: {
        type: Number,
        default: 0,
      },
      hsr: {
        type: Number,
        default: 0,
      }, // Highest Score
      hsw: {
        type: Number,
        default: 0,
      }, // Highest Wicket
      four: {
        type: Number,
        default: 0,
      }, // Fours
      six: {
        type: Number,
        default: 0,
      }, // Sixes
      totalBallsPlayed: {
        type: Number,
        default: 0,
      },
      totalBallsBowled: {
        type: Number,
        default: 0,
      },
      runconceded: {
        type: Number,
        default: 0,
      },
      overbowled: {
        type: Number,
        default: 0,
      },
    },
    t6: {
      scores: {
        type: Number,
        default: 0,
      },
      wickets: {
        type: Number,
        default: 0,
      },
      fifties: {
        type: Number,
        default: 0,
      },
      centuries: {
        type: Number,
        default: 0,
      },
      hatricks: {
        type: Number,
        default: 0,
      },
      matches: {
        type: Number,
        default: 0,
      },
      bowledmatches: {
        type: Number,
        default: 0,
      },
      hsr: {
        type: Number,
        default: 0,
      }, // Highest Score
      hsw: {
        type: Number,
        default: 0,
      }, // Highest Wicket
      four: {
        type: Number,
        default: 0,
      }, // Fours
      six: {
        type: Number,
        default: 0,
      }, // Sixes
      totalBallsPlayed: {
        type: Number,
        default: 0,
      },
      totalBallsBowled: {
        type: Number,
        default: 0,
      },
      runconceded: {
        type: Number,
        default: 0,
      },
      overbowled: {
        type: Number,
        default: 0,
      },
    },
  },
});

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  teamId: {
    type: Number,
    required: true,
    unique: true, 
  },
  emoji: {
    type: String,
    required: true,
    
  },
  states: {
    t10: {
      totalMtachPlayed: Number,
      totalWin: Number,
      overfaced: Number,
      runscored: Number,
    },
    t15: {
      totalMtachPlayed: Number,
      totalWin: Number,
      overfaced: Number,
      runscored: Number,
    },
    t6: {
      totalMtachPlayed: Number,
      totalWin: Number,
      overfaced: Number,
      runscored: Number,
    },
  },
});

const Player = mongoose.model("Player", playerSchema);
const Team = mongoose.model("Team", teamSchema);

// Get all players route
app.get("/players", async (req, res) => {
  try {
    const players = await Player.find(); // Get all players from the database
    res.json(players); // Return the players as a JSON response
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/teams", async (req, res) => {
  try {
    const teams = await Team.find(); // Get all unique team IDs from the database
    res.json(teams); // Return the teams as a JSON response
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Register Route
app.post("/register", async (req, res) => {
  const {
    name,
    username,
    password,
    teamId,
    photoUrl = "",
    stats,
    role = "guest",
  } = req.body;
  try {
    const player = new Player({
      name,
      username,
      password,
      role: role || "guest", // Default role to 'guest' if not provided,
      teamId,
      photoUrl,
      stats,
    });
    if (!name || !username || !password || !teamId) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Save the new player
    await player.save();
    res.status(201).send("Player registered");
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});


// Team Registration Route
app.post("/teamregister", async (req, res) => {
  const {
    teamName,
    teamId,
    emoji,
    states
  } = req.body;
  try {
    const team = new Team({
      teamName,
      teamId,
      emoji,
      states
    });
    if (!teamName || !teamId || !emoji ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Save the new team
    await team.save();
    res.status(201).send("Team registered");
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

    

// Login Route (plain password comparison)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const player = await Player.findOne({
    username,
  });
  if (!player) {
    return res.status(404).send("User not found");
  }

  // Compare password directly without bcrypt for now
  if (player.password !== password) {
    return res.status(401).send("Incorrect password");
  }

  res.json({
    message: "Login successful",
    playerId: player._id,
    playerName: player.name,
    playerPhoto: player.photoUrl,
    teamId: player.teamId,
    stats: player.stats,
  });
});

// PATCH: Add stats
app.patch("/players/:id/add-stats", async (req, res) => {
  const { id } = req.params;
  const {
    t10_scores = 0,
    t10_wickets = 0,
    t10_matches = 0,
    t10_fifties = 0,
    t10_centuries = 0,
    t10_hatricks = 0,
    t10_hsr = 0,
    t10_hsw = 0,
    t10_four = 0,
    t10_six = 0,
    t10_bowledmatches = 0,
    t10_totalBallsPlayed = 0,
    t10_totalBallsBowled = 0,
    t10_runconceded = 0,
    t10_overbowled = 0,
    t15_scores = 0,
    t15_wickets = 0,
    t15_matches = 0,
    t15_fifties = 0,
    t15_centuries = 0,
    t15_hatricks = 0,
    t15_hsr = 0,
    t15_hsw = 0,
    t15_four = 0,
    t15_six = 0,
    t15_bowledmatches = 0,
    t15_totalBallsPlayed = 0,
    t15_totalBallsBowled = 0,
    t15_runconceded = 0,
    t15_overbowled = 0,
    t6_scores = 0,
    t6_wickets = 0,
    t6_matches = 0,
    t6_fifties = 0,
    t6_centuries = 0,
    t6_hatricks = 0,
    t6_hsr = 0,
    t6_hsw = 0,
    t6_four = 0,
    t6_six = 0,
    t6_bowledmatches = 0,
    t6_totalBallsPlayed = 0,
    t6_totalBallsBowled = 0,
    t6_runconceded = 0,
    t6_overbowled = 0,
  } = req.body;
  const player = await Player.findById(id);
  if (!player) return res.status(404).send("Player not found");

  // Example: Adding to T10 stats only
  player.stats.t10.scores += +t10_scores;
  player.stats.t10.wickets += +t10_wickets;
  player.stats.t10.matches += +t10_matches;
  player.stats.t10.fifties += +t10_fifties;
  player.stats.t10.centuries += +t10_centuries;
  player.stats.t10.hatricks += +t10_hatricks;
  player.stats.t10.hsr = +t10_hsr;
  player.stats.t10.hsw = +t10_hsw;
  player.stats.t10.four += +t10_four;
  player.stats.t10.six += +t10_six;
  player.stats.t10.bowledmatches += +t10_bowledmatches;
  player.stats.t10.totalBallsPlayed += +t10_totalBallsPlayed;
  player.stats.t10.totalBallsBowled += +t10_totalBallsBowled;
  player.stats.t10.runconceded += +t10_runconceded;
  player.stats.t10.overbowled += +t10_overbowled;
  player.stats.t15.scores += +t15_scores;
  player.stats.t15.wickets += +t15_wickets;
  player.stats.t15.matches += +t15_matches;
  player.stats.t15.fifties += +t15_fifties;
  player.stats.t15.centuries += +t15_centuries;
  player.stats.t15.hatricks += +t15_hatricks;
  player.stats.t15.hsr = +t15_hsr;
  player.stats.t15.hsw = +t15_hsw;
  player.stats.t15.four += +t15_four;
  player.stats.t15.six += +t15_six;
  player.stats.t15.bowledmatches += +t15_bowledmatches;
  player.stats.t15.totalBallsPlayed += +t15_totalBallsPlayed;
  player.stats.t15.totalBallsBowled += +t15_totalBallsBowled;
  player.stats.t15.runconceded += +t15_runconceded;
  player.stats.t15.overbowled += +t15_overbowled;
  player.stats.t6.scores += +t6_scores;
  player.stats.t6.wickets += +t6_wickets;
  player.stats.t6.matches += +t6_matches;
  player.stats.t6.fifties += +t6_fifties;
  player.stats.t6.centuries += +t6_centuries;
  player.stats.t6.hatricks += +t6_hatricks;
  player.stats.t6.hsr = +t6_hsr;
  player.stats.t6.hsw = +t6_hsw;
  player.stats.t6.four += +t6_four;
  player.stats.t6.six += +t6_six;
  player.stats.t6.bowledmatches += +t6_bowledmatches;
  player.stats.t6.totalBallsPlayed += +t6_totalBallsPlayed;
  player.stats.t6.totalBallsBowled += +t6_totalBallsBowled;
  player.stats.t6.runconceded += +t6_runconceded;
  player.stats.t6.overbowled += +t6_overbowled;
  await player.save();
  res.send("Stats updated");
});

// PATCH: Update info
app.patch("/players/:id/update-info", async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  await Player.findByIdAndUpdate(id, update);
  res.send("Player info updated");
});

// PATCH: Reset player
app.patch("/players/:id/reset", async (req, res) => {
  await Player.findByIdAndUpdate(req.params.id, {
    name: "",
    username: "",
    password: "",
    teamId: 0,
    photoUrl: "",
    stats: {
      t10: {},
      t15: {},
      t6: {},
    },
    
  });
  res.send("Player reset");
});

// DELETE: Remove player
app.delete("/players/:id", async (req, res) => {
  await Player.findByIdAndDelete(req.params.id);
  res.send("Player deleted");
});

// Team CRUD
// PATCH: Add stats
app.patch("/teams/:id/add-stats", async (req, res) => {
  const { id } = req.params;
  const {
    t10_totalMtachPlayed = 0,
    t10_totalWin = 0,
    t10_overfaced = 0,
    t10_runscored = 0,
    t15_totalMtachPlayed = 0,
    t15_totalWin = 0,
    t15_overfaced = 0,
    t15_runscored = 0,
    t6_totalMtachPlayed = 0,
    t6_totalWin = 0,
    t6_overfaced = 0,
    t6_runscored = 0
  } = req.body;
  const team = await Team.findById(id);
  if (!team) return res.status(404).send("Team not found");
  team.states.t10.totalMtachPlayed += +t10_totalMtachPlayed;
  team.states.t10.totalWin += +t10_totalWin;
  team.states.t10.overfaced += +t10_overfaced;
  team.states.t10.runscored += +t10_runscored;
  team.states.t15.totalMtachPlayed += +t15_totalMtachPlayed;
  team.states.t15.totalWin += +t15_totalWin;
  team.states.t15.overfaced += +t15_overfaced;
  team.states.t15.runscored += +t15_runscored;
  team.states.t6.totalMtachPlayed += +t6_totalMtachPlayed;
  team.states.t6.totalWin += +t6_totalWin;
  team.states.t6.overfaced += +t6_overfaced;
  team.states.t6.runscored += +t6_runscored;
  await team.save();
  res.send("Stats updated");
});

// PATCH: Update info
app.patch("/teams/:id/update-info", async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  await Team.findByIdAndUpdate(id, update);
  res.send("Team info updated");
});

// PATCH: Reset team
app.patch("/teams/:id/reset", async (req, res) => {
  await Team.findByIdAndUpdate(req.params.id, {
    teamName: "",
    teamID: 0,
    emoji: "",
    stats: {
      t10: {},
      t15: {},
      t6: {},
    },
  });
  res.send("Team reset");
});

// DELETE: Remove team
app.delete("/teams/:id", async (req, res) => {
  await Team.findByIdAndDelete(req.params.id);
  res.send("Team deleted");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
