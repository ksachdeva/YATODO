var fbUtils = require('./fbutils.js');

var Firebase = require('firebase');
var chai = require('chai');

var expect = chai.expect;
var should = chai.should();

var sampleRules = require('./data/test3_rules.json');
var sampleData = require('./data/test3_data.json');

var FB_BASE_URL = fbUtils.BASE_URL;

var TEST1_ACCOUNT = fbUtils.TEST1_ACCOUNT;
var TEST2_ACCOUNT = fbUtils.TEST2_ACCOUNT;
var TEST3_ACCOUNT = fbUtils.TEST3_ACCOUNT;

describe('Stage3 Test Cases', function() {

  beforeEach(function(done) {
    // this code will run before each test case
    // so that we have the clean test data
    // on firebase server

    // upload rules & data
    fbUtils.loadRulesAndData(sampleRules, sampleData)
      .catch(console.error)
      .finally(done);
  });

  it('should allow simplelogin:2 (member) to create todolist for himself', function(done) {

    var ref = new Firebase(FB_BASE_URL);

    ref.authWithPassword({
      email: TEST2_ACCOUNT.email,
      password: TEST2_ACCOUNT.pwd
    }, function(error, authData) {

      var todoRef = ref.child("organizations").child("-uniqueOrgId_1").child("todos").child("uniqueStaffId_2");

      todoRef.push({
        title: 'My first to do'
      }, function(error) {
        should.not.exist(error);
        done();
      });

    });

  });

  it('should allow simplelogin:1 (admin) to create todolist for simplelogin:2 (member)', function(done) {

    var ref = new Firebase(FB_BASE_URL);

    ref.authWithPassword({
      email: TEST1_ACCOUNT.email,
      password: TEST1_ACCOUNT.pwd
    }, function(error, authData) {

      var todoRef = ref.child("organizations").child("-uniqueOrgId_1").child("todos").child("uniqueStaffId_2");

      todoRef.push({
        title: 'A todo created by admin for member'
      }, function(error) {
        should.not.exist(error);
        done();
      });

    });

  });

  it('should allow simplelogin:1 (admin) to read todolist of simplelogin:2 (member)', function(done) {

    // we need to first create the todo list for simple login 2
    var ref = new Firebase(FB_BASE_URL);

    ref.authWithPassword({
      email: TEST2_ACCOUNT.email,
      password: TEST2_ACCOUNT.pwd
    }, function(error, authData) {

      var todoRef = ref.child("organizations").child("-uniqueOrgId_1").child("todos").child("uniqueStaffId_2");

      todoRef.push({
        title: 'My first to do'
      }, function(error) {
        should.not.exist(error);

        // now we would log as admin and try to read his list
        ref.authWithPassword({
          email: TEST1_ACCOUNT.email,
          password: TEST1_ACCOUNT.pwd
        }, function(error, authData) {

          var todoRef = ref.child("organizations").child("-uniqueOrgId_1").child("todos").child("uniqueStaffId_2");

          todoRef.once("value", function(snapShot) {
            should.exist(snapShot);
            done();
          }, function(error) {
            should.not.exist(error);
            done();
          });

        });

      });

    });

  });

  it('should not allow simplelogin:2 (member) to read todolist of other users', function(done) {

    // we need to first create the todo list for simple login 1
    var ref = new Firebase(FB_BASE_URL);

    ref.authWithPassword({
      email: TEST1_ACCOUNT.email,
      password: TEST1_ACCOUNT.pwd
    }, function(error, authData) {

      var todoRef = ref.child("organizations").child("-uniqueOrgId_1").child("todos").child("uniqueStaffId_1");

      todoRef.push({
        title: 'My first to do'
      }, function(error) {
        should.not.exist(error);

        // now we would log as admin and try to read his list
        ref.authWithPassword({
          email: TEST2_ACCOUNT.email,
          password: TEST2_ACCOUNT.pwd
        }, function(error, authData) {

          var todoRef = ref.child("organizations").child("-uniqueOrgId_1").child("todos").child("uniqueStaffId_1");

          todoRef.once("value", function(snapShot) {
            should.not.exist(snapShot);
            done();
          }, function(error) {
            should.exist(error);
            done();
          });

        });

      });

    });

  });


});