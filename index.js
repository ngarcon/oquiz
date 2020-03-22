require('dotenv').config(); 

const express = require('express');
const app = express(); 
const session = require('express-session');
const router = require("./app/router");


const PORT = process.env.PORT || 3000;



// Static files
app.use(express.static("integration")); 

//View management
app.set("view engine", 'ejs'); 
app.set("views", "./app/views"); 

// 
app.use(express.urlencoded({ extended: true })); 

app.use(session({
    secret: 'keyboard cat', 
    resave: true, 
    saveUninitialized: true, 

    cookie: { 
      secure: false, 
      maxAge: (1000*60*60)
    }
}));

const userMiddleware = require('./app/middlewares/checkLogin'); 
app.use(userMiddleware);

// Set router
app.use(router); 


app.listen(PORT, () => {
    console.log("Salut, c'est le PORT : ", PORT);
});