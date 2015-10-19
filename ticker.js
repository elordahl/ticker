/*jslint indent:2*/
"use strict";

var http = require('http');
var function_name = 'pretty_output';

/**
 * Logs things nicely
 */
function log(symbol,last_price,percent) {
  //console.log("[" + (new Date()).toLocaleString() + "] " + text);
    console.log('['+symbol+'] $'+last_price+' ('+percent+'%)');
}

function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

function pretty_output(json){
    var name=json.Name;
    var symbol=json.Symbol;
    var last_price=json.LastPrice;
    var percent=json.ChangePercent;
    log(symbol,last_price,parseFloat(percent).toFixed(2));
}

function run(ticker){
    var options = {
      hostname: 'dev.markitondemand.com',
      path: '/MODApis/Api/v2/Quote/jsonp?symbol=' + ticker+'&callback='+function_name,
      method: 'GET',
    };

    var response_json="";
    var req = http.request(options, function (res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
	response_json+=chunk;
      });

      res.on('end', function (){
	//Ensure we're calling our function
	if (strStartsWith(response_json,function_name)){
	  eval(response_json);
	}
      });
    });

    req.on('error', function (e) {
      log('problem with request: ' + e.stack);
    });

    req.end();
}

run('FEYE')

