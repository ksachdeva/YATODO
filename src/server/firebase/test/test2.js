var fbUtils = require('./fbutils.js');

var Firebase = require('firebase');
var chai = require('chai');

var expect = chai.expect;
var should = chai.should();

var sampleRules = require('./data/test2_rules.json');
var sampleData = require('./data/test2_data.json');

var FB_BASE_URL = fbUtils.BASE_URL;

var TEST1_ACCOUNT = fbUtils.TEST1_ACCOUNT;
var TEST2_ACCOUNT = fbUtils.TEST2_ACCOUNT;
var TEST3_ACCOUNT = fbUtils.TEST3_ACCOUNT;

describe('Stage2 Test Cases', function() {

  beforeEach(function(done) {
    // this code will run before each test case
    // so that we have the clean test data
    // on firebase server

    // upload rules & data
    fbUtils.loadRulesAndData(sampleRules, sampleData)
      .catch(console.error)
      .finally(done);
  });


  it('should allow reading organizations list of users/simplelogin:1 by user simplelogin:1', function(done) {

    var ref = new Firebase(FB_BASE_URL);

    ref.authWithPassword({
      email: TEST1_ACCOUNT.email,
      password: TEST1_ACCOUNT.pwd
    }, function(error, authData) {

      var orgRef = ref.child("users/" + authData.uid + "/organizations");

      // try to read the value only once
      orgRef.once('value', function(snapshot) {
        should.exist(snapshot);
        done();
      }, function(errorObj) {
        should.not.exist(errorObj);
        done();
      });

    });

  });

  it('should not allow reading users/simplelogin:1 organizations by user simplelogin:2', function(done) {

    var ref = new Firebase(FB_BASE_URL);

    ref.authWithPassword({
      email: TEST2_ACCOUNT.email,
      password: TEST2_ACCOUNT.pwd
    }, function(error, authData) {

      var orgRef = ref.child("users/" + 'simplelogin:1' + "/organizations");

      orgRef.once('value', function(snapshot) {
        should.not.exist(snapshot);
        done();
      }, function(errorObj) {
        should.exist(errorObj);
        done();
      });

    });

  });

  it('should allow only admin to create new staff members', function(done) {

    var ref = new Firebase(FB_BASE_URL);

    ref.authWithPassword({
      email: TEST1_ACCOUNT.email,
      password: TEST1_ACCOUNT.pwd
    }, function(error, authData) {

      var staffRef = ref.child("organizations").child("-uniqueOrgId_1").child("staff");

      staffRef.push({
        "email": TEST2_ACCOUNT.email,
        "password": TEST2_ACCOUNT.pwd,
        role: 1
      }, function(error) {
        should.not.exist(error);
        done();
      });

    });

  });


});