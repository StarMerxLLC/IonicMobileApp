// angular.module('ionicApp')
myApp.controller('LoginCtrl', function($scope, $state, $timeout, $ionicLoading, $ionicPopup, AppAPI , AppCache) {
  var check = function(user) {
    AppCache.loginCheck(user, function(result) {
              if(result=='existence') {
                $ionicLoading.hide();
                $state.go('app.suppliers');
              }
              else if(result=='inexistence'){
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                 title: '提醒！',
                 template: '该用户名不存在，请重新输入！'
                 });
                 alertPopup.then(function(res) {
                   console.log('user error!');
                 });
              }
              else {
                var alertPopup = $ionicPopup.alert({
                 title: '提醒！',
                 template: '出现错误，请联系开发人员！'
                 });
                 alertPopup.then(function(res) {
                   console.log('error!');
                 });
              }
          })
  }
  $scope.login = function(user) {
    // $state.go('app.suppliers');
    $ionicLoading.show({
      template: '<i class="icon ion-loading-a"></i>',
    });
    AppCache.usertableCheck(function(result) {
      if(result=='error') {
        console.log('no user table')
        AppAPI.getUserInfor().then(function(data) {
          AppCache.storeUserInfor(data, function(result) {
            $timeout(function() {
              if(result=='success') {
              check(user);
              }
              else {
                alert('出现错误，请联系开发人员！');
                $ionicLoading.hide();
              }
            }, 300)
          })
        }, function(data) {
          alert('网络请求错误！');
          $ionicLoading.hide();
        })
      }
      else {
        console.log('have user table')
        $timeout(function() {
          check(user);
        }, 300)
      };
    })
  }
})
.controller('SuppliersCtrl', function($scope, $state, $ionicLoading, $ionicPopup, $ionicListDelegate, $timeout, AppAPI, AppCache) {
  $ionicLoading.show({
      template: '正在加载...',
    });
  $scope.active = 'shiti';
  var currentPage = 1;
  var searchString;
  $scope.doRefresh =function() {
    $scope.searchmodel=false;
    $scope.loadfinished=true;
    AppCache.getSuppliers(1, $scope.active, function(data) {
      currentPage=1;
      $scope.suppliers = data;
      $ionicLoading.hide()
      $scope.$broadcast('scroll.refreshComplete');
    })
  };
  $scope.doRefresh();
  $scope.setActive = function(type) {
    $scope.searchmodel=false;
    $scope.active = type;
    currentPage=1;
    $ionicLoading.show({
      template: '正在加载...',
    });
    AppCache.getSuppliers(1, type, function(data) {
      $timeout(function() {
        $ionicLoading.hide();
        $scope.suppliers=data;
      }, 300)
      })
  };
  $scope.isActive = function(type){
    return type === $scope.active;
  };
  
  $scope.loadMoreData = function() {
    currentPage++;
    $scope.loadfinished=false;
    if(!$scope.searchmodel) {
        AppCache.getSuppliers(currentPage, $scope.active, function(data) {
        $timeout(function() {
          $scope.loadfinished=true;
          $scope.suppliers = $scope.suppliers.concat(data);
        }, 300)
      });
    }
    else {
      AppCache.searchSupplier(currentPage, searchString, 'supplierTab', function(data) {
        $timeout(function() {
          $scope.loadfinished=true;
          $scope.suppliers = $scope.suppliers.concat(data);
        }, 300);
      })
    }
  };

  $scope.confirmDisable = function(supplier) {
    var confirmPopup = $ionicPopup.confirm({
       title: '提醒！',
       template: '你确定要禁用该供应商吗?'
     });
     confirmPopup.then(function(res) {
       if(res) {
        AppCache.disableSupplier(supplier,function(state){
          if(state=='success'){
            $scope.suppliers.splice($scope.suppliers.indexOf(supplier), 1);
            $ionicListDelegate.closeOptionButtons();
          }
          else{
            alert('禁用失败！');
            $ionicListDelegate.closeOptionButtons();
          }
        });
        
       } else {
         $ionicListDelegate.closeOptionButtons();
       }
     });
  };
  $scope.searchTerm = '';
  $scope.searchItem = function(suppliername) {
    $scope.searchmodel=true;
    searchString = suppliername;
    if(suppliername==='')return;
    $ionicLoading.show({
      template:'搜索中...'
    });
    document.getElementById('searchInput').blur();
    AppCache.searchSupplier(1, suppliername, 'supplierTab', function(data) {
      $timeout(function() {
          if(data.length==0) {
          $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
             title: '提醒！',
             template: '没有匹配的供应商！'
             });
             alertPopup.then(function(res) {
             });
        }
        else {
              $scope.suppliers = data;
              $scope.noMatchSupplier=false;
              $ionicLoading.hide();
        }
      }, 300)
    })
  };
  $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    $ionicLoading.hide();
    });
  $scope.$on('fpSearchBar.clear', function(){
    $scope.searchTerm = '';
  });
})
.controller('ShouCangCtrl',function($scope,$state,$ionicPopup,$ionicModal,$timeout, $ionicLoading,AppCache){
  $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    $ionicLoading.show({
      template: '正在加载...',
    });
    $scope.loadfinished=true;
    currentPage=1;
    AppCache.getCollectPro(1, 'undev',function(data){
      $timeout(function(){
        $scope.products=data;
        $ionicLoading.hide();
      },500)
    })
  });
  $scope.active = 'undev';
  $scope.setActive = function(type) {
    $scope.active = type;
    currentPage=1;
    $ionicLoading.show({
      template: '正在加载...',
    });
    AppCache.getCollectPro(1, type, function(data) {
      $timeout(function() {
        $ionicLoading.hide();
        $scope.products=data;
      }, 300)
      })
  };
  $scope.isActive = function(type){
    return type === $scope.active;
  };
  $scope.isDev = function(product){
    if(product.developed=='true'){
      return true;
    }
    else{
      return false;
    }
  };
  // $scope.selectAll = function()
  $scope.loadMoreData = function(){
    currentPage++;
    $scope.loadfinished=false;
    AppCache.getCollectPro(currentPage,$scope.active, function(data){
      $timeout(function(){
        $scope.loadfinished=true;
        $scope.products = $scope.products.concat(data);
      },300)
    })
  }
  $scope.assignSupplier = function() {
    var selchecks = document.getElementsByName('checkbox2');
    var selectPros=[];
    for (var i=0; i<selchecks.length; i++)
    {
      if(selchecks[i].checked)
      {
        selectPros.push($scope.products[i].productid);
      }
    }
    if(selectPros.length==0) {
     var alertPopup = $ionicPopup.alert({
       title: '提醒！',
       template: '请选择产品！'
     });
    }
    else {
      collectProSelected=selectPros;
      $state.go('market_assignsupplier',{datatag:'collection'});
    }
  };
  $scope.showdetail = function(product){
    $state.go('prodetail', {productID: product.productid, tag:'collection'})
  };
  $ionicModal.fromTemplateUrl('image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });
  $scope.viewImage = function(imgurl) {
      $scope.imageSrc = imgurl;
      $scope.openModal();
  };
  $scope.clearAllMark = function(){
    var confirmPopup = $ionicPopup.confirm({
      title: '<strong>清空收藏夹！</strong>',
      template: '你确定要清空收藏夹？这将清除所有收藏内容！',
      okText: '确定',
      cancelText: '取消'
    });
    confirmPopup.then(function (res){
      if(res){
        $ionicLoading.show({
          template:'<i class="icon ion-loading-a"></i>正在清除收藏夹!'
        })
        AppCache.clearAllCollection(currentUser,function(state){
          if(state=='success'){
            $ionicLoading.hide();
            $scope.products.splice(0, $scope.products.length);
          }
          else{
            alert('清空出现异常！');
          }
        })
      }
    })    
  };
  $scope.quxiao = function(product){
    AppCache.quxiaoShouCang(product, currentUser,function(state){
      if(state=='success'){
        var myPopup = $ionicPopup.show({
          title: '取消收藏成功！',
          scope: $scope,
        });
        $timeout(function() {
           $scope.products.splice($scope.products.indexOf(product),1);
           myPopup.close(); //close the popup after 0.5 seconds
        }, 500);
      }
      else{
        alert('取消收藏失败！');
      }
    })
  };
})
.controller('NewSupplierCtrl', function($scope, $ionicPopover, $state, AppCache) {
  $scope.newsupplier={};
  $scope.selecttype={name:'实体',value:'shiti'};
  $scope.suppliertypes=[{name:'实体',value:'shiti'},{name:'淘宝', value:'taobao'}]
  $scope.createSupplier = function() {
    var d = new Date();
    $scope.newsupplier.cardimg='';
    $scope.newsupplier.type = $scope.selecttype.value;
    AppCache.selectMaxSupplierId(function(data) {
      var id = data;
      var supplierObj = SupplierModel($scope.newsupplier);
      AppCache.insertSupplier(id+1,supplierObj, function(result) {
        if(result=="success") {
          $scope.cancel();
          return;
        }
        else {
          alert("创建供应商失败！")
          return;
        }
      })
    });
  };
  $scope.cancel = function () {
      $state.go('app.suppliers');
   };
})

