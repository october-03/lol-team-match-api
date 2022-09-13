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

router.patch('/add-member/:code', findTeamCode, async (req, res)=>{
  let position = req.body.position;
  let {isFull} = res.team;
  if(isFull){
    return res.status(200).json({message: 'Team is full'});
  }

  switch (position) {
    case 'top':
      if(res.team.top){
        return res.status(200).json({message: 'Position is full'});
      }
      res.team.top = req.body;
      break;
    case 'jg':
      if(res.team.jg){
        return res.status(200).json({message: 'Position is full'});
      }
      res.team.jg = req.body;
      break;
    case 'mid':
      if(res.team.mid){
        return res.status(200).json({message: 'Position is full'});
      }
      res.team.mid = req.body;
      break;
    case 'adc':
      if(res.team.adc){
        return res.status(200).json({message: 'Position is full'});
      }
      res.team.adc = req.body;
      break;
    case 'sup':
      if(res.team.sup){
        return res.status(200).json({message: 'Position is full'});
      }
      res.team.sup = req.body;
      break;
    default:
      return res.status(400).json({message: 'Invalid position'});
  }

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

router.patch('/del-member/:code', findTeamCode, async (req, res)=>{
  let position = req.body.position;
  switch (position) {
    case 'top':
      if(res.team.top.name === req.body.name && res.team.top.password === req.body.password) {
        res.team.top = null;
      } else {
        return res.status(400).json({message: '정보가 일치하지 않습니다.'});
      }
      break;
    case 'jg':
      if(res.team.jg.name === req.body.name && res.team.jg.password === req.body.password) {
        res.team.jg = null;
      } else {
        return res.status(400).json({message: '정보가 일치하지 않습니다.'});
      }
      break;
    case 'mid':
      if(res.team.mid.name === req.body.name && res.team.mid.password === req.body.password) {
        res.team.mid = null;
      } else {
        return res.status(400).json({message: '정보가 일치하지 않습니다.'});
      }
      break;
    case 'adc':
      if(res.team.adc.name === req.body.name && res.team.adc.password === req.body.password) {
        res.team.adc = null;
      } else {
        return res.status(400).json({message: '정보가 일치하지 않습니다.'});
      }
      break;
    case 'sup':
      if(res.team.sup.name === req.body.name && res.team.sup.password === req.body.password) {
        res.team.sup = null;
      } else {
        return res.status(400).json({message: '정보가 일치하지 않습니다.'});
      }
      break;
    default:
      return res.status(400).json({message: 'Invalid position'});
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

router.delete('/del-team/:uniqueCode', findUniqueCode, async (req,res)=>{
  try {
    await res.team.remove();
    res.json({message: 'Deleted team'});
  } catch(err) {
    res.status(500).json({message: err.message});
  }
})

module.exports = router