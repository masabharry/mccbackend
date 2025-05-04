const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("DB Connection Error:", err));

// Player Schema
const playerSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  teamId: Number,
  photoUrl: String,
  stats: {
    t10: { scores: Number, wickets: Number, fifties: Number, centuries: Number, hatricks: Number, matches: Number },
    t15: { scores: Number, wickets: Number, fifties: Number, centuries: Number, hatricks: Number, matches: Number },
    t6:  { scores: Number, wickets: Number, fifties: Number, centuries: Number, hatricks: Number, matches: Number }
  },
  totalBallsPlayed: Number,
  totalBallsBowled: Number,
  totalFours: Number,
  totalSixes: Number,
});

const Player = mongoose.model('Player', playerSchema);

// Get all players route
app.get('/players', async (req, res) => {
  try {
    const players = await Player.find(); // Get all players from the database
    res.json(players); // Return the players as a JSON response
    console.log(players)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register Route
app.post('/register', async (req, res) => {
  const { name, username, password, teamId } = req.body;

  try {
    const player = new Player({
      name,
      username,
      password,  
      teamId,
      stats: { t10: {}, t15: {}, t6: {} },
      totalBallsPlayed: 0,
      totalBallsBowled: 0,
      totalFours: 0,
      totalSixes: 0,
    });
    await player.save();
    res.status(201).send("Player registered");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login Route (plain password comparison)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username, password);

  const player = await Player.findOne({ username });
  if (!player) {
    console.log('User not found');
    return res.status(404).send("User not found");
  }

  // Compare password directly without bcrypt for now
  if (player.password !== password) {
    console.log('Incorrect password');
    return res.status(401).send("Incorrect password");
  }

  res.json({ message: "Login successful",
     playerId: player._id,
     playerName: player.name,
     playerPhoto: player.photoUrl,
     teamId: player.teamId,
     stats: player.stats,
     totalBallsPlayed: player.totalBallsPlayed,
     totalBallsBowled: player.totalBallsBowled,
     totalFours: player.totalFours,
     totalSixes: player.totalSixes
    });

});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
