angular.module('starter.controllers', [])

//You will find three main controllers LOGIN/CONTACT/ACTIVITIES
//Login functions : create user - login user - register user
//Contact functions : create contact - edit contact
//Activities functions : create activities - edit activites

//LOGIN CONTROLLER
.controller('LoginCtrl', function($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $ionicPopup, $timeout, $rootScope, $cordovaToast, $location, Auth) {

console.log('Login Controller Initialized');


   $scope.buy = function() {
        if((window.device && device.platform == "iOS") && window.storekit) {
          alert("dans la Fonction");
            storekit.purchase("mindSubscription");
        }
    }
 
    $scope.restore = function() {
        if((window.device && device.platform == "iOS") && window.storekit) {
            storekit.restore();
        }
    }

//Replace the Firebase ref with yours
var ref = new Firebase("https://sophro.firebaseio.com/");
var auth = $firebaseAuth(ref);

//Modal for register user
$ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
}).then(function (modal) {
    $scope.modal = modal;
});


//Create user Function
$scope.createUser = function (user) {
    console.log("Create User Function called");
    if (user && user.email && user.prenom && user.nom && user.password) {
        $ionicLoading.show({
            template: ' <ion-spinner icon="spiral"></ion-spinner><br>Inscription'

        });

        auth.$createUser({
            email: user.email,
            prenom: user.prenom,
            nom:user.nom,
            password: user.password

        }).then(function (userData) {
            alert("Utilisateur créé avec succès!");
            ref.child("users").child(userData.uid).set({
                email: user.email,
                prenom: user.prenom,
                nom:user.nom,
                password: user.password
                
            });

            $ionicLoading.hide();
            $scope.modal.hide();
        }).catch(function (error) {
            alert("Error: " + error);
            $ionicLoading.hide();
        });
    } else
        alert("Merci de remplir tous les champs");
}


//Login Function 
$scope.signIn = function (user) {


    if (user && user.email && user.pwdForLogin) {
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral"></ion-spinner><br>Chargement des contacts'
        });
        auth.$authWithPassword({
            email: user.email,
            password: user.pwdForLogin
        }).then(function (authData) {
            console.log("Logged in as:" + authData.uid);
            $rootScope.email = user.email;
            $rootScope.password = user.pwdForLogin;
            $rootScope.authData = authData.uid;
            
            $ionicLoading.hide();
            $state.go('app.contact');
        }).catch(function (error) {
            alert("La connexion a echoué: " + error.message);
            $ionicLoading.hide();
        });
    } else
        alert("Entrez votre identifiant et votre mot de passe");
}




//Modal conditions d'utilisations
//id = 2 because the first modal is used to display the Register modal
 $ionicModal.fromTemplateUrl('templates/cgu.html', {
      id:'2',
      scope: $scope
      }).then(function(modal) {
      $scope.modal2 = modal;
});



//PopUp for the forgot password
$scope.forget = function () {

var ref = new Firebase('https://sophro.firebaseio.com');

$ionicPopup.prompt({
  title: 'Entrez votre adresse email',
  inputType: 'email'
}).then(function(email) {
  console.log(email);

  ref.resetPassword({
  email: email
}, function(error) {
  if (error) {
    switch (error.code) {
      case "INVALID_USER":
        console.log("The specified user account does not exist.");
        alert("Votre compte n'existe pas, verifiez votre adresse email")
        break;
      default:
        console.log("Error resetting password:", error);
    }
  } else {
    console.log("Password reset email sent successfully!");
    alert("Un email a été envoyé pour réinitialiser votre mot de passe");
  }
});


  
});
    
};
 
})


//CONTACT CONTROLLER
.controller('ContactCtrl', function($scope, $rootScope, $state, $ionicPopup,$ionicListDelegate,$ionicLoading, $ionicModal, $ionicFilterBar,$firebaseArray,$firebaseAuth, $firebaseObject, $firebase,$stateParams, $ionicPopup){

console.log($rootScope.authData);
var contacts = new Firebase("https://sophro.firebaseio.com/users/" + $rootScope.authData + "/contacts");
var Contacts = $firebaseArray(contacts);


$scope.contacts = Contacts;
 
  $scope.doRefresh = function() {
    $scope.contacts = Contacts;
    $scope.$broadcast('scroll.refreshComplete');
  
  };
  
     

 //Affiche la page d'ajout de contact
$ionicModal.fromTemplateUrl('templates/addContact.html', {
      id:'1',
      scope: $scope
      }).then(function(modal) {
      $scope.modal1 = modal;
});


//Affichage Edition 

$ionicModal.fromTemplateUrl('templates/editContact.html', {
      id:'2',
      scope: $scope
      }).then(function(modal) {
      $scope.modal2 = modal;
});



   
  $scope.showAlert2 = function(msg) {
            $ionicPopup.alert({
                title: msg.title,
                template: msg.message,
                okText: 'Ok',
                okType: 'button-positive'
            });
          };




//Add contact function
  $scope.addContact = function(contact) {

      Contacts.$add({
                    
                    nom: contact.nom,
                    prenom : contact.prenom,
                    adresse : contact.adresse || null,
                    cp : contact.cp || null,
                    mail : contact.mail || null,
                    telephone : contact.telephone || null
            
    
                });

                  contact.nom ="";
                  contact.prenom ="";
                  contact.adresse ="";
                  contact.cp ="";
                  contact.mail ="";
                  contact.telephone="";
      

$scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
     title: 'Ajouté',
     template: 'Votre contact a bien été ajouté'
   });
    
   alertPopup.then(function(res) {
      $scope.contacts.$loaded().then(function(contacts) {
      var nombreDeContacts = contacts.length;
      $scope.nombreDeContacts = nombreDeContacts;
      console.log(nombreDeContacts); // data is loaded here
});
     console.log('Alert Pop up ok');
   });
 };
   
     $scope.showAlert();
     $scope.modal1.hide();
    
  };


