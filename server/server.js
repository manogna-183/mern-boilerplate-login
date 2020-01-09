const express = require("express");
const app = express();
const path = require("path");

const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const config = require('./config/key');

const PORT = process.env.PORT || 5000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

mongoose.connect(config.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
                .then(() => console.log("MongoDB connected"))
                .catch(err => console.error(err));

const { User } = require("./models/user");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

const { auth } = require("./middleware/auth");

app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    });
});

app.post('/api/users/register', (req, res) => {
    const newUser = new User(req.body);

    newUser.save((err, doc) => {
        if(err) return res.json({registerSuccess: false, message:"Registartion Failed", err});
        return res.status(200).json({registerSuccess: true});
    });    
});

app.post('/api/users/login', (req, res) => {
    //Find by Email

    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) return res.json({
            loginSuccess: false,
            message: "Auth failed, email not found"
        });

        //Compare Password
        user.comparePassword(req.body.password, function(err, isMatch) {
            if(!isMatch) return res.json({
                loginSuccess: false,
                message: "Auth failed, wrong password"
            });
            //console.log("password matched");
            //Generate Token
            user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);

            res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true });
            });
        });
    });
});

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id},{token: ""}, (err, doc) => {
        if(err) return res.json({ success: false, err });
        return res.status(200).send({success: true});
    });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`);
});