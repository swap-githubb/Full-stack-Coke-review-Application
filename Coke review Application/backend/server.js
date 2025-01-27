const path = require('path');
const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');

const server = express();

server.use(cors());
server.use(express.json());


// server.use("/public", express.static(__dirname + "/public"));
// server.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

// Serve static files from frontend folder
server.use(express.static(path.join(__dirname, '../frontend')));

// Route for root URL
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const pool  = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Shiv@1234',
    database: 'coke_poll',
});

pool.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Result:', results);
    }
  });



server.get('/flavors',(req, res) => {
    pool.query('SELECT * FROM flavors', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Database query failed', details: err.message });
            return;
        }

        const formattedResults = results.map(row => ({
            name: row.flavor,
            y: row.votes
        }));

        res.json(formattedResults);
    });
});

server.post('/poll', (req, res) => {
    console.log('Request body:', req.body);

    const { flavor } = req.body;

    if (!flavor) {
        res.status(400).json({ error: 'Flavor is required'});
        return;
    }

    pool.query('SELECT id FROM flavors WHERE flavor = ?', [flavor], (err, results) => {
        if (err) {
            console.error('Error fetching flavor ID: ', err);
            res.status(500).json({ error: 'Database query failed' });
            return;
        }

        if (results.length == 0) {
            res.status(400).json({ error: 'Invalid flavor selected' });
            return;
        }
        
        const flavorId = results[0].id;

        pool.query('INSERT INTO poll_results (flavor_id) VALUES (?)', [flavorId], (errs) => {
            if (errs) {
                console.error('Error inserting data: ', err);
                res.status(500).json({ error: 'Database insertion failed' });
                return;
            }
            
            pool.query('UPDATE flavors SET votes = votes + 1 WHERE id = ?', [flavorId], (err) => {
                if (err) {
                    console.error('Error updating flavor votes: ', err);
                    res.status(500).json({ error: 'Failed to update flavor votes' });
                    return;
                }

                //Success message
                res.json({ message: 'Vote recoded and flavor votes updated!', id: results.insertId });
            });
        });
    });
});

server.post('/review',(req,res)=>{
     
    const {review}=req.body;

    if(!review){
        res.status(400).json({error:'Review is required'});
        return;
    }

    pool.query('INSERT INTO all_reviews (review) VALUES (?)',[review],(err,results)=>{
        if(err){
            console.error('Error inserting data:',err);
            res.status(500).json({error:'Database insertion failed'});
            return;
        }
        res.json({message:'Review recorded',id:results.insertId});
    });
});


const PORT = 3000;
server.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
});