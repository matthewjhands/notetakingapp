(function(){

  var app = angular.module('notesApp',['ngRoute', 'ngMaterial']);

  app.config(['$locationProvider', '$routeProvider',
      function ($locationProvider, $routeProvider) {

        $routeProvider
          .when('/', {
            templateUrl: '/partials/notes-view.html',
            controller: 'notesController'
          })
          .when('/login', {
             templateUrl: '/partials/login.html',
             controller: 'loginController',
          })
          .otherwise('/');
      }
  ]);

  app.run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {
      $rootScope.$on('$routeChangeStart', function (event) {

          if ($location.path() == "/login"){
             return;
          }

          if (!AuthService.isLoggedIn()) {
              console.log('DENY');
              event.preventDefault();
              $location.path('/login');
          }
      });
  }]);


  app.service('AuthService', function($http){
    // bad var names.. "loggedUser" is set to the full http response
        var loggedUser = null;

        function login (username, password){
            return $http.post("api/login", {username: username, password: password}).then(function(response){
                loggedUser = response;
                return response;
            }, function(error){
                loggedUser = null;
                return response;
            })
        }

        function isLoggedIn(){
            return loggedUser != null;
        }
        return {
            login : login,
            isLoggedIn: isLoggedIn
        }
  });

  app.controller('loginController', function($scope, AuthService, $location){

    $scope.invalidCreds = false;
    $scope.login = {
        username : null,
        password : null
    };

    $scope.login = function(){
        AuthService.login($scope.login.username, $scope.login.password).then(function(data){
            console.log(data);

            if(data["status"] == 401){
                $scope.invalidCreds = true;
            } else if(data["status"] == 200) {
                $location.path("/");
            }

        }, function(error){
            console.log(error);
            
        });
    };
  });


  app.controller('notesController', function($scope){

    $scope.isEditCreateView = false;

    $scope.newNoteView = function(){
        $scope.isEditCreateView = true;
    };

    $scope.deleteNote = function (i) {
      var r = confirm("Are you sure you want to delete this note?");
      if (r == true){
        //TODO delete the note
      }
    };

    $scope.viewNote = function(){
        //TODO
    }
  });

})();