myApp.factory('Camera', ['$q', function($q) {

return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
        return q.promise;
        }
    }
}])
myApp.factory('AppAPI', function($http, $q) {
  // var apiUrl = "http://yantai.starmerx.com:8001/";
  var apiUrl = "http://192.168.1.153:8000/";
  var service = {};
  service.synDbFromServer = function(dbtype) {
    var deferred = $q.defer();
    $http.get(apiUrl+"syndbmobile?data="+dbtype).success(function (data, status, headers, config) {
      deferred.resolve(data);
    }).error(function (data, status, headers, config) {
      deferred.reject(data);
    });
    return deferred.promise;
  };
  service.downProFromServer = function(data) {
    var deferred=$q.defer();
    $http.post(apiUrl+"downprotomobile/", data).success(function (result) {
        deferred.resolve(result);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
  };
  service.synDbToServer = function(data) {
    var deferred=$q.defer();
    $http.post(apiUrl+"syndbtoserver/", data).success(function (result) {
        deferred.resolve(result);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
  };
  service.getUserInfor = function() {
    var deferred = $q.defer();
    $http.get(apiUrl+'getuserinfor/').success(function (data, status, headers, config) {
      deferred.resolve(data);
    }).error(function (data, status, headers, config) {
      deferred.reject(data);
    });
    return deferred.promise;
  }
  return service;
});

myApp.factory('AppCache', function() {
  // var db = window.sqlitePlugin.openDatabase({name: "marketproDB.db"});
  // db = openDatabase('marketproDB', '1.0', 'Test DB', 500 * 1024 * 1024);
  // var db=window.openDatabase("proDB.db", "1.0", "Demo", 1024 * 1024 * 500);// browser
  var service = {};
  service.createTable = function(type, callBack){
    if(type=='supplier'){
      db.transaction(function(context){
        context.executeSql('drop table IF EXISTS supplierTB',[],function(context,res){
        context.executeSql('drop table IF EXISTS offerTB',[],function(context,res){
          context.executeSql('CREATE TABLE IF NOT EXISTS supplierTB (id integer primary key, supplierid, name, location, contact, telephone, type, url, state, email,beizhu, cardimg, modify, new, uploaded)');
          context.executeSql('CREATE TABLE IF NOT EXISTS offerTB (id integer primary key, supplierid, productid, developerid, price, dev_note, lead_time, MOQ, type, modify, new,uploaded)');
          callBack('success');
        },function(context,error){
          console.log('drop offerTB error');
          callBack('error')
        });
      },function(context,error){
        console.log('drop supplierTB error');
        callBack('error')
      });
      }) 
    }
    else if(type=='category'){
      db.transaction(function(context){
        context.executeSql('drop table IF EXISTS marketTB',[],function(context,res){
         context.executeSql('drop table IF EXISTS categoryTB',[],function(context,res){
          context.executeSql('drop table IF EXISTS catRelationTB',[],function(context,res){
            context.executeSql('drop table IF EXISTS assignTB',[],function(context,res){
              context.executeSql('CREATE TABLE IF NOT EXISTS marketTB (id integer primary key, market_name)');
              context.executeSql('CREATE TABLE IF NOT EXISTS categoryTB (id integer primary key, catid, catname, marketid, is_root, downloaded)');
              context.executeSql('CREATE TABLE IF NOT EXISTS catRelationTB (id integer primary key, catid, child_catid, marketid)');
              context.executeSql('CREATE TABLE IF NOT EXISTS assignTB (id integer primary key, productid, assignto, finished)');
              context.executeSql('create index idxcat on categoryTB(catid)');
              context.executeSql('create index idxcatRel1 on catRelationTB(catid)');
              context.executeSql('create index idxcatRel2 on catRelationTB(child_catid)');
              context.executeSql('create index idxassign on assignTB(productid)');
              callBack('success');
            },function(context,error){
              console.log('drop assignTB error');
              callBack('error')
            });
          },function(context,error){
            console.log('drop catRelationTB error');
            callBack('error')
          });
         },function(context,error){
          console.log('drop categoryTB error');
          callBack('error')
         });
      },function(context,error){
        console.log('drop marketTB error');
        callBack('error')
      });
      })
    }
  }
  service.storeData = function(dbtype, data, callBack) {
    if(dbtype=='supplier') {
      db.transaction(function(context) {
        for(var i=0; i<data['supplier'].length; i++) {
          context.executeSql('INSERT INTO supplierTB (supplierid, name, location, contact, telephone, type, url, state, email,beizhu, cardimg, modify, new,uploaded) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',[data['supplier'][i].id, data['supplier'][i].sname, data['supplier'][i].loc, data['supplier'][i].contact, data['supplier'][i].tel, data['supplier'][i].type,'', 0,'','', '', 0, 0,0],null,function(context,error){
            console.log('insert supplierTB error');
          });
         };
        for(var i=0; i<data['offer'].length; i++) {
          context.executeSql('INSERT INTO offerTB (id, supplierid, productid, developerid, price, dev_note, lead_time, MOQ, type, modify, new,uploaded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',[data['offer'][i].id, data['offer'][i].sid, data['offer'][i].pid, data['offer'][i].did, data['offer'][i].price, data['offer'][i].dnote, data['offer'][i].ltime, data['offer'][i].MOQ, data['offer'][i].type, 0, 0,0],null,function(context,error){
            console.log('insert offerTB error');
          });
         };
        console.log('store supplier and offer success!');
        callBack('success');
      });
    }
    else if(dbtype == 'category'){
       db.transaction(function(context){
        for(var i=0; i<data['market'].length; i++) {
          context.executeSql('INSERT INTO marketTB (id, market_name) VALUES (?, ?)',[data['market'][i].id, data['market'][i].market_name],null,function(context,error){
            console.log('insert marketTB error');
          });
         };
        for(var i=0; i<data['category'].length; i++) {
          context.executeSql('INSERT INTO categoryTB (id, catid, catname, marketid, is_root,downloaded) VALUES (?, ?, ?, ?, ?,?)',[data['category'][i].id, data['category'][i].cid, data['category'][i].cname, data['category'][i].mid, data['category'][i].root, 0],null,function(context,error){
            console.log('insert categoryTB error');
          });
         };
        for(var i=0; i<data['catrelation'].length; i++) {
          context.executeSql('INSERT INTO catRelationTB (catid, child_catid, marketid) VALUES (?, ?, ?)',[data['catrelation'][i].cid, data['catrelation'][i].ccid, data['catrelation'][i].mid],null,function(context,error){
            console.log('insert catRelationTB error');
          });
         };
        for(var i=0; i<data['assign'].length; i++) {
          context.executeSql('INSERT INTO assignTB (productid, assignto, finished) VALUES (?, ?, ?)',[data['assign'][i].pid, data['assign'][i].aid, data['assign'][i].finished],null,function(context,error){
            console.log('insert assignTB error');
          });
         };

        console.log('store category success!');
        callBack('success')
      })
    }
    else if(dbtype=='procat'){
      db.transaction(function(context){
        for(var i=0; i<data['procat'].length; i++){
            context.executeSql('INSERT INTO proCategoryTB (id, productid, catid) VALUES (?,?,?)',[data['procat'][i].id,data['procat'][i].pd, data['procat'][i].cd],null, function(context,error){
              // console.log('insert procat error');
            });
          };
          console.log('store procat success!');
          callBack('success');
      })
    }
    else if(dbtype == 'product') {
      db.transaction(function(context) {
        for(var i=0; i<data['product'].length; i++) {
            context.executeSql('INSERT INTO productTB (id, marketid, asin, title, image, price, reviews, weight, grossweight, real_weight, real_grossweight,developed,modify,uploaded,markColor) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)',[data['product'][i].id, data['product'][i].md, data['product'][i].an, data['product'][i].te, data['product'][i].ie, data['product'][i].pe, data['product'][i].rs, data['product'][i].wt, data['product'][i].gt, data['product'][i].rwt, data['product'][i].rgt, data['product'][i].de,0,0,''],null,function(context,error){
              // console.log('insert product error');
            });
         }
        console.log('store product success!');
        callBack('success');
      })
    }
  };
  service.clearAllPro = function(callBack){
    db.transaction(function(context){
      context.executeSql('drop table if EXISTS productTB',[],function(context,res){
        context.executeSql('drop table if EXISTS proCategoryTB',[],function(context,res){
          context.executeSql('CREATE TABLE IF NOT EXISTS productTB (id integer primary key, marketid, asin, title, image, price, reviews, weight, grossweight, real_weight, real_grossweight,developed,modify,uploaded,markColor)',[],function(context,res){
            context.executeSql('CREATE TABLE IF NOT EXISTS proCategoryTB (id integer primary key, productid, catid)',[],function(context,res){
              context.executeSql('create index idxprocat1 on proCategoryTB(productid)');
              context.executeSql('create index idxprocat2 on proCategoryTB(catid)');
              context.executeSql('update categoryTB set downloaded=0 where downloaded=1');
              callBack('success');
            },function(context, error){
              console.log('create proCategoryTB error');
              callBack('error');
            });
          },function(context,error){
            console.log('create productTB error');
            callBack('error');
          });
        },function(context,error){
          console.log('drop proCategoryTB error');
          callBack('error');
        })
      },function(context,error){
        console.log('drop productTB error');
        callBack('error');
      })
    })
  };
  service.getsynData = function(data,callBack) {
    var supplier=[];
    var offer=[]
    var product=[]
    if(data=='supplier'){
      db.transaction(function(context) {
        context.executeSql('select * from supplierTB where modify=1 and uploaded=0', [], function(context, res) {
          console.log(res.rows.length);
          for(var i=0; i<res.rows.length; i++) {
            supplier.push(res.rows.item(i));
          }
          callBack(supplier);
        }, function(context, error) {
          console.log('getsynsupplier:'+error);
          callBack('error');
        });
      })
    }
    else if(data=='offer'){
      db.transaction(function(context) {
          context.executeSql('select * from offerTB where modify=1 and uploaded=0 and developerid=?', [currentUser.id], function(context, res) {
            console.log(res.rows.length);
            for(var i=0; i<res.rows.length; i++) {
              offer.push(res.rows.item(i));
            }
            callBack(offer);
          }, function(context, error) {
            console.log('getsynoffer:'+error);
            callBack('error');
          });
        })
    }
    else{
      db.transaction(function(context) {
        context.executeSql('select id, weight, grossweight, real_weight, real_grossweight,developed FROM productTB where modify=1 and uploaded=0',[], function(context, res) {
          console.log(res.rows.length)
          for(var i=0; i<res.rows.length; i++) {
            product.push(res.rows.item(i));
          }
          callBack(product);
        }, function(context, error) {
          console.log('getsynpro'+error);
          callBack('error');
        })
      })
    }
  };
  service.storeUserInfor = function(data, callBack) {
    db.transaction(function(context) {
      context.executeSql('CREATE TABLE IF NOT EXISTS userTB (id integer primary key, name)');
      for(var i=0; i<data.length; i++) {
          context.executeSql('INSERT INTO userTB (id, name) VALUES (?, ?)',[data[i].id, data[i].username]);
         };
      callBack('success');
    })
  };
  service.usertableCheck = function(callBack) {
    db.transaction(function(context) {
      context.executeSql('SELECT id FROM userTB', [], function(context, results) {
        callBack('success');
      }, function(context, error) {
        callBack('error');
      })
    })
  };
  service.shouCang = function(product, user, callBack){
    db.transaction(function(context){
      context.executeSql('CREATE TABLE IF NOT EXISTS collectTB (id integer primary key, productid,  title, image,price, userid)',[],function(context,res){
        context.executeSql('select id from collectTB where productid=? and userid=?',[product.id, user.id],function(context,res){
          if(res.rows.length==0){
            context.executeSql('INSERT INTO collectTB (productid, title, image,price, userid) VALUES (?, ?, ?, ?,?)',[product.id, product.title, product.image, product.price,user.id],function(context,res){
              context.executeSql('update productTB set markColor=? where id=?',['royal',product.id],function(context,res){
                callBack('success');
              },function(context,error){
                console.log(error);
                callBack('success');
              });
            },function(context,error){
              console.log(error);
              callBack('success');
            })
          }
          else{
            callBack('have');
          }
        })
      },function(context,error){
        callBack('error');
      });
    })
  };
  service.quxiaoShouCang = function(product, user, callBack){
    db.transaction(function(context){
      context.executeSql("delete from collectTB where id=?",[product.id],function(context,res){
        context.executeSql('update productTB set markColor=? where id=?',['',product.productid],function(context,res){
          callBack('success');
        },function(context,error){
          callBack('error');
        })
      },function(context,error){
        callBack('error');
      })
    })
  };
  service.clearAllCollection = function(user,callBack){
    db.transaction(function(context){
      context.executeSql('delete from collectTB where userid=?',[user.id],function(context,res){
        callBack('success');
      },function(context,error){
        console.log(error);
        callBack('error');
      })
    })
  };
  service.getCollectPro = function(page, type, callBack){
    var resultObj=[];
    var startIndex = (page-1)*10;
    if(type=='undev'){
      db.transaction(function(context){
        context.executeSql('select a.id, a.productid, a.title, a.image, a.price, b.developed from collectTB a, productTB b where a.productid=b.id and a.userid=? and b.developed=? limit ?,10',[currentUser.id,'false',startIndex],function(context,res){
          for(var i=0; i<res.rows.length; i++){
            resultObj.push(res.rows.item(i));
          }
          callBack(resultObj);
        },function(context,res){
          callBack(resultObj);
        })
      })
    }
    else{
      db.transaction(function(context){
        context.executeSql('select a.id,a.productid, a.title, a.image, a.price, b.developed from collectTB a, productTB b where a.productid=b.id and a.userid=? and b.developed=? limit ?,10',[currentUser.id,'true',startIndex],function(context,res){
          for(var i=0; i<res.rows.length; i++){
            resultObj.push(res.rows.item(i));
          }
          callBack(resultObj);
        },function(context,res){
          callBack(resultObj);
        })
      })
    }

  };
  // service.testtest = function(callBack){
  //   db.transaction(function(context){
  //     context.executeSql('drop table if EXISTS collectTB',[],function(context,res){
  //       callBack('success');
  //     });
  //   })
  // }
  service.loginCheck = function(user, callBack) {
    db.transaction(function(context) {
      context.executeSql('SELECT id, name FROM userTB where name like ?', [user.username], function(context, results) {
        if(results.rows.length>0) {
          currentUser = results.rows.item(0);
          callBack('existence');
        }
        else {
          callBack('inexistence')
        }
      }, function(context, error) {
        console.log('error')
        callBack('error');
      });
    })
  };
  service.getChildCat = function(marketID, catID, callBack) {
    var resultObj=[];
    db.transaction(function (context) {
      context.executeSql('SELECT id, child_catid FROM catRelationTB where marketid=? and catid=? ', [marketID, catID], function(context, results) {
        for(var i=0; i<results.rows.length; i++) {
          resultObj.push(results.rows.item(i));
        }
        console.log(resultObj.length);
        callBack(resultObj);
      });
    });
  };
  service.getSuppliers = function(currentPage, type, callBack) {
    var supplierObj = [];
    var startIndex = (currentPage-1)*10;
    db.transaction(function(context) {
      context.executeSql('SELECT id, supplierid, name, contact, telephone FROM supplierTB where state=0 and type=? order by id DESC limit ?, 10', [type, startIndex], function(context, results) {
        for(var i=0; i<results.rows.length; i++) {
          supplierObj.push(results.rows.item(i));
        }
        callBack(supplierObj);
      }, function(context, error) {
        console.log('error'+error)
        callBack('error');
      });
    });
  };
  service.updateSupplier = function(supplierEdited) {
    db.transaction(function(context) {
      context.executeSql('update supplierTB set name=?,location=?,contact=?,telephone=?,type=?,url=?,email=?,beizhu=?,cardimg=?, modify=1,uploaded=0 where id=?', [supplierEdited.name, supplierEdited.location, supplierEdited.contact, supplierEdited.telephone, supplierEdited.type, supplierEdited.url, supplierEdited.email,supplierEdited.beizhu, supplierEdited.cardimg, supplierEdited.id] )
    })
  };
  service.disableSupplier = function(supplierSelected,callBack) {
    db.transaction(function(context) {
      context.executeSql('update supplierTB set state=1, modify=1 where id=?',[supplierSelected.id], function(context, results) {
        callBack('success');
      },function(context,error){
        callBack('error');
      });
    });
  };
  service.selectMaxSupplierId = function(callBack) {
    db.transaction(function(context) {
        context.executeSql('select supplierid from supplierTB order by supplierid DESC limit 1',[], function(context, results) {
        console.log('success');
        var index=results.rows.item(0).supplierid;
        callBack(index);
      });
    });
  }
  service.insertSupplier = function(ID, supplier, callBack) {
    db.transaction(function(context) {
        context.executeSql('insert into supplierTB (supplierid, name, location, contact, telephone, type, url, state,email,beizhu, cardimg, modify, new,uploaded) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)', [ID, supplier.name, supplier.location, supplier.contact, supplier.telephone, supplier.type, supplier.url, 0, supplier.email,supplier.beizhu, supplier.cardimg, 1, 1,0], function(context,results) {
        console.log('insert success');
        callBack('success');
      }, function(context, error) {
        console.log('insert error'+error);
        callBack('error');
      })
    })
  };
  service.updateOffer = function(offerEdited, supplierID) {
    db.transaction(function(context) {
      context.executeSql('update offerTB set price=?, lead_time=?, MOQ=?, modify=1,uploaded=0 where id=?', [offerEdited.price, offerEdited.lead_time, offerEdited.MOQ, offerEdited.id], function(context, results) {
        console.log('update offer success!');
      },function(context,error){
        console.log('update offer error')
      });
      context.executeSql('update supplierTB set modify=1, uploaded=0 where supplierid=?',[supplierID],function(context, res){
        console.log('update supplier success!')
      },function(context,error){
        console.log('update supplier error')
      })
    });
  };
  service.getMarketCategory = function(datatype, marketID, callBack) {
    var marketObj=[];
    var categoryObj=[];
    if(datatype=='market'){
      db.transaction(function(context) {
        context.executeSql('SELECT * FROM marketTB', [], function(context, results) {
        for(var i=0; i<results.rows.length; i++) {
          marketObj.push(results.rows.item(i));
        };
        callBack(marketObj)
      });
      })
    }
    else if(datatype=='category'){
      db.transaction(function(context) {
        context.executeSql('SELECT id, catname, downloaded FROM categoryTB where marketid=? and is_root=?', [marketID, 'true'], function(context, results) {
         for(var i=0; i<results.rows.length; i++) {
          categoryObj.push(results.rows.item(i));
        };
        callBack(categoryObj)
      }, function(context, error) {
        console.log(error);
      });
      })
    }
  };
  service.getSelectedPro = function(selectproID, callBack) {
    var resultObj=[];
    console.log('selectlenght:'+selectproID.length);
    db.transaction(function(context) {
      for(var i=0; i<selectproID.length; i++) {
        context.executeSql('select id, title, image, price, reviews, weight, grossweight, real_weight, real_grossweight FROM productTB where id=?', [selectproID[i]], function(context, results) {
          var product = {
            id: results.rows.item(0).id,
            title: results.rows.item(0).title,
            image: results.rows.item(0).image,
            price: results.rows.item(0).price,
            reviews: results.rows.item(0).reviews,
            weight: results.rows.item(0).weight,
            grossweight: results.rows.item(0).grossweight,
            real_weight: results.rows.item(0).real_weight,
            real_grossweight: results.rows.item(0).real_grossweight,
            offerprice: 0,
            lead_time: 3,
            MOQ: 3
          }
          resultObj.push(product);
        })
      };
      callBack(resultObj);
    })
  };
  service.updateProduct = function(product, callBack) {
    db.transaction(function(context) {
      context.executeSql('update productTB set weight=?, grossweight=?, real_weight=?, real_grossweight=?, modify=1,uploaded=0 where id=?', [product.weight, product.grossweight, product.real_weight, product.real_grossweight, product.id], function(context, results) {
        callBack('success');
      }, function(context, error) {
        console.log('update productTB error!');
        callBack('error');
      })
    })
  };
  service.getCatProduct = function(datatype, tag, currentPage, marketID, catID, callBack) {
    var index = (currentPage - 1)*20;
    var resultObj = {};
    var categoryObj=[];
    var productObj=[];
    if(catID==-1){
      if(datatype=='category'){
        db.transaction(function(context){
          context.executeSql('SELECT id, catname,downloaded FROM categoryTB where marketid=? and is_root=?', [marketID, 'true'], function(context, results) {
            for(var i=0; i<results.rows.length; i++) {
              categoryObj.push(results.rows.item(i));
            };
            callBack(categoryObj);
          }, function(context, error) {
            console.log('error');
          });
        })
      }
    }
    else{
      if(datatype=='category'){
        db.transaction(function(context){
          context.executeSql('SELECT categoryTB.id, categoryTB.catname from categoryTB, catRelationTB where categoryTB.id=catRelationTB.child_catid and catRelationTB.marketid=? and catRelationTB.catid=?', [marketID, catID], function(context, results) {
            for(var i=0; i<results.rows.length; i++) {
              categoryObj.push(results.rows.item(i));
            };
            callBack(categoryObj)
          }, function(context, error) {
            console.log(error);
          });
        })
      }
      else{
        if(tag=='market'){
          db.transaction(function(context){
            context.executeSql('SELECT a.id, a.title, a.image, a.price,a.developed from productTB a, proCategoryTB b where a.id=b.productid and b.catid=? limit ?, 20', [catID, index], function(context, results) {
              for(var i=0; i<results.rows.length; i++){
                productObj.push(results.rows.item(i));
              }
              callBack(productObj)
            }, function(context, error){
              console.log(error);
            });
          })
        }
        else{
          // SELECT distinct a.productid, a.title, a.image, a.price, a.reviews from productTB a,assignTB b,proCategoryTB c where a.productid=c.productid and c.productid=b.productid and c.catid=? limit ?, 20
          // SELECT productTB.productid, productTB.title, productTB.image, productTB.price, productTB.reviews from assignTB LEFT JOIN proCategoryTB ON assignTB.productid=proCategoryTB.productid LEFT JOIN productTB ON assignTB.productid=productTB.productid where proCategoryTB.catid=? limit ?, 20
          db.transaction(function(context){
            context.executeSql('SELECT distinct a.id, a.title, a.image, a.price, a.reviews, a.developed,a.markColor from productTB a,assignTB b,proCategoryTB c where a.id=c.productid and c.productid=b.productid and c.catid=? limit ?, 20', [catID, index], function(context, results) {
              for(var i=0; i<results.rows.length; i++){
                productObj.push(results.rows.item(i));
              }
              callBack(productObj)
            }, function(context, error){
              console.log(error);
            });
          })
        }
      }
    }
  };
  service.setDownloadTag = function(marketID, catlist, callBack){
    db.transaction(function(context){
      for(var i=0; i<catlist.length; i++){
        context.executeSql('update categoryTB set downloaded=1 where marketid=? and id=? ',[marketID,catlist[i]],null,function(context,err){
          console.log('set downloadedTag error');
        })
      }
      callBack('success');
    })
  };
  service.searchProduct = function(currentPage, searchItem, marketID, callBack) {
    var index = (currentPage - 1)*20;
    var resultObj = [];
    db.transaction(function(context) {
      context.executeSql('SELECT id, title, image, price, reviews,developed,markColor FROM productTB where marketid=? and title LIKE ? limit ?, 20', [marketID, '%'+searchItem+'%', index], function(context, results) {
        for(var i=0; i<results.rows.length; i++) {
          resultObj.push(results.rows.item(i));
        };
      });
      context.executeSql('SELECT id, title, image, price, reviews,developed,markColor FROM productTB where marketid=? and asin=?', [marketID, searchItem], function(context, results) {
        for(var i=0; i<results.rows.length; i++) {
          resultObj.push(results.rows.item(i));
        };
        callBack(resultObj);
      });
    })
  };
  service.getOffer = function(supplierID, user, callBack) {
    var offerdic={};
    var offerObj = [];
    db.transaction(function(context) {
      context.executeSql('SELECT  * from supplierTB where supplierid=?', [supplierID], function(context, result) {
        offerdic['supplier']=result.rows.item(0);
      });
      context.executeSql('SELECT offerTB.*, productTB.title, productTB.image FROM offerTB, productTB where offerTB.productid=productTB.id and offerTB.supplierid = ? and offerTB.developerid= ?', [supplierID, user.id], function(context, results) {
        for(var i=0; i<results.rows.length; i++) {
          offerObj.push(results.rows.item(i));
        };
        offerdic['offer']=offerObj;
        callBack(offerdic);
      });
    });
  } ;
  service.getproduct = function(productID, callBack) {
    var resultObj = {};
    var supplierObj=[];
    db.transaction(function(context) {
      context.executeSql('SELECT * FROM productTB where id=?', [productID], function(context, res) {
        resultObj['product'] = res.rows.item(0);
        context.executeSql('SELECT a.name, a.location, a.contact, a.telephone, a.cardimg, b.price, b.lead_time, b.MOQ FROM supplierTB a,offerTB b where a.supplierid=b.supplierid and b.productid=?', [productID], function(context, result) {
          for(var i=0; i<result.rows.length; i++) {
            supplierObj.push(result.rows.item(i));
          };
          resultObj['supplier']=supplierObj;
          callBack(resultObj);
        },function(context,error){
          console.log(error);
        });
      });
    });
  };
  service.getassignInfor = function(productID, callBack){
    var resultObj=[];
    db.transaction(function(context){
      context.executeSql('select a.finished, u.name from assignTB a,userTB u where a.assignto=u.id and a.productid=?',[productID],function(context,res){
        for(var i=0; i<res.rows.length; i++){
          resultObj.push(res.rows.item(i));
        };
        callBack(resultObj);
      },function(context,error){
        console.log(error);
      })
    })
  }
  service.searchSupplier = function(currentPage, name, tag, callBack) {
    var supplierObj = [];
    var index = (currentPage-1)*10
    db.transaction(function(context) {
      if(tag=='supplierTab') {
          context.executeSql('SELECT id, supplierid, name, contact, telephone FROM supplierTB where state=0 and name LIKE ? order by id desc limit ?, 10', ['%'+name+'%', index], function(context, result) {
          for(var i=0; i<result.rows.length; i++) {
            supplierObj.push(result.rows.item(i));
          };
          callBack(supplierObj);
        }, function(context, error) {
          console.log(error);
          callBack(supplierObj);
        });
      }
      else {
          context.executeSql('SELECT id, supplierid, name FROM supplierTB where state=0 and name LIKE ? order by id desc limit ?, 10', ['%'+name+'%', index], function(context, result) {
          for(var i=0; i<result.rows.length; i++) {
            supplierObj.push(result.rows.item(i));
          };
          callBack(supplierObj);
        }, function(context, error) {
          console.log(error);
          callBack(supplierObj);
        });
      }
    })
  };
  service.selectSupplier = function(supplierID, callBack) {
    db.transaction(function(context) {
      context.executeSql('SELECT * from supplierTB where supplierid = ?', [supplierID], function(context, results) {
        callBack(results.rows.item(0));
      })
    })
  };
  service.selectMaxOfferId = function(callBack) {
     db.transaction(function(context) {
        context.executeSql('select id from offerTB order by id DESC limit 1',[], function(context, results) {
        console.log('success');
        var index=results.rows.item(0).id;
        callBack(index);
      });
    });
  };
  service.addProToSupplier = function(user, products, supplierID, index, callBack) {
    var offerID=index;
    db.transaction(function(context) {
      context.executeSql('update supplierTB set modify=1,uploaded=0 where supplierid=?',[supplierID],function(context, res){
        console.log('update supplier success!')
      })
      for(var i=0; i<products.length; i++,offerID++) {
        context.executeSql('INSERT INTO offerTB (id, supplierid, productid, developerid, price, dev_note, lead_time, MOQ, type, modify, new,uploaded)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)', [offerID, supplierID, products[i].id, user.id, products[i].offerprice, '', products[i].lead_time, products[i].MOQ, 'shiti',1,1,0], function(context, result) {
          console.log(offerID);
        });
      }
      for(var i=0; i<products.length; i++){
        context.executeSql('update productTB set developed=?,modify=1 where id=?',['true',products[i].id],null,function(context,err){
          console.log('update productTB dev error');
        })
      }
      callBack('success');
    })
  };
  service.setUploadedTag = function(data, callBack){
    db.transaction(function(context){
      for(var i=0; i<data['supplier'].length; i++){
        context.executeSql('update supplierTB set uploaded=1 where supplierid=?',[data['supplier'][i].supplierid],null, function(context,error){
          console.log('update supplier uploaded error');
        })
      }
      for(var j=0; j<data['offer'].length; j++){
        context.executeSql('update offerTB set uploaded=1 where id=?',[data['offer'][j].id],null,function(context,error){
          console.log('update offer uploaded error');
        })
      }
      for(var k=0; k<data['product'].length; k++){
        context.executeSql('update productTB set uploaded=1 where id=?',[data['product'][k].id],null,function(context,error){
          console.log('updata product uploaded error');
        })
      }
      callBack('success');
    })
  };
  service.getMarket = function(callBack){
    var resultObj=[];
    db.transaction(function(context){
      context.executeSql('select * from marketTB',[],function(context,res){
        for(var i=0; i<res.rows.length; i++){
          resultObj.push(res.rows.item(i));
        }
        callBack(resultObj);
      },function(context,error){
        console.log('getMarket error');
      })
    })
  };
  service.getCategory = function(marketID,callBack){
    var resultObj=[];
    db.transaction(function(context){
      context.executeSql('SELECT id, catname, downloaded FROM categoryTB where marketid=? and is_root=?', [marketID, 'true'],function(context,res){
        var len=res.rows.length;
        if(len>0){
          for(var i=0; i<res.rows.length; i++){
            resultObj.push(res.rows.item(i));
          }
          callBack(resultObj);
        }
        else{
          callBack('no');
        }
      },function(context,error){
        console.log('getCategory error');
      })
    })
  }
  return service;
})
