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


  app.controller('notesController', function($scope, $http){

    $scope.isEditCreateView = false;
    $scope.selectedNote = null;

    $scope.notes = {}; 

    $scope.newNoteView = function(){
        $scope.isEditCreateView = true;
        $scope.selectedNote = {body: "", title: ""}; // note no id - this is set by server
    };

    $scope.loadNotes = function() {
        return $http.get("/api/notes").then(function(response){
            $scope.notes = {}; // clear existing
            response.data.forEach(element => {
                $scope.notes[element.id] = element;
            });
            console.log("Notes obj loaded: ", $scope.notes);
        });
    }

    $scope.deleteNote = function (i) {
      var r = confirm("Are you sure you want to delete this note?");
      if (r == true){
        return $http.delete("/api/notes/" + $scope.selectedNote.id, $scope.selectedNote).then(function(response){
            console.log("Got DELETE Response ", response);
            $scope.loadNotes(); // refresh notes list
            $scope.clearView(); 
        });
      }
    };

    $scope.viewNote = function(note){
        // clone note so as not to update preview until save is clicked
        noteClone = Object.assign({}, note); 
        $scope.selectedNote = noteClone; 
        $scope.isEditCreateView = true;
        console.log("Viewing note ", note);
    }

    $scope.saveNote = function() {
        if($scope.selectedNote.id == null){
            // no note id - this must be a new note
            $http.post("/api/notes", $scope.selectedNote).then(function(response){
                console.log("Got POST Response ", response);

                // refresh notes list
                $scope.loadNotes().then(function(){
                    $scope.viewNote($scope.notes[response.data.id]); // reload note with id into view
                });
                
            });
        } else {
            // update existing note
            $http.put("/api/notes/" + $scope.selectedNote.id, $scope.selectedNote).then(function(response){
                console.log("Got PUT Response ", response);

                // refresh notes list
                $scope.loadNotes().then(function(){
                    $scope.viewNote($scope.notes[response.data.id]); // in theory shouldn't be necessary - belt and braces
                });
            });
        }
    }

    $scope.clearView = function() {
        $scope.isEditCreateView = false;
        $scope.selectedNote = null;
    }

    $scope.loadNotes(); // load notes on page load
  });

})();