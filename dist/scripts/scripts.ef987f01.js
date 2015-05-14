"use strict";function TabController(a,b){this.items=[],this.id=null,this.empty=b,this.selected=null,this.select=function(b){a.clear(),-1===b?(this.id=null,this.selected=null):(this.id=b,this.selected=this.items[b])},this.add=function(a){var b=this.empty();"max"===a&&(b.name=this.maxName()+1),this.items.push(b),this.select(this.items.length-1)},this.remove=function(a){1!==this.items.length&&(this.items.splice(a,1),this.id>=a?this.select(0===this.id||0===a?0:this.id-1):this.id>this.items.length-1&&this.select(this.items.length-1))},this.maxName=function(){return _.reduce(this.items,function(a,b){var c=parseFloat(b.name);return a>c?a:c},0)},this.add()}angular.module("dprCalcApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).constant("_",window._).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/license/",{templateUrl:"views/openGameLicense.html"}).when("/class-list/",{templateUrl:"views/class-list.html",controller:"ClassListCtrl"}).otherwise({redirectTo:"/"})}]);var app=angular.module("dprCalcApp");app.service("editService",function(){var a={id:null,value:null,target:null,source:null,dependentSources:null,dependentTargets:null,dependentValues:[]};return a.set=function(b,c,d,e,f){if(a.clear(),a.id=b,a.source=c,a.target=d,a.value=c[d],a.dependentSources=e,a.dependentTargets=f,a.dependentValue=[],e&&f)for(var g=0;g<e.length&&g<f.length;g++){var h=e[g],i=f[g];a.dependentValues[g]=h[i]}},a.clear=function(){if(a.id=null,a.dependentSources&&a.value===a.target[a.source])for(var b=0;b<a.dependentSources.length&&b<a.dependentTargets.length&&b<a.dependentValues.length;b++){var c=a.dependentSources[b],d=a.dependentTargets[b];c[d]=a.dependentValues[b]}},a.cancel=function(){a.source[a.tartet]=a.value,a.clear()},a}),app.service("abilityModService",function(){return function(a){return a=parseInt(a),Math.floor((a-10)/2)}}),app.service("bonusService",function(){var a={STATIC:0,ABILITY:1,DYNAMIC:2,STAT:3,BASE_ABILITY:4,DICE:5,POWER_ATTACK_HIT:6,POWER_ATTACK_DMG:7,TWO_WEAPON:8};return a}),app.factory("emptyCharacter",["emptyLevel",function(a){return function(){var b=a();return{name:"New Character",levels:[b],race:"Human","class":"",selectedLevel:b,selectedLevelIndex:0,abilityScores:{strength:10,dexterity:10,constitution:10,intelligence:10,wisdom:10,charisma:10}}}}]),app.factory("emptyLevel",["bonusService",function(a){return function(){return{name:1,level:1,attackGroups:[],selectedAttackGroupIndex:-1,selectedAttackGroup:null,strength:{increase:{type:a.DYNAMIC,value:0,order:1},"class":{type:a.DYNAMIC,value:0,order:2},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:a.BASE_ABILITY,value:"strength",applyOnce:!0,order:0}},dexterity:{increase:{type:a.DYNAMIC,value:0,order:1},"class":{type:a.DYNAMIC,value:0,order:2},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:a.BASE_ABILITY,value:"dexterity",applyOnce:!0,order:0}},constitution:{increase:{type:a.DYNAMIC,value:0,order:1},"class":{type:a.DYNAMIC,value:0,order:2},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:a.BASE_ABILITY,value:"constitution",applyOnce:!0,order:0}},intelligence:{increase:{type:a.DYNAMIC,value:0,order:1},"class":{type:a.DYNAMIC,value:0,order:2},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:a.BASE_ABILITY,value:"intelligence",applyOnce:!0,order:0}},wisdom:{increase:{type:a.DYNAMIC,value:0,order:1},"class":{type:a.DYNAMIC,value:0,order:2},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:a.BASE_ABILITY,value:"wisdom",applyOnce:!0,order:0}},charisma:{increase:{type:a.DYNAMIC,value:0,order:1},"class":{type:a.DYNAMIC,value:0,order:2},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:a.BASE_ABILITY,value:"charisma",applyOnce:!0,order:0}},ac:{base:{type:a.STATIC,value:10,"flat-footed":!0,touch:!0,applyOnce:!0,order:0},armor:{type:a.DYNAMIC,value:0,"flat-footed":!0,touch:!1,applyOnce:!0,order:1},shield:{type:a.DYNAMIC,value:0,"flat-footed":!0,touch:!1,applyOnce:!0,order:2},dexterity:{type:a.ABILITY,value:"dexterity","flat-footed":!1,touch:!0,title:"Dex",applyOnce:!0,order:3},size:{type:a.DYNAMIC,value:0,"flat-footed":!0,touch:!0,applyOnce:!0,order:4},natural:{type:a.DYNAMIC,value:0,"flat-footed":!0,touch:!1,applyOnce:!0,order:5},deflection:{type:a.DYNAMIC,value:0,"flat-footed":!0,touch:!0,applyOnce:!0,order:6},dodge:{type:a.DYNAMIC,value:0,"flat-footed":!1,touch:!0,applyOnce:!0,order:7},touch:{type:a.DYNAMIC,value:0,"flat-footed":!1,touch:!0,applyOnce:!0,order:8},"flat-footed":{type:a.DYNAMIC,value:0,"flat-footed":!0,touch:!1,applyOnce:!0,order:9}},fortitude:{base:{type:a.DYNAMIC,value:0,order:0},constitution:{type:a.ABILITY,value:"constitution",applyOnce:!0,title:"Ability",order:1},magic:{type:a.DYNAMIC,value:0,applyOnce:!0,order:2},misc:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3}},reflex:{base:{type:a.DYNAMIC,value:0,order:0},dexterity:{type:a.ABILITY,value:"dexterity",applyOnce:!0,title:"Ability",order:1},magic:{type:a.DYNAMIC,value:0,applyOnce:!0,order:2},misc:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3}},will:{base:{type:a.DYNAMIC,value:0,order:0},wisdom:{type:a.ABILITY,value:"wisdom",applyOnce:!0,title:"Abililty",order:1},magic:{type:a.DYNAMIC,value:0,applyOnce:!0,order:2},misc:{type:a.DYNAMIC,value:0,applyOnce:!0,order:3}},dr:{base:{type:a.DYNAMIC,value:0,applyOnce:!0,order:0},"class":{type:a.DYNAMIC,value:0,order:1}},sr:{base:{type:a.DYNAMIC,value:0,order:0},"class":{type:a.DYNAMIC,value:0,order:1},enhance:{type:a.DYNAMIC,value:0,applyOnce:!0,order:2}},hp:{level:{type:a.DYNAMIC,value:0,order:0},constitution:{type:a.ABILITY,value:"constitution",title:"Con",applyOnce:!0,modifier:"level",order:1},favoured:{type:a.DYNAMIC,value:0,order:2},toughness:{type:a.DYNAMIC,value:0,order:3},other:{type:a.DYNAMIC,value:0,order:4}},bab:{"class":{type:a.DYNAMIC,value:0,order:0}},initiative:{dexterity:{type:a.ABILITY,value:"dexterity",applyOnce:!0,order:0,title:"Dex"},"class":{type:a.DYNAMIC,value:0,order:2},misc:{type:a.DYNAMIC,value:0,applyOnce:!0,order:1}},movement:{base:30,armor:30,fly:0,swim:0,climb:0,burrow:0},equipment:[],feats:[],skills:[],"spell-casting":[],abilities:[]}}}]),app.filter("orderObjectBy",function(){return function(a,b,c){return _.chain(_.keys(a)).map(function(b){var c=a[b];return c._objectKey=b,c}).sortBy(function(a){return c?-a[b]:a[b]}).value()}}),app.directive("tabs",function(){return{restrict:"E",templateUrl:"../views/horizontal-tabs.html",scope:{tabs:"=tabs",css:"=css",selected:"=selected",unselected:"=unselected",name:"=itemname"}}}),app.directive("inputField",["editService",function(a){return{restrict:"E",templateUrl:"../views/input-field.html",transclude:!0,scope:{cssClass:"=css",type:"=type",editId:"=id",editTarget:"=target",editSource:"=source",title:"=title",step:"=step"},link:function(b){b.edit=a}}}]),app.directive("inputAbility",["editService","abilityModService",function(a,b){return{restrict:"E",templateUrl:"../views/input-ability.html",transclude:!0,scope:{scores:"=scores",target:"=source"},link:function(c){c.edit=a,c.getAbilityMod=b}}}]),app.controller("CharacterCtrl",["editService","emptyCharacter",TabController]),app.controller("LevelListCtrl",["editService","emptyLevel",TabController]),app.controller("MainCtrl",["$scope","$filter","editService",function(a,b,c){function d(b,c,d){var e;switch("string"==typeof d.type&&(d.type=parseInt(d.type)),d.type){case r.STATIC:e=d.value;break;case r.DYNAMIC:e=d.value;break;case r.ABILITY:var f=a.getStat(b,c,d.value);e=a.getAbilityMod(f);break;case r.STAT:e=a.getStat(b,c,d.value);break;case r.BASE_ABILITY:e=b.abilityScores[d.value];break;case r.DICE:var g=d.value.split("d");e=(parseInt(g[1])/2+.5)*parseInt(g[0]);break;case r.POWER_ATTACK_HIT:var h=a.getStat(b,c,"bab");e=-1*(Math.floor(h/4)+1);break;case r.POWER_ATTACK_DMG:var i=a.getStat(b,c,"bab");i=Math.floor(i/4)||1,e=d.value?3*i:2*i;break;case r.TWO_WEAPON:e=-2}if("string"==typeof e&&(e=parseFloat(e),e=isNaN(e)?0:e),d.modifier){var j=d.modifier;"string"==typeof j&&(j=c[j]),e*=j,d.type!==r.DICE&&(e=Math.floor(e))}return e}function e(){var b=0;return a.selectedCharacter.levels.length>0&&(b=_.max(a.selectedCharacter.levels,function(a){var b=parseFloat(a.level);return isNaN(b)?0:b}).level),{level:b+1,attackGroups:[],selectedAttackGroupIndex:-1,selectedAttackGroup:null,strength:{increase:{type:r.DYNAMIC,value:0,order:1},"class":{type:r.DYNAMIC,value:0,order:2},enhance:{type:r.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:r.BASE_ABILITY,value:"strength",applyOnce:!0,order:0}},dexterity:{increase:{type:r.DYNAMIC,value:0,order:1},"class":{type:r.DYNAMIC,value:0,order:2},enhance:{type:r.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:r.BASE_ABILITY,value:"dexterity",applyOnce:!0,order:0}},constitution:{increase:{type:r.DYNAMIC,value:0,order:1},"class":{type:r.DYNAMIC,value:0,order:2},enhance:{type:r.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:r.BASE_ABILITY,value:"constitution",applyOnce:!0,order:0}},intelligence:{increase:{type:r.DYNAMIC,value:0,order:1},"class":{type:r.DYNAMIC,value:0,order:2},enhance:{type:r.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:r.BASE_ABILITY,value:"intelligence",applyOnce:!0,order:0}},wisdom:{increase:{type:r.DYNAMIC,value:0,order:1},"class":{type:r.DYNAMIC,value:0,order:2},enhance:{type:r.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:r.BASE_ABILITY,value:"wisdom",applyOnce:!0,order:0}},charisma:{increase:{type:r.DYNAMIC,value:0,order:1},"class":{type:r.DYNAMIC,value:0,order:2},enhance:{type:r.DYNAMIC,value:0,applyOnce:!0,order:3},base:{type:r.BASE_ABILITY,value:"charisma",applyOnce:!0,order:0}},ac:{base:{type:r.STATIC,value:10,"flat-footed":!0,touch:!0,applyOnce:!0,order:0},armor:{type:r.DYNAMIC,value:0,"flat-footed":!0,touch:!1,applyOnce:!0,order:1},shield:{type:r.DYNAMIC,value:0,"flat-footed":!0,touch:!1,applyOnce:!0,order:2},dexterity:{type:r.ABILITY,value:"dexterity","flat-footed":!1,touch:!0,title:"Dex",applyOnce:!0,order:3},size:{type:r.DYNAMIC,value:0,"flat-footed":!0,touch:!0,applyOnce:!0,order:4},natural:{type:r.DYNAMIC,value:0,"flat-footed":!0,touch:!1,applyOnce:!0,order:5},deflection:{type:r.DYNAMIC,value:0,"flat-footed":!0,touch:!0,applyOnce:!0,order:6},dodge:{type:r.DYNAMIC,value:0,"flat-footed":!1,touch:!0,applyOnce:!0,order:7},touch:{type:r.DYNAMIC,value:0,"flat-footed":!1,touch:!0,applyOnce:!0,order:8},"flat-footed":{type:r.DYNAMIC,value:0,"flat-footed":!0,touch:!1,applyOnce:!0,order:9}},fortitude:{base:{type:r.DYNAMIC,value:0,order:0},constitution:{type:r.ABILITY,value:"constitution",applyOnce:!0,title:"Ability",order:1},magic:{type:r.DYNAMIC,value:0,applyOnce:!0,order:2},misc:{type:r.DYNAMIC,value:0,applyOnce:!0,order:3}},reflex:{base:{type:r.DYNAMIC,value:0,order:0},dexterity:{type:r.ABILITY,value:"dexterity",applyOnce:!0,title:"Ability",order:1},magic:{type:r.DYNAMIC,value:0,applyOnce:!0,order:2},misc:{type:r.DYNAMIC,value:0,applyOnce:!0,order:3}},will:{base:{type:r.DYNAMIC,value:0,order:0},wisdom:{type:r.ABILITY,value:"wisdom",applyOnce:!0,title:"Abililty",order:1},magic:{type:r.DYNAMIC,value:0,applyOnce:!0,order:2},misc:{type:r.DYNAMIC,value:0,applyOnce:!0,order:3}},dr:{base:{type:r.DYNAMIC,value:0,applyOnce:!0,order:0},"class":{type:r.DYNAMIC,value:0,order:1}},sr:{base:{type:r.DYNAMIC,value:0,order:0},"class":{type:r.DYNAMIC,value:0,order:1},enhance:{type:r.DYNAMIC,value:0,applyOnce:!0,order:2}},hp:{level:{type:r.DYNAMIC,value:0,order:0},constitution:{type:r.ABILITY,value:"constitution",title:"Con",applyOnce:!0,modifier:"level",order:1},favoured:{type:r.DYNAMIC,value:0,order:2},toughness:{type:r.DYNAMIC,value:0,order:3},other:{type:r.DYNAMIC,value:0,order:4}},bab:{"class":{type:r.DYNAMIC,value:0,order:0}},initiative:{dexterity:{type:r.ABILITY,value:"dexterity",applyOnce:!0,order:0,title:"Dex"},"class":{type:r.DYNAMIC,value:0,order:2},misc:{type:r.DYNAMIC,value:0,applyOnce:!0,order:1}},movement:{base:30,armor:30,fly:0,swim:0,climb:0,burrow:0},equipment:[],feats:[],skills:[],"spell-casting":[],abilities:[]}}function f(){return{name:"Name",selectedAttack:null,selectedAttackIndex:null,attacks:[g()]}}function g(){return{weapon:"attack",damage:[{type:r.DICE,value:"1d8",modifier:1,percision:!1},{type:r.ABILITY,value:"strength",modifier:1,percision:!1}],hitChance:[{type:r.STAT,value:"bab"},{type:r.ABILITY,value:"strength"}],critThreat:.05,critMultiplier:2}}function h(){return{type:r.DYNAMIC,value:0}}function i(){return{type:r.DICE,value:"1d8",modifier:1,percision:!1}}function j(){var a=Math.floor(255*Math.random()),b=Math.floor(255*Math.random()),c=Math.floor(255*Math.random()),d=.5,e=1,f="rgba("+a+","+b+","+c+","+d+")",g="rgba("+a+","+b+","+c+","+e+")";return{fill:f,stroke:g,point:f}}function k(){q&&q.destroy();var b,c=[];for(var d in a.characters){var e=a.characters[d];for(var f in e.levels){var g=e.levels[f];c.push(g.level)}e.colors||(e.colors=j(),e.style={"background-color":e.colors.fill})}c=_.uniq(c),b=_.map(a.characters,function(b){return{label:b.name,fillColor:b.colors.fill,strokeColor:b.colors.stroke,pointColor:b.colors.point,pointStrokeColor:"#FFF",pointHighlightFill:"#FFF",pointHighlighStroke:"#FFF",data:_.map(c,function(c){var d=_.find(b.levels,function(a){return a.level===c});return d?_.reduce(d.attackGroups,function(c,e){var f=a.calculateDPR(b,d,e);return c>f?c:f},0):0})}});var h={labels:c,datasets:b};q=new Chart(t).Line(h),window.setTimeout(function(){q.resize()},1e3)}function l(a){return"string"==typeof a&&(a=parseFloat(a),isNaN(a))?function(){return!1}:function(b){var c=parseFloat(b.level);return a>=c}}function m(a,b,c){return function(e,f){var g=_.reduce(f[c],function(c,e){return e.applyOnce&&f.level!==b.level?c:c+d(a,b,e)},0);return e+=g?g:0}}function n(a,b,c){return _.reduce(c.hitChance,function(c,e){return c+=d(a,b,e)},0)}function o(a,b,c,e){var f=0,g=0;for(var h in c.damage){var i=c.damage[h],j=d(a,b,i);i.percision?g+=j:f+=j}return f=0>f?0:f,g=0>g?0:g,e?{damage:f,percision:g}:g?f+" and percision: "+g:f}function p(b,c,d){var e,f=parseInt(c.level),g=a.targetAc[f],h=.05,i=.95,j=0,k=0,l=n(b,c,d),m=o(b,c,d,!0);return j=m.damage,k=m.percision,e=1-(g-l)/20,e=h>e?h:e,e=e>i?i:e,e*(j+k)+d.critThreat*(d.critMultiplier-1)*e*j}a.edit=c;var q,r={STATIC:0,ABILITY:1,DYNAMIC:2,STAT:3,BASE_ABILITY:4,DICE:5,POWER_ATTACK_HIT:6,POWER_ATTACK_DMG:7,TWO_WEAPON:8},s={INLINE:0,HEADER:1,GROUP:2},t=angular.element("#chart")[0].getContext("2d");a.graphDPR=function(){c.id="graph",window.setTimeout(k,100)},a.BONUS_TYPE=r,a.RENDER_TYPE=s,a.bonusTypeText=function(a){a=parseInt(a);var b;switch(a){case r.STATIC:b="Static";break;case r.ABILITY:b="Ability";break;case r.DYNAMIC:b="Dynamic";break;case r.STAT:b="Stat";break;case r.BASE_ABILITY:b="Base Ability";break;case r.DICE:b="Dice";break;case r.POWER_ATTACK_HIT:b="Power Atk";break;case r.POWER_ATTACK_DMG:b="Power Atk";break;case r.TWO_WEAPON:b="Two Weapon"}return b},a.getValue=d,a.selectLevel=function(b,c){a.edit.clear(),b.selectedLevelIndex=c,-1===c?b.selectedLevel=null:b.selectedLevel=b.levels[c]},a.addLevel=function(b){b.levels.push(e()),a.selectLevel(b,b.levels.length-1)},a.removeLevel=function(b,c){1!==b.levels.length&&(b.levels.splice(c,1),b.selectedLevelIndex>=c?0===c||0===b.selectedLevelIndex?a.selectLevel(b,0):a.selectLevel(b,b.selectedLevelIndex-1):b.selectedLevelIndex>b.levels.length-1&&a.selectLevel(b,b.levels.length-1))},a.sortLevel=function(a){a.levels=_.sortBy(a.levels,function(a){return parseFloat(a.level)}),a.selectedLevelIndex=_.indexOf(a.levels,a.selectedLevel)},a.getAbilityMod=function(a){return a=parseInt(a),Math.floor((a-10)/2)},a.getPointBuy=function(b){return b?_.reduce(a.abilityScores,function(c,d){var e=parseFloat(b.abilityScores[d]);return e=3>e?3:e,e=e>18?18:e,c+=a.pointBuy[e?e:10]},0):void 0},a.importExport=null,a["export"]=function(){a.importExport=b("json")(a.selectedCharacter,4),a.edit.id="export"},a.importStart=function(){a.importExport="",a.edit.id="import"},a.importPaste=function(b){a.importExport=b.target.value},a.importEnd=function(){a.selectedCharacter=angular.fromJson(a.importExport),a.characters[a.selectedCharacterIndex]=a.selectedCharacter,a.edit.id=null},a.getStat=function(a,b,c){return _.chain(a.levels).filter(l(b.level)).reduce(m(a,b,c),0).value()},a.getStatMod=function(a,b,c,d){return _.chain(a.levels).filter(l(b.level)).map(function(a){var b={};return b[c]={},b[c][d]=a[c][d],b}).reduce(m(a,b,c),0).value()},a.standardStats=[{title:"Ability",renderType:s.GROUP,items:[{name:"strength",title:"Str"},{name:"dexterity",title:"Dex"},{name:"constitution",title:"Con"},{name:"intelligence",title:"Int"},{name:"wisdom",title:"Wis"},{name:"charisma",title:"Cha"}],additionalColumns:[{name:"mod",title:"Modifier",value:a.getAbilityMod,order:0,position:0}]},{name:"hp",title:"HP",renderType:s.HEADER},{name:"ac",title:"AC",renderType:s.HEADER},{title:"Saves",renderType:s.GROUP,items:[{name:"fortitude",title:"Fort"},{name:"reflex",title:"Ref"},{name:"will",title:"Will"}]},{name:"initiative",title:"Init",renderType:s.INLINE},{name:"bab",title:"BAB",renderType:s.INLINE},{name:"dr",title:"DR",renderType:s.INLINE},{name:"sr",title:"SR",renderType:s.INLINE}],a.statOrder="order",a.selectAttackGroup=function(b,c){a.edit.clear(),b.selectedAttackGroupIndex=c,-1===c?b.selectedAttackGroup=null:b.selectedAttackGroup=b.attackGroups[c]},a.addAttackGroup=function(b){b.attackGroups.push(f()),a.selectAttackGroup(b,b.attackGroups.length-1)},a.removeAttackGroup=function(b,c){b.attackGroups.splice(c,1),b.selectedAttackGroupIndex===c&&a.selectAttackGroup(b,-1),b.selectedAttackGroupIndex>=c?0===c||0===b.selectedAttackGroupIndex?a.selectAttackGroup(b,0):a.selectAttackGroup(b,b.selectedAttackGroupIndex-1):b.selectedAttackGroupIndex>b.attackGroups.lenth-1&&a.selectAttackGroup(b,b.attackGroups.length-1)},a.copyAttackGroupFromPreviousLevel=function(a,b){var c=parseInt(b.level),d=_.reduce(a.levels,function(a,b){var d=parseInt(b.level),e=parseInt(a.level);return c>d&&(!a||d>e)?b:a},!1);d&&(b.attackGroups=b.attackGroups.concat(angular.copy(d.attackGroups)))},a.selectAttack=function(b,c){a.edit.clear(),b.selectedAttackIndex=c,-1===c?b.selectedAttack=null:b.selectedAttack=b.attacks[c]},a.addAttack=function(b){b.attacks.push(g()),a.selectAttack(b,b.attacks.length-1)},a.removeAttack=function(b,c){b.attacks.splice(c,1),b.selectedAttackIndex===c&&a.selectAttack(b,-1),b.selectedAttackIndex>=c?0===c||0===b.selectedAttackIndex?a.selectAttack(b,0):a.selectAttack(b,b.selectedAttackIndex-1):b.selectedAttackIndex>b.attacks.lenth-1&&a.selectAttack(b,b.attacks.length-1)},a.addHit=function(a){a.hitChance.push(h())},a.removeHit=function(a,b){a.hitChance.splice(b,1)},a.addDmg=function(a){a.damage.push(i())},a.removeDmg=function(a,b){a.damage.splice(b,1)},a.calculateAttackDPR=p,a.calculateDPR=function(a,b,c){return _.reduce(c.attacks,function(c,d){return c+=p(a,b,d)},0)},a.getHit=n,a.getDmg=o,a.abilityScores=["strength","dexterity","constitution","intelligence","wisdom","charisma"],a.pointBuy={3:-4,4:-4,5:-4,6:-4,7:-4,8:-2,9:-1,10:0,11:1,12:2,13:3,14:5,15:7,16:10,17:13,18:17},a.targetAc={1:12,2:14,3:15,4:17,5:18,6:19,7:20,8:21,9:23,10:24,11:25,12:27,13:28,14:29,15:30,16:31,17:32,18:33,19:34,20:36}}]),angular.module("dprCalcApp").controller("ClassListCtrl",["$scope","$http",function(a,b){function c(b){a.classes=a.classes.concat(b)}var d=["acg","crb","apg","uc","um"];a.classes=[];for(var e in d)b.get("data/"+d[e]+"/class-list.json").success(c);a.options={bab:["1","0.75","0.5"],hd:["12","10","8","6"],skills:["8","6","4","2"],saves:["HIGH","LOW"]},a.orderProp="name"}]);