'use strict';

module.exports = function(app) {
    var cors = require('cors');

 	// api controllers
    let game = require('./api/game');
    let player = require('./api/player');

    let originsWhitelist = [
            '*',
            'http://localhost:8080'
    ];
    let corsOptions = {
        origin: function(origin, callback){
            let isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
            callback(null, isWhitelisted);
        },
        credentials:true
    };
    //here is the magic of cors :)
    app.use(cors(corsOptions));
    app.options('/api', cors(corsOptions));

    app.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        next();
    });

    // player 
    app.route('/api/player/')
        .get(player.get, cors(corsOptions));
    app.route('/api/player/:id')
        .get(player.getById, cors(corsOptions)); 
    app.route('/api/player/')
        .post(player.create, cors(corsOptions));
    // game 
    app.route('/api/game/:gameId')
        .get(game.getById, cors(corsOptions)); 
    app.route('/api/game/')
        .post(game.create, cors(corsOptions));
    app.route('/api/game/:gameId/player')
        .post(game.addPlayer, cors(corsOptions));
    app.route('/api/game/:gameId/move')
        .post(game.addMove, cors(corsOptions)); 
    
};
