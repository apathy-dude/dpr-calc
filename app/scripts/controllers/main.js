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
          STAT: 3,
          BASE_ABILITY: 4,
          DICE: 5,
          POWER_ATTACK_HIT: 6,
          POWER_ATTACK_DMG: 7,
          TWO_WEAPON: 8
      };
      var RENDER_TYPE = {
          INLINE: 0,
          HEADER: 1,
          GROUP: 2
      };

      function getValue(character, level, bonus) {
          var value;
          if(typeof bonus.type === 'string') {
              bonus.type = parseInt(bonus.type);
          }
          switch(bonus.type) {
              case BONUS_TYPE.STATIC: value = bonus.value; break;
              case BONUS_TYPE.DYNAMIC: value = bonus.value; break;
              case BONUS_TYPE.ABILITY:
                  var score = $scope.getStat(character, level, bonus.value);
                  value = $scope.getAbilityMod(score);
                  break;
              case BONUS_TYPE.STAT: value = $scope.getStat(character, level, bonus.value); break;
              case BONUS_TYPE.BASE_ABILITY: value = character.abilityScores[bonus.value]; break;
              case BONUS_TYPE.DICE:
                var dice = bonus.value.split('d');
                value = (parseInt(dice[1]) / 2 + 0.5) * parseInt(dice[0]);
                break;
              case BONUS_TYPE.POWER_ATTACK_HIT:
                var bab = $scope.getStat(character, level, 'bab');
                value = -1 * (Math.floor(bab / 4) + 1);
                break;
              case BONUS_TYPE.POWER_ATTACK_DMG:
                var bab2 = $scope.getStat(character, level, 'bab');
                bab2 = Math.floor(bab2 / 4) || 1;
                value = bonus.value ? bab2 * 3 : bab2 * 2;
                break;
              case BONUS_TYPE.TWO_WEAPON: value = -2; break;
          }

          if(typeof value === 'string') {
              value = parseFloat(value);
              value = isNaN(value) ? 0 : value;
          }

          if(bonus.modifier) {
              var modifier = bonus.modifier;
              if(typeof modifier === 'string') {
                  modifier = level[modifier];
              }
              value *= modifier;
              if(bonus.type !== BONUS_TYPE.DICE) {
                  value = Math.floor(value);
              }
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
              'selectedAttackGroupIndex': -1,
              'selectedAttackGroup': null,
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
                  'constitution': { 'type': BONUS_TYPE.ABILITY, 'value': 'constitution', 'title': 'Con', 'applyOnce': true, 'modifier': 'level', 'order': 1 }, // TODO: Need to be multiplied by level
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
              'name': 'Name',
              'selectedAttack': null,
              'selectedAttackIndex': null,
              'attacks': [emptyAttack()]
          };
      }

      function emptyAttack() {
          return {
            'weapon': 'attack',
            'damage': [
                { 'type': BONUS_TYPE.DICE, 'value': '1d8', 'modifier': 1, 'percision': false },
                { 'type': BONUS_TYPE.ABILITY, 'value': 'strength', 'modifier': 1, 'percision': false }
            ],
            'hitChance': [
                { 'type': BONUS_TYPE.STAT, 'value': 'bab' },
                { 'type': BONUS_TYPE.ABILITY, 'value': 'strength' }
            ],
            'critThreat': 0.05,
            'critMultiplier': 2
          };
      }

      function emptyHit() {
          return { 'type': BONUS_TYPE.DYNAMIC, 'value': 0 };
      }

      function emptyDmg() {
          return { 'type': BONUS_TYPE.DICE, 'value': '1d8', 'modifier': 1, 'percision': false };
      }

      $scope.BONUS_TYPE = BONUS_TYPE;
      $scope.RENDER_TYPE = RENDER_TYPE;
      $scope.bonusTypeText = function(type) {
          type = parseInt(type);
          var val;
          switch(type) {
              case BONUS_TYPE.STATIC: val = 'Static'; break;
              case BONUS_TYPE.ABILITY: val = 'Ability'; break;
              case BONUS_TYPE.DYNAMIC: val = 'Dynamic'; break;
              case BONUS_TYPE.STAT: val = 'Stat'; break;
              case BONUS_TYPE.BASE_ABILITY: val = 'Base Ability'; break;
              case BONUS_TYPE.DICE: val = 'Dice'; break;
              case BONUS_TYPE.POWER_ATTACK_HIT: val = 'Power Atk'; break;
              case BONUS_TYPE.POWER_ATTACK_DMG: val = 'Power Atk'; break;
              case BONUS_TYPE.TWO_WEAPON: val = 'Two Weapon'; break;
          }
          return val;
      };
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
              character.selectedLevel = character.levels[ind];
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
          else if(character.selectedLevelIndex > character.levels.length - 1) {
              $scope.selectLevel(character, character.levels.length - 1);
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
      var editObject, editObjectValue;
      $scope.setEdit = function(field, temp, clearObject, clearObjectValue) {
          $scope.clearEdit();
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

          editObject = clearObject;
          editObjectValue = clearObjectValue;
      };
      $scope.clearEdit = function() {
          $scope.edit = null;

          if(editObject && editObjectValue && $scope.editTemp) {
              var target = $scope;
              var fields = $scope.editTemp.field.split('.');
              while(fields.length > 0) {
                  target = target[fields.shift()];
              }
              
              var t = parseFloat(target);
              var et = parseFloat($scope.editTemp.value);
              if(!(t === et || target === $scope.editTemp.value)) {
                  editObject[editObjectValue] = '';
                  editObject = null;
                  editObjectValue = null;
              }
          }
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
      //Attack Group management
      $scope.selectAttackGroup = function(level, ind) {
          $scope.clearEdit();
          level.selectedAttackGroupIndex = ind;

          if(ind === -1) {
              level.selectedAttackGroup = null;
          }
          else {
              level.selectedAttackGroup = level.attackGroups[ind];
          }
      };
      $scope.addAttackGroup = function(level) {
          level.attackGroups.push(emptyAttackGroup());
          $scope.selectAttackGroup(level, level.attackGroups.length - 1);
      };
      $scope.removeAttackGroup = function(level, ind) {
          level.attackGroups.splice(ind, 1);
          if(level.selectedAttackGroupIndex >= ind) {
              if(ind === 0 || level.selectedAttackGroupIndex === 0) {
                  $scope.selectAttackGroup(level, 0);
              }
              else {
                  $scope.selectAttackGroup(level, level.selectedAttackGroupIndex - 1);
              }
          }
          else if(level.selectedAttackGroupIndex > level.attackGroups.lenth - 1) {
              $scope.selectAttackGroup(level, level.attackGroups.length - 1);
          }
      };

      $scope.selectAttack = function(atkGroup, ind) {
          $scope.clearEdit();
          atkGroup.selectedAttackIndex = ind;

          if(ind === -1) {
              atkGroup.selectedAttack = null;
          }
          else {
              atkGroup.selectedAttack = atkGroup.attacks[ind];
          }
      };
      $scope.addAttack = function(atkGroup) {
          atkGroup.attacks.push(emptyAttack());
          $scope.selectAttack(atkGroup, atkGroup.attacks.length - 1);
      };
      $scope.removeAttack = function(atkGroup, ind) {
          atkGroup.attacks.splice(ind, 1);
          if(atkGroup.selectedAttacIndex >= ind) {
              if(ind === 0 || atkGroup.selectedAttackIndex === 0) {
                  $scope.selectAttack(atkGroup, 0);
              }
              else {
                  $scope.selectAttack(atkGroup, atkGroup.selectedAttackIndex - 1);
              }
          }
          else if(atkGroup.selectedAttackIndex > atkGroup.attacks.lenth - 1) {
              $scope.selectAttack(atkGroup, atkGroup.attacks.length - 1);
          }
      };

      $scope.addHit = function(atk) {
          atk.hitChance.push(emptyHit());
      };
      $scope.removeHit = function(atk, ind) {
           atk.hitChance.splice(ind, 1);
      };

      $scope.addDmg = function(atk) {
          atk.damage.push(emptyDmg());
      };
      $scope.removeDmg = function(atk, ind) {
           atk.damage.splice(ind, 1);
      };

      // Attack management
      function calculateAttackDPR(character, level, attack, targetAC) {
          var hitChance;
          var minHitChance = 0.05;
          var maxHitChance = 0.95;
          var damage = 0;
          var percision = 0;
          var hit = $scope.getHit(character, level, attack);

          var d = $scope.getDmg(character, level, attack, true);
          damage = d.damage;
          percision = d.percision;

          hitChance = 1 - ((targetAC-hit) / 20);
          hitChance = hitChance < minHitChance ? minHitChance : hitChance;
          hitChance = hitChance > maxHitChance ? maxHitChance : hitChance;

          // h(dp)+c(m-1)hd
          return hitChance * (damage + percision) + attack.critThreat * (attack.critMultiplier - 1) * hitChance * damage;
      }
      $scope.calculateAttackDPR = calculateAttackDPR;
      $scope.calculateDPR = function(character, level, attackGroup, targetAC) {
          return _.reduce(attackGroup.attacks, function(total, attack) {
              return total += calculateAttackDPR(character, level, attack, targetAC);
          }, 0);
      };
      $scope.getHit = function(character, level, atk) {
          return _.reduce(atk.hitChance, function(total, chance) {
              return total += getValue(character, level, chance);
          }, 0);
      };
      $scope.getDmg = function(character, level, atk, obj) {
          var damage = 0;
          var percision = 0;

          for(var d in atk.damage) {
              var dam = atk.damage[d];
              var dmg = getValue(character, level, dam);
              if(dam.percision) {
                  percision += dmg;
              }
              else {
                  damage += dmg;
              }
          }

          damage = damage < 0 ? 0 : damage;
          percision = percision < 0 ? 0 : percision;

          if(obj) {
              return { damage: damage, percision: percision };
          }

          if(percision) {
              return damage + ' and percision: ' + percision;
          }

          return damage;
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
  }
);
