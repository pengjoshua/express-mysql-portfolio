let express = require('express');
let router = express.Router();
let mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'portfolio'
});

connection.connect();

router.get('/', (req, res, next) => {
  connection.query('select * from projects', (err, rows, fields) => {
    if (err) throw err;
    res.render('index', {
      'projects': rows
    });
  });
});

router.get('/details/:id', (req, res, next) => {
  connection.query('select * from projects where id = ?', req.params.id, (err, rows, fields) => {
    if (err) throw err;
    res.render('details', {
      'project': rows[0]
    });
  });
});

module.exports = router;
