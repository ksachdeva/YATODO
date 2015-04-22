var yatodo_todo = angular.module('yatodo.todo', []);

yatodo_todo.controller('ListMyTodoCtrl', ListMyTodoCtrl);

function ListMyTodoCtrl($scope, $rootScope, BASE_FIREBASE_URL, $firebaseArray) {

  $scope.todos_by_me = [];

  var ref = new Firebase(BASE_FIREBASE_URL);

  $scope.addNewTodo = function() {

    var selected_org = $rootScope.selected_org;

    // we simply create a random todo for now
    var myTodoRef = ref.child("organizations").child(selected_org.orgId).child("todos").child(selected_org.staffId);

    myTodoRef.push({
      title: 'A new todo'
    });
  };

  function init() {
    var selected_org = $rootScope.selected_org;

    var myTodoRef = ref.child("organizations").child(selected_org.orgId).child("todos").child(selected_org.staffId);

    // peform binding with todos_by_me
    $scope.todos_by_me = $firebaseArray(myTodoRef);

  }

  init();

}