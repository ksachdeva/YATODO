var Firebase = require('Firebase');
var fbUtils = require('./fbutils.js');
var _ = require('lodash');

var ref = new Firebase(fbUtils.BASE_URL);

ref.authWithCustomToken(fbUtils.FB_SECRET_KEY, function(error, authData) {

  if (error !== null) {
    console.log("failed to authenticate ..exiting");
    process.exit();
    return;
  }

  // start to monitor the users node for the addition of the nodes
  var usersRef = ref.child("users");

  usersRef.on("child_added", function(snapshot) {

    // send an email with the invite code
    var value = snapshot.val();
    var key = snapshot.key();

    console.log(value);
    console.log(key);

    var user_email = value.email;

    if (!_.has(value, 'verified')) {

      var generatedcode = "abcdefg"; // TODO : a random code with letters and digits only

      console.log("Generated Code - " + generatedcode);

      // push it in the users area
      var codeRef = usersRef.child(key).child('generated_code');
      codeRef.set(generatedcode);
    }

  });

});