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
      var charactersCount = 0;
      function emptyCharacter() {
          var id = charactersCount;
          charactersCount++;
          return {
              'name': 'Character-' + id,
              'levels': [],
              'race': 'Human',
              'class': '',
              'selectedLevel': null,
              'selectedLevelIndex': -1,
              'abilityScores': {
                  'strength': 10,
                  'dexterity': 10,
                  'constitution': 10,
                  'intelligence': 10,
                  'wisdom': 10,
                  'charisma': 10
              }
          };
      }

      function emptyLevel() {
          var lastLevel = 0;
          if($scope.selectedCharacter.levels.length > 0) {
              lastLevel = _.max($scope.selectedCharacter.levels, function(lvl) {
                  var level = Number.parseInt(lvl.level);
                  return level === Number.NAN ? 0 : level;
              }).level;
          }

          return {
              'level': lastLevel + 1,
              'applyPreviousLevels': true,
              'abilityScoreChanges': {
                  'strength': 0,
                  'dexterity': 0,
                  'constitution': 0,
                  'inteligence': 0,
                  'wisdom': 0,
                  'charisma': 0
              },
              'abilityScoreEnhancements': {
                  'strength': 0,
                  'dexterity': 0,
                  'constitution': 0,
                  'inteligence': 0,
                  'wisdom': 0,
                  'charisma': 0
              },
              'attackGroups': [],
              'equipment': [],
              'feats': [],
              'skills': [],
              'ac': { 'base': { 'value': 10, 'flat-footed': true, 'touch': true } },
              'saves': {
                  'fortitude': { 'base': 0, 'abilityScores': ['constitution'] },
                  'reflex': { 'base': 0, 'abilityScores': ['dexterity'] },
                  'will': { 'base': 0, 'abilityScores': ['wisdom'] }
              }

          };
      }

      // Character tab management
      $scope.characters = [];
      $scope.selectedCharacterIndex = -1;
      $scope.selectedCharacter = null;

      $scope.selectCharacter = function(ind) {
          $scope.clearEdit();
          $scope.selectedCharacterIndex = ind;

          if(ind === -1) {
              $scope.selectedCharacter = null;
          }
          else {
              $scope.selectedCharacter = $scope.characters[ind];
          }
      };
      $scope.addCharacter = function() {
          $scope.characters.push(emptyCharacter());
          $scope.selectCharacter($scope.characters.length - 1);
      };
      $scope.removeCharacter = function(ind) {
          $scope.characters.splice(ind, 1);
          if($scope.selectedCharacterIndex > ind) {
              $scope.selectCharacter($scope.selectedCharacterIndex - 1);
          }
          else if($scope.characters.length === 0) {
              $scope.selectCharacter(-1);
          }
          else if($scope.selectedCharacterIndex > $scope.characters.length - 1) {
              $scope.selectCharacter($scope.characters.length - 1);
          }
      };

      // Level tab management
      $scope.selectLevel = function(ind) {
          var character = $scope.selectedCharacter;
          $scope.clearEdit();
          character.selectedLevelIndex = ind;

          if(ind === -1) {
              character.selectedLevel = null;
          }
          else {
              character.selectedLevel = $scope.selectedCharacter.levels[ind];
          }
      };
      $scope.addLevel = function() {
          var character = $scope.selectedCharacter;
          $scope.selectedCharacter.levels.push(emptyLevel());
          character.selectedLevel = $scope.selectLevel($scope.selectedCharacter.levels.length - 1);
      };
      $scope.removeLevel = function(ind) {
          var character = $scope.selectedCharacter;
          $scope.selectedCharacter.levels.splice(ind, 1);
          if(character.selectedLevelIndex > ind) {
              $scope.selectLevel(character.selectedLevelIndex - 1);
          }
          else if($scope.selectedCharacter.levels.length === 0) {
              $scope.selectLevel(-1);
          }
          else if(character.selectedLevelIndex > $scope.selectedCharacter.levels.length -1){
              $scope.selectLevel($scope.characters.length -1);
          }
      };

      // Edit management
      $scope.edit = null;
      $scope.editTemp = null;
      $scope.setEdit = function(field, temp) {
          $scope.edit = field;
          if(temp) {
              var target = $scope;
              var fields = temp.split('.');
              while(fields.length > 1) {
                  target = target[fields.shift()];
              }
              $scope.editTemp = { field: temp, value: target[fields[0]] };
          }
          else {
              $scope.editTemp = null;
          }
      };
      $scope.clearEdit = function() {
          $scope.edit = null;
      };
      $scope.cancelEdit = function() {
          if($scope.editTemp === null) {
              return;
          }

          var target = $scope;
          var fields = $scope.editTemp.field.split('.');
          while(fields.length > 1) {
              target = target[fields.shift()];
          }

          target[fields[0]] = $scope.editTemp.value;
          $scope.editTemp = null;

          $scope.clearEdit();
      };

      // Character management
      $scope.getAbilitymod = function(score) {
          score = Number.parseInt(score);
          return Math.floor((score - 10) / 2);
      };
      $scope.abilityScores = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

      // Initialization
      $scope.addCharacter();
  }
);