.controller('SupplierOfferCtrl', function($scope, $state, $ionicPopup, $timeout, $ionicLoading, $ionicPopover, $ionicModal, $ionicListDelegate, $ionicActionSheet, $stateParams, AppCache) {
  $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      $scope.refresh();
      $scope.selecttype={};
  });
  var supplierID = parseInt($stateParams.supplierid)
  $scope.nooffer=false;
  $scope.refresh = function() {
    $scope.editsupplier=false;
    AppCache.getOffer(supplierID, currentUser, function(data) {
      $timeout(function() {
        $scope.offers=data['offer'];
        $scope.supplier=data['supplier'];
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        if($scope.offers.length==0) {
          $scope.nooffer=true;
        };
      }, 350)
    })
  }
  $scope.editSupplier = function(supplier) {
    var btnContent = document.getElementById('editBut').innerHTML;
    if(btnContent=='编辑供应商'){
      document.getElementById('editBut').innerHTML="取消编辑";
      $scope.editsupplier=true;
      $scope.selecttype={value: supplier.type}
      $scope.suppliertypes=[{value:'shiti'}, {value:'taobao'}]
      $scope.supplierEdited = {
        id: supplier.id,
        name: supplier.name,
        location: supplier.location,
        contact: supplier.contact,
        telephone: supplier.telephone,
        url: supplier.url,
        email:supplier.email,
        state: supplier.state,
        beizhu: supplier.beizhu,
        cardimg: supplier.cardimg
      };
    }
    else{
      document.getElementById('editBut').innerHTML="编辑供应商";
      $scope.editsupplier=false;
    }
  };

  $scope.updateSupplier = function(supplierEdited) {
    supplierEdited.type=$scope.selecttype.value;
    AppCache.updateSupplier(supplierEdited);
    document.getElementById('editBut').innerHTML="编辑供应商";
    $scope.refresh();
  };
  $scope.editOffer = function(offer) {
   $scope.offerEdited = {
      id: offer.id,
      price: offer.price,
      dev_note: offer.dev_note,
      lead_time: offer.lead_time,
      MOQ: offer.MOQ,
    };
    var confirmPopup = $ionicPopup.confirm({
       title: '编辑offer信息',
       templateUrl: 'templates/editOffer.html',
       scope: $scope,
     });
     confirmPopup.then(function(res) {
       if(res) {
        AppCache.updateOffer($scope.offerEdited, supplierID);
        $ionicListDelegate.closeOptionButtons();
        $scope.refresh();
       } else {
        $ionicListDelegate.closeOptionButtons();
       }
     });
  };
  $scope.offerDetail = function(offer) {
    $state.go('offerdetail',{supplier: offer.supplierid, productID: offer.productid});
  }

  $scope.addOffer = function() {
    $state.go('app.pros.marketpro');
  };
  // $scope.gotoDetail = function(offer) {
  //   $state.go("prodetail")
  // }
  $ionicModal.fromTemplateUrl('image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });

  $scope.showImg = function(imgurl) {
      $scope.imageSrc = imgurl;
      $scope.openModal();
    };
})
.controller('MarketAssignSupplierCtrl', function($scope, $timeout, $stateParams,$ionicModal, $ionicPopup, $ionicLoading, $state, AppCache, Camera) {
  $ionicModal.fromTemplateUrl('templates/selectSupplier.html', function(modal) {
    $scope.selectSupplierModal = modal;
  }, {
    scope: $scope
  });
  var tag = $stateParams.datatag;
  $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      if(tag=='market'){
        AppCache.getSelectedPro(marketProSelected, function(result) {
          $timeout(function() {
            $scope.products = result;
            $scope.supplierInfoShow=false;
            $scope.lastPhoto="";
            $scope.supplierAdd = {};
            $scope.supplierSelected={supplier: null};
            $ionicLoading.hide();
          }, 300)
        })
      }
      else{
        AppCache.getSelectedPro(collectProSelected, function(result) {
          $timeout(function() {
            $scope.products = result;
            $scope.supplierInfoShow=false;
            $scope.lastPhoto="";
            $scope.supplierAdd = {};
            $scope.supplierSelected={supplier: null};
            $ionicLoading.hide();
          }, 300)
        })
      }
    });
  $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
      $scope.lastPhoto = imageURI;
    }, function(err) {
      console.err(err);
    }, {
      quality: 75,
      targetWidth: 100,
      targetHeight: 100,
      saveToPhotoAlbum: false
    });
  };
  $scope.deltetePhoto = function() {
      $scope.lastPhoto="";
  }
  $scope.noMatchSupplier=false;
  $scope.supplierInfoShow=false;
  $scope.loadfinished = true;
  $scope.viewSupplier = function() {
    $scope.noMatchSupplier=false;
    $scope.selectSupplierModal.show();
  };
  $scope.supplierAdd = {};
  $scope.supplierSelected={supplier: null};
  $scope.selectItem = {name: ''};
  var currentPage = 1;
  $scope.searchSupplier = function() {
    currentPage = 1;
    if(!$scope.selectItem.name) {
      return;
    }
    $ionicLoading.show({
          template: 'searching...',
        })
    AppCache.searchSupplier(1, $scope.selectItem.name, 'marketproTab', function(data) {
      if(data.length==0) {
        $ionicLoading.hide();
        $scope.suppliers = data;
        $scope.loadfinished = true;
      }
      else {
        $timeout(function() {
           $scope.suppliers = data;
           $scope.loadfinished = true;
           $ionicLoading.hide();
        }, 300)
      }
    })
  };
  $scope.loadMoreData = function() {
    $scope.loadfinished = false;
    currentPage++;
    AppCache.searchSupplier(currentPage, $scope.selectItem.name, 'marketproTab', function(data) {
      if(data.length==0) {
        $scope.loadfinished = true;
      }
      else {
        $timeout(function() {
           $scope.suppliers = $scope.suppliers.concat(data);
           $scope.loadfinished = true;
        }, 300)
      }
    })
  };
  $scope.selecttype={name:'实体',value:'shiti'}
  $scope.suppliertypes=[{name:'实体',value:'shiti'},{name:'淘宝',value:'taobao'}]
  $scope.submitSupplier= function() {
    AppCache.selectSupplier($scope.supplierSelected.supplier.supplierid, function(result) {
      $scope.supplierAdd = result;
      $scope.selectSupplierModal.hide();
      $scope.supplierInfoShow=true;
    })
    $scope.selectItem.name = '';
    delete $scope.suppliers;
  };
  $scope.$on('fpSearchBar.clear', function(){
    $scope.selectItem.name = '';
    delete $scope.suppliers;
  });
  $scope.saveProSupplier = function() {
  var productsList = ProductModel($scope.products);
  console.log(productsList)   
    if($scope.supplierAdd.supplierid) {     //select existed supplier
      AppCache.selectMaxOfferId(function(data) {
        AppCache.addProToSupplier(currentUser, productsList, $scope.supplierAdd.supplierid, data+1, function(result) {
          if(result=='success') {
            console.log('success');
            if(tag=='market'){
              $state.go('app.pros.marketpro');
            }
            else{
              $state.go('app.collection');
            }
            
          }
          else{
            alert('error');
          }
        })
      })
    }
    else if($scope.supplierAdd.name) {
      $scope.supplierAdd.type = $scope.selecttype.value;
      $scope.supplierAdd.cardimg=$scope.lastPhoto;
      var supplierObj = SupplierModel($scope.supplierAdd); 
        AppCache.selectMaxSupplierId(function(data) {
        var supplierID = data+1;
        AppCache.insertSupplier(supplierID, supplierObj, function(result) {
          if(result=="success") {
            AppCache.selectMaxOfferId(function(index) {
              AppCache.addProToSupplier(currentUser, productsList, supplierID, index+1, function(result) {
                if(result=='success') {
                  console.log('success')
                  if(tag=='market'){
                    $state.go('app.pros.marketpro');
                  }
                  else{
                    $state.go('app.collection');
                  }
                  
                }
                else{
                  alert('error');
                }
              })
            })
          }
          else {
            alert("创建供应商失败！")
            return;
          }
        })
      });
      }
    else {
      alert('供应商名称不能为空！')
    }
  }
  $scope.back = function() {
    if(tag=='market'){
      $state.go('app.pros.marketpro');
    }
    else{
      $state.go('app.collection');
    }
  }
  $scope.close = function() {
    $scope.selectSupplierModal.hide();
    $scope.selectItem.name = '';
    delete $scope.suppliers;
  };
  $scope.deleteProduct = function(product){
    $scope.products.splice($scope.products.indexOf(product), 1);
  }
  $scope.editProduct = function(product) {
    $scope.proEdited = {
      id: product.id,
      weight: product.weight,
      grossweight: product.grossweight,
      real_weight: product.real_weight,
      real_grossweight: product.real_grossweight
    }
    var confirmPopup = $ionicPopup.confirm({
       title: '编辑信息',
       templateUrl: 'templates/editProduct.html',
       scope: $scope,
     });
     confirmPopup.then(function(res) {
       if(res) {
        AppCache.updateProduct($scope.proEdited, function(result) {
          if(result=='success') {
            if(tag=='market'){
              AppCache.getSelectedPro(marketProSelected, function(result) {
                $scope.products = result;
              })
            }
            else{
              AppCache.getSelectedPro(collectProSelected, function(result) {
              $scope.products = result;
            })
            }
          }
          else {
            alert('error!');
          }
        });
        $scope.refresh();
       } else {
        //close popup!
       }
     });
  }
})
.controller('AssignSupplierCtrl', function($scope, $timeout, $ionicModal, $ionicPopup, $ionicLoading, $state, AppCache, Camera) {
  $ionicModal.fromTemplateUrl('templates/selectSupplier.html', function(modal) {
    $scope.selectSupplierModal = modal;
  }, {
    scope: $scope
  });
  $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    AppCache.getSelectedPro(proSelected, function(result) {
      $timeout(function() {
        $scope.products = result;
        $scope.supplierInfoShow=false;
        $scope.lastPhoto="";
        $scope.supplierAdd = {};
        $scope.supplierSelected={supplier: null};
        $ionicLoading.hide();
      }, 300)
    })
    });
  $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
      $scope.lastPhoto = imageURI;
    }, function(err) {
      console.err(err);
    }, {
      quality: 75,
      targetWidth: 100,
      targetHeight: 100,
      saveToPhotoAlbum: false
    });
  };
  $scope.deltetePhoto = function() {
      $scope.lastPhoto="";
  }
  // $scope.noMatchSupplier=false;
  $scope.supplierInfoShow=false;
  $scope.loadfinished = true;
  var currentPage = 1;
  $scope.viewSupplier = function() {
    $scope.noMatchSupplier=false;
    $scope.selectSupplierModal.show();
  };
  $scope.supplierAdd = {};
  $scope.supplierSelected={supplier: null};
  $scope.selectItem = {name: ''};
  $scope.searchSupplier = function() {
    currentPage = 1;
    if(!$scope.selectItem.name) {
      return;
    }
    $ionicLoading.show({
          template: 'searching...',
        })
    AppCache.searchSupplier(1, $scope.selectItem.name, 'marketproTab', function(data) {
      if(data.length==0) {
        $ionicLoading.hide();
        $scope.suppliers = data;
      }
      else {
        $timeout(function() {
           $scope.suppliers = data;
           $ionicLoading.hide();
        }, 300)
      }
    })
  };
  $scope.loadMoreData = function() {
    $scope.loadfinished = false;
    currentPage++;
    AppCache.searchSupplier(currentPage, $scope.selectItem.name, 'marketproTab', function(data) {
      if(data.length==0) {
        $scope.loadfinished = true;
      }
      else {
        $timeout(function() {
           $scope.suppliers = $scope.suppliers.concat(data);
           $scope.loadfinished = true;
        }, 300)
      }
    })
  };
  $scope.submitSupplier= function() {
    AppCache.selectSupplier($scope.supplierSelected.supplier.supplierid, function(result) {
      $scope.supplierAdd = result;
      $scope.selectSupplierModal.hide();
      $scope.supplierInfoShow=true;
    })
    $scope.selectItem.name = '';
    delete $scope.suppliers;
  };
  $scope.$on('fpSearchBar.clear', function(){
    $scope.selectItem.name = '';
    delete $scope.suppliers;
  });

  $scope.typeSelected={name:'实体',value:'shiti'}
  $scope.types=[{name:'实体',value:'shiti'},{name:'淘宝',value:'taobao'}]
  $scope.saveProSupplier = function() {
    var productsList = ProductModel($scope.products);
    if($scope.supplierAdd.supplierid) {
      AppCache.selectMaxOfferId(function(data) {
        AppCache.addProToSupplier(currentUser, productsList, $scope.supplierAdd.supplierid, data+1, function(result) {
          if(result=='success') {
            console.log('success');
            $state.go('app.product.proview');
          }
          else{
            alert('error');
          }
        })
      })
    }
    else if($scope.supplierAdd.name) {
      $scope.supplierAdd.type = $scope.typeSelected.value
      $scope.supplierAdd.cardimg=$scope.lastPhoto;
      var supplierObj = SupplierModel($scope.supplierAdd);
      AppCache.selectMaxSupplierId(function(data) {
        var supplierID = data+1;
        AppCache.insertSupplier(supplierID, supplierObj, function(result) {
          if(result=="success") {
            AppCache.selectMaxOfferId(function(index) {
              AppCache.addProToSupplier(currentUser, productsList, supplierID, index+1, function(result) {
                if(result=='success') {
                  console.log('success')
                  $state.go('app.product.proview');
                }
                else{
                  alert('error');
                }
              })
            })
          }
          else {
            alert("创建供应商失败！")
            return;
          }
        })
      });
      }
    else {
      alert('供应商名称不能为空！')
    }
  }
  $scope.back = function() {
    $state.go('app.product.proview')
  }
  $scope.close = function() {
    $scope.selectSupplierModal.hide();
    $scope.selectItem.name = '';
    delete $scope.suppliers;
  };
  $scope.deleteProduct = function(product){
    $scope.products.splice($scope.products.indexOf(product), 1);
  };
  $scope.editProduct = function(product) {
    $scope.proEdited = {
      id: product.id,
      weight: product.weight,
      grossweight: product.grossweight,
      real_weight: product.real_weight,
      real_grossweight: product.real_grossweight
    }
    var confirmPopup = $ionicPopup.confirm({
       title: '编辑信息',
       templateUrl: 'templates/editProduct.html',
       scope: $scope,
     });
     confirmPopup.then(function(res) {
       if(res) {
        AppCache.updateProduct($scope.proEdited, function(result) {
          if(result=='success') {
            AppCache.getSelectedPro(proSelected, function(result) {
              $scope.products = result;
            })
          }
          else {
            alert('error!');
          }
        });
        $scope.refresh();
       } else {
        //close popup!
       }
     });
  }
})
.controller('SideMenuCtrl', function($scope, $state,  $ionicPopup, $ionicLoading, $timeout, AppCache) {
  var currentPage = 1;
  var searchString;
  $scope.loadMoreFinished = true;
  $scope.searchmodel=false;
  $scope.haveMoreItems = true;
  $scope.activeCategory={'id': -1, 'catid': -1,'catname':'Top'};
  $scope.refresh = function(){
    $ionicLoading.show({
      template: '正在加载...'
    });
    AppCache.getMarketCategory('market', 1, function(market){
      if(market.length==0){
         $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
         title: '提醒！',
         template: '没有市场和品类信息，请下载！'
         });
         alertPopup.then(function(res) {
           console.log('have no data');
         });
      }
      else{
        AppCache.getMarketCategory('category', 1, function(category) {
          $timeout(function() {
              $scope.markets=market;
              $scope.activeMarket=market[0];
              $scope.categorys=category;
              $scope.products=[];
              $scope.messageTip=true;
              $scope.proMessage=false;
              $ionicLoading.hide();
            },300)
        })
      }
      $scope.cathistory.splice(1, $scope.cathistory.length-1);
    });
  }
  $scope.refresh();
  $scope.cathistory = [{'id': -1, 'catid': -1,'catname':'Top'}];
  $scope.selectMarket = function(market) {
      $ionicLoading.show({
      template: '正在加载...'
    });
    currentPage = 1;
    $scope.searchmodel=false;
    $scope.haveMoreItems = true;
    $scope.activeCategory={'id': -1, 'catid': -1,'catname':'Top'};
    $scope.activeMarket = market;
    $scope.cathistory.splice(1, $scope.cathistory.length-1);
    var marketId = market.id;
    AppCache.getMarketCategory('category', marketId, function(category) {
       $timeout(function() {
          $scope.categorys = category;
          $scope.products = [];
          $scope.messageTip=true;
          $scope.proMessage=false;
          $ionicLoading.hide();
        },300)
    });
  };
  
  $scope.searchItem = '';
  $scope.selectCategory = function(category, index) {
    $ionicLoading.show({
      template: '正在加载...'
    });
    $scope.activeCategory = category;
    $scope.searchmodel=false;
    $scope.haveMoreItems = true;
    currentPage = 1;
    var marketId = $scope.activeMarket.id;
    var categoryId = category.id;
    if (index==-1) {
      $scope.cathistory.push(category);
    }
    else {
      $scope.cathistory.splice(index+1, $scope.cathistory.length-index-1);
      };
    if(categoryId==-1){
      AppCache.getCatProduct('category', 'market', 1, marketId, -1, function(category) {
         $timeout(function() {
            $scope.categorys = category;
            $scope.products = [];
            $scope.messageTip=true;
            $scope.proMessage=false;
            $ionicLoading.hide();
          },300)
      });
    }
    else{
      AppCache.getCatProduct('category', 'market', 1, marketId, categoryId, function(category){
        AppCache.getCatProduct('product', 'market', 1, marketId, categoryId, function(product){
          $timeout(function() {
            if(product.length>0){
              $scope.proMessage=false;
            }
            else{
              $scope.proMessage=true;
            }
            $scope.categorys=category;
            $scope.products = product;
            $scope.messageTip=false;
            $ionicLoading.hide();
          }, 300);
        })
      });
    }
  };

  $scope.loadMoreData = function() {
    $scope.loadMoreFinished = false;
    currentPage++;
    if(!$scope.searchmodel) {
        AppCache.getCatProduct('product', 'market', currentPage, $scope.activeMarket.id, $scope.activeCategory.id, function(product) {
        $timeout(function() {
          $scope.loadMoreFinished = true;
          $scope.products = $scope.products.concat(product);
        }, 300);
      })
    }
    else {
      AppCache.searchProduct(currentPage, searchString, $scope.activeMarket.id, function(searchResults) {
          $timeout(function() {
            if(searchResults.length>0) {
              $scope.loadMoreFinished = true;
              $scope.haveMoreItems = true;
              $scope.products = $scope.products.concat(searchResults);
            }
            else {
              $scope.loadMoreFinished = true;
              $scope.haveMoreItems = false;
            }
          },300);
      });
    }
  };
  $scope.searchItem={item:''};
  $scope.clear = function() {
    $scope.searchItem.item = '';
  }
  $scope.searchPro= function() {
    if($scope.searchItem.item) {
        searchString = $scope.searchItem.item;
        $scope.searchmodel=true;
        $ionicLoading.show({
          template: '搜索中...'
        });
        AppCache.searchProduct(1, searchString, $scope.activeMarket.id, function(searchResults) {
          if(searchResults.length>0){
            $ionicLoading.hide();
            $scope.products = searchResults;
            $scope.messageTip = false;
          }
          else{
            $ionicLoading.hide();
           var alertPopup = $ionicPopup.alert({
             title: '提醒！',
             template: '没有匹配的产品！'
             });
             alertPopup.then(function(res) {
             });
          }
        });
    }
    else {
      return;
    }
  };
})

