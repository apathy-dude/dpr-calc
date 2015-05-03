'use strict';

/**
 * @ngdoc function
 * @name dprCalcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dprCalcApp
 */
angular.module('dprCalcApp')
  .controller('MainCtrl', function ($scope) {
      $scope.charactersCount = 0;
      function emptyCharacter() {
          var id = $scope.charactersCount;
          $scope.charactersCount++;
          return {
              'name': 'character-' + id
          };
      }

      $scope.characters = [emptyCharacter()];
      $scope.selectedCharacter = 0;

      $scope.emptyCharacter = emptyCharacter;
      $scope.selectCharacter = function(ind) {
          $scope.selectedCharacter = ind;
      };
      $scope.removeCharacter = function(ind) {
          $scope.characters.splice(ind, 1);
          if($scope.selectedCharacter > ind) {
              $scope.selectedCharacter--;
          }
          else if($scope.characters.length === 0) {
              $scope.selectedCharacter = 0;
          }
          else if($scope.selectedCharacter > $scope.characters.length - 1) {
              $scope.selectedCharacter = $scope.characters.length - 1;
          }
      };
  });
