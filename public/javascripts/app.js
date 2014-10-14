angular.module('mcc', ['ngRoute'])
.config(function($locationProvider, $routeProvider){
  $locationProvider.html5Mode(true);
  $routeProvider.when('', {
    templateUrl: '/templates/index.html',
  }).when('/', {
    templateUrl: '/templates/index.html',
  }).when('/show/:id', {
    templateUrl: '/templates/show.html',
  }).when('/edit/:id', {
    templateUrl: '/templates/edit.html',
  }).when('/create', {
    templateUrl: '/templates/create.html',
  });
})
.service('Contacts', function($http, $q, $routeParams){
  function getData(resp){ return resp.data; }
  function loadCurrent(service){
    return service.get($routeParams.id).then(function(contact){
      angular.copy(contact, current);
      return contact;
    });
  }

  var BASE_URL = '/api/contacts', current = {}, currentPromise = $q.when(current);

  return {
    index: function(){
      return $http.get(BASE_URL).then(getData);
    },
    get: function(id){
      return $http.get(BASE_URL + '/' + id).then(getData);
    },
    current: function(){
      if($routeParams.id && current._id !== $routeParams.id){
        angular.copy({}, current);
        loadCurrent(this);
      }
      return currentPromise;
    },
    create: function(contact){
      return $http.post(BASE_URL, contact).then(getData);
    },
    update: function(contact){
      return $http.put(BASE_URL + '/' + contact.id, contact).then(getData);
    },
    delete: function(id){
      return $http.delete(BASE_URL + '/' + id).then(getData);
    }
  };
})
.controller('Navigation', function(Contacts, $location){
  var self = this;
  Contacts.current().then(function(contact){
    self.contact = contact;
  });

  this.pathEquals = function(path){
    return $location.path() === path;
  };
  this.pathStarts = function(path){
    return $location.path().indexOf(path) === 0;
  };
})
.controller('Index', function(Contacts){
  var self = this;
  Contacts.index().then(function(contacts) { self.contacts = contacts; });
})
.controller('Show', function(Contacts){
  var self = this;
  Contacts.current().then(function(contact) { self.contact = contact; });
})
.controller('Edit', function(Contacts, $location){
  var self = this, originalContact = null;
  Contacts.current().then(function(contact) {
    originalContact = contact;
    self.contact = angular.copy(contact);
  });

  this.save = function(contact){
    Contacts.update(contact).then(function(){
      $location.path('/show/' + contact.id);
    });
  };

  this.changed = function(contact){
    return !angular.equals(contact, originalContact);
  };

  this.cancelChanges = function(){
    self.contact = angular.copy(originalContact);
  };

  this.cancel = function(contact){
    $location.path('/show/' + contact._id);
  };
})
.controller('Create', function(Contacts, $location){
  this.contact = {};
  this.create = function(contact){
    Contacts.create(contact).then(function(createdContact){
      $location.path('/show/' + createdContact._id);
    });
  };

  this.cancel = function(){
    $location.path('/');
  };
});
