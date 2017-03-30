var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var http = require('http');
var multer  = require('multer');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var pkgcloud = require('pkgcloud');

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json 
app.use(bodyParser.json());

// Connection URL
var url = 'mongodb://infra:icfsugmx@ds137760.mlab.com:37760/drive';
var collection;

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    collection = db.collection('users');
});

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({ storage: storage });

var openstack = pkgcloud.storage.createClient({
    provider: 'openstack', // required
    username: 'admin', // required
    password: 'ADMIN_PASS', // required
    authUrl: '150.165.85.15:5000', // required
    domainId: 'default',
    region: 'RegionOne',
    tenantId: 'd07349d8407b44bfae558e8e2192b744',
    version: 'v1',
    keystoneAuthVersion: 'v3'
});

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.set('port', process.env.PORT || 3333);

app.get('/test', function (req,res,next) {
    console.log('oi');
    // console.log(openstack);
    openstack.getContainers(function(err, containers) {
        console.log('err', err);
        console.log('c', containers);
        res.json(containers);
    });
});

app.get('/upload/:user', function(req,res,next){
    console.log('Get files', req.params.user);
    res.json({'ok':'ok'});
});

app.post('/upload', upload.single('file'), function(req,res,next){
    console.log('Uploade Successful ', req.file, req.body);
    res.json({'ok':'ok'});
});

app.delete('/upload', function(req,res,next){
    console.log('Remove Successful ', req.body);
    res.json({'ok':'ok'});
});

app.post('/signin', function(req,res,next){
    var user = {
        username: req.body.username,
        password: req.body.password
    };

    collection.find(user).toArray(function (err, result) {
        if (err) {
            return res.status(400).json({data: err});
        }

        if (result.length === 0) {
            return res.status(400).json({message: 'User not found'});
        }

        res.json({message: 'User logged'});
    });
});

app.post('/user', function(req,res,next){
    var user = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    };

    collection.insertOne(user, function(err, result) {
        if (err) {
            return res.status(400).json({data: err});
        }

        res.json({message: 'User created'});
    });
});


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
