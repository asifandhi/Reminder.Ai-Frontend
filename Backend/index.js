const express = require("express");
require("dotenv").config()
const app = express();


app.get("/",(req,res) =>{
    res.send("Hello World");
})


app.get('/status', (req, res) => {
  res.json({ status: 'OK' })
})