angular.module('supplier.directives', [])
.directive('fpSearchBar', function($rootScope) {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {
      searchModel: '=?',
      focused: '=?',
      submit: '&'
    },
    template:function(){
      if(ionic.Platform.isAndroid()){
        return '<form class="bar bar-header bar-light item-input-inset" ng-submit="submit()">' +
          '<div style="border:1px solid green" class="item-input-wrapper light-bg" ng-class="alignment" ng-click="focus()">' +
          '<i class="icon ion-ios7-search-strong placeholder-icon"></i>' +
          '<input type="search"' +
          'id="searchInput"' +
          'placeholder="请输入供应商名称"' +
          'ng-model="searchModel"' +
          'ng-focus="alignment = \'text-left\'"' +
          'ng-blur="alignment = searchModel.length?\'left\':\'centered\'">' +
          '<i class="icon ion-ios7-close dark" ng-show="searchModel.length" ng-click="clear()"></i>' +
           '</div>' +
          '</form>'
      }
      return '<form class="bar bar-header bar-light item-input-inset" ng-submit="submit()">' +
        '<div style="border:1px solid green" class="item-input-wrapper light-bg" ng-class="alignment" ng-click="focus()">' +
        '<i class="icon ion-ios7-search placeholder-icon"></i>' +
        '<input type="search"' +
        'id="searchInput"' +
        'placeholder="请输入供应商名称"' +
        'ng-model="searchModel"' +
        'ng-focus="alignment = \'left\'"' +
        'ng-blur="alignment = searchModel.length?\'left\':\'centered\'">' +
        '<i class="icon ion-ios7-close dark" ng-show="searchModel.length" ng-click="clear()"></i>' +
         '</div>' +
        '</form>'
    },
    link: function(scope, elem){
      var input = elem[0].querySelector('#searchInput');
      scope.focus = function(){
        input.focus()
      };
      scope.alignment = scope.searchModel.length? 'left':'centered';
      // grab the cached search term when the user re-enters the page
      $rootScope.$on('$ionicView.beforeEnter', function(){
        if(typeof localStorage.searchCache != 'undefined') {
          var sc = JSON.parse(localStorage.searchCache);
          scope.searchModel = sc.term;
        }
      });
      scope.clear = function(){
        scope.searchModel = '';
        scope.alignment = 'centered';
        input.blur();

        scope.$emit('fpSearchBar.clear');
      };
    }
  };
})
// custom directive to bind to hold events and trigger the sharing plugin
// expects the parent scope to contain a post item from the HNAPI service
.directive('fpShare', function($ionicGesture) {
  return {
    restrict :  'A',
    link : function(scope, elem) {
      $ionicGesture.on('hold',share , elem);

      function share(){
        if(typeof window.plugins === 'undefined' || typeof window.plugins.socialsharing === 'undefined'){
          console.error("Social Sharing Cordova Plugin not found. Disregard if on a desktop browser.");
          return;
        }
        window.plugins
          .socialsharing
          .share(null,
          null,
          null,
          scope.$parent.post.url)
      }
    }
  }
});