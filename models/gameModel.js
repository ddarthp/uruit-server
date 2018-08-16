'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

let MoveSchema = new Schema({
    playerId:{ 
        type: Schema.Types.ObjectId,
        ref: 'UserId',
        required: true
    },
    weapon: {
        type: String,
        required: true
    },
    set: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    
})
let GameSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    playerOne: { 
        type: Schema.Types.ObjectId,
        ref: 'PlayerId',
        default: null
    },
    playerTwo: { 
        type: Schema.Types.ObjectId,
        ref: 'PlayerId',
        default: null
    },
    actualSet: {
        type: Number,
        default: 1
    },
    moves: [MoveSchema],
    winnerSets: [{ 
        type: Schema.Types.ObjectId,
        ref: 'PlayerId',
        default: null
    }],
    winnerGame: { 
        type: Schema.Types.ObjectId,
        ref: 'PlayerId',
        default: null
    },
    typeGame: {
        type: String,
        required:true
    },
    created: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Games', GameSchema);