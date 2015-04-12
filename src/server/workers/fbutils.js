var env = require('node-env-file');

env(__dirname + '/.env');

var FB_NAME = process.env.FB_NAME;

var baseUrl = 'https://' + FB_NAME + "/";

exports.BASE_URL = baseUrl;
exports.FB_SECRET_KEY = process.env.FB_SECRET_KEY;