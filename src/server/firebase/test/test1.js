var fbUtils = require('./fbutils.js');

var Firebase = require('firebase');
var chai = require('chai');

var expect = chai.expect;
var should = chai.should();

var sampleRules = require('./data/test1_rules.json');
var sampleData = require('./data/test1_data.json');

var FB_BASE_URL = fbUtils.BASE_URL;

var TEST1_ACCOUNT = fbUtils.TEST1_ACCOUNT;
var TEST2_ACCOUNT = fbUtils.TEST2_ACCOUNT;
var TEST3_ACCOUNT = fbUtils.TEST3_ACCOUNT;

describe('Stage1 Test Cases', function() {

  beforeEach(function(done) {
    // this code will run before each test case
    // so that we have the clean test data
    // on firebase server

    // upload rules & data
    fbUtils.loadRulesAndData(sampleRules, sampleData)
      .catch(console.error)
      .finally(done);
  });

  it('should allow creating users/simplelogin:1 for user simplelogin:1', function(done) {

    var ref = new Firebase(FB_BASE_URL);

    // authenticate the user
    ref.authWithPassword({
      email: TEST1_ACCOUNT.email,
      password: TEST1_ACCOUNT.pwd
    }, function(error, authData) {

      // once auth is done now create
      // the profile object
      var profileRef = ref.child("users/" + authData.uid + "/profile");

      var objectToWrite = {
        email: TEST1_ACCOUNT.email,
        name: 'First Tester'
      };

      profileRef.set(objectToWrite, function(error) {
        should.not.exist(error);
        done();
      });

    });

  });

  it('should allow reading profile of users/simplelogin:1 for user simplelogin:1', function(done) {

    var ref = new Firebase(FB_BASE_URL);

    ref.authWithPassword({
      email: TEST1_ACCOUNT.email,
      password: TEST1_ACCOUNT.pwd
    }, function(error, authData) {

      var profileRef = ref.child("users/" + authData.uid + "/profile");

      // try to read the value only once
      profileRef.once('value', function(snapshot) {
        should.exist(snapshot);
        done();
      }, function(errorObj) {
        should.not.exist(errorObj);
        done();
      });

    });

  });

  it('should not allow creating users/simplelogin:2 by user simplelogin:1', function(done) {

    var ref = new Firebase(FB_BASE_URL);

    ref.authWithPassword({
      email: TEST1_ACCOUNT.email,
      password: TEST1_ACCOUNT.pwd
    }, function(error, authData) {

      var profileRef = ref.child("users/" + 'simplelogin:2' + "/profile");

      var objectToWrite = {
        email: TEST1_ACCOUNT.email,
        name: 'First Tester'
      };

      profileRef.set(objectToWrite, function(error) {
        should.exist(error);
        done();
      });

    });

  });

  it('should not allow reading users/simplelogin:1 by user simplelogin:2', function(done) {

    var ref = new Firebase(FB_BASE_URL);

    ref.authWithPassword({
      email: TEST2_ACCOUNT.email,
      password: TEST2_ACCOUNT.pwd
    }, function(error, authData) {

      var profileRef = ref.child("users/" + 'simplelogin:1' + "/profile");

      profileRef.once('value', function(snapshot) {
        should.not.exist(snapshot);
        done();
      }, function(errorObj) {
        should.exist(errorObj);
        done();
      });

    });

  });

});