.controller('CategoryMenuCtrl', function($scope, $ionicLoading, $state, $timeout, $ionicModal, $ionicPopup,AppCache) {
  $scope.assignSupplier = function() {
    var selchecks = document.getElementsByName('checkbox');
    var selectPros=[];
    for (var i=0; i<selchecks.length; i++)
    {
      if(selchecks[i].checked)
      {
        selectPros.push($scope.products[i].id);
      }
    }
    if(selectPros.length==0) {
     var alertPopup = $ionicPopup.alert({
       title: '提醒！',
       template: '请选择产品！'
     });
    }
    else {
      marketProSelected=selectPros;
      $state.go('market_assignsupplier',{datatag:'market'});
    }
  };
  // $scope.isCollection = function(product){
  //   if(product.Color){
  //     if(product.Color=='royal'){
  //       return true;
  //     }
  //     else{
  //       return false;
  //     }
  //   }
  //   else{
  //     if(product.markColor=='royal'){
  //       return true;
  //     }
  //     else{
  //       return false;
  //     }
  //   } 
  // };
  $scope.isDev = function(product){
    if(product.developed=='true'){
      return true;
    }
    else{
      return false;
    }
  };
  $scope.collection = function(product){
    AppCache.shouCang(product, currentUser,function(res){
      if(res=='success'){
        $timeout(function(){
        var myPopup = $ionicPopup.show({
            title: '添加收藏成功！',
            scope: $scope,
          });
          $timeout(function() {
             myPopup.close(); //close the popup after 1 seconds
          }, 500);
       }) 
      }
      else if(res=='have'){
        $timeout(function(){
        var myPopup = $ionicPopup.show({
            title: '该产品已收藏过！',
            scope: $scope,
          });
          $timeout(function() {
             myPopup.close(); //close the popup after 1 seconds
          }, 800);
       }) 
      }
      else{
        alert('添加收藏失败！')
      }
    })
  }
  $scope.showdetail = function(product) {
    $state.go('prodetail', {productID: product.id, tag:'market'})
  };
  $ionicModal.fromTemplateUrl('image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });

  $scope.showImg = function(imgurl) {
      $scope.imageSrc = imgurl;
      $scope.openModal();
    }
})
.controller('PersonalProCtrl', function($scope, $state, $ionicPopup,$ionicLoading, $timeout, AppCache) {
  var currentPage = 1;
  var searchString;
  $scope.loadMoreFinished = true;
  $scope.searchmodel=false;
  $scope.haveMoreItems = true;
  $scope.activeCategory={'id': -1, 'catid': -1,'catname':'Top'};
  $scope.refresh = function(){
    $ionicLoading.show({
      template:"正在加载...",
    })
    AppCache.getMarketCategory('market', 1, function(market){
      if(market.length==0){
         $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
         title: '提醒！',
         template: '没有市场和品类信息，请下载！'
         });
         alertPopup.then(function(res) {
           console.log('have no data');
         });
      }
      else{
        AppCache.getMarketCategory('category', 1, function(category) {
          $timeout(function() {
              $scope.markets=market;
              $scope.activeMarket=market[0];
              $scope.categorys=category;
              $scope.products=[];
              $scope.messageTip=true;
              $scope.proMessage=false;
              $ionicLoading.hide();
            },300)
        })
      }
      $scope.cathistory.splice(1, $scope.cathistory.length-1);
    });
  }
  $scope.refresh();
  $scope.cathistory = [{'id': -1, 'catid': -1,'catname':'Top'}];
  $scope.selectMarket = function(market) {
      $ionicLoading.show({
      template: '正在加载...'
    });
    currentPage = 1;
    $scope.searchmodel=false;
    $scope.haveMoreItems = true;
    $scope.activeCategory={'id': -1, 'catid': -1,'catname':'Top'};
    $scope.activeMarket = market;
    $scope.cathistory.splice(1, $scope.cathistory.length-1);
    var marketId = market.id;
    AppCache.getMarketCategory('category', marketId, function(category) {
       $timeout(function() {
          $scope.categorys = category;
          $scope.products = [];
          $scope.messageTip=true;
          $scope.proMessage=false;
          $ionicLoading.hide();
        },300)
    });
  };
  
  $scope.searchItem = '';
  $scope.selectCategory = function(category, index) {
    $ionicLoading.show({
      template: '正在加载...'
    });
    $scope.activeCategory = category;
    $scope.searchmodel=false;
    $scope.haveMoreItems = true;
    currentPage = 1;
    var marketId = $scope.activeMarket.id;
    var categoryId = category.id;
    if (index==-1) {
      $scope.cathistory.push(category);
    }
    else {
      $scope.cathistory.splice(index+1, $scope.cathistory.length-index-1);
      };
    if(categoryId==-1){
      AppCache.getCatProduct('category', 'assign', 1, marketId, -1, function(category) {
         $timeout(function() {
            $scope.categorys = category;
            $scope.products = [];
            $scope.messageTip=true;
            $scope.proMessage=false;
            $ionicLoading.hide();
          },300)
      });
    }
    else{
      AppCache.getCatProduct('category', 'assign', 1, marketId, categoryId, function(category){
        AppCache.getCatProduct('product', 'assign', 1, marketId, categoryId, function(product){
          $timeout(function() {
            if(product.length>0){
              $scope.proMessage=false;
            }
            else{
              $scope.proMessage=true;
            }
            $scope.categorys=category;
            $scope.products = product;
            $scope.messageTip=false;
            $ionicLoading.hide();
          }, 300);
        })
      });
    }
  };

  $scope.loadMoreData = function() {
    $scope.loadMoreFinished = false;
    currentPage++;
    if(!$scope.searchmodel) {
        AppCache.getCatProduct('product', 'assign', currentPage, $scope.activeMarket.id, $scope.activeCategory.id, function(product) {
        $timeout(function() {
          $scope.loadMoreFinished = true;
          $scope.products = $scope.products.concat(product);
        }, 300);
      })
    }
    else {
      AppCache.searchProduct(currentPage, searchString, $scope.activeMarket.id, function(searchResults) {
          $timeout(function() {
            if(searchResults.length>0) {
              $scope.loadMoreFinished = true;
              $scope.haveMoreItems = true;
              $scope.products = $scope.products.concat(searchResults);
            }
            else {
              $scope.loadMoreFinished = true;
              $scope.haveMoreItems = false;
            }
          },300);
      });
    }
  };
  $scope.searchItem={item:''};
  $scope.clear = function() {
    $scope.searchItem.item = '';
  }
  $scope.searchPro = function() {
    if($scope.searchItem.item) {
        searchString = $scope.searchItem.item;
        $scope.searchmodel=true;
        $ionicLoading.show({
          template: '搜索中...'
        });
        AppCache.searchProduct(1, searchString, $scope.activeMarket.id, function(searchResults) {
          if(searchResults.length>0){
            $ionicLoading.hide();
            $scope.products = searchResults;
          }
          else{
            $ionicLoading.hide();
           var alertPopup = $ionicPopup.alert({
             title: '提醒！',
             template: '没有匹配的产品！'
             });
             alertPopup.then(function(res) {
             });
          }
        });
    }
    else {
      return;
    }
  };
})

