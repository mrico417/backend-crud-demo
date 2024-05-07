// imports here for express and pg

const express = require('express');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL || 'pstgres://localhost/the_acme_notes_db');

const app = express();

app.use(express.json());
app.use(require('morgan')('dev'));
// static routes here (you only need these for deployment)

// app routes here

app.post('/api/notes', async (req, res, next) => {
    try {
        const insertSQL = `
        INSERT INTO notes(txt,ranking) VALUES($1,$2) 
        RETURNING *
        ; `;

        const response = await client.query(insertSQL, [req.body.txt, req.body.ranking]);
        res.send(response.rows[0]);

    } catch (error) {
        next(error);
    }
});
app.get('/api/notes', async (req, res, next) => {
    try {
        const selectSQL = `
        SELECT * FROM notes 
        ORDER BY created_at DESC
        ;`;
        
        const response = await client.query(selectSQL);
        res.send(response.rows);

    } catch (error) {
        next(error);
    }
});
app.put('/api/notes/:id', async (req, res, next) => {
    try {
        const updateSQL = `
        UPDATE notes
        SET txt=$1, rankding=$2, updated_at=now()
        WHERE id=$3
        RETURNING *
        ;`;

        const response = await client.query(updateSQL, [req.body.txt, req.body.rankding, req.params.id]);
        res.send(response.rows[0]);
    } catch (error) {
        next(error);
    }
});
app.delete('/api/notes/:id', async (req, res, next) => {
    try {
        const deleteSQL = `
        DELETE FROM notes 
        WHERE id = $1
        ;`;

        const response = await client.query(deleteSQL, [req.params.id]);
        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
});

// create your init function
const init = async () => {

    try {
        await client.connect();
        const SQL = `
            DROP TABLE IF EXISTS notes;
            CREATE TABLE notes(
                id SERIAL PRIMARY KEY,
                txt VARCHAR(255),
                ranking INTEGER DEFAULT 3 NOT NULL,
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now() 
            );

            INSERT INTO notes(txt,ranking) VALUES('Lear Fullstack Dev', 1);
            INSERT INTO notes(txt,ranking) VALUES('Write SQL Queries', 2);
            INSERT INTO notes(txt,ranking) VALUES('Create Routes', 3);
        `;
        const response = await client.query(SQL);
        console.log("Database created and loaded with dummy rows!");
    
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, ()=> console.log(`Listening on ${PORT}`));
        
    } catch (error) {
        console.log(error);
        next(error);
    }

};

init();// init function invocation
