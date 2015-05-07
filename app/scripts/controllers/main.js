'use strict';

/**
 * @ngdoc function
 * @name dprCalcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dprCalcApp
 */
angular.module('dprCalcApp')
  .filter('orderObjectBy', function() {
      return function(items, field, reverse) {
          return _.chain(_.keys(items))
            .map(function(item) {
                var i = items[item];
                i._objectKey = item;
                return i;
            })
            .sortBy(function(v) {
              return reverse ? -v[field] : v[field];
          })
          .value();
      };
  })
  .controller('MainCtrl', function ($scope) {
      var charactersCount = 0;
      var BONUS_TYPE = {
          STATIC: 0,
          ABILITY: 1,
          DYNAMIC: 2,
          BAB: 3,
          BASE_ABILITY: 4,
          DICE: 5
      };
      var RENDER_TYPE = {
          INLINE: 0,
          HEADER: 1,
          GROUP: 2
      };

      function getValue(character, level, bonus) {
          var value;
          switch(bonus.type) {
              case BONUS_TYPE.STATIC: value = bonus.value; break;
              case BONUS_TYPE.DYNAMIC: value = bonus.value; break;
              case BONUS_TYPE.ABILITY:
                  var temp = $scope.getStat(character, level, bonus.value);
                  value = $scope.getAbilityMod(temp);
                  break;
              case BONUS_TYPE.BAB: value = $scope.getBab(character, level); break;
              case BONUS_TYPE.BASE_ABILITY: value = character.abilityScores[bonus.value]; break;
              case BONUS_TYPE.DICE:
                var dice = bonus.value.split('d');
                value = (parseInt(dice[1]) / 2 + 0.5) * parseInt(dice[0]);
                break;
          }

          if(typeof value === 'string') {
              value = parseFloat(value);
              value = isNaN(value) ? 0 : value;
          }

          if(bonus.modifier) {
              value *= bonus.modifier;
              value = Math.floor(value);
          }

          return value;
      }

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
                  var level = parseFloat(lvl.level);
                  return isNaN(level) ? 0 : level;
              }).level;
          }

          return {
              // Base items
              'level': lastLevel + 1,
              'attackGroups': [],
              // Ability information TODO: Move to standard stat
              // Standard stats
              // -- Ability Scores
              'strength': {
                  'increase': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
                  'enhance': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 2 },
                  'base': { 'type': BONUS_TYPE.BASE_ABILITY, 'value': 'strength', 'applyOnce': true, 'order': 0 }
              },
              'dexterity': {
                  'increase': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
                  'enhance': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 2 },
                  'base': { 'type': BONUS_TYPE.BASE_ABILITY, 'value': 'dexterity', 'applyOnce': true, 'order': 0 }
              },
              'constitution': {
                  'increase': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
                  'enhance': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 2 },
                  'base': { 'type': BONUS_TYPE.BASE_ABILITY, 'value': 'constitution', 'applyOnce': true, 'order': 0 }
              },
              'intelligence': {
                  'increase': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
                  'enhance': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 2 },
                  'base': { 'type': BONUS_TYPE.BASE_ABILITY, 'value': 'intelligence', 'applyOnce': true, 'order': 0 }
              },
              'wisdom': {
                  'increase': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
                  'enhance': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 2 },
                  'base': { 'type': BONUS_TYPE.BASE_ABILITY, 'value': 'wisdom', 'applyOnce': true, 'order': 0 }
              },
              'charisma': {
                  'increase': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
                  'enhance': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 2 },
                  'base': { 'type': BONUS_TYPE.BASE_ABILITY, 'value': 'charisma', 'applyOnce': true, 'order': 0 }
              },
              // -- End Ability Scores
              'ac': {
                  'base': { 'type': BONUS_TYPE.STATIC, 'value': 10, 'flat-footed': true, 'touch': true, 'applyOnce': true, 'order': 0 },
                  'armor': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'flat-footed': true, 'touch': false, 'applyOnce': true, 'order': 1 },
                  'shield': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'flat-footed': true, 'touch': false, 'applyOnce': true, 'order': 2 },
                  'dexterity': { 'type': BONUS_TYPE.ABILITY, 'value': 'dexterity', 'flat-footed': false, 'touch': true, 'title': 'Dex', 'applyOnce': true, 'order': 3 },
                  'size': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'flat-footed': true, 'touch': true, 'applyOnce': true, 'order': 4 },
                  'natural': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'flat-footed': true, 'touch': false, 'applyOnce': true, 'order': 5 },
                  'deflection': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'flat-footed': true, 'touch': true, 'applyOnce': true, 'order': 6 },
                  'dodge': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'flat-footed': false, 'touch': true, 'applyOnce': true, 'order': 7 },
                  'touch': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'flat-footed': false, 'touch': true, 'applyOnce': true, 'order': 8 },
                  'flat-footed': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'flat-footed': true, 'touch': false, 'applyOnce': true, 'order': 9 },
              },
              // -- Saves
              'fortitude': {
                  'base': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 0 },
                  'constitution': { 'type': BONUS_TYPE.ABILITY, 'value': 'constitution', 'applyOnce': true, 'title': 'Ability', 'order': 1 },
                  'magic': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 2 },
                  'misc': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 3 },
              },
              'reflex': {
                  'base': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 0 },
                  'dexterity': { 'type': BONUS_TYPE.ABILITY, 'value': 'dexterity', 'applyOnce': true, 'title': 'Ability', 'order': 1 },
                  'magic': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 2 },
                  'misc': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 3 },
              },
              'will': {
                  'base': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 0 },
                  'wisdom': { 'type': BONUS_TYPE.ABILITY, 'value': 'wisdom', 'applyOnce': true, 'title': 'Abililty', 'order': 1 },
                  'magic': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 2 },
                  'misc': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 3 },
              },
              // -- End Saves
              'dr': {
                  'base': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 0 },
              },
              'sr': {
                  'base': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 0 },
              },
              'hp': {
                  'level': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 0 },
                  'constitution': { 'type': BONUS_TYPE.ABILITY, 'value': 'constitution', 'title': 'Con', 'order': 1 },
                  'favoured': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 2},
                  'toughness': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 3 },
                  'other': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 4 },
              },
              'bab': {
                  'class': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 0 },
              },
              'initiative': {
                  'dexterity': { 'type': BONUS_TYPE.ABILITY, 'value': 'dexterity', 'applyOnce': true, 'order': 0, 'title': 'Dex' },
                  'misc': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 1 },
              },
              // Non-standard stats
              'movement': {
                  'base': 30,
                  'armor': 30,
                  'fly': 0,
                  'swim': 0,
                  'climb': 0,
                  'burrow': 0
              },
              'equipment': [],
              'feats': [],
              'skills': [],
              'spell-casting': [],
              'abilities': [],
          };
      }

      function emptyAttackGroup() {
          return {
              'name': '',
              'attacks': []
          };
      }

      function emptyAttack() {
          return {
            'weapon': '',
            'damageDice': [],
            'damageBonus': {},
            'hitChance': {},
            'critThreat': 0.05,
            'critMultiplier': 2
          };
      }

      function emptyMeleeAttack() {
          return {
              'weapon': '',
              'damage-dice': [],
              'damage-bonus': {
                  'strength': { 'type': BONUS_TYPE.ABILITY, 'value': 'strength' },
              },
              'hit-chance': {
                  'strength': { 'type': BONUS_TYPE.ABILITY, 'value': 'strength' },
                  'bab': { 'type': BONUS_TYPE.BAB, 'value': 'bab' },
              }
          };
      }

      function emptyRangedAttack() {
          return {
              'weapon': '',
              'damage-dice': [],
              'damage-bonus': {},
              'hit-chance': {
                  'strength': { 'type': BONUS_TYPE.ABILITY, 'value': 'dexterity' },
                  'bab': { 'type': BONUS_TYPE.BAB, 'value': 'bab' },
              }
          };
      }

      $scope.BONUS_TYPE = BONUS_TYPE;
      $scope.RENDER_TYPE = RENDER_TYPE;
      $scope.getValue = getValue;

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
          $scope.addLevel($scope.selectedCharacter);
      };
      $scope.removeCharacter = function(ind) {
          if($scope.characters.length === 1) {
              return;
          }

          $scope.characters.splice(ind, 1);
          if($scope.selectedCharacterIndex >= ind) {
              if($scope.selectedCharacterIndex === 0 || ind === 0) {
                  $scope.selectCharacter(0);
              }
              else {
                  $scope.selectCharacter($scope.selectedCharacterIndex - 1);
              }
          }
          else if($scope.selectedCharacterIndex > $scope.characters.length - 1) {
              $scope.selectCharacter($scope.characters.length - 1);
          }
      };

      // Level tab management
      $scope.selectLevel = function(character, ind) {
          $scope.clearEdit();
          character.selectedLevelIndex = ind;

          if(ind === -1) {
              character.selectedLevel = null;
          }
          else {
              character.selectedLevel = $scope.selectedCharacter.levels[ind];
          }
      };
      $scope.addLevel = function(character) {
          character.levels.push(emptyLevel());
          $scope.selectLevel(character, character.levels.length - 1);
      };
      $scope.removeLevel = function(character, ind) {
          if(character.levels.length === 1) {
              return;
          }

          character.levels.splice(ind, 1);
          if(character.selectedLevelIndex >= ind) {
              if(ind === 0 || character.selectedLevelIndex === 0) {
                  $scope.selectLevel(character, 0);
              }
              else {
                  $scope.selectLevel(character, character.selectedLevelIndex - 1);
              }
          }
          else if(character.selectedLevelIndex > character.levels.length -1){
              $scope.selectLevel(character, $scope.characters.length -1);
          }
      };
      $scope.sortLevel = function(character) {
          character.levels = _.sortBy(character.levels, function(lvl) {
              return parseFloat(lvl.level);
          });
          character.selectedLevelIndex = _.indexOf(character.levels, character.selectedLevel);
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
      $scope.getAbilityMod = function(score) {
          score = parseInt(score);
          return Math.floor((score - 10) / 2);
      };
      $scope.getPointBuy = function(character) {
          if(!character) {
              return;
          }

          return _.reduce($scope.abilityScores, function(result, score) {
              var val = parseFloat(character.abilityScores[score]);
              val = val < 3 ? 3 : val;
              val = val > 18 ? 18 : val;
              return result += $scope.pointBuy[val ? val : 10];
          }, 0);
      };

      // Level management
      function levelFilter(level) {
          if(typeof level === 'string') {
              level = parseFloat(level);
              if(isNaN(level)) {
                  return function() {
                      return false;
                  };
              }
          }

          return function(lvl) {
              var l = parseFloat(lvl.level);
              return l <= level;
          };
      }
      function getFieldSum(character, level, field) {
          return function(result, value) {
              var v = _.reduce(value[field], function(res, val) {
                  if(!val.applyOnce || value.level === level.level) {
                      return res + getValue(character, level, val);
                  }
                  return res;
              }, 0);
              return result += v ? v : 0;
          };
      }
      $scope.getStat = function(character, level, stat) {
          return _.chain(character.levels)
            .filter(levelFilter(level.level))
            .reduce(getFieldSum(character, level, stat), 0)
            .value();
      };
      $scope.getStatMod = function(character, level, stat, mod) {
          return _.chain(character.levels)
            .filter(levelFilter(level.level))
            .map(function(level) {
                var obj = {};
                obj[stat] = {};
                obj[stat][mod] = level[stat][mod];
                return obj;
            })
            .reduce(getFieldSum(character, level, stat), 0)
            .value();
      };
      $scope.standardStats = [
        { 'title': 'Ability', 'renderType': RENDER_TYPE.GROUP, 'items': [
                { 'name': 'strength', 'title': 'Str' },
                { 'name': 'dexterity', 'title': 'Dex' },
                { 'name': 'constitution', 'title': 'Con' },
                { 'name': 'intelligence', 'title': 'Int' },
                { 'name': 'wisdom', 'title': 'Wis' },
                { 'name': 'charisma', 'title': 'Cha' },
            ],
            'additionalColumns': [
                { 'name': 'mod', 'title': 'Modifier', 'value': $scope.getAbilityMod, 'order': 0, 'position': 0 }
            ]
        },
        { 'name': 'hp', 'title': 'HP', 'renderType': RENDER_TYPE.HEADER },
        { 'name': 'ac', 'title': 'AC', 'renderType': RENDER_TYPE.HEADER },
        { 'title': 'Saves', 'renderType': RENDER_TYPE.GROUP, 'items': [
                { 'name': 'fortitude', 'title': 'Fort' },
                { 'name': 'reflex', 'title': 'Ref' },
                { 'name': 'will', 'title': 'Will' }
            ],
        },
        { 'name': 'initiative', 'title': 'Init', 'renderType': RENDER_TYPE.INLINE },
        { 'name': 'bab', 'title': 'BAB', 'renderType': RENDER_TYPE.INLINE },
        { 'name': 'dr', 'title': 'DR', 'renderType': RENDER_TYPE.INLINE },
        { 'name': 'sr', 'title': 'SR', 'renderType': RENDER_TYPE.INLINE }
      ];
      $scope.statOrder = 'order';

      // Attack management
      function calculateAttackDPR(character, level, attack, targetAC) {
          var hitChance;
          var minHitChance = 0.05;
          var maxHitChance = 0.95;
          var damage = 0;
          var percision = 0;
          var hit = _.reduce(attack.hitChance, function(total, chance) {
              return total += getValue(character, level, chance);
          }, 0);

          for(var d in attack.damageDice) {
              var die = attack.damageDice[d];
              if(die.percision) {
                  percision += die.average();
              }
              else {
                  damage += die.average();
              }
          }

          for(var b in attack.damageBonus) {
              var bonus = attack.damageBonus[b];
              if(bonus.percision) {
                  percision += getValue(character, level, bonus);
              }
              else {
                  damage += getValue(character, level, bonus);
              }
          }

          hitChance = 1 - (targetAC-hit) / 20;
          hitChance = hitChance < minHitChance ? minHitChance : hitChance;
          hitChance = hitChance < maxHitChance ? maxHitChance : hitChance;

          // h(dp)+c(m-1)hd
          return hitChance * (damage + percision) + attack.critChance * (attack.critMultiplier - 1) * hitChance * damage;
      }
      $scope.calculateDPR = function(character, level, attackGroup, targetAC) {
          return _.reduce(attackGroup.attacks, function(total, attack) {
              return total += calculateAttackDPR(character, level, attack, targetAC);
          }, 0);
      };

      // Static data
      $scope.abilityScores = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
      $scope.pointBuy = {
          3: -4,
          4: -4,
          5: -4,
          6: -4,
          7: -4,
          8: -2,
          9: -1,
          10: 0,
          11: 1,
          12: 2,
          13: 3,
          14: 5,
          15: 7,
          16: 10,
          17: 13,
          18: 17
      };

      // Initialization
      $scope.addCharacter();

      //Not used functions
      (function() {
          emptyAttackGroup();
          emptyAttack();
          emptyMeleeAttack();
          emptyRangedAttack();
      })();
  }
);