.controller('CatPerProCtrl', function($scope, $ionicLoading, $state, $timeout,$ionicModal, $ionicPopup,AppCache) {
  $scope.assign = function() {
    var selchecks = document.getElementsByName('checkbox1');
    var selectPros=[];
    for (var i=0; i<selchecks.length; i++)
    {
      if(selchecks[i].checked)
      {
        selectPros.push($scope.products[i].id);
      }
    }
    if(selectPros.length==0) {
     var alertPopup = $ionicPopup.alert({
       title: '提醒！',
       template: '请选择产品！'
     });
    }
    else {
      proSelected=selectPros;
      $state.go('assignsupplier');
    }
  };
  $scope.collection = function(product){
    console.log(product)
    AppCache.shouCang(product, currentUser,function(res){
      if(res=='success'){
        $timeout(function(){
        var myPopup = $ionicPopup.show({
            title: '添加收藏成功！',
            scope: $scope,
          });
          $timeout(function() {
             myPopup.close(); //close the popup after 1 seconds
          }, 500);
       }) 
      }
      else if(res=='have'){
        $timeout(function(){
        var myPopup = $ionicPopup.show({
            title: '该产品已收藏过！',
            scope: $scope,
          });
          $timeout(function() {
             myPopup.close(); //close the popup after 1 seconds
          }, 800);
       }) 
      }
      else{
        alert('添加收藏失败！')
      }
    })
  };
  $scope.isDev = function(product){
    if(product.developed=='true'){
      return true;
    }
    else{
      return false;
    }
  };
  $scope.showdetail = function(product) {
    $state.go('prodetail', {productID: product.id, tag:'assign'})
  };
  $ionicModal.fromTemplateUrl('image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });

  $scope.showImg = function(imgurl) {
      $scope.imageSrc = imgurl;
      $scope.openModal();
    };
})
.controller('ProDetailCtrl', function($scope, $state, $timeout, $stateParams, $ionicLoading, $ionicModal, AppCache) {
  var productID = parseInt($stateParams.productID);
  var tag = $stateParams.tag;
  $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      $ionicLoading.show({
        template: '正在加载...',
      });
      AppCache.getproduct(productID, function(proSupplier) {
          AppCache.getassignInfor(productID,function(assignInfor){
            $timeout(function(){
              $scope.product = proSupplier['product'];
              $scope.suppliers = proSupplier['supplier'];
              $scope.assigns = assignInfor;
              $ionicLoading.hide();
            },350)
          })
      })
    });
  
  $scope.back = function(){
    if(tag=='market'){
      $state.go('app.pros.marketpro');
    }
    else if(tag=='assign'){
      $state.go('app.product.proview');
    }
    else{
      $state.go('app.collection');
    }
    
  };
  $ionicModal.fromTemplateUrl('image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });

  $scope.openImgModel = function(imgurl) {
      $scope.imageSrc = imgurl;
      $scope.openModal();
    }
})
.controller('OfferDetailCtrl', function($scope, $state, $timeout, $stateParams, $ionicLoading, AppCache) {
  var supplierID = parseInt($stateParams.supplier);
  var productID = parseInt($stateParams.productID);
  $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      $ionicLoading.show({
        template: '正在加载...',
      });
      AppCache.getproduct(productID, function(data) {
        $timeout(function() {
          $scope.product = data['product'];
          $scope.suppliers=data['supplier'];
          $ionicLoading.hide();
        }, 350)
      });
    });
  $scope.back = function() {
    $state.go('app.supplieroffer', {supplierid: $stateParams.supplier});
  }
})
.controller('SettingCtrl', function($scope, $http, $q, $ionicModal,$cordovaFile,$ionicListDelegate,$ionicActionSheet, $timeout, $ionicLoading, $ionicPlatform, $ionicPopup, AppAPI, AppCache, Camera) {

  $ionicModal.fromTemplateUrl('templates/selectCategory.html', function(modal) {
    $scope.selectCategoryModal = modal;
  }, {
    scope: $scope
  });
  $scope.selectCategory = function(){
    $ionicLoading.show({
      template: '<i class="icon ion-loading-a"></i>正在加载内容...',
    });
    AppCache.getMarket(function(data){
      $ionicLoading.hide();
      $timeout(function(){
        $scope.selectCategoryModal.show();
        $scope.markets=data;
        $scope.categorys=[];
      },100)
    }) 
  };
  $scope.closeModal = function() {
    $scope.selectCategoryModal.hide();
    $scope.categorys=[];
  };
  $scope.selectMarket = function(market){
    $scope.activeMarket = market;
    AppCache.getCategory(market.id, function(data){
      if(data=='no'){
        alert('该市场下没有品类！');
        $scope.categorys=[];
      }
      else{
        $scope.categorys=data;
      }
    })
  };
  $scope.download = function() {
    var checkbox_list = document.getElementsByName('chBox');
    var selectCat=[];
    var dataObj={}
    for (var i=0; i<checkbox_list.length; i++)
    {
      if(checkbox_list[i].checked)
      {
        selectCat.push($scope.categorys[i].id);
      }
    }
    if(selectCat.length==0) {
     var alertPopup = $ionicPopup.alert({
       title: '警告！',
       template: '请选择品类！'
     });
    }
    else {
      dataObj={'market':$scope.activeMarket.id, 'catlist':selectCat}
      $ionicLoading.show({
        template: '正在下载，可能需要花费几分钟，请稍等！....',
      });
      // console.log(dataObj);
      AppAPI.downProFromServer(dataObj).then(function(data){
          AppCache.storeData('product', data, function(state){
            AppCache.storeData('procat',data, function(state){
                AppCache.setDownloadTag($scope.activeMarket.id, dataObj['catlist'], function(state){
                  $timeout(function() {
                      $ionicLoading.hide();
                      var alertPopup = $ionicPopup.alert({
                           title: '提醒！',
                           template: '下载已完成！'
                           });
                           alertPopup.then(function(res) {
                            AppCache.getCategory($scope.activeMarket.id, function(data){
                                  if(data=='no'){
                                    alert('该市场下没有品类！');
                                    $scope.categorys=[];
                                  }
                                  else{
                                    $scope.categorys=data;
                                  }
                                })
                             console.log('download success');
                           });
                    }, 500)
                })
              })
        })
      },function(error){
        alert('下载失败！');
        $ionicLoading.hide();
      })
    }
  };
  $scope.user=currentUser;
  $scope.getSupplierFromServer = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: '<strong>提醒！</strong>',
      template: '你确定要下载供应商、offer信息吗？',
      okText: '确定',
      cancelText: '取消'
    });
  confirmPopup.then(function (res) {
      if (res) {
        $ionicLoading.show({
          template: '正在下载供应商、offer信息，请稍等！....',
        });
        AppAPI.synDbFromServer('supplier').then(function (data) {
          AppCache.createTable('supplier',function(state){
            if(state=='success'){
              AppCache.storeData('supplier', data, function (state) {
                if(state == 'success') {
                  $timeout(function() {
                      $ionicLoading.hide();
                       var alertPopup = $ionicPopup.alert({
                         title: '提醒！',
                         template: '下载已完成！'
                         });
                         alertPopup.then(function(res) {
                           console.log('download success');
                         });
                    }, 500)
                }
                else {
                  console.log('store supplier error');
                  $ionicLoading.hide();
                  alert('存储数据时出错！');
                }
              })
            }
            else{
              console.log('creatTable error');
              alert('存储数据时出现错误！');
              $ionicLoading.hide();
            }
          })
        }, function(error) {
          console.log('request supplier error:'+error);
          $ionicLoading.hide();
          alert('下载时出错！');
        })
      } else {
        // Don't close
      }
    });
  };
  $scope.getMarketCatFromServer = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: '<strong>提醒！</strong>',
      template: '你确定要下载市场和品类信息吗？',
      okText: '确定',
      cancelText: '取消'
    });
    confirmPopup.then(function (res) {
      if (res) {
        $ionicLoading.show({
          template: '正在下载市场和品类信息，请稍等！....',
        });
        AppAPI.synDbFromServer('category').then(function(data) {
          AppCache.createTable('category',function(state){
            if(state=='success'){
              AppCache.storeData('category', data, function(state) {
                if(state == 'success') {
                    $timeout(function() {
                        $ionicLoading.hide();
                         var alertPopup = $ionicPopup.alert({
                           title: '提醒！',
                           template: '下载已完成！'
                           });
                           alertPopup.then(function(res) {
                             console.log('download success');
                           });
                      }, 500)
                }
                else {
                  console.log('store cat error');
                  $ionicLoading.hide();
                  alert('存储数据时出错！');
                }
              })
            }
            else{
              console.log('creatTable error');
              alert('存储数据时出现错误！');
              $ionicLoading.hide();
            }
          })
        }, function(error) {
          console.log('request cat error:'+error);
          $ionicLoading.hide();
          alert('下载时出错！');
        })
      } else {
        // Don't close
      }
    });
  };
  $scope.synDbToServer = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: '<strong>提醒！</strong>',
      template: '你确定要上传数据到服务器吗？',
      okText: '确定',
      cancelText: '取消'
    });
    confirmPopup.then(function (res) {
      if (res) {
        $ionicLoading.show({
          template: '正在上传，请稍等！....',
        });
        AppCache.getsynData('supplier',function(supplier) {
          console.log(supplier);
          if(supplier!='error'){
            AppCache.getsynData('offer',function(offer){
              if(offer!='error'){
                AppCache.getsynData('product',function(product){
                  if(product!='error'){
                    var synData={'supplier':supplier,
                                    'offer':offer,
                                    'product':product};
                    AppAPI.synDbToServer(synData).then(function(data) {
                      if(data==1) {
                          AppCache.setUploadedTag(synData,function(state){
                            $ionicLoading.hide();
                            if(state='success'){
                              alert('上传成功！');
                            }
                          })
                        }
                        else {
                          $ionicLoading.hide();
                          alert('上传失败！:'+data)
                        }
                    }, function(error) {
                      $ionicLoading.hide();
                      console.log(error);
                      $timeout(function() {
                        alert('上传失败！code:4');
                      },100)
                    })
                  }
                  else{
                    $ionicLoading.hide();
                    alert('上传失败！code:3');
                  }
                })
              }
              else{
                $ionicLoading.hide();
                alert('上传失败！code:2');
              }
            })
          }
          else{
            $ionicLoading.hide();
            alert('上传失败！code:1');
          }
        })
      } else {
        // Don't close
      }
    });
  };

  // $scope.test = function() {
  //   AppCache.testtest(function(data){
  //     alert(data)
  //   })
  // };
  $scope.exit = function() {
    var confirmPopup = $ionicPopup.confirm({
          title: '<strong>退出?</strong>',
          template: '你确定要退出吗?',
          okText: '退出',
          cancelText: '取消'
        });
    confirmPopup.then(function (res) {
          if (res) {
            ionic.Platform.exitApp();
          } else {
            // Don't close
          }
        });
  };
   $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
      $scope.lastPhoto = imageURI;
    }, function(err) {
      console.err(err);
    }, {
      quality: 75,
      targetWidth: 100,
      targetHeight: 100,
      saveToPhotoAlbum: false
    });
  };
  $scope.deltetePhoto = function(name) {
    $scope.lastPhoto="";
      var fso=new ActiveXObject("Scripting.FileSystemObject");   
      if(fso.FileExists(name))   
        fso.DeleteFile(name);   
      else   
        return false;   
  };
  $scope.clearPro = function() {
    var hideSheet = $ionicActionSheet.show({
                titleText: '你确定要清空产品数据吗？（这将清空所有已经下载过的产品数据）',
                cancelText: '取消',
                destructiveText: '清空产品数据',
                cancel: function () {
                    // if the user cancel, hide the list item's delete button
                    $ionicListDelegate.closeOptionButtons();
                },
                destructiveButtonClicked: function () {
                  hideSheet();
                  $ionicLoading.show({
                      template: '<i class="icon ion-loading-a"></i>正在清除！',
                    });
                  AppCache.clearAllPro(function(state){
                    if(state=='success'){
                      $timeout(function(){
                        $ionicLoading.hide();
                        var myPopup = $ionicPopup.show({
                            title: '清除成功！',
                            scope: $scope,
                          });
                          $timeout(function() {
                             myPopup.close(); //close the popup after 1 seconds 
                          }, 1000);
                      },1000) 
                    }
                    else{
                      $ionicLoading.hide();
                      var alertPopup = $ionicPopup.alert({
                       title: '提醒！',
                       template: '数据清除失败！'
                       });
                       alertPopup.then(function(res) {
                         // console.log('download success');
                       });
                    }
                  })
                }
            });
  }
})
