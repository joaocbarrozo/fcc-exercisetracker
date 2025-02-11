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

// Create user endpoint
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
    // Response JSON with new user added
    res.json(newUser);
  }

});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
