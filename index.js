const express = require('express');
const app = express();
const fs = require('fs');
const router = express.Router();

app.use(express.json());  // To parse JSON bodies

// 1. Serve home.html file
router.get('/home', (req, res) => {
  res.sendFile(__dirname + '/home.html');
});

// 2. Serve user.json file as JSON
router.get('/profile', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Error reading user file' });
    } else {
      res.json(JSON.parse(data));  
    }
  });
});

// 3. POST route for /login, validate username and password from user.json
router.post('/login', (req, res) => {
  const { username, password } = req.body;  // Extract username and password from request body
  console.log('Request Body:', req.body);
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading user file' });
    }

    const userData = JSON.parse(data);  // Parse the user data from the file
    console.log('User Data:', userData); 
    // Validate username
    if (username !== userData.username) {
      return res.json({ status: false, message: 'User Name is invalid' });
    }

    // Validate password
    if (password !== userData.password) {
      return res.json({ status: false, message: 'Password is invalid' });
    }

    // If both username and password are valid
    res.json({ status: true, message: 'User Is valid' });
  });
});

// 4. GET route for /logout, accept username as query parameter
router.get('/logout', (req, res) => {
  const { username } = req.query;  // Extract the username from query string (e.g., /logout?username=johndoe)

  if (username) {
    res.send(`<b>${username} successfully logged out.</b>`);
  } else {
    res.send('<b>Username is required to logout.</b>');
  }
});

// 5. Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log the error for debugging
  res.status(500).send('Server Error');  // Send the "Server Error" message to the client
});

// Use the router for all routes
app.use('/', router);

// Start the server on port 8082
app.listen(process.env.port || 8082, () => {
  console.log('Web Server is listening at port ' + (process.env.port || 8081));
});
