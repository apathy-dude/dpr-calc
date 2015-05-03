'use strict';

describe('Controller: ClassListCtrl', function () {

  // load the controller's module
  beforeEach(module('dprCalcApp'));

  var ClassListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClassListCtrl = $controller('ClassListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of options.saves to the scope', function () {
    expect(scope.options.saves.length).toBe(2);
  });

});
