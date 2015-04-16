var Firebase = require('firebase');
var fbUtils = require('./fbutils.js');
var _ = require('lodash');
var iron_worker = require('iron_worker');

var payload = iron_worker.params();

var ref = new Firebase(fbUtils.BASE_URL);

ref.authWithCustomToken(fbUtils.FB_SECRET_KEY, function(error, authData) {

  if (error !== null) {
    console.log("failed to authenticate ..exiting");
    process.exit();
    return;
  }

  // start to monitor the users node for the addition of the nodes
  var userRef = ref.child("users").child(payload.uid);

  // TODO : a random code with letters and digits only
  var generatedcode = "abcdefg";

  console.log("Generated Code - " + generatedcode);

  // push it in the users area
  var codeRef = userRef.child('generated_code');
  codeRef.set(generatedcode, function(error) {
    if (error) {
      console.log("error setting the code ..");
    }

    process.exit();

  });

});