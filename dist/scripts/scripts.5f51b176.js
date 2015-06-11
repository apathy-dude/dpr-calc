"use strict";angular.module("dprCalcApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.bootstrap","chart.js"]).constant("_",window._).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"CharacterController"}).when("/license/",{templateUrl:"views/openGameLicense.html"}).when("/class-list/",{templateUrl:"views/class-list.html",controller:"ClassListCtrl"}).otherwise({redirectTo:"/"})}]);var app=angular.module("dprCalcApp");app.config(["ChartJsProvider",function(a){a.setOptions({responsive:!0}),a.setOptions("Line",{datasetFill:!1})}]),app.filter("orderObjectBy",function(){return function(a,b,c){return _.chain(_.keys(a)).map(function(b){var c=a[b];return c._objectKey=b,c}).sortBy(function(a){return c?-a[b]:a[b]}).value()}}),app.service("levelDataService",[function(){return{1:{ac:12,wealth:150},2:{ac:14,wealth:1e3},3:{ac:15,wealth:3e3},4:{ac:17,wealth:6e3},5:{ac:18,wealth:10500},6:{ac:19,wealth:16e3},7:{ac:20,wealth:23500},8:{ac:21,wealth:33e3},9:{ac:23,wealth:46e3},10:{ac:24,wealth:62e3},11:{ac:25,wealth:82e3},12:{ac:27,wealth:108e3},13:{ac:28,wealth:14e4},14:{ac:29,wealth:185e3},15:{ac:30,wealth:24e4},16:{ac:31,wealth:315e3},17:{ac:32,wealth:41e4},18:{ac:33,wealth:53e4},19:{ac:34,wealth:685e3},20:{ac:36,wealth:88e4}}}]),app.service("pointBuyService",function(){var a={3:-4,4:-4,5:-4,6:-4,7:-4,8:-2,9:-1,10:0,11:1,12:2,13:3,14:5,15:7,16:10,17:13,18:17};return function(b){return _.reduce(b,function(b,c){return c=c>18?18:c,c=7>c?7:c,b+a[c]},0)}}),app.service("editService",function(){var a={id:null,value:null,target:null,source:null,dependentSources:null,dependentTargets:null,dependentValues:[]};return a.set=function(b,c,d,e,f){if(a.clear(),a.id=b,a.source=c,a.target=d,a.value=c[d],a.dependentSources=e,a.dependentTargets=f,a.dependentValue=[],e&&f)for(var g=0;g<e.length&&g<f.length;g++){var h=e[g],i=f[g];a.dependentValues[g]=h[i]}},a.clear=function(){if(a.id=null,a.dependentSources&&a.value===a.target[a.source])for(var b=0;b<a.dependentSources.length&&b<a.dependentTargets.length&&b<a.dependentValues.length;b++){var c=a.dependentSources[b],d=a.dependentTargets[b];c[d]=a.dependentValues[b]}},a.cancel=function(){a.source[a.tartet]=a.value,a.clear()},a}),app.service("abilityModService",function(){return function(a){return a=parseInt(a),Math.floor((a-10)/2)}}),app.service("abilityScoreService",function(){return["strength","dexterity","constitution","intelligence","wisdom","charisma"]}),app.service("statService",["bonusService","abilityModService",function(a,b){function c(c,d,e){var g;switch("string"==typeof e.type&&(e.type=parseInt(e.type)),e.type){case a.STATIC:g=e.value;break;case a.DYNAMIC:g=e.value;break;case a.ABILITY:var h=f(c,d,e.value);g=b(h);break;case a.STAT:g=f(c,d,e.value);break;case a.BASE_ABILITY:g=c.data.abilityScores[e.value];break;case a.DICE:var i=e.value.split("d");g=(parseInt(i[1])/2+.5)*parseInt(i[0]);break;case a.POWER_ATTACK_HIT:var j=f(c,d,"bab");g=-1*(Math.floor(j/4)+1);break;case a.POWER_ATTACK_DMG:var k=f(c,d,"bab");k=Math.floor(k/4)+1,g=e.value?3*k:2*k;break;case a.TWO_WEAPON:g=-2}if("string"==typeof g&&(g=parseFloat(g),g=isNaN(g)?0:g),e.modifier){var l=e.modifier;"string"==typeof l&&(l=d[l]||d.data[l]),g*=l,e.type!==a.DICE&&(g=Math.floor(g))}return g}function d(a){return"string"==typeof a&&(a=parseFloat(a),isNaN(a))?function(){return!1}:function(b){var c=parseFloat(b.name);return a>=c}}function e(a,b,d){return function(e,f){var g=f.name;f=f.data?f.data:f,f.name=g;var h=_.reduce(f[d],function(d,e){return e.applyOnce&&f.name!==b.name?d:d+c(a,b,e)},0);return e+=h?h:0}}function f(a,b,c){var f=_.chain(a.data.levels).filter(d(b.name)).reduce(e(a,b,c),0).value();return f}function g(a,b,c,f){return _.chain(a.data.levels).filter(d(b.name)).map(function(a){var b={};return b[c]={},b[c][f]=a.data[c][f],b}).reduce(e(a,b,c),0).value()}return{get:f,getMod:g,getValue:c}}]),app.service("bonusService",function(){function a(a){var b;switch(a){case c.STATIC:b="Static";break;case c.ABILITY:b="Ability";break;case c.DYNAMIC:b="Dynamic";break;case c.STAT:b="Stat";break;case c.BASE_ABILITY:b="Base Ability";break;case c.DICE:b="Dice";break;case c.POWER_ATTACK_HIT:b="Power Attack";break;case c.POWER_ATTACK_DMG:b="Power Attack";break;case c.TWO_WEAPON:b="Two-weapon"}return b}function b(a){var b;switch(a){case c.STATIC:b="number";break;case c.ABILITY:b="select";break;case c.DYNAMIC:b="number";break;case c.STAT:b="select";break;case c.BASE_ABILITY:b="select";break;case c.DICE:b="text";break;case c.POWER_ATTACK_HIT:b="calc";break;case c.POWER_ATTACK_DMG:b="checkbox";break;case c.TWO_WEAPON:b="calc"}return b}var c={STATIC:0,ABILITY:1,DYNAMIC:2,STAT:3,BASE_ABILITY:4,DICE:5,POWER_ATTACK_HIT:6,POWER_ATTACK_DMG:7,TWO_WEAPON:8};return c.text=a,c.type=b,c}),app.service("renderService",function(){var a={INLINE:0,HEADER:1,GROUP:2};return a}),app.service("dprService",["statService","levelDataService",function(a,b){function c(a,b,c){return _.reduce(c.data.hitChance,function(c,d){return c+=g(a,b,d)},0)}function d(a,b,c,d){var e=0,f=0;for(var h in c.data.damage){var i=c.data.damage[h],j=g(a,b,i);i.percision?f+=j:e+=j}return e=0>e?0:e,f=0>f?0:f,d?{damage:e,percision:f}:f?e+" and percision: "+f:e}function e(a,e,f){var g,h=parseInt(e.name),i=b[h],j=i?i.ac:0,k=.05,l=.95,m=0,n=0,o=c(a,e,f),p=d(a,e,f,!0);return m=p.damage,n=p.percision,g=1-(j-o)/20,g=k>g?k:g,g=g>l?l:g,g*(m+n)+f.data.critThreat*(f.data.critMultiplier-1)*g*m}function f(a,b,c){return _.reduce(c.data.attacks,function(c,d){return c+=e(a,b,d)},0)}var g=a.getValue;return{calculateAttackDPR:e,calculateDPR:f,getHit:c,getDmg:d}}]),app.factory("emptyCharacter",[function(){return function(){return{levels:[],race:"Human","class":"",abilityScores:{strength:10,dexterity:10,constitution:10,intelligence:10,wisdom:10,charisma:10}}}}]),app.factory("emptyLevel",["bonusService",function(a){return function(){return{name:1,attackGroups:[],strength:{increase:{type:a.DYNAMIC,value:0,order:1},"class":{type:a.DYNAMIC,value:0,order:2},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:a.BASE_ABILITY,value:"strength",applyOnce:!0,order:0}},dexterity:{increase:{type:a.DYNAMIC,value:0,order:1},"class":{type:a.DYNAMIC,value:0,order:2},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:a.BASE_ABILITY,value:"dexterity",applyOnce:!0,order:0}},constitution:{increase:{type:a.DYNAMIC,value:0,order:1},"class":{type:a.DYNAMIC,value:0,order:2},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:a.BASE_ABILITY,value:"constitution",applyOnce:!0,order:0}},intelligence:{increase:{type:a.DYNAMIC,value:0,order:1},"class":{type:a.DYNAMIC,value:0,order:2},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:a.BASE_ABILITY,value:"intelligence",applyOnce:!0,order:0}},wisdom:{increase:{type:a.DYNAMIC,value:0,order:1},"class":{type:a.DYNAMIC,value:0,order:2},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:a.BASE_ABILITY,value:"wisdom",applyOnce:!0,order:0}},charisma:{increase:{type:a.DYNAMIC,value:0,order:1},"class":{type:a.DYNAMIC,value:0,order:2},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:a.BASE_ABILITY,value:"charisma",applyOnce:!0,order:0}},ac:{base:{type:a.STATIC,value:10,"flat-footed":!0,touch:!0,applyOnce:!0,order:0},armor:{type:a.DYNAMIC,value:0,"flat-footed":!0,touch:!1,applyOnce:!0,order:1},shield:{type:a.DYNAMIC,value:0,"flat-footed":!0,touch:!1,applyOnce:!0,order:2},dexterity:{type:a.ABILITY,value:"dexterity","flat-footed":!1,touch:!0,title:"Dex",applyOnce:!0,order:3},size:{type:a.DYNAMIC,value:0,"flat-footed":!0,touch:!0,applyOnce:!0,order:4},natural:{type:a.DYNAMIC,value:0,"flat-footed":!0,touch:!1,applyOnce:!0,order:5},deflection:{type:a.DYNAMIC,value:0,"flat-footed":!0,touch:!0,applyOnce:!0,order:6},dodge:{type:a.DYNAMIC,value:0,"flat-footed":!1,touch:!0,applyOnce:!0,order:7},touch:{type:a.DYNAMIC,value:0,"flat-footed":!1,touch:!0,applyOnce:!0,order:8},"flat-footed":{type:a.DYNAMIC,value:0,"flat-footed":!0,touch:!1,applyOnce:!0,order:9}},fortitude:{base:{type:a.DYNAMIC,value:0,order:0},constitution:{type:a.ABILITY,value:"constitution",applyOnce:!0,title:"Ability",order:1},magic:{type:a.DYNAMIC,value:0,applyOnce:!0,order:2},misc:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3}},reflex:{base:{type:a.DYNAMIC,value:0,order:0},dexterity:{type:a.ABILITY,value:"dexterity",applyOnce:!0,title:"Ability",order:1},magic:{type:a.DYNAMIC,value:0,applyOnce:!0,order:2},misc:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3}},will:{base:{type:a.DYNAMIC,value:0,order:0},wisdom:{type:a.ABILITY,value:"wisdom",applyOnce:!0,title:"Abililty",order:1},magic:{type:a.DYNAMIC,value:0,applyOnce:!0,order:2},misc:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3}},dr:{base:{type:a.DYNAMIC,value:0,applyOnce:!0,order:0},"class":{type:a.DYNAMIC,value:0,order:1}},sr:{base:{type:a.DYNAMIC,value:0,order:0},"class":{type:a.DYNAMIC,value:0,order:1},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:2}},hp:{level:{type:a.DYNAMIC,value:0,order:0},constitution:{type:a.ABILITY,value:"constitution",title:"Con",applyOnce:!0,modifier:"name",order:1},favoured:{type:a.DYNAMIC,value:0,order:2},toughness:{type:a.DYNAMIC,value:0,order:3},other:{type:a.DYNAMIC,value:0,order:4}},bab:{"class":{type:a.DYNAMIC,value:0,order:0}},initiative:{dexterity:{type:a.ABILITY,value:"dexterity",applyOnce:!0,order:0,title:"Dex"},"class":{type:a.DYNAMIC,value:0,order:2},misc:{type:a.DYNAMIC,value:0,applyOnce:!0,order:1}},movement:{base:30,armor:30,fly:0,swim:0,climb:0,burrow:0},equipment:[],feats:[],skills:[],"spell-casting":[],abilities:[]}}}]),app.factory("emptyAttackGroup",[function(){return function(){return{attacks:[]}}}]),app.factory("emptyAttack",["bonusService",function(a){return function(){return{weapon:"attack",damage:[{name:"Weapon",type:a.DICE,value:"1d8",modifier:1,percision:!1},{name:"",type:a.ABILITY,value:"strength",modifier:1,percision:!1}],hitChance:[{name:"",type:a.STAT,value:"bab"},{name:"",type:a.ABILITY,value:"strength"}],critThreat:.05,critMultiplier:2}}}]),app.factory("emptyHit",["bonusService",function(a){return function(){return{name:"hit",type:a.DYNAMIC,value:0}}}]),app.factory("emptyDamage",["bonusService",function(a){return function(){return{name:"damage",type:a.DYNAMIC,value:"0",modifier:1,percision:!1}}}]),app.directive("autoFocus",[function(){return{restrict:"A",link:function(a,b){b[0].focus()}}}]),app.directive("inputField",["editService",function(a){return{restrict:"E",templateUrl:"views/input-field.html",transclude:!0,scope:{cssClass:"=css",type:"=type",editId:"=id",editTarget:"=target",editSource:"=source",editName:"=namefunc",title:"=title",step:"=step",onChange:"=oncng",options:"=options",deleteFunc:"=delete",deleteIndex:"=delindex"},link:function(b){b.edit=a}}}]),app.directive("inputAbility",["editService","abilityModService",function(a,b){return{restrict:"E",templateUrl:"views/input-ability.html",transclude:!0,scope:{scores:"=scores",target:"=source"},link:function(c){c.edit=a,c.getAbilityMod=b}}}]),app.directive("character",["abilityScoreService","pointBuyService","emptyLevel","editService",function(a,b,c,d){return{restrict:"E",scope:{character:"=character"},templateUrl:"views/character.html",controller:["$scope",function(e){function f(){angular.forEach(e.character.data.levels,function(a){a.active=!1})}function g(){var a=_.reduce(e.character.data.levels,function(a,b){var c=parseInt(b.name);return a>c?a:c},0);a++,e.character.data.levels.push({id:a,name:a,active:!0,data:c()})}e.edit=d,e.abilityScores=a,e.pointBuy=b,e.remove=function(a){if(1!==e.character.data.levels.length){var b=e.character.data.levels[a].active;b&&f(),e.character.data.levels.splice(a,1),b&&(e.character.data.levels.length>a?e.character.data.levels[a].active=!0:e.character.data.levels[a-1].active=!0)}},e.add=function(){e.edit.clear(),f(),g()},e.sort=function(){var a=e.character.data.levels;e.character.data.levels=_.sortBy(a,function(a){return parseInt(a.name)})},e.download=function(){var a=btoa(angular.toJson(e.character),!1);window.open("data:application/json;base64,"+a)}}]}}]),app.directive("level",[function(){return{restrict:"E",scope:{level:"=level",character:"=character",sort:"=sort"},templateUrl:"views/level.html",controller:function(){}}}]),app.directive("standardStats",["editService","abilityModService","bonusService","renderService","statService",function(a,b,c,d,e){return{restrict:"E",transclude:!0,scope:{character:"=character",level:"=level"},templateUrl:"views/standard-stats.html",link:function(f){f.edit=a,f.standardStats=[{title:"Ability",renderType:d.GROUP,items:[{name:"strength",title:"Str"},{name:"dexterity",title:"Dex"},{name:"constitution",title:"Con"},{name:"intelligence",title:"Int"},{name:"wisdom",title:"Wis"},{name:"charisma",title:"Cha"}],additionalColumns:[{name:"mod",title:"Modifier",value:b,order:0,position:0}]},{name:"hp",title:"HP",renderType:d.HEADER},{name:"ac",title:"AC",renderType:d.HEADER},{title:"Saves",renderType:d.GROUP,items:[{name:"fortitude",title:"Fort"},{name:"reflex",title:"Ref"},{name:"will",title:"Will"}]},{name:"initiative",title:"Init",renderType:d.INLINE},{name:"bab",title:"BAB",renderType:d.INLINE},{name:"dr",title:"DR",renderType:d.INLINE},{name:"sr",title:"SR",renderType:d.INLINE}],f.RENDER_TYPE=d,f.BONUS_TYPE=c,f.getStat=e.get,f.getStatMod=e.getMod,f.getValue=e.getValue}}}]),app.directive("standardStatInline",["editService","abilityModService","bonusService","statService",function(a,b,c,d){return{restrict:"E",transclude:!0,scope:{character:"=character",level:"=level",stat:"=stat"},templateUrl:"views/standard-stats/inline.html",link:function(b){b.edit=a,b.BONUS_TYPE=c,b.getStat=d.get,b.getStatMod=d.getMod,b.getValue=d.getValue}}}]),app.directive("standardStatHeader",["editService","abilityModService","bonusService","statService",function(a,b,c,d){return{restrict:"E",transclude:!0,scope:{character:"=character",level:"=level",stat:"=stat"},templateUrl:"views/standard-stats/header.html",link:function(b){b.edit=a,b.BONUS_TYPE=c,b.getStat=d.get,b.getStatMod=d.getMod,b.getValue=d.getValue}}}]),app.directive("standardStatGroup",["editService","abilityModService","bonusService","statService",function(a,b,c,d){return{restrict:"E",transclude:!0,scope:{character:"=character",level:"=level",stat:"=stat"},templateUrl:"views/standard-stats/group.html",link:function(b){b.edit=a,b.BONUS_TYPE=c,b.getStat=d.get,b.getStatMod=d.getMod,b.getValue=d.getValue}}}]),app.directive("attackGroups",["editService","emptyAttackGroup",function(a,b){return{restrict:"E",transclude:!0,scope:{character:"=character",level:"=level"},templateUrl:"views/attack-group-list.html",controller:["$scope",function(c){function d(){return _.find(c.level.data.attackGroups,function(a){return a.active})}function e(){angular.forEach(c.level.data.attackGroups,function(a){a.active=!1})}function f(a){c.level.data.attackGroups.push(a)}function g(){i++,f({id:i,name:"attack group "+i,active:!0,data:b()})}function h(a,b){i++,a=angular.copy(a),b&&(a.name=a.name+" copy"),a.id=i,a.active=!0,f(a)}var i=0;c.edit=a,c.remove=function(a){c.level.data.attackGroups.length>1&&c.level.data.attackGroups.splice(a,1)},c.add=function(){c.edit.clear(),e(),g()},c.copy=function(){c.edit.clear();var a=d();e(),h(a,!0)},c.copyPreviousLevel=function(){var a=parseInt(c.level.name),b=_.reduce(c.character.data.levels,function(b,c){var d=parseInt(c.name);return a>d&&(null===b||parseInt(b.name)<d)?c:b},null);if(null!==b){for(c.edit.clear(),e();c.level.data.attackGroups.length>0;)c.level.data.attackGroups.splice(0,1);for(var d in b.data.attackGroups){var f=b.data.attackGroups[d];h(f),e()}c.level.data.attackGroups[0].active=!0}}}]}}]),app.directive("attackGroup",["editService","dprService","emptyAttack",function(a,b,c){return{restrict:"E",transclude:!0,scope:{character:"=character",level:"=level",group:"=group"},templateUrl:"views/attack-group.html",controller:["$scope",function(d){function e(){return _.find(d.group.data.attacks,function(a){return a.active})}function f(){angular.forEach(d.group.data.attacks,function(a){a.active=!1})}function g(a){d.group.data.attacks.push(a)}function h(){j++,g({id:j,name:"attack "+j,active:!0,data:c()})}function i(a){j++,a=angular.copy(a),a.name=a.name+" copy",a.id=j,a.active=!0,g(a)}var j=0;d.edit=a,d.dpr=b.calculateDPR,d.remove=function(a){d.group.data.attacks.length>1&&d.group.data.attacks.splice(a,1)},d.add=function(){d.edit.clear(),f(),h()},d.copy=function(){d.edit.clear();var a=e();f(),i(a)}}]}}]),app.directive("attack",["editService","emptyHit","emptyDamage","bonusService","dprService","abilityScoreService",function(a,b,c,d,e,f){return{restrict:"E",transclude:!0,scope:{character:"=character",level:"=level",group:"=group",attack:"=attack"},templateUrl:"views/attack.html",controller:["$scope",function(g){function h(a){return{value:a,name:d.text(a)}}g.edit=a,g.dpr=e,g.hitChance={add:function(){g.edit.clear(),g.attack.data.hitChance.push(b())},remove:function(a){g.edit.clear(),g.attack.data.hitChance.splice(a,1)},types:[d.ABILITY,d.DYNAMIC,d.POWER_ATTACK_HIT,d.STAT,d.TWO_WEAPON]},g.damage={add:function(){g.edit.clear(),g.attack.data.damage.push(c())},remove:function(a){g.edit.clear(),g.attack.data.damage.splice(a,1)},types:[d.ABILITY,d.DICE,d.DYNAMIC,d.POWER_ATTACK_DMG]},g.hitChance.types=_.map(g.hitChance.types,h),g.damage.types=_.map(g.damage.types,h);var i=f,j=["bab"];g.getOptions=function(a){a=parseInt(a);var b;switch(a){case d.ABILITY:b=i;break;case d.STAT:b=j;break;default:b=null}return b},g.getTitle=function(a){a=parseInt(a);var b;switch(a){case d.POWER_ATTACK_DMG:b="Two-handed:";break;default:b=""}return b},g.BONUS_TYPE=d,g.bonusText=d.text,g.bonusType=d.type}]}}]),app.directive("attackInput",["bonusService","statService",function(a,b){return{restrict:"E",transclude:!1,scope:{character:"=character",level:"=level",group:"=group",attack:"=attack",source:"=source",index:"=index",name:"=name",options:"=options",title:"=title"},templateUrl:"views/attack-input.html",controller:["$scope",function(c){c.BONUS_TYPE=a,c.bonusText=a.text,c.bonusType=a.type,c.calcType=function(b){return"calc"===a.type(b)},c.calcValue=b.getValue,c.selectType=function(b){return"select"===a.type(b)},c.textType=function(b){return"text"===a.type(b)},c.numberType=function(b){return"number"===a.type(b)},c.checkboxType=function(b){return"checkbox"===a.type(b)}}]}}]),app.directive("graph",["dprService","$timeout",function(a,b){return{restrict:"E",transclude:!1,scope:{characters:"=characters"},templateUrl:"views/graph.html",controller:["$scope",function(a){a.levels=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],a.data=[],a.series=[]}],link:function(c){function d(a){return void 0===a.graph&&(a.graph=!0),a.graph}function e(){function b(b){return _.map(c.levels,function(c){var d=_.find(b.data.levels,function(a){return parseInt(a.name)===parseInt(c)});return d?_.reduce(d.data.attackGroups,function(c,e){var f=a.calculateDPR(b,d,e);return c>f?c:f},0):0})}return _.chain(c.characters).filter(d).map(b).value()}function f(){return _.chain(c.characters).filter(d).map("name").value()}function g(){c.data=e(),c.series=f()}c.$on("show-graph",function(){b(g,100)}),c.update=g}}}]),app.directive("equipment",["editService","levelDataService","statService",function(a,b,c){return{restrict:"E",transclude:!1,scope:{character:"=character",level:"=level"},templateUrl:"views/equipment.html",controller:["$scope",function(d){function e(){return{name:"item name",weight:0,value:0}}function f(a){if(11>a)return 10*a;if(g[a])return g[a];var b=4*f(a-10);return g[a]=b,b}d.edit=a;var g={11:115,12:130,13:150,14:175,15:200,16:230,17:260,18:300,19:350};d.add=function(){d.level.data.equipment.push(e())},d.remove=function(a){d.level.data.equipment.splice(a,1)},d.copyPreviousLevel=function(){var a=parseInt(d.level.name),b=_.reduce(d.character.data.levels,function(b,c){var d=parseInt(c.name);return a>d&&(null===b||parseInt(b.name)<d)?c:b},null);null!==b&&(d.edit.clear(),d.level.data.equipment=angular.copy(b.data.equipment))},d.total=function(a){return _.reduce(d.level.data.equipment,function(b,c){return b+=c[a]},0)},d.wealthByLevel=function(a){var c=b[a];return c?c.wealth:0},d.carryCapacity={light:function(a){return a=parseInt(a),Math.floor(f(a)/3)},medium:function(a){return a=parseInt(a),2*Math.floor(f(a)/3)},heavy:function(a){return a=parseInt(a),f(a)}},d.getStat=c.get}]}}]),app.directive("feat",["editService",function(a){return{restrict:"E",transclude:!1,scope:{character:"=character",level:"=level"},templateUrl:"views/feat.html",controller:["$scope",function(b){function c(){return{name:"feat",type:"general",description:"description"}}b.edit=a,b.add=function(){b.level.data.feats.push(c())},b.remove=function(a){b.level.data.equipment.splice(a,1)},b.feats=[]}],link:function(a){function b(){var b=parseInt(a.level.name);a.feats=_.reduce(a.character.data.levels,function(a,c){return parseInt(c.name)<b?a.concat(_.map(c.data.feats,function(a){return a.level=c.name,a})):a},[])}b(),a.$watch("level.name",b)}}}]),app.controller("CharacterController",["$scope","emptyCharacter","editService",function(a,b,c){function d(){return _.find(a.characters,function(a){return a.active})}function e(){angular.forEach(a.characters,function(a){a.active=!1})}function f(b){a.characters.push(b)}function g(){i++,f({id:i,name:"character "+i,active:!0,data:b()})}function h(a){i++,a=angular.copy(a),a.name=a.name+" copy",a.id=i,a.active=!0,f(a)}var i=0;a.edit=c,a.characters=[],a.remove=function(b){a.characters.length>1&&a.characters.splice(b,1)},a.add=function(){a.edit.clear(),e(),g()},a.copy=function(){a.edit.clear();var b=d();b&&(e(),h(b))},a.graph=!0,a.toggleGraph=function(){c.clear(),a.graph=!a.graph,a.graph&&a.$broadcast("show-graph")},a.add(),a.uploadActive=!1,a.upload=function(){a.edit.clear(),e();var b=angular.element("#file")[0],c=b.files[0],d=new FileReader;d.onload=function(b){var c=angular.fromJson(b.target.result);c.active=!0,f(c),a.uploadActive=!1,a.$apply()},d.readAsBinaryString(c)}}]),angular.module("dprCalcApp").controller("ClassListCtrl",["$scope","$http",function(a,b){function c(b){a.classes=a.classes.concat(b)}var d=["acg","crb","apg","uc","um"];a.classes=[];for(var e in d)b.get("data/"+d[e]+"/class-list.json").success(c);a.options={bab:["1","0.75","0.5"],hd:["12","10","8","6"],skills:["8","6","4","2"],saves:["HIGH","LOW"]},a.orderProp="name"}]);