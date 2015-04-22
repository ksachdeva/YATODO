var yatodo = angular.module('yatodo', [
  'ionic',
  'firebase',
  'yatodo.user',
  'yatodo.org',
  'yatodo.todo'
]);

yatodo.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
});

//yatodo.constant('BASE_FIREBASE_URL', '<ur firebase url');

yatodo.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('login', {
    url: "/login",
    templateUrl: "templates/login.html"
  })

  .state('register', {
    url: "/register",
    templateUrl: "templates/register_user.html"
  })

  .state('verify_user', {
    url: "/verify_user",
    templateUrl: "templates/verify_user.html"
  })

  .state('join_or_create_org', {
    url: "/join_or_create_org",
    templateUrl: "templates/join_or_create_org.html"
  })

  .state('create_new_org', {
    url: "/create_new_org",
    templateUrl: "templates/create_new_org.html"
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'ListMyTodoCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html'
      }
    }
  })

  .state('tab.account-newstaff', {
    url: '/account/newstaff',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-newstaff.html'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});