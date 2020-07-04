require('dotenv').config();
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const Info = require('./models/Info');
const passport = require('passport');
require('./config/passport')(passport);
const cors = require('cors');
const loginController = require('./controllers/loginController');
const personController = require('./controllers/personController');
const photoController = require('./controllers/photoController');

mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true}).then(() => {
    console.log('Conected to database');
}).catch(err => {
    console.log(`Error: ${err.message}`);
});

app.use('/static', express.static('files'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(fileUpload());

app.post('/login', loginController.login);
app.post('/register', loginController.register);

app.post('/people', passport.authenticate('jwt', {session: false}), personController.addPerson);
app.get('/people', passport.authenticate('jwt', {session: false}), personController.getPeople);
app.get('/people/:id', passport.authenticate('jwt', {session: false}), personController.getPerson);

app.post('/upload', passport.authenticate('jwt', {session: false}), photoController.uploadPhoto);
app.get('/photos2', passport.authenticate('jwt', {session: false}), photoController.getPhotos);
app.delete('/photos/:id', passport.authenticate('jwt', {session: false}), photoController.removePhoto);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));