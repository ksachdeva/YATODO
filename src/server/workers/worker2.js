var Firebase = require('Firebase');
var fbUtils = require('./fbutils.js');
var _ = require('lodash');

var ref = new Firebase(fbUtils.BASE_URL);

var submittedCodesCache = [];

function doOrganizationCreations() {
  // start to monitor email_verification_submissions node
  var submissionsRef = ref.child("organization_creation_submissions");

  submissionsRef.on("child_added", function(snapshot) {

    var value = snapshot.val();
    var key = snapshot.key();

    console.log(value);
    console.log(key);

    var userRef = ref.child("users").child(key);

    var profileRef = userRef.child("profile");
    profileRef.once("value", function(userSnapshot) {

      var profile = userSnapshot.val();

      // we need to
      // - create the organization entry
      // - add staff entry in that entry for this user
      // - add org entry in the users area

      var organizationsRef = ref.child("organizations");
      var orgRef = organizationsRef.push({
        "about": {
          "name": value.info.name,
          "phone": value.info.phone,
          "address": value.info.address
        }
      }, function(error) {
        if (error !== null) {
          console.log("error create new org");
        } else {

          // add a new staff entry
          var staffRef = orgRef.child("staff");
          var adminRef = staffRef.push({
            "name": profile.name,
            "email": profile.email,
            "role": 5
          });

          // finally push this entry in the users account
          userRef.child("organizations").child(orgRef.key()).set({
            "name": value.info.name,
            "orgId": orgRef.key(),
            "staffId": adminRef.key(),
            "role": 5
          });

          // delete the pending submissions
          submissionsRef.child(key).remove();
        }
      });

    });

  });
}

function doEmailSubmissionVerifications() {
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

        // and users generated_code
        userRef.child('generated_code').remove();

      } else {
        console.log("submitted and generated code did not match");
        userRef.child('verified').set(false);
      }

      // in both cases remove the entry for submissions
      submissionsRef.child(key).remove();

    }, function(error) {
      // ignoring the error here but we need to find a way
      // to inform the user that the code is invalid
      console.log("error occurred when getting the generated_code value");
    });

  });
}

ref.authWithCustomToken(fbUtils.FB_SECRET_KEY, function(error, authData) {

  if (error !== null) {
    console.log("failed to authenticate ..exiting");
    process.exit();
    return;
  }

  doEmailSubmissionVerifications();
  doOrganizationCreations();

});