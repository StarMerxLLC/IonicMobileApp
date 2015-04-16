// angular.module('ionicApp')
myApp.config(function($stateProvider, $compileProvider, $httpProvider, $urlRouterProvider, $ionicConfigProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.withCredentials = true;
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);       //camera config
  //让tabs处于底部
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('bottom');
  $stateProvider
    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller:"LoginCtrl"
      })
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/tabs.html",
    })
    .state('app.suppliers', {
      url: "/suppliers",
      views: {
        'tab-suppliers': {
          templateUrl: "templates/suppliers_list.html",
          controller: 'SuppliersCtrl'
        }
      }
    })
    .state('app.collection', {
      cache: false,
      url: "/collection",
      views: {
        'tab-collection': {
          templateUrl: "templates/shoucang.html",
          controller: 'ShouCangCtrl'
        }
      }
    })
    .state('app.createsupplier', {
      url: "/createsupplier",
      views: {
        'tab-suppliers': {
          templateUrl: "templates/createSupplier.html",
          controller: 'NewSupplierCtrl'
        }
      }
    })
    .state('app.supplieroffer', {
      url: "/supplieroffer/:supplierid",
      views: {
        'tab-suppliers': {
          templateUrl: "templates/supplier_offers.html",
          controller: 'SupplierOfferCtrl'
        }
      }
    })
    .state('app.addoffer', {
      url: "/supplieroffer/addoffer",
      views: {
        'tab-suppliers': {
          templateUrl: "templates/addOffer.html",
          controller: 'AddOfferCtrl'
        }
      }
    })
    .state('market_assignsupplier', {
      cache: false,
      url: "/markettab/assignsupplier/:datatag",
      templateUrl: "templates/market_assignSupplier.html",
      controller: 'MarketAssignSupplierCtrl'
    })
    .state('assignsupplier', {
      cache: false,
      url: "/assignsupplier",
      templateUrl: "templates/personal_assignSupplier.html",
      controller: 'AssignSupplierCtrl'
    })
    .state('app.pros', {
      url: "/pros",
      views: {
        'tab-marketpro': {
          templateUrl: "templates/side-menu.html",
          controller: 'SideMenuCtrl'
        }
      }
    })
    .state('app.pros.marketpro', {
      url: "/marketpro",
      views: {
        'sidemenu': {
          templateUrl: "templates/category_pro.html",
          controller: 'CategoryMenuCtrl'
        }
      }
    })
     .state('app.product', {
      url: "/product",
      views: {
        'tab-personal': {
          templateUrl: "templates/sidemenu_personal.html",
          controller: 'PersonalProCtrl'
        }
      }
    })
    .state('app.product.proview', {
      url: "/proview",
      views: {
        'sidemenu': {
          templateUrl: "templates/marketpro_personal.html",
          controller: 'CatPerProCtrl'
        }
      }
    })
    .state('prodetail', {
      cache:false,
      url: "/prodetail/:productID/:tag",
      templateUrl: "templates/marketpro_detail.html",
      controller: 'ProDetailCtrl'
    })
    .state('offerdetail', {
      cache: false,
      url: "/offerdetail/:supplier/:productID",
      templateUrl: "templates/offer_detail.html",
      controller: 'OfferDetailCtrl'
    })
    .state('app.setting', {
      url: "/setting",
      views: {
        'tab-setting': {
          templateUrl: "templates/setting.html",
          controller: 'SettingCtrl'
        }
      }
    });
   $urlRouterProvider.otherwise("/login");

})
