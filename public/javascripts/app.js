angular.module('mcc', ['ngRoute'])
.config(function($locationProvider, $routeProvider){
  $locationProvider.html5Mode(true);
  $routeProvider.when('', {
    templateUrl: '/templates/contacts/index.html',
  }).when('/', {
    templateUrl: '/templates/contacts/index.html',
  }).when('/show/:id', {
    templateUrl: '/templates/contacts/show.html',
  }).when('/edit/:id', {
    templateUrl: '/templates/contacts/edit.html',
  }).when('/create', {
    templateUrl: '/templates/contacts/create.html',
  });
})
.factory('SimpleHttpService', function($http, $q, $routeParams){
  function getData(resp){ return resp.data; }
  function loadCurrent(service){
    return service.get($routeParams.id).then(function(current){
      angular.copy(current, service.__data);
      return current;
    });
  }

  var SimpleHttpService = function(baseUrl){
    this.__data = {};
    this.__promise = $q.when(this.__data);
    this.baseUrl = baseUrl;
  };

  SimpleHttpService.prototype.index = function(){
    return $http.get(this.baseUrl).then(getData);
  };
  SimpleHttpService.prototype.get =  function(id){
    return $http.get(this.baseUrl + '/' + id).then(getData);
  };
  SimpleHttpService.prototype.current = function(){
    if($routeParams.id && this.__data._id !== $routeParams.id){
      var self = this;
      angular.copy({}, this.__data);
      return $q.all([this.__promise, loadCurrent(this)]).then(function(){
        return self.__data;
      });
    }
    return this.__promise;
  };
  SimpleHttpService.prototype.create = function(contact){
    return $http.post(this.baseUrl, contact).then(getData);
  };
  SimpleHttpService.prototype.update = function(contact){
    return $http.put(this.baseUrl + '/' + contact._id, contact).then(getData);
  };
  SimpleHttpService.prototype.delete = function(id){
    return $http.delete(this.baseUrl + '/' + id).then(getData);
  };

  return SimpleHttpService;
})
.service('Contacts', function($http, $q, $routeParams, SimpleHttpService){
  return new SimpleHttpService('/contacts');
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
.controller('ContactIndex', function(Contacts){
  var self = this;
  Contacts.index().then(function(contacts) { self.contacts = contacts; });
})
.controller('ContactShow', function(Contacts){
  var self = this;
  Contacts.current().then(function(contact) { self.contact = contact; });
})
.controller('ContactEdit', function(Contacts, $location){
  var self = this, originalContact = null;
  Contacts.current().then(function(contact) {
    originalContact = contact;
    self.contact = angular.copy(contact);
  });

  this.save = function(contact){
    Contacts.update(contact).then(function(){
      $location.path('/show/' + contact._id);
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
.controller('ContactCreate', function(Contacts, $location){
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
