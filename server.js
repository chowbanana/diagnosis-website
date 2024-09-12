const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Create a new express application
const app = express();

// Set up body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'badly-beautified-walrus.data-1.use1.tembo.io',
  database: 'postgres',
  password: 'VJeLLrpBPsRo7lqH',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// To get all the other HTML files
app.get('/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(__dirname + '/public/' + page);
});

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public' + '/index.html');
});

app.post('/login', async (req, res) => {
  const id = req.body.id_num;
  const id_num = {id_num : id};

  try {
    const result = await pool.query('SELECT*FROM patient_details WHERE id_num = $1', [id]);
    if (result.rows.length > 0){
      // const token = jwt.sign(id_num, process.env.ACCESS_TOKEN_SECRET);
      // console.log(token);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).send('Server error');
  }
})

app.post('/api/user_details', async (req, res) => {
  const { id_num } = req.body;
  try{
    const result = await pool.query('SELECT first_name, last_name FROM patient_details WHERE id_num = $1', [id_num]);
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

app.post('/api/user_diagnosis', async (req, res) => {
  const { id_num } = req.body;
  try{
    const result = await pool.query('SELECT diagnosis FROM patient_details WHERE id_num = $1', [id_num]);
    if (result.rows.length > 0) {
      res.json({ success: true, diagnosis: result.rows[0] });
    } else {
      res.json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).send('Server error');
  }

});

app.post('/add_comment', (req, res) => {
  const {first_name, last_name, comment} = req.body;
  const add = 'INSERT INTO patient_comments (first_name, last_name, comment) VALUES ($1, $2, $3)';
  const values = [first_name, last_name, comment];

  pool.query(add, values, (error, result) => {
    if (error) {
      console.error('Error executing query', error.stack);
      res.status(500).send('Error saving data');
    } else {
      console.log('Query result:', result);
    }
  });
});

app.get('/api/patient_comments', async (req,res) => {
  try {
    const display = await pool.query('SELECT * FROM patient_comments');
    res.json(display.rows);
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).send('Server error');
  }
});

app.post('/api/maneuver_video', async (req, res) => {
  const { id_num } = req.body;
  try {
    const result = await pool.query('SELECT maneuver FROM patient_details WHERE id_num = $1', [id_num]);
    if (result.rows.length > 0) {
      res.json({success: true, maneuver: result.rows[0].maneuver, message: 'Video found'});
    } else{
      res.json({success: false, message: 'No video found'});
    }
  } catch (error) {
    console.error('Error execusting query', error.stack);
    res.status(500).send('Server error');
  }
})

// Handle form submission
app.post('/submit', (req, res) => {
  const { id_num, first_name, last_name, email, symptoms, diagnosis, maneuver, advice } = req.body;
  const default_password = "aaaaaaa";

  const query = 'INSERT INTO patient_details (id_num, first_name, last_name, email, symptoms, diagnosis, maneuver, advice, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
  const values = [id_num, first_name, last_name, email, symptoms, diagnosis, maneuver, advice, default_password];
  console.log(values);

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error executing query', error.stack);
      res.status(500).send('Error saving data');
    } else {
      console.log('Query result:', result);
      res.status(0).send('Data saved successfully. Please have patient login with their provided ID number.');
    }
  });
});

app.use('/videos', express.static('videos'));
app.use(express.static(__dirname + '/public'));

// Start the server
const port = process.env.PORT || 5500;
// const port = 5500;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
