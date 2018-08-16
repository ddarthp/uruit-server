'use strict';
module.exports = {
	"site": {
		"name": "uruit-server"
	},
	"secret": "fandango-secret:AppSecret",
    "database": {
    	"db": "mongodb://localhost:27017/uruit-game",
    	"auth":{
    		"user": "uruit-game",
    		"pass": "A303365dfp",
    		"auth_db": "admin"
    	}
    },
    "salt": 'd2g6IOP(U(&Â§)%UÂ§VUIPU(HN%V/Â§Â§URerjh0Ã¼rfqw4zoÃ¶qe54gÃŸ0Ã¤Q"LOU$3wer"' // security salt for hash
	
	
};