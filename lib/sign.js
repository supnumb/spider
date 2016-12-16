var crypto = require('crypto');
var util = require('utility');

module.exports = function(timestamp,appKey,secretKey,data){
	var t = util.md5(data+appKey);
	return util.md5(timestamp+t+secretKey);
};


//var time =new Date().getTime();
//var token = "ss";
//var nonce = "s1";
//
//var tt = ff(token,time,nonce);
//
//console.log(tt);
//

