// Mind-app

// angular.module is a global place for creating, registering and retrieving Angular modules
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic','starter.controllers','ngCordova','firebase','angular-timeline','jett.ionic.filter.bar','pascalprecht.translate','starter.factories','angularMoment','starter.filters'])

.run(function($ionicPlatform,$rootScope,Auth, $ionicLoading,$location) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      //org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  
    //Loading in app purchase from Apple developpers plateform
    if((window.device && device.platform == "iOS") && window.storekit) {
                storekit.init({
                    debug:    true,
                    ready:    function() {
                        storekit.load(["mindSubscription"], function (products, invalidIds) {
                            console.log("In-app purchases are ready to go");
                        });
                    },
                    purchase: function(transactionId, productId, receipt) {
                        if(productId === 'mindSubscription') {
                            console.log("Purchased product id 1");
                        }
                    },
                    restore:  function(transactionId, productId, transactionReceipt) {
                        if(productId === 'mindSubscription') {
                            console.log("Restored product id 1 purchase")
                        }
                    },
                    error:    function(errorCode, errorMessage) {
                        console.log("ERROR: " + errorMessage);
                    }
                });
            }



       //Important: Store user credential in the rootscope variable
       //We can use this variable in the others file 
      
      $rootScope.authData = {};
      
      Auth.$onAuth(function (authData) {
                    if (authData) {
                        console.log("Connecté:", authData.uid);
                       
                        /* STORE AUTHDATA */
                        $rootScope.authData = authData.uid;
                        
                        
                      } else {

                console.log("Logged out");
                $ionicLoading.hide();
                $location.path('/login');

                }


                });
      
      //When the application is closed, or the user logout

         $rootScope.logout = function () {
            console.log("Logging out from the app");
            $ionicLoading.show({
                template: 'Logging Out...'
            });

            Auth.$unauth();

        };

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  

//Login Page
.state('login', {
    url: '/login',
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl',
    resolve: {
            wait : 'Auth'
           }
})
  

//Menu page
.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller : 'ContactCtrl'
     
})

  
//Contact page 
 .state('app.contact', {
    url: '/contact',
    views: {
      'menuContent': {
        templateUrl: "templates/contact.html",
        controller : 'ContactCtrl'

      }
    }
  })



//Profil page 
 .state('app.profil', {
    url: '/profil',
    views: {
      'menuContent': {
        templateUrl: "templates/profil.html",
        controller : 'ProfilCtrl'

      }
    }
  })

  
//Activities page
 .state('app.activite', {
      url: '/contact/:id',
      views : {
        'menuContent': {
                templateUrl: 'templates/activite.html',
                controller: 'ActiviteCtrl'
        }
      }
  });

  
// if none of the above states are matched, then redirect to the login page
$urlRouterProvider.otherwise('/login');
    
});
