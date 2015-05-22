'use strict';

/**
 * @ngdoc function
 * @name dprCalcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dprCalcApp
 */
var app = angular.module('dprCalcApp');

app.service('pointBuyService', function() {
    var pointBuy = {
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

    return function calculate(stats) {
        return _.reduce(stats, function(total, value) {
            value = value > 18 ? 18 : value;
            value = value < 7 ? 7 : value;
            return total + pointBuy[value];
        }, 0);
    };
});

app.service('editService', function() {
    var edit = {
        id: null,
        value: null,
        target: null,
        source: null,
        dependentSources: null,
        dependentTargets: null,
        dependentValues: []
    };

    edit.set = function(id, source, target, dependentSources, dependentTargets) {
        edit.clear();

        edit.id = id;
        edit.source = source;
        edit.target = target;
        edit.value = source[target];
        edit.dependentSources = dependentSources;
        edit.dependentTargets = dependentTargets;
        edit.dependentValue = [];
        if(dependentSources && dependentTargets) {
            for(var d = 0; d < dependentSources.length && d < dependentTargets.length; d++) {
                var s = dependentSources[d];
                var t = dependentTargets[d];

                edit.dependentValues[d] = s[t];
            }
        }
    };
    edit.clear = function() {
        edit.id = null;

        if(edit.dependentSources && edit.value === edit.target[edit.source]) {
            for(var d = 0; d < edit.dependentSources.length && d < edit.dependentTargets.length && d < edit.dependentValues.length; d++) {
                var s = edit.dependentSources[d];
                var t = edit.dependentTargets[d];

                s[t] = edit.dependentValues[d];
            }
        }
    };
    edit.cancel = function() {
        edit.source[edit.tartet] = edit.value;
        edit.clear();
    };

    return edit;
});

app.service('abilityModService', function() {
    return function(score) {
        score = parseInt(score);
        return Math.floor((score - 10) / 2);
    };
});

app.service('abilityScoreService', function() {
    return ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
});

app.service('statService', ['bonusService', 'abilityModService', function(BONUS_TYPE, getAbilityMod) {
    function getValue(character, level, bonus) {
        var value;

        if(typeof bonus.type === 'string') {
            bonus.type = parseInt(bonus.type);
        }
        switch(bonus.type) {
            case BONUS_TYPE.STATIC: value = bonus.value; break;
            case BONUS_TYPE.DYNAMIC: value = bonus.value; break;
            case BONUS_TYPE.ABILITY:
                var score = getStat(character, level, bonus.value);
                value = getAbilityMod(score);
                break;
            case BONUS_TYPE.STAT: value = getStat(character, level, bonus.value); break;
            case BONUS_TYPE.BASE_ABILITY: value = character.data.abilityScores[bonus.value]; break;
            case BONUS_TYPE.DICE:
                 var dice = bonus.value.split('d');
                 value = (parseInt(dice[1]) / 2 + 0.5) * parseInt(dice[0]);
                 break;
            case BONUS_TYPE.POWER_ATTACK_HIT:
                var bab = getStat(character, level, 'bab');
                value = -1 * (Math.floor(bab / 4) + 1);
                break;
              case BONUS_TYPE.POWER_ATTACK_DMG:
                var bab2 = getStat(character, level, 'bab');
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
                modifier = level[modifier] || level.data[modifier];
            }
            value *= modifier;
            if(bonus.type !== BONUS_TYPE.DICE) {
                value = Math.floor(value);
            }
        }

        return value;
    }
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
            var l = parseFloat(lvl.name);
            return l <= level;
        };
    }
    function getFieldSum(character, level, field) {
        return function(result, value) {
            var name = value.name;
            value = value.data ? value.data : value;
            value.name = name;
            var v = _.reduce(value[field], function(res, val) {
                if(!val.applyOnce || value.name === level.name) {
                    return res + getValue(character, level, val);
                }
                return res;
            }, 0);
            return result += v ? v : 0;
        };
    }

    function getStat(character, level, stat) {
        var v = _.chain(character.data.levels)
            .filter(levelFilter(level.name))
            .reduce(getFieldSum(character, level, stat), 0)
            .value();
        return v;
    }

    function getStatMod(character, level, stat, mod) {
        return _.chain(character.data.levels)
          .filter(levelFilter(level.name))
          .map(function(level) {
              var obj = {};
              obj[stat] = {};
              obj[stat][mod] = level.data[stat][mod];
              return obj;
          })
          .reduce(getFieldSum(character, level, stat), 0)
          .value();
    }

    return {
        get: getStat,
        getMod: getStatMod,
        getValue: getValue
    };
}]);

