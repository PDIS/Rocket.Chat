const request = require('request');
const fs = require('fs');

RocketChat.API.v1.addRoute('claimToken', { authRequired: false }, {
	post() {
		const par = this.requestParams();
		const headers = this.request.headers;
		const claimToken = par.token;
		const sessionId = headers['x-sandstorm-session-id'];
		request({
		  proxy: process.env.HTTP_PROXY,
		  method: "POST",
		  url: "http://http-bridge/session/" + sessionId + "/claim",
		  json: {
		    requestToken: claimToken,
		    requiredPermissions: ["read","write"]
		  }
		}, (err, httpResponse, body) => {
		  if (err) {
		    console.error(err);
		  } else {
				if (body.cap !== undefined) {
					fs.writeFile("/var/token.txt",body.cap,function(err){
						if(err){console.log(err); }
					});
				}
		  }
		});//request
		return RocketChat.API.v1.success();
	}//post
});
