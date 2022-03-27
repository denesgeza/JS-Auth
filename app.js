//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
// Encrypt the password field
const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

// Routing
app.route('/')
    .get(function(req, res){
        res.render('home');
    });

app.route('/login')
    .get(function(req, res){
        res.render('login');
    })
    .post(function(req, res){
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({email: username}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser){
                    if(foundUser.password === password){
                        res.render('secrets');
                    }
                }
            }
        });
    });

app.route('/register')
    .get(function(req, res){
        res.render('register');
    })
    .post(function(req, res){
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            } else {
                res.render('secrets');
            }
        });
    });









app.listen(3000, function() {
  console.log('Server started on port 3000');
});