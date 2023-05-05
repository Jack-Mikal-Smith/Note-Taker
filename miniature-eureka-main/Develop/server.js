const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uniqid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', function(err, data) {
        res.send(data);
    })
});

app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', function(err, data) {
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuid();
        notes.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(notes), function(err, data) {
            res.json(newNote);
        })
    })
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', function(err, data) {
        const notes = JSON.parse(data);
        let newNotes = notes.filter(note => note.id !== req.params.id)

        fs.writeFile('./db/db.json', JSON.stringify(newNotes), function(err, data) {
            res.json(newNotes);
        })
    })
});


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
    console.log('App listening at http://localhost:${PORT}')
);