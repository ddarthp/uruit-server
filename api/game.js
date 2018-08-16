'use strict';
var request = require("request"),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Game = mongoose.model('Games'),
    path = require('path');

exports.get = (req, res) => {
  let games = Game.find();
  games.exec( (err, data) => {
    if (err)
      res.send(err);
    res.json(data);
  });
};

exports.getById = (req, res) => {
let aggregate = [
  {
    $match: {
      _id: mongoose.Types.ObjectId(req.params.gameId)
    }
  },
  {
    $lookup: {
      from: 'players',
      localField: 'playerOne',
      foreignField: '_id',
      as: 'players.one'
    }
  },
  {
    $lookup: {
      from: 'players',
      localField: 'playerTwo',
      foreignField: '_id',
      as: 'players.two'
    }
  },
  {
    $project: {
      _id: '$_id',
      typeGame: '$typeGame',
      active: '$active',
      winnerGame: '$winnerGame',
      winnerSets: '$winnerSets',
      moves: '$moves',
      actualSet: '$actualSet',
      playerOne: '$playerOne',
      playerTwo: '$playerTwo',
      created: '$created',
      players: {
        one: {
          $arrayElemAt: [ "$players.one", 0 ]
        },
        two: {
          $arrayElemAt: [ "$players.two", 0 ]
        }
      }
    }
  }
];

  let getGame = Game.aggregate(aggregate);
  getGame.exec( (err, game) => {
    if (err)
      return res.send(err);
    
    if (game.length > 0 ) {
      let _game = game[0];
      if(!_game.winnerGame) {
        setWinner(_game);
      }
      
      return res.json(_game);
    } else {
      return res.json({error: 'not found'})
    }
    
  });
};

let setWinner = (game) => {
  let sets = {};
      for (let i in game.moves) {
        let move = game.moves[i];
        if (!sets[move.set]) {
          sets[move.set] = [];
        }
        sets[move.set].push(move);

      }

       sets
}

let compare = function(choice1,choice2) {

  if (choice1 === choice2) {
      return "It's a tie!";
  }
  if (choice1 === "rock") {
      if (choice2 === "scissors") {
          // rock wins
          return "You win!";
      } else {
          // paper wins
          return "You lose! Try again.";
      }
  }
  if (choice1 === "paper") {
      if (choice2 === "rock") {
          // paper wins
          return "You win!";
      } else {
          // scissors wins
          return "You lose! Try again.";
      }
  }
  if (choice1 === "scissors") {
      if (choice2 === "rock") {
          // rock wins
          return "You lose! Try again.";
      } else {
          // scissors wins
          return "You win!";
      }
  }
};

exports.create = (req, res) => {
  let new_game =  new Game(req.body)
  new_game.save( (err, data) => {
    if (err)
      res.send(err);
    res.json(data);
  });
};

exports.addPlayer = (req, res) => {
  let gameId = req.params.gameId;
  let getGame = Game.findById(gameId);
  getGame.exec((err, game) => {
    if (err)
      res.send(err);
    if (!game)
      return res.json({error: 'object not found'});

    if (!game.playerOne) {
      req.body['player'] = 'playerOne';
    } else if (!game.playerTwo && game.typeGame!=='single') {
      req.body['player'] = 'playerTwo';
    }else{
      return res.json({error: 'The game is already full'});
    }
    insertPlayer(req, res);
  })
}

let insertPlayer = (req, res) => {
  let playerId = req.body.playerId;
  if (!playerId)
    return res.json({error:'invalid playerId'})
  let position = req.body.player; 
  let insert = {}
  insert[position]= playerId;
  console.log(insert);

  let gameUpdate = Game.update({
    '_id': mongoose.Types.ObjectId(req.params.gameId)
  }, insert , {upsert: true});
  gameUpdate.exec( (err, game) => {
      if (err)
        res.send(err);
      res.json(game);
    });
}

exports.addMove = (req, res) => {
  let gameId = req.params.gameId;
  let getGame = Game.findById(gameId);
  let newMove = {
    weapon: req.body.weapon,
    playerId: req.body.playerId,
    set: req.body.set
  }

  getGame.exec((err, game) => {
    if (err)
      return res.send(err);
    if (!game)
      return res.json({error: 'object not found'});
    if ( newMove.set > 3 )
      return res.json({error: 'limit of sets reach (3)'})
    let moves = game.moves;
    for (let i in moves ){
      if (moves[i].playerId == newMove.playerId && 
          moves[i].set == newMove.set ) {
        return res.json({error: 'Already exist a move for this set'})
      }
    }
    
    game.moves.push(newMove)
    

    let gameUpdate = Game.update({
      '_id': mongoose.Types.ObjectId(req.params.gameId)
    }, { moves: game.moves} , {upsert: true});
    gameUpdate.exec( (err, update) => {
        if (err)
          res.send(err);
        res.json(game);
      });

  })
}