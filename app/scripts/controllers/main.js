'use strict';

/**
 * @ngdoc function
 * @name dprCalcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dprCalcApp
 */
angular.module('dprCalcApp')
  .controller('MainCtrl', function ($scope, $http) {

     $http.get('data/class-list.json').success(function(data) {
        $scope.classes = data;
    });

    $scope.orderProp = 'name';

  });
