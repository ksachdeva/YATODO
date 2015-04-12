var program = require('commander');
var Firebase = require('Firebase');
var fbUtils = require('./fbutils.js');

var ref = new Firebase(fbUtils.BASE_URL);

program.version('0.1.0');

program
  .command('reg email pwd')
  .description("Register a user using email and password")
  .action(function(email, pwd) {

    ref.createUser({
      email: email,
      password: pwd
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
        process.exit();
      } else {
        console.log("Successfully created user account with uid:", userData.uid);

        // authenticate
        // authenticate the user
        ref.authWithPassword({
          email: email,
          password: pwd
        }, function(error, authData) {

          if (error) {
            process.exit();
          } else {
            // create the profile area
            // as well at the same time
            var usersRef = ref.child('users').child(userData.uid).child('profile');
            usersRef.set({
              name: 'Tester T',
              email: email
            }, function(error) {
              if (error) {
                console.log("failed to create the profile for the user");
              } else {
                console.log("profile created successfully");
              }
              process.exit();
            });
          }
        });
      }

    });

  });

program
  .command('verify email pwd code')
  .description("Verfiy users email using the code")
  .action(function(email, pwd, code) {

    // authenticate
    // authenticate the user
    ref.authWithPassword({
      email: email,
      password: pwd
    }, function(error, authData) {

      if (error) {
        console.log("error authenticating ..");
        process.exit();
      } else {

        // push it in the verification area

        var usersRef = ref.child('email_verification_submissions').child(authData.uid).child('code');
        usersRef.set(code, function(error) {
          if (error) {
            console.log("failed to submit the code for the user");
          } else {
            console.log("code submitted successfully");
          }

          process.exit();

        });
      }
    });

  });

program.parse(process.argv);