(function () {

  'use strict';

  angular
    .module('app')
    .controller('ProfileController', profileController);

  profileController.$inject = ['authService'];

  function profileController(authService) {

    var vm = this;
    vm.auth = authService;
    vm.profile;

    if (authService.getCachedProfile()) {
      vm.profile = authService.getCachedProfile();
    } else {
      authService.fetchProfile(function(err, profile) {
        vm.profile = profile;
      });
    }

  }

})();