//Delete contact function 

 $scope.deleteContact = function(id) {

   $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
   title: 'Supprimer',
   template: 'Etes-vous sur de vouloir supprimer ce contact et ses séances?'
   });
   confirmPopup.then(function(res) {
     if(res) {
      Contacts.$remove(id);  
      $scope.contacts.$loaded().then(function(contacts) {
      var nombreDeContacts = contacts.length;
      $scope.nombreDeContacts = nombreDeContacts;

      console.log(nombreDeContacts); // data is loaded here
});
       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
 };


 $scope.showConfirm();       
         

     };

    
//Edit Contact 
$scope.editContact = function (id) {

var Contact = id;

console.log(Contact);

$scope.contact = Contact;

$scope.modal2.show();


$scope.save = function () {

  Contact.nom = $scope.contact.nom;
  Contact.prenom = $scope.contact.prenom;
  Contact.adresse = $scope.contact.adresse || null;
  Contact.cp = $scope.contact.cp || null;
  Contact.mail = $scope.contact.mail || null;
  Contact.telephone = $scope.contact.telephone || null;


Contacts.$save(id);
    
console.log(Contact.nom);

$scope.modal2.hide();

$ionicListDelegate.closeOptionButtons();

}

};



//ionic filter bar 

    var filterBarInstance;

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.contacts,
        update: function (filteredItems) {
          $scope.contacts = filteredItems;
        },
        filterProperties: 'nom'
      });
    };

    $scope.refreshItems = function () {
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
      }

      $timeout(function () {
        getItems();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };

//Show DATA
    

//Logout Function


      $scope.contacts.$loaded().then(function(contacts) {
      var nombreDeContacts = contacts.length;
      $scope.nombreDeContacts = nombreDeContacts;

      console.log(nombreDeContacts); // data is loaded here
});




})
 

//ACTIVITE CONTROLLER
.controller('ActiviteCtrl', function($scope,$state,$stateParams, $ionicModal,$stateParams, $firebaseArray, $ionicFilterBar, $ionicPopup, $rootScope) {
  
var activitesURL = new Firebase("https://sophro.firebaseio.com/users/" + $rootScope.authData + "/contacts/" + $stateParams.id + "/activites");

var Activites = $firebaseArray(activitesURL);

console.log($stateParams.id);
$scope.activites = Activites;

    
 $scope.doRefresh = function() {
    $scope.activites = Activites;
    $scope.$broadcast('scroll.refreshComplete');
    $scope.$apply()
  };


$ionicModal.fromTemplateUrl('templates/addActivite.html', {
    scope: $scope
}).then(function(modal) {
    $scope.modal = modal;
});


//Add actitie function
$scope.addActivite = function(activite) {

    
    Activites.$add({
     
        titre: activite.titre,
        createdAt: Firebase.ServerValue.TIMESTAMP,
        note : activite.note
        
    
    });

          activite.titre="";
          activite.note="";


      $scope.modal.hide();

            $scope.activites.$loaded().then(function(activites) {
      var nombreDactivites = activites.length;
      $scope.nombreDactivites = nombreDactivites;

      console.log(nombreDactivites); // Number of activities
});
    
  };

  $scope.deleteNote = function(activiteId) {

  };
    

      $scope.activites.$loaded().then(function(activites) {
      var nombreDactivites = activites.length;
      $scope.nombreDactivites = nombreDactivites;

      console.log(nombreDactivites); //Number of activities
      }); 

})


//PROFIL CONTROLLER
.controller('ProfilCtrl', function($scope,$rootScope,$ionicPopup) {

$scope.mail = $rootScope.email;

//Change password function
$scope.changePassword = function () {

var ref = new Firebase('https://sophro.firebaseio.com');

  $ionicPopup.prompt({
  title: 'Nouveau mot de passe',
  inputType: 'password'
}).then(function(password) {
  console.log(password);

ref.changePassword({
  email: $rootScope.email,
  oldPassword: $rootScope.password,
  newPassword: password
}, function(error) {
  if (error) {
    switch (error.code) {
      case "INVALID_PASSWORD":
        console.log("The specified user account password is incorrect.");
        break;
      case "INVALID_USER":
        console.log("The specified user account does not exist.");
        break;
      default:
        console.log("Error changing password:", error);
    }
  } else {
    console.log("User password changed successfully!");
    alert("Mot de passe changé");
     // success
  }
    });
  });
};

 
//END OF CONTROLLERS 
});
