var Firebase = require('firebase');
var fbUtils = require('./fbutils.js');
var _ = require('lodash');
var iron_worker = require('iron_worker');

var iw = new iron_worker.Client();

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

    var user_email = value.email;

    if (!_.has(value, 'verified') &&
      !_.has(value, 'generated_code')) {

      // queue a worker
      var payload = {
        uid: key
      };
      var options = {
        priority: 1
      };

      console.log("Queuing a task to generate code and email it ..");
      iw.tasksCreate('code_generator', payload, options,
        function(error, body) {
          if (error) {
            console.log("An error occurred when queuing a task ..");
          }
        });
    }

  });

});