let express = require('express');
let router = express.Router();
let multer = require('multer');
let upload = multer({ dest: './public/images/portfolio' });
let mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'portfolio'
});

connection.connect();

router.get('/', (req, res, next) => {
    connection.query("SELECT * FROM projects", (err, rows, fields) => {
    	if (err) throw err;
    	res.render('admin/index', {
    		"projects": rows
    	});
    });
});

router.get('/add', (req, res, next) => {
    res.render('admin/add')
});

router.post('/add', upload.single('projectimage'), (req, res, next) => {
  // Get Form Values
  let title = req.body.title;
  let description = req.body.description;
  let service = req.body.service;
  let url = req.body.url;
  let client = req.body.client;
  let projectdate = req.body.projectdate;

  // Check Image Upload
  if (req.file) var projectImageName = req.file.filename;
	else var projectImageName = 'noimage.jpg';

  // Form Field Validation
	req.checkBody('title', 'Title field is required').notEmpty();
	req.checkBody('service', 'Service field is required').notEmpty();

	let errors = req.validationErrors();

	if (errors) {
  res.render('admin/add', {
      errors: errors,
      title: title,
      description: description,
      service: service,
      client: client,
      url: url
    });
  } else {
    var project = {
      title: title,
      description: description,
      service: service,
      client: client,
      date: projectdate,
      url: url,
      image: projectImageName
    };
  }

  let query = connection.query('INSERT INTO projects SET ?', project, (err, result) => {
    console.log('Error: ' + err);
    console.log('Success: ' + result);
  });

  req.flash('success_msg', 'Project Added');
  res.redirect('/admin');
});

router.get('/edit/:id', (req, res, next) => {
  connection.query("SELECT * FROM projects WHERE id = ?", req.params.id, (err, rows, fields) => {
  	if (err) throw err;
  	res.render('admin/edit', {
  		"project": rows[0]
  	});
  });
});

router.post('/edit/:id', upload.single('projectimage'), (req, res, next) => {
  // Get Form Values
  let title = req.body.title;
  let description = req.body.description;
  let service = req.body.service;
  let url = req.body.url;
  let client = req.body.client;
  let projectdate = req.body.projectdate;

  // Check Image Upload
  if (req.file) var projectImageName = req.file.filename
  else var projectImageName = 'noimage.jpg';

  // Form Field Validation
	req.checkBody('title', 'Title field is required').notEmpty();
	req.checkBody('service', 'Service field is required').notEmpty();

	let errors = req.validationErrors();

	if (req.file) {
		if (errors) {
      res.render('admin/add', {
        errors: errors,
        title: title,
        description: description,
        service: service,
        client: client,
        url: url
      });
    } else {
      var project = {
        title: title,
        description: description,
        service: service,
        client: client,
        date: projectdate,
        url: url,
        image: projectImageName
      };
	  }
	} else {
		if (errors) {
	    res.render('admin/add', {
        errors: errors,
        title: title,
        description: description,
        service: service,
        client: client,
        url: url
      });
	  } else {
	    var project = {
        title: title,
        description: description,
        service: service,
        client: client,
        date: projectdate,
        url: url
      };
	  }
	}

  let query = connection.query('UPDATE projects SET ? WHERE id = ' + req.params.id, project, (err, result) => {
    console.log('Error: ' + err);
    console.log('Success: ' + result);
  });

  req.flash('success_msg', 'Project Updated');
  res.redirect('/admin');
});

router.delete('/delete/:id', (req, res) => {
  connection.query('DELETE FROM Projects WHERE id = ' + req.params.id, (err, result) => {
    if (err) throw err;
      console.log('deleted ' + result.affectedRows + ' rows');
  });
    req.flash('success_msg', 'Project Deleted');
    res.sendStatus(200);
});

module.exports = router;