app.service('bonusService', function() {
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

    return BONUS_TYPE;
});

app.service('renderService', function() {
    var RENDER_TYPE = {
        INLINE: 0,
        HEADER: 1,
        GROUP: 2
    };

    return RENDER_TYPE;
});

app.factory('emptyCharacter', [function() {
    return function() {
        return {
            'levels': [],
            'race': 'Human',
            'class': '',
            'abilityScores': {
                'strength': 10,
                'dexterity': 10,
                'constitution': 10,
                'intelligence': 10,
                'wisdom': 10,
                'charisma': 10
            }
        };
    };
}]);

app.factory('emptyLevel', ['bonusService', function(BONUS_TYPE) {
    return function() {
        return {
        // Base items
        'name': 1,
        'attackGroups': [],
        'selectedAttackGroupIndex': -1,
        'selectedAttackGroup': null,
        // Ability information TODO: Move to standard stat
        // Standard stats
        // -- Ability Scores
        'strength': {
            'increase': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
            'class': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 2 },
            'enhance': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 3 },
            'base': { 'type': BONUS_TYPE.BASE_ABILITY, 'value': 'strength', 'applyOnce': true, 'order': 0 }
        },
        'dexterity': {
            'increase': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
            'class': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 2 },
            'enhance': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 3 },
            'base': { 'type': BONUS_TYPE.BASE_ABILITY, 'value': 'dexterity', 'applyOnce': true, 'order': 0 }
        },
        'constitution': {
            'increase': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
            'class': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 2 },
            'enhance': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 3 },
            'base': { 'type': BONUS_TYPE.BASE_ABILITY, 'value': 'constitution', 'applyOnce': true, 'order': 0 }
        },
        'intelligence': {
            'increase': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
            'class': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 2 },
            'enhance': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 3 },
            'base': { 'type': BONUS_TYPE.BASE_ABILITY, 'value': 'intelligence', 'applyOnce': true, 'order': 0 }
        },
        'wisdom': {
            'increase': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
            'class': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 2 },
            'enhance': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 3 },
            'base': { 'type': BONUS_TYPE.BASE_ABILITY, 'value': 'wisdom', 'applyOnce': true, 'order': 0 }
        },
        'charisma': {
            'increase': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
            'class': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 2 },
            'enhance': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 3 },
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
            'class': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
        },
        'sr': {
            'base': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 0 },
            'class': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 1 },
            'enhance': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'applyOnce': true, 'order': 2 },
        },
        'hp': {
           'level': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 0 },
           'constitution': { 'type': BONUS_TYPE.ABILITY, 'value': 'constitution', 'title': 'Con', 'applyOnce': true, 'modifier': 'name', 'order': 1 },
           'favoured': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 2},
           'toughness': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 3 },
           'other': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 4 },
        },
        'bab': {
            'class': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 0 },
        },
        'initiative': {
            'dexterity': { 'type': BONUS_TYPE.ABILITY, 'value': 'dexterity', 'applyOnce': true, 'order': 0, 'title': 'Dex' },
            'class': { 'type': BONUS_TYPE.DYNAMIC, 'value': 0, 'order': 2 },
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
    };
}]);

app.filter('orderObjectBy', function() {
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
});

app.directive('tabs', function() {
    return {
        restrict: 'E',
        templateUrl: '../views/horizontal-tabs.html',
        scope: {
            tabs: '=tabs',
            css: '=css',
            selected: '=selected',
            unselected: '=unselected',
            name: '=itemname'
        }
    };
});

