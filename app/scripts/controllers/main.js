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

    $scope.options = {
        'bab': [ '1', '0.75', '0.5' ],
        'hd': [ '12', '10', '8', '6' ],
        'skills': ['8', '6', '4', '2' ],
        'saves': [ 'HIGH', 'LOW' ]
    };

    $scope.orderProp = 'name';

  });
