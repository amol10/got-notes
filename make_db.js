var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('terms.db');

db.serialize(() => {
    db.run("CREATE TABLE terms (term TEXT, type VARCHAR(20))");
});
