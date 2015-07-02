'use strict';

/**
 * @ngdoc function
 * @name dprCalcApp.controller:ClassListCtrl
 * @description
 * # ClassListCtrl
 * Controller of the dprCalcApp
 */
angular.module('dprCalcApp')
  .controller('ClassListCtrl', function ($scope, $http) {
    var books = ['acg', 'crb', 'apg', 'uc', 'um'];

    $scope.classes = [];
    function appendClass(data) {
        $scope.classes = $scope.classes.concat(data);
    }

    for(var b in books) {
        $http.get('data/' + books[b] + '/class-list.json').success(appendClass);
    }

    $scope.options = {
        'bab': [ '1', '0.75', '0.5' ],
        'hd': [ '12', '10', '8', '6' ],
        'skills': ['8', '6', '4', '2' ],
        'saves': [ 'HIGH', 'LOW' ]
    };

    $scope.orderProp = 'name';

  });
