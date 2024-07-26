const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

// Create a new express application
const app = express();

// Set up body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'form_database',
  password: 'iloveestonia',
  port: 5432,
});

// To get all the other HTML files
app.get('/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(__dirname + '/public/' + page);
});

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public' + '/login.html');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT*FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0){
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).send('Server error');
  }
})

// Handle form submission
app.post('/submit', (req, res) => {
  console.log('Form submitted successfully');
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  const query = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)';
  const values = [username, password, email];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error executing query', error.stack);
      res.status(500).send('Error saving data');
    } else {
      console.log('Query result:', result);
      res.redirect('/dashboard.html');
    }
  });
});

// Start the server
const port = 5500;
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}/`);
});
