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
  const { id_num } = req.body;

  try {
    const result = await pool.query('SELECT*FROM patient_details WHERE id_num = $1', [id_num]);
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

app.post('/user_details', async (req, res) => {
  const { id_num } = req.body;
  try{
    const result = await pool.query('SELECT first_name FROM patient_details WHERE id_num = $1', [id_num]);
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).send('Server error');
  }

});

// Handle form submission
app.post('/submit', (req, res) => {
  console.log('Form submitted successfully');
  const { id_num, first_name, last_name, email, diagnosis } = req.body;
  const default_password = "aaaaaaa";
  // if (!username || !email || !password) {
  //   return res.status(400).send('All fields are required');
  // }

  const query = 'INSERT INTO patient_details (id_num, first_name, last_name, email, diagnosis, password) VALUES ($1, $2, $3, $4, $5, $6)';
  const values = [id_num, first_name, last_name, email, diagnosis, default_password];

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
