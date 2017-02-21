(function () {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$state', 'angularAuth0'];

  function authService($state, angularAuth0) {

    function login(username, password) {
      angularAuth0.client.login({
        realm: 'Username-Password-Authentication',
        username: username,
        password: password,
      }, function(err, authResult) {
        if (err) alert(err);
        if (authResult && authResult.idToken) {
          setSession(authResult);
          $state.go('home');
        }
      });
    }

    function signup(username, password) {
      angularAuth0.redirect.signupAndLogin({
        connection: 'Username-Password-Authentication',
        email: username,
        password: password
      });
    }

    function loginWithGoogle() {
      angularAuth0.authorize({
        connection: 'google-oauth2'
      });
    }
    
    function handleParseHash() {
      angularAuth0.parseHash(function(err, authResult) {
        if (authResult && authResult.idToken) {
          setSession(authResult);
          $state.go('home');
        }
      });
    }

    function setSession(authResult) {
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
    }
    
    function logout() {
      // Remove tokens and expiry time from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
    }
    
    function isAuthenticated() {
      // Check whether the current time is past the 
      // access token's expiry time
      let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }

    return {
      login: login,
      signup: signup,
      loginWithGoogle: loginWithGoogle,
      handleParseHash: handleParseHash,
      logout: logout,
      isAuthenticated: isAuthenticated
    }
  }
})();
