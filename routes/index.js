const express = require("express");
const router = express.Router();
const Team = require('./models/teamModel');

async function findUniqueCode(req, res, next) {
  let team;
  try {
    team = await Team.find({uniqueCode: req.params.uniqueCode});
    if (team.length === 0) {
      return res.status(404).json({message: 'Cannot find team'});
    }
  } catch(err) {
    return res.status(500).json({message: err.message});
  }
  let teamObj = team[0];
  res.team = teamObj;
  next();
}

async function findTeamCode(req, res, next) {
  let team;
  try {
    team = await Team.find({code: req.params.code});
    if (team.length === 0) {
      return res.status(404).json({message: 'Cannot find team'});
    }
  } catch(err) {
    return res.status(500).json({message: err.message});
  }
  let teamObj = team[0];
  res.team = teamObj;
  next();
}

router.get('/', async (req, res)=>{
  // res.send("test get complete");
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch(err) {
    res.status(500).json({message: err.message});
  }
})

router.get('/team/:uniqueCode', findUniqueCode ,async (req, res)=>{
  // res.send("test get complete");
  try {
    res.json(res.team);
  } catch(err) {
    res.status(500).json({message: err.message});
  }
})

router.post('/create-team', async (req, res)=>{
  const team = new Team({
    name: req.body.name,
    code: req.body.code,
    type: req.body.type,
  });

  try {
    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch(err) {
    res.status(400).json({message: err.message});
  }
})

router.patch('/add-member/:uniqueCode', findUniqueCode, async (req, res)=>{
  let position = req.body.position;
  let {isFull} = res.team;
  if(isFull){
    return res.status(200).json({message: 'Team is full'});
  }

  if(res.team[position]){
    return res.status(200).json({message: 'Position is full'});
  }

  res.team[position] = req.body;

  let {top, jg, mid, adc, sup, type} = res.team;

  let teamArr = [top, jg, mid, adc, sup];
  let teamArrNullCheck = teamArr.filter((member) => member !== null);

  switch (type) {
    case '5x5':
      if (teamArrNullCheck.length >= 5) {
        res.team.isFull = true;
      }
      break;
    case 'solo':
      if (teamArrNullCheck.length >= 2) {
        res.team.isFull = true;
      }
      break;
    default:
      return res.status(500).json({message: 'Something went wrong'});
  }

  
  try {
    const updatedTeam = await res.team.save();
    res.json(updatedTeam);
  } catch(err) {
    res.status(400).json({message: err.message});
  }
})

router.patch('/del-member/:uniqueCode', findUniqueCode, async (req, res)=>{
  let position = req.body.position;

  if(res.team[position].name === req.body.name && res.team[position].password === req.body.password) {
    res.team[position] = null;
  } else {
    return res.status(400).json({message: '정보가 일치하지 않습니다.'});
  }

  let {top, jg, mid, adc, sup, type} = res.team;

  let teamArr = [top, jg, mid, adc, sup];
  let teamArrNullCheck = teamArr.filter((member) => member !== null);

  switch (type) {
    case '5x5':
      if (teamArrNullCheck.length < 5) {
        res.team.isFull = false;
      }
      break;
    case 'solo':
      if (teamArrNullCheck.length < 2) {
        res.team.isFull = false;
      }
      break;
    default:
      return res.status(500).json({message: 'Something went wrong'});
  }
  
  try {
    const updatedTeam = await res.team.save();
    res.json(updatedTeam);
  } catch(err) {
    res.status(400).json({message: err.message});
  }
})

router.delete('/del-team/:code', findTeamCode, async (req,res)=>{
  try {
    await res.team.remove();
    res.json({message: 'Deleted team'});
  } catch(err) {
    res.status(500).json({message: err.message});
  }
})

module.exports = router