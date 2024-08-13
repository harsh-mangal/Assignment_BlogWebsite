const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const apiRoutes = require('./routes/api');

mongoose.connect('mongodb://localhost:27017/cmsDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.use('/api', apiRoutes);

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
