var rp = require('request-promise');
var env = require('node-env-file');

env(__dirname + '/.env');

var FB_NAME = process.env.FB_NAME;
var FB_SECRET_KEY = process.env.FB_SECRET_KEY;

var baseUrl = 'https://' + FB_NAME + "/";

var rulesUrl = baseUrl + '.settings/rules.json?auth=' + FB_SECRET_KEY;
var rootDataUrl = baseUrl + '.json?auth=' + FB_SECRET_KEY;

exports.BASE_URL = baseUrl;

exports.TEST1_ACCOUNT = {
  "email": process.env.TEST1_EMAIL,
  "pwd": process.env.TEST1_PWD
};

exports.TEST2_ACCOUNT = {
  "email": process.env.TEST2_EMAIL,
  "pwd": process.env.TEST2_PWD
};

exports.TEST2_ACCOUNT = {
  "email": process.env.TEST2_EMAIL,
  "pwd": process.env.TEST2_PWD
};

exports.loadRulesAndData = function(rules, newData) {

  return rp({
      url: rulesUrl,
      method: 'PUT',
      json: rules
    })
    .then(function() {
      return rp({
        url: rootDataUrl,
        method: 'PUT',
        json: newData
      });
    });

};