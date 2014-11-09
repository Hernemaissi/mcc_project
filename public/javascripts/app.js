angular.module('mcc', ['ngRoute'])
.config(function($locationProvider, $routeProvider){
  $locationProvider.html5Mode(true);
  $routeProvider.when('', {
    templateUrl: '/templates/contacts/index.html',
  }).when('/', {
    templateUrl: '/templates/contacts/index.html',
  }).when('/edit/:id', {
    templateUrl: '/templates/contacts/edit.html',
  }).when('/create', {
    templateUrl: '/templates/contacts/create.html',
  }).when('/groups/', {
    templateUrl: '/templates/groups/index.html',
  }).when('/groups/edit/:id', {
    templateUrl: '/templates/groups/edit.html',
  }).when('/groups/create', {
    templateUrl: '/templates/groups/create.html',
  });
})
.filter('exclude', function(filterFilter){
  return function(array, exclusions){
    if(angular.isUndefined(array) ||  angular.isUndefined(exclusions)){
      return array;
    }

    return filterFilter(array, function(obj){ return exclusions.indexOf(obj.id) === -1; });
  };
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
  SimpleHttpService.prototype.create = function(entity){
    return $http.post(this.baseUrl, entity).then(getData);
  };
  SimpleHttpService.prototype.update = function(entity){
    return $http.put(this.baseUrl + '/' + entity._id, entity).then(getData);
  };
  SimpleHttpService.prototype.delete = function(entity){
    return $http.delete(this.baseUrl + '/' + entity._id).then(getData);
  };

  return SimpleHttpService;
})
.service('Contacts', function($http, $q, $routeParams, SimpleHttpService){
  return new SimpleHttpService('/api/contacts');
})
.service('Groups', function($http, $q, $routeParams, SimpleHttpService){
  function getData(resp){ return resp.data; }

  var GroupService = function(baseUrl){
    this.__data = {};
    this.__promise = $q.when(this.__data);
    this.baseUrl = baseUrl;
  };
  angular.forEach(SimpleHttpService.prototype, function(method, key){
    GroupService.prototype[key] = method;
  });

  GroupService.prototype.addContact = function(group, contact){
    return $http.post(this.baseUrl + '/' + group._id + '/contacts/' + contact._id).then(getData);
  };

  GroupService.prototype.removeContact = function(group, contact){
    return $http.delete(this.baseUrl + '/' + group._id + '/contacts/' + contact._id).then(getData);
  };

  return new GroupService('/api/groups');
})
.controller('Navigation', function($location, Contacts, Groups){
  var self = this;
  Contacts.current().then(function(contact){
    self.contact = contact;
  });

  Groups.current().then(function(group){
    self.group = group;
  });

  this.pathEquals = function(path){
    return $location.path() === path;
  };
  this.pathStarts = function(path){
    return $location.path().indexOf(path) === 0;
  };
  this.pathContains = function(path){
    return $location.path().indexOf(path) !== -1;
  };
})
.controller('ContactIndex', function(Contacts){
  var self = this;
  Contacts.index().then(function(contacts) { self.contacts = contacts; });

  this.delete = function(contact){
    Contacts.delete(contact).then(function(){
      self.contacts.splice(self.contacts.indexOf(contact), 1);
    });
  };
})
.controller('ContactEdit', function(Contacts, $location){
  var self = this, originalContact = null;
  Contacts.current().then(function(contact) {
    originalContact = contact;
    self.contact = angular.copy(contact);
  });

  this.save = function(contact){
    Contacts.update(contact).then(function(){
      angular.copy(contact, originalContact);
    });
  };

  this.changed = function(contact){
    return !angular.equals(contact, originalContact);
  };

  this.cancelChanges = function(){
    self.contact = angular.copy(originalContact);
  };

  this.cancel = function(){
    $location.path('/contacts');
  };
})
.controller('ContactCreate', function(Contacts, $location){
  this.contact = {};
  this.create = function(contact){
    Contacts.create(contact).then(function(createdContact){
      $location.path('/edit/' + createdContact._id);
    });
  };

  this.cancel = function(){
    $location.path('/');
  };
})
.controller('GroupIndex', function(Groups){
  var self = this;
  Groups.index().then(function(groups) { self.groups = groups; });

  this.delete = function(group){
    Groups.delete(group).then(function(){
      self.groups.splice(self.groups.indexOf(group), 1);
    });
  };
})
.controller('GroupEdit', function($location, Groups, Contacts){
  var self = this, originalGroup = null;
  Groups.current().then(function(group) {
    originalGroup = group;
    self.group = angular.copy(group);
    self.members = [];
    self.contacts = [];
    Contacts.index().then(function(contacts){
      self.contacts = contacts;
      angular.forEach(contacts, function(contact){
        if(self.group.members.indexOf(contact._id) !== -1){
          self.members.push(contact);
        }
      });
    });
  });

  this.save = function(group){
    Groups.update(group).then(function(){
      angular.copy(group, originalGroup);
    });
  };

  this.addContact = function(group, contact){
    Groups.addContact(group, contact).then(function(){
      self.members.push(contact);
    });
  };

  this.removeContact = function(group, contact){
    Groups.removeContact(group, contact).then(function(){
      self.members.splice(self.members.indexOf(contact._id), 1);
    });
  };

  this.changed = function(group){
    return !angular.equals(group, originalGroup);
  };
})
.controller('GroupCreate', function(Groups, $location){
  this.group = {};
  this.create = function(group){
    Groups.create(group).then(function(createdContact){
      $location.path('/groups/edit/' + createdContact._id);
    });
  };

  this.cancel = function(){
    $location.path('/groups');
  };
});
