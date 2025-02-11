const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const crypto = require('crypto');

app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(express.urlencoded({ extended: true }));

// Users array
let users = [];
// Exercises array
let exercises = [];
// Log array
let log = [];

// Post user endpoint
app.post('/api/users', (req, res) => {
  // Get username from form
  const { username } = req.body;
  // Check if username already exists
  if (users.some(user => user.username === username)){
    res.json({'error': 'User already exists'});
  // Create a new user
  } else {
    // Generate a user id
    const userId = `${crypto.randomBytes(8).toString('hex')}`;
    // Create a user object
    const newUser = {'username': username, '_id': userId};
    // Add new user to users array
    users.push(newUser);
    // Add user to log
    const newLog = {
      'username': username,
      'count': 0,
      '_id': userId,
      'log':[]
    };
    log.push(newLog);
    // Response JSON with new user added
    res.json(newUser);
  }

});
// Get users endpoint
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Post exercises endpoint
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const username = users.find(user => user._id === _id).username;
  if (username) {
    const { description, duration, date } = req.body;
    const exerciseDuration = parseInt(duration)
    const exerciseDate = date ? new Date(date).toDateString(): new Date().toDateString();
    const newExercise = { 
      'username': username,
      'description': description, 
      'duration': exerciseDuration, 
      'date': exerciseDate,
      'id': _id
    };
    exercises.push(newExercise);
    const newLog = {
      'description': description, 
      'duration': exerciseDuration, 
      'date': exerciseDate
    }
    const userLog = log.find(user => user._id === _id);
    userLog.log.push(newLog);
    userLog.count++;
    res.json({
      '_id': _id,
      'username': username,
      'date': exerciseDate,
      'duration': exerciseDuration,
      'description': description
    })
  } else {
    res.json({'error': 'user not found'});
  }
  
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
