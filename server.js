var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require('express-session');
var cookieParser = require('cookie-parser');

var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'rohtih',
    password: 'Kanchi1620',
    database: 'kanchi',
    port: '3306'
});

con.connect(function (err) {
    //if (err) throw err;
    console.log("connected");
    console.log(err);
})

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload.array());
app.use(cookieParser());

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/form', function (req, res) {
    res.render('form');
});

app.post('/form2', function (req, res, err) {
    console.log(req.body.name);

    console.log(err);

    con.query("INSERT INTO userdetails(name, email, contact) VALUES ('" + req.body.name + "','" + req.body.email + "','" + req.body.contact + "')", function (err, result) {
        // if (err) throw err;
        console.log(err);
    });
    res.render('form');
});

app.get('/admin', function (req, res) {
    res.render('admin');
});

app.post('/admin2', function (req, res) {
    var users = [];

    if (!req.body.name || !req.body.password) {
        res.status("400");
        res.send("Invalid details!");
    }
    else {
        con.query("select * from admin", function (err, result) {

            var name2 = result[0].name;
            var pass2 = result[0].password;
            if (name2 == req.body.name && pass2 == req.body.password) {
                con.query("SELECT * FROM userdetails", function (err, result) {
                    var l = result.length;
                    for (var i = 0; i < l; i++) {
                        var use = {
                            "name": result[i].name,
                            "email":result[i].email,
                            "contact": result[i].contact,
                            "time": result[i].time
                        }
                    }

                })
                res.render('result', {users : users}
                );
            }
            else {
                res.render('admin', { message: "Invalid credentials!" });
            }
        });

    }
});

app.get('/result', function (err, req, res, next) {
    console.log(err);
    //User should be authenticated! Redirect him to log in.
    res.redirect('/admin');
});

app.listen(3000);