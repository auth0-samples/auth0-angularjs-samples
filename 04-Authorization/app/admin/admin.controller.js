(function () {

  'use strict';

  angular
    .module('app')
    .controller('AdminController', adminController);

  adminController.$inject = ['$http'];

  function adminController($http) {

    var vm = this;
    var API_URL = 'http://localhost:3001/api';
    
    vm.adminPing = function() {
      vm.message = '';
      $http.post(API_URL + '/admin').then(function(result) {
        vm.message = result.data.message;
      }, function(error) {
        vm.message = error.data;
      });
    }

  }

})();