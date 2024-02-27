const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const User = require('./models/user');
const Post = require('./models/post'); 

const app = express();
const PORT = 3000;
const Item = require('./models/post');

app.use('/images', express.static(path.join(__dirname, 'images')));
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
}));

mongoose.connect('mongodb://localhost/backendfinal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

// Define middleware
const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

const authorize = (req, res, next) => {
    if (req.session.userId && req.session.role === 'admin') {
      next();
    } else {
      res.status(403).send('Unauthorized: Access is denied');
    }
  };

// User Registration
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aldiyar.kakim80@gmail.com',
        pass: 'monf wubf htbh jvwu'
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName, age, country, gender, email } = req.body;
        let role = 'regular';
        if (username == "Aldiyar") {
            role = 'admin';
        }
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.send('Username already exists');
        }

        // Create a new user
        const user = new User({ username, password, firstName, lastName, age, country, gender, role, email });
        await user.save();

        // Send welcome email
        const mailOptions = {
            from: 'aldiyar.kakim80@gmail.com',
            to: email,
            subject: 'Welcome to Our App!',
            text: `Hi ${firstName}, welcome to our application! We're glad to have you on board.`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log('Error sending email: ' + error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.redirect('/login');
    } catch (error) {
        res.send('Error registering user: ' + error.message);
    }
});

// User Login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        req.session.role = user.role;
        res.redirect('/index.html');
    } 
    else {
        res.send('Login failed');
    }
});

app.get('/auth/status', (req, res) => {
    const isLoggedIn = !!req.session.userId;
    const role = req.session.role || 'guest';
    res.json({ isLoggedIn, role });
});

// Logout endpoint
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login.html'); 
    });
});

app.get('/admin', authorize, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  });

// Post creation
app.post('/admin/add-item', upload.array('images', 3), async (req, res) => {
    try {
        const { name, description } = req.body;
        const images = req.files.map(file => file.path); 

        const newItem = new Item({
            name,
            description,
            images
        });

        await newItem.save();

        res.redirect('/admin'); 
    } catch (error) {
        console.error('Error adding new item:', error);
        res.status(500).send('Error adding new item');
    }
});

// Updating post
app.post('/admin/update-item', async (req, res) => {
    try {
        const { id, name, description } = req.body;
        
        await Item.findByIdAndUpdate(id, {
            name: name,
            description: description
        });

        res.redirect('/admin');
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).send('Error updating item');
    }
});

// Deleting post
app.get('/admin/items', async (req, res) => {
    try {
        const items = await Item.find({});
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('Error fetching items');
    }
});

app.post('/admin/delete-item', async (req, res) => {
    try {
        const { id } = req.body;
        await Item.findByIdAndDelete(id);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).send('Error deleting item');
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
