var Firebase = require('Firebase');
var fbUtils = require('./fbutils.js');
var _ = require('lodash');

var ref = new Firebase(fbUtils.BASE_URL);

var submittedCodesCache = [];

ref.authWithCustomToken(fbUtils.FB_SECRET_KEY, function(error, authData) {

  if (error !== null) {
    console.log("failed to authenticate ..exiting");
    process.exit();
    return;
  }

  // start to monitor email_verification_submissions node

  var submissionsRef = ref.child("email_verification_submissions");

  submissionsRef.on("child_added", function(snapshot) {

    // send an email with the invite code
    var value = snapshot.val();
    var key = snapshot.key();

    console.log(value);
    console.log(key);

    var userRef = ref.child("users").child(key);
    userRef.child('generated_code').once('value', function(snapshot) {

      if (value.code === snapshot.val()) {
        // the code matched so we will set the verified
        // value to true
        console.log("submitted value matched the generated value ..");
        userRef.child('verified').set(true);
      } else {
        console.log("submitted and generated code did not match");
      }

      // in both cases remove the entry for submissions
      submissionsRef.child(key).remove();
      // and users generated_code
      userRef.child('generated_code').remove();

    }, function(error) {
      // ignoring the error here but we need to find a way
      // to inform the user that the code is invalid
      console.log("error occurred when getting the generated_code value");
    });

  });

});