app.directive('inputField', ['editService', function(edit) {
    return {
        restrict: 'E',
        templateUrl: '../views/input-field.html',
        transclude: true,
        scope: {
            cssClass: '=css',
            type: '=type',
            editId: '=id',
            editTarget: '=target',
            editSource: '=source',
            title: '=title',
            step: '=step',
            onChange: '=oncng'
        },
        link: function(scope) {
            scope.edit = edit;
        }
    };
}]);

app.directive('inputAbility', ['editService', 'abilityModService', function(edit, abilityMod) {
    return {
        restrict: 'E',
        templateUrl: '../views/input-ability.html',
        transclude: true,
        scope: {
            scores: '=scores',
            target: '=source'
        },
        link: function(scope) {
            scope.edit = edit;
            scope.getAbilityMod = abilityMod;
        }
    };
}]);

app.directive('standardStats', ['editService', 'abilityModService', 'bonusService', 'renderService', 'statService', function(edit, abilityMod, BONUS_TYPE, RENDER_TYPE, stat) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            character: '=character',
            level: '=level'
        },
        templateUrl: '../views/standard-stats.html',
        link: function(scope) {
            scope.edit = edit;

            scope.standardStats = [
              { 'title': 'Ability', 'renderType': RENDER_TYPE.GROUP, 'items': [
                      { 'name': 'strength', 'title': 'Str' },
                      { 'name': 'dexterity', 'title': 'Dex' },
                      { 'name': 'constitution', 'title': 'Con' },
                      { 'name': 'intelligence', 'title': 'Int' },
                      { 'name': 'wisdom', 'title': 'Wis' },
                      { 'name': 'charisma', 'title': 'Cha' },
                  ],
                  'additionalColumns': [
                      { 'name': 'mod', 'title': 'Modifier', 'value': abilityMod, 'order': 0, 'position': 0 }
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

            scope.RENDER_TYPE = RENDER_TYPE;
            scope.BONUS_TYPE = BONUS_TYPE;
            scope.getStat = stat.get;
            scope.getStatMod = stat.getMod;
            scope.getValue = stat.getValue;
        }
    };
}]);

app.controller('TabsCharacterController', ['$scope', 'emptyCharacter', 'editService', function($scope, empty, edit) {
    $scope.edit = edit;

    var id = 0;
    function setAllInactive() {
        angular.forEach($scope.characters, function(character) {
           character.active = false;
        });
    }

    function addNewCharacter() {
        id++;
        $scope.characters.push({
            id: id,
            name: 'character ' + id,
            active: true,
            data: empty()
        });
    }

    $scope.remove = function remove(ind) {
        if($scope.characters.length > 1) {
            $scope.characters.splice(ind, 1);
        }
    };

    $scope.characters = [];

    $scope.add = function() {
        $scope.edit.clear();
        setAllInactive();
        addNewCharacter();
    };

    $scope.add();
}]);

app.directive('character', ['abilityScoreService', 'pointBuyService', 'emptyLevel', 'editService', function(abilityScores, pointBuy, empty, edit) {
    return {
        restrict: 'E',
        scope: {
            character: '=character',
        },
        templateUrl: '../views/character.html',
        controller: function($scope) {
            $scope.edit = edit;
            $scope.abilityScores = abilityScores;
            $scope.pointBuy = pointBuy;

            function setAllInactive() {
                angular.forEach($scope.character.data.levels, function(level) {
                   level.active = false;
                });
            }
            function addNewLevel() {
                var id = _.reduce($scope.character.data.levels, function(max, current) {
                    var cVal = parseInt(current.name);
                    return max > cVal ? max : cVal;
                }, 0);
                id++;
                $scope.character.data.levels.push({
                    id: id,
                    name: id,
                    active: true,
                    data: empty()
                });
            }

            $scope.remove = function remove(ind) {
                if($scope.character.data.levels.length === 1) {
                    return;
                }

                var active = $scope.character.data.levels[ind].active;

                if(active) {
                    setAllInactive();
                }

                $scope.character.data.levels.splice(ind, 1);

                if(active) {
                    if($scope.character.data.levels.length > ind) {
                        $scope.character.data.levels[ind].active = true;
                    }
                    else {
                        $scope.character.data.levels[ind - 1].active = true;
                    }
                }
            };

            $scope.add = function() {
                $scope.edit.clear();
                setAllInactive();
                addNewLevel();
            };

            $scope.sort = function() {
                var levels = $scope.character.data.levels;
                $scope.character.data.levels = _.sortBy(levels, function(level) {
                    return parseInt(level.name);
                });
            };
        }
    };
}]);

app.directive('level', [function() {
    return {
        restrict: 'E',
        scope: {
            level: '=level',
            character: '=character',
            sort: '=sort'
        },
        templateUrl: '../views/level.html',
        controller: function() {
        }
    };
}]);

app.directive('standardStatInline', ['editService', 'abilityModService', 'bonusService', 'statService', function(edit, abilityMod, BONUS_TYPE, stat) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            character: '=character',
            level: '=level',
            stat: '=stat'
        },
        templateUrl: '../views/standard-stat-inline.html',
        link: function(scope) {
            scope.edit = edit;

            scope.BONUS_TYPE = BONUS_TYPE;
            scope.getStat = stat.get;
            scope.getStatMod = stat.getMod;
            scope.getValue = stat.getValue;
        }
    };
}]);

app.directive('standardStatHeader', ['editService', 'abilityModService', 'bonusService', 'statService', function(edit, abilityMod, BONUS_TYPE, stat) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            character: '=character',
            level: '=level',
            stat: '=stat'
        },
        templateUrl: '../views/standard-stat-header.html',
        link: function(scope) {
            scope.edit = edit;

            scope.BONUS_TYPE = BONUS_TYPE;
            scope.getStat = stat.get;
            scope.getStatMod = stat.getMod;
            scope.getValue = stat.getValue;
        }
    };
}]);

app.directive('standardStatGroup', ['editService', 'abilityModService', 'bonusService', 'statService', function(edit, abilityMod, BONUS_TYPE, stat) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            character: '=character',
            level: '=level',
            stat: '=stat'
        },
        templateUrl: '../views/standard-stat-group.html',
        link: function(scope) {
            scope.edit = edit;

            scope.BONUS_TYPE = BONUS_TYPE;
            scope.getStat = stat.get;
            scope.getStatMod = stat.getMod;
            scope.getValue = stat.getValue;
        }
    };
}]);

