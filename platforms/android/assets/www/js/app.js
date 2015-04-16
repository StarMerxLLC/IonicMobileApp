// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var marketProSelected=[];
var proSelected=[];
var collectProSelected=[];
var currentUser;
var db;
var myApp = angular.module('ionicApp', ['ionic', 'supplier.directives', 'ngCordova']);

myApp.run(['$ionicPlatform', '$ionicPopup','$ionicLoading','$rootScope','$location', function ($ionicPlatform, $ionicPopup, $ionicLoading, $rootScope, $location) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs).
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }

                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
                db=window.openDatabase("proDB.db", "1.0", "Demo", 1024 * 1024 * 500);// browser
                db.transaction(function(context){
                    context.executeSql('CREATE TABLE IF NOT EXISTS supplierTB (id integer primary key, supplierid, name, location, contact, telephone, type, url, state, email,beizhu, cardimg, modify, new, uploaded)');
                    context.executeSql('CREATE TABLE IF NOT EXISTS offerTB (id integer primary key, supplierid, productid, developerid, price, dev_note, lead_time, MOQ, type, modify, new,uploaded)');
                    context.executeSql('CREATE TABLE IF NOT EXISTS marketTB (id integer primary key, market_name)');
                    context.executeSql('CREATE TABLE IF NOT EXISTS categoryTB (id integer primary key, catid, catname, marketid, is_root, downloaded)');
                    context.executeSql('CREATE TABLE IF NOT EXISTS catRelationTB (id integer primary key, catid, child_catid, marketid)');
                    context.executeSql('CREATE TABLE IF NOT EXISTS assignTB (id integer primary key, productid, assignto, finished)');
                    context.executeSql('CREATE TABLE IF NOT EXISTS proCategoryTB (id integer primary key, productid, catid)');
                    context.executeSql('CREATE TABLE IF NOT EXISTS productTB (id integer primary key, marketid, asin, title, image, price, reviews, weight, grossweight, real_weight, real_grossweight, developed,modify,uploaded,markColor)');
                    context.executeSql('CREATE TABLE IF NOT EXISTS collectTB (id integer primary key, productid,title, image, price , userid)');
                    context.executeSql('create index idxprocat1 on proCategoryTB(productid)');
                    context.executeSql('create index idxprocat2 on proCategoryTB(catid)');
                    console.log('create all table success!');
                  })
            });

            //*** Show loading indicator between page transitions - mostly for when deployed
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                // $ionicLoading.show({
                //     template: '<i class="icon ion-loading-b"></i>'
                // });
            });
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                $ionicLoading.hide();
            });
        }])





