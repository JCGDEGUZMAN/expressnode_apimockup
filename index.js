'use strict';

const lodash = require('lodash');
// const uuidv4 = require('uuid/v4');

const express = require('express');

const app = express();
app.use(express.json());

// Your code starts here.
// Placeholders for all requests are provided for your convenience.

let users = [];
let articles = [];

app.post('/api/user', (req, res) => {

    const user = req.body;

    if(lodash.isEmpty(user)) {
        res.status(400).json({ message: "Your request body is empty!" });
    }

    users.push(user);

    res.status(201).json({ message: "User created successfully!" });
});

app.post('/api/authenticate', (req, res) => {
  
    const credential = req.body;

    if(lodash.isEmpty(credential)) {
        res.status(400).json({ message: "Your request body is empty!" });
    }

    const isLoginExist = users.filter(user => user.login == credential.login).length;

    if(!isLoginExist)
    {
        res.status(404).json({ message: "Your login cannot be found!" });
    }

    const isPasswordCorrect = users.filter(user => user.login == credential.login && user.password == credential.password).length;

    if(!isPasswordCorrect)
    {
        res.status(401).json({ message: "Your password is incorrect!" });
    }

    res.status(201).json({ token: "123456", message: "temporary placeholder for token" });
});

app.post('/api/logout', (req, res) => {
  
    const token = req.headers.token;

    if(token !== "123456")
    {
        res.status(401).json({ message: "Your token is invalid!" });
    }

    res.status(200).json({ message: "You successfully logout. The token you used willbe invalid..." });
});

app.post('/api/articles', (req, res) => {
  
    const article = req.body;
    const token = req.headers.token;

    if(token !== "123456")
    {
        res.status(401).json({ message: "Your token is invalid!" });
    }

    if(lodash.isEmpty(article)) {
        res.status(400).json({ message: "Your request body is empty!" });
    }

    if(token == "123456" && !lodash.isEmpty(article))
    {
        articles.push(article);
    }

    res.status(201).json({ message: "Article created successfully!" });

});

app.get('/api/articles', (req, res) => {
  
    const token = req.headers.token;

    if(token == "123456")
    {
        res.status(200).json({ articles });
    }
    else{
        res.status(200).json({ articles: articles.filter(article => article.visibility == "public") });
    }

});

app.get('/test', (req, res) => {
    res.status(201).json({ users, articles });
});

exports.default = app.listen(process.env.HTTP_PORT || 5000, () => console.log(`Server Running On Port: ${process.env.HTTP_PORT || 5000}`));