app.controller('MainCtrl', [ '$scope', '$filter', 'editService', function ($scope, $filter, edit) {
    $scope.edit = edit;
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
    var ctx = null;//angular.element('#chart')[0].getContext('2d');
    var chart;

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

    function getGraphColor() {
        var red = Math.floor(Math.random() * 255);
        var green = Math.floor(Math.random() * 255);
        var blue = Math.floor(Math.random() * 255);
        var fillAlpha = 0.5;
        var strokeAlpha = 1;

        var fill = 'rgba(' + red + ',' + green + ',' + blue + ',' + fillAlpha + ')';
        var stroke = 'rgba(' + red + ',' + green + ',' + blue + ',' + strokeAlpha + ')';

        return {
            fill: fill,
            stroke: stroke,
            point: fill
        };
    }

    function graphDPR() {
        if(chart) {
            chart.destroy();
        }

        var levels = [];
        var datasets;

        for(var char in $scope.characters) {
            var character = $scope.characters[char];
            for(var l in character.levels) {
                var level = character.levels[l];
                levels.push(level.name);
            }

            if(!character.colors) {
                character.colors = getGraphColor();
                character.style = { 'background-color': character.colors.fill };
            }
        }

        levels = _.uniq(levels);

        datasets = _.map($scope.characters, function(character) {
            return {
                label: character.name,
                fillColor: character.colors.fill,
                strokeColor: character.colors.stroke,
                pointColor: character.colors.point,
                pointStrokeColor: '#FFF',
                pointHighlightFill: '#FFF',
                pointHighlighStroke: '#FFF',
                data: _.map(levels, function(level) {
                    var lev = _.find(character.levels, function(l) { return l.level === level; });
                    if(lev) {
                        return _.reduce(lev.attackGroups, function(max, group) {
                            var dpr = $scope.calculateDPR(character, lev, group);
                            return max > dpr ? max : dpr;
                          }, 0);
                    }
                    else {
                        return 0;
                    }
                })};
        });

        var data = {
            labels: levels,
            datasets: datasets
        };

        chart = new Chart(ctx).Line(data);

        window.setTimeout(function() {
            chart.resize();
        }, 1000);
    }

    $scope.graphDPR = function() {
        edit.id = 'graph';
        window.setTimeout(graphDPR, 100);
    };

    $scope.importExport = null;
    $scope.export = function() {
        $scope.importExport = $filter('json')($scope.selectedCharacter, 4);
        $scope.edit.id = 'export';
    };
    $scope.importStart = function() {
        $scope.importExport = '';
        //$scope.addCharacter();
        $scope.edit.id = 'import';
    };
    $scope.importPaste = function(e) {
        $scope.importExport = e.target.value;
    };
    $scope.importEnd = function() {
        $scope.selectedCharacter = angular.fromJson($scope.importExport);
        $scope.characters[$scope.selectedCharacterIndex] = $scope.selectedCharacter;
        $scope.edit.id = null;
    };

    //Attack Group management
    $scope.selectAttackGroup = function(level, ind) {
        $scope.edit.clear();
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
        if(level.selectedAttackGroupIndex === ind) {
            $scope.selectAttackGroup(level, -1);
        }
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
    $scope.copyAttackGroupFromPreviousLevel = function(character, level) {
        var currentLevel = parseInt(level.name);
        var lastLevel = _.reduce(character.levels, function(max, l) {
            var testLevel = parseInt(l.level);
            var maxLevel = parseInt(max.level);
            if(testLevel < currentLevel && (!max || testLevel > maxLevel)) {
                return l;
            }
            return max;
        }, false);

        if(lastLevel) {
            level.attackGroups = level.attackGroups.concat(angular.copy(lastLevel.attackGroups));
        }
    };

    $scope.selectAttack = function(atkGroup, ind) {
        $scope.edit.clear();
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
        if(atkGroup.selectedAttackIndex === ind) {
            $scope.selectAttack(atkGroup, -1);
        }
        if(atkGroup.selectedAttackIndex >= ind) {
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
    function getHit(character, level, atk) {
        return _.reduce(atk.hitChance, function(total, chance) {
            return total += getValue(character, level, chance);
        }, 0);
    }
    function getDmg(character, level, atk, obj) {
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
    }
    function calculateAttackDPR(character, level, attack) {
        var lev = parseInt(level.name);
        var targetAC = $scope.targetAc[lev];
        var hitChance;
        var minHitChance = 0.05;
        var maxHitChance = 0.95;
        var damage = 0;
        var percision = 0;
        var hit = getHit(character, level, attack);

        var d = getDmg(character, level, attack, true);
        damage = d.damage;
        percision = d.percision;

        hitChance = 1 - ((targetAC-hit) / 20);
        hitChance = hitChance < minHitChance ? minHitChance : hitChance;
        hitChance = hitChance > maxHitChance ? maxHitChance : hitChance;

        // h(dp)+c(m-1)hd
        return hitChance * (damage + percision) + attack.critThreat * (attack.critMultiplier - 1) * hitChance * damage;
    }
    $scope.calculateAttackDPR = calculateAttackDPR;
    $scope.calculateDPR = function(character, level, attackGroup) {
        return _.reduce(attackGroup.attacks, function(total, attack) {
            return total += calculateAttackDPR(character, level, attack);
        }, 0);
    };
    $scope.getHit = getHit;
    $scope.getDmg = getDmg;

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
    $scope.targetAc = {
        1: 12,
        2: 14,
        3: 15,
        4: 17,
        5: 18,
        6: 19,
        7: 20,
        8: 21,
        9: 23,
        10: 24,
        11: 25,
        12: 27,
        13: 28,
        14: 29,
        15: 30,
        16: 31,
        17: 32,
        18: 33,
        19: 34,
        20: 36,
    };
}]);

