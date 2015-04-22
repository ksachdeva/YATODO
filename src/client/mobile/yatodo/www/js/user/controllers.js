var yatodo_user = angular.module('yatodo.user', []);

yatodo_user.controller('LoginCtrl', LoginCtrl);
yatodo_user.controller('VerifyUserCtrl', VerifyUserCtrl);
yatodo_user.controller('RegisterUserCtrl', RegisterUserCtrl);

function LoginCtrl(
  $scope, $rootScope,
  $state, $firebaseAuth, $firebaseObject, $firebaseArray,
  $ionicLoading,
  BASE_FIREBASE_URL) {

  var ref = new Firebase(BASE_FIREBASE_URL);
  var auth = $firebaseAuth(ref);

  $scope.signIn = function(user) {

    auth.$authWithPassword({
        email: user.email,
        password: user.password
      })
      .then(function(userData) {

        $rootScope.authData = userData;

        // fetch the profile data
        var verifiedValue = $firebaseObject(ref.child("users").child(userData.uid).child('verified'));

        return verifiedValue.$loaded();
      })
      .then(function(data) {

        if (data.$value === true) {
          // check the organization list for this user
          //var organizations = $firebaseObject(ref.child("users").child($rootScope.authData.uid).child('organizations'));
          var organizations = $firebaseArray(ref.child("users").child($rootScope.authData.uid).child('organizations'));
          return organizations.$loaded();
        } else {
          $state.go('verify_user');
        }
      })
      .then(function(data) {
        console.log(data);
        if (data.length === 0) {
          $state.go('create_new_org');
        } else {
          // selecting the first org
          $rootScope.selected_org = data[0];
          console.log($rootScope.selected_org);
          $state.go('tab.dash');
        }
      })
      .catch(function(error) {
        alert("Error: " + error);
      })
      .finally(function() {
        $ionicLoading.hide();
      });
  };

}

function VerifyUserCtrl(
  $scope, $rootScope,
  $state,
  $ionicLoading,
  $firebaseObject,
  BASE_FIREBASE_URL) {

  var ref = new Firebase(BASE_FIREBASE_URL);

  function waitUntilVerified() {
    var verifiedRef = ref.child("users").child($rootScope.authData.uid).child('verified');

    verifiedRef.on("value", function(snapShot) {
      console.log('value changed');

      if (snapShot.val() === true) {
        verifiedRef.off("value");
        $ionicLoading.hide();
        $state.go('tab.dash');
      }

    });
  }

  $scope.verify = function(user) {

    $ionicLoading.show();

    var usersRef = ref.child('email_verification_submissions').child($rootScope.authData.uid).child('code');
    var obj = $firebaseObject(usersRef);

    obj.$value = user.code;

    obj.$save()
      .then(function(ref) {
        waitUntilVerified();
      })
      .catch(function(error) {
        console.log("failed to submit the code for the user");
      })
      .finally(function() {});
  };
}

function RegisterUserCtrl(
  $scope,
  BASE_FIREBASE_URL,
  $state, $firebaseAuth,
  $ionicLoading) {

  var ref = new Firebase(BASE_FIREBASE_URL);
  var auth = $firebaseAuth(ref);

  $scope.signUp = function(user) {

    console.log("Create User Function called");
    if (user && user.email && user.password && user.name) {

      $ionicLoading.show({
        template: 'Signing Up...'
      });

      auth.$createUser({
          email: user.email,
          password: user.password
        }).then(function(userData) {
          // authenticate the user
          return auth.$authWithPassword({
            email: user.email,
            password: user.password
          });

        })
        .then(function(userData) {
          ref.child("users").child(userData.uid).child('profile').set({
            email: user.email,
            name: user.name
          });
          $ionicLoading.hide();
          $state.go('login');
        })

      .catch(function(error) {
        alert("Error: " + error);
        $ionicLoading.hide();
      });


    } else {
      alert("Please fill all details");
    }
  };
}