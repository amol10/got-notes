var sqlite3 = require('sqlite3');
var express = require('express');
var path = require('path');

var app = express();
const port = 3000;

var db = new sqlite3.Database('terms.db');

function save(term, type) {
    db.serialize(() => {
        var stmt = db.prepare("INSERT INTO terms VALUES (?, ?);");
        stmt.run(term, type);
        stmt.finalize();
    });
}

app.get('/term/add/:term/:type', (req, res) => {
    console.log("term: ", req.params.term);
    save(req.params.term, req.params.type);
    res.send("OK");
});

app.get('/term/get/:term/', (req, res) => {
    console.log("get term: ", req.params.term);
    var terms = {};
    function send() {
        console.log(terms);
        res.send(terms);
    }
    //db.serialize(() => {
        db.each("SELECT * FROM terms WHERE term like \"%" + req.params.term.trim() + "%\";", (err, row) => {
            console.log(row.term);
            terms[row.term] = row.type;
            send();
        })
    //});
    
});

app.get('/term/getall/', (req, res) => {
    console.log("term: ", req.params.term);
    var terms = {};
    function send() {
        console.log(terms);
        res.send(terms);
    }
    //db.serialize(() => {
        db.all("SELECT * FROM terms;", (err, rows) => {
            for (var i = 0; i < rows.length; i++) {
                console.log(rows[i].term);
                terms[rows[i].term] = rows[i].type;
            }
            send();
        })
    //});
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/*
terms: add, get, getall
*/

app.listen(port, () => {
    console.log("listening...");
});