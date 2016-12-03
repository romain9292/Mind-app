angular.module('starter.factories', ['firebase'])
         

//Create service call "Auth" to authenticate user on the app

.factory("Auth", ["$firebaseAuth", "$rootScope", function($firebaseAuth, $rootScope) {
           
		var ref = new Firebase("https://sophro.firebaseio.com");
        return $firebaseAuth(ref);

}])


//Create service call "Contacts" with Firebase array; object and rootScope variable

 .factory('Contacts', function($firebaseArray, $firebaseObject, $rootScope) {
     // Might use a resource here that returns a JSON array
  var contacts = new Firebase("https://sophro.firebaseio.com/users/" + $rootScope.authData + "/contacts");

return $firebaseArray(contacts);

})

//Create service call "Activities" with child users to retrieve activities for each contacts

 .factory('Activites', function($firebaseArray,$rootScope,$stateParams) {
     // Might use a resource here that returns a JSON array
var activites = new Firebase("https://sophro.firebaseio.com/").child("users").child($rootScope.authData).child("contacts");
  
  return $firebaseArray(activites);


});
