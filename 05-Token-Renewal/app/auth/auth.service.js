(function () {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$state', 'angularAuth0', '$timeout'];

  function authService($state, angularAuth0, $timeout) {

    var userProfile;
    var tokenRenewalTimeout;

    function login() {
      angularAuth0.authorize();
    }
    
    function handleAuthentication() {
      angularAuth0.parseHash(function(err, authResult) {
        if (authResult && authResult.idToken) {
          setSession(authResult);
          $state.go('home');
        } else if (err) {
          $timeout(function() {
            $state.go('home');
          });
          console.log(err);
          alert('Error: ' + err.error + '. Check the console for further details.');
        }
      });
    }

    function getProfile(cb) {
      var accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token must exist to fetch profile');
      }
      angularAuth0.client.userInfo(accessToken, function(err, profile) {
        if (profile) {
          setUserProfile(profile);
        }
        cb(err, profile);
      });
    }

    function setUserProfile(profile) {
      userProfile = profile;
    }

    function getCachedProfile() {
      return userProfile;
    }

    function setSession(authResult) {
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
      scheduleRenewal();
    }
    
    function logout() {
      // Remove tokens and expiry time from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      clearTimeout(tokenRenewalTimeout);
      $state.go('home');
    }
    
    function isAuthenticated() {
      // Check whether the current time is past the 
      // access token's expiry time
      let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }

    function renewToken() {
      angularAuth0.checkSession({},
        function(err, result) {
          if (err) {
            alert(
              'Could not get a new token. ' +
                err.description
            );
          } else {
            setSession(result);
            alert('Successfully renewed auth!');
          }
        }
      );
    }

    function scheduleRenewal() {
      var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      var delay = expiresAt - Date.now();
      if (delay > 0) {
        tokenRenewalTimeout = setTimeout(function() {
          renewToken();
        }, delay);
      }
    }

    return {
      login: login,
      getProfile: getProfile,
      getCachedProfile: getCachedProfile,
      handleAuthentication: handleAuthentication,
      logout: logout,
      isAuthenticated: isAuthenticated,
      renewToken: renewToken,
      scheduleRenewal: scheduleRenewal
    }
  }
})();
