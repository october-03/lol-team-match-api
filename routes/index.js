const express = require("express");
const router = express.Router();

router.get('/', async (req, res)=>{
  res.send("test get complete");
})

router.post('/', async (req, res)=>{
  res.send("test post complete");
})

module.exports = router