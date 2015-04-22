var yatodo_org = angular.module('yatodo.org', []);

yatodo_org.controller('RegisterOrgCtrl', RegisterOrgCtrl);
yatodo_org.controller('RegisterNewStaffCtrl', RegisterNewStaffCtrl);

function RegisterNewStaffCtrl($scope,
  BASE_FIREBASE_URL,
  $state, $firebaseObject, $rootScope,
  $ionicLoading, $ionicHistory) {

  var ref = new Firebase(BASE_FIREBASE_URL);

  $scope.signUp = function(staff) {

    var selected_org = $rootScope.selected_org;

    // we simply create a random todo for now
    var staffRef = ref.child("organizations").child(selected_org.orgId).child("staff");

    staffRef.push({
      "name": staff.name,
      "email": staff.email,
      "role": 1
    });

    $ionicHistory.goBack();
  };

}

function RegisterOrgCtrl(
  $scope,
  BASE_FIREBASE_URL,
  $state, $firebaseObject, $rootScope,
  $ionicLoading) {

  var ref = new Firebase(BASE_FIREBASE_URL);

  function waitUntilCreated() {
    var orgsRef = ref.child("users").child($rootScope.authData.uid).child('organizations');

    orgsRef.on("value", function(snapShot) {
      console.log('value changed');

      if (snapShot.val() !== null) {
        orgsRef.off("value");
        $ionicLoading.hide();
        $state.go('tab.dash');
      }

    });
  }

  $scope.register = function(org) {

    $ionicLoading.show();

    var orgRef = ref.child('organization_creation_submissions').child($rootScope.authData.uid).child("info");
    var obj = $firebaseObject(orgRef);

    obj.name = org.name;
    obj.address = org.address;
    obj.phone = org.phone;

    obj.$save()
      .then(function(ref) {
        waitUntilCreated();
      })
      .catch(function(error) {
        console.log("failed to submit the code for the user");
      })
      .finally(function() {});

  };
}