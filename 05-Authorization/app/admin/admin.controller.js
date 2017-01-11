(function () {

  'use strict';

  angular
    .module('app')
    .controller('AdminController', adminController);

  adminController.$inject = ['authService'];

  function adminController(authService) {

    var vm = this;
    vm.auth = authService;

  }

})();