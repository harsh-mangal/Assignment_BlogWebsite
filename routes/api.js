const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Page = require('../models/Page');
const User = require('../models/User');

router.get('/pages', async (req, res) => {
    const pages = await Page.find();
    res.json(pages);
});


router.get('/pages/:slug', async (req, res) => {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
});

router.post('/pages', async (req, res) => {
    const { title, slug, content, image } = req.body;
    const page = new Page({ title, slug, content, image });
    await page.save();
    res.status(201).json(page);
});


router.put('/pages/:id', async (req, res) => {
    console.log(`Received GET request for ID: ${req.params.id}`); 
    const { title, slug, content, image } = req.body;
    const page = await Page.findByIdAndUpdate(req.params.id, { title, slug, content, image }, { new: true });
    res.json(page);
});
router.get('/getpages/:id', async (req, res) => {
    
    try {
        const id = req.params.id;
        console.log(id);
        const page = await Page.findById(id);
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }
        res.json(page);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


router.delete('/pages/:id', async (req, res) => {
    await Page.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

       
        res.json({ message: 'Login successful', adminLoggedIn: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
