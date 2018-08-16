'use strict';
var request = require("request"),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Player = mongoose.model('Players'),
    path = require('path');

exports.get = (req, res) => {
  let players = Player.find();
  players.exec( (err, data) => {
    if (err)
      res.send(err);
    res.json(data);
  });
};

exports.getById = (req, res) => {
  let getPlayer = Player.findById(req.params.id);
  getPlayer.exec( (err, player) => {
    if (err)
      res.send(err);
    res.json(player);
  });
};

exports.create = (req, res) => {
  if (!req.body.email || !req.body.name)
    return res.json({error: 'invalid request'})
  let playerUpdate = Player.update({
    'email': req.body.email,
    'name': req.body.name,
  }, req.body, {upsert: true});

  playerUpdate.exec((err, result) => {
    if (err) 
      res.send(err)
    getPlayer(req, res) 
  })
};

let getPlayer = (req, res) => {
  let getPlayer = Player.find({
    'email': req.body.email,
    'name': req.body.name,
  });
    getPlayer.exec( (err, player) => {
      if (err)
        res.send(err);
      res.json(player[0]);
    });
}
