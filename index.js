const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static('./assests'));

app.use(expressLayouts);

// extrace style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// use express router
app.use('/', require('./routes'));

// Setting view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.listen(port, function(err){
    if(err){
        console.log(`Erro : ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});