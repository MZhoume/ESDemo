angular.module('app', ['ionic', 'ngLoadScript', 'app.controllers', 'app.services'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      .state('tab.welcome', {
        url: '/welcome',
        views: {
          'tab-welcome': {
            templateUrl: 'templates/tab-welcome.html',
            controller: 'WelcomeCtrl'
          }
        }
      })

      .state('tab.sense', {
        url: '/sense',
        views: {
          'tab-sense': {
            templateUrl: 'templates/tab-sense.html',
            controller: 'SenseCtrl'
          }
        }
      })
      .state('tab.sense-question', {
        url: '/sense/:qId',
        views: {
          'tab-sense': {
            templateUrl: 'templates/sense-question.html',
            controller: 'SenseQuestionCtrl'
          }
        }
      })
      .state('tab.finished', {
        url: '/finished',
        views: {
          'tab-sense': {
            templateUrl: 'templates/finished.html',
            controller: 'FinishedCtrl'
          }
        }
      })

      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: 'templates/tab-settings.html',
            controller: 'SettingsCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/tab/welcome');
  });
