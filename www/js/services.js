var app=angular.module('starter.services', [])



app.service('employeeProfileService',function($rootScope,  $ionicLoading,$timeout,$ionicNavBarDelegate,$location){

  $timeout(function(){

    if (window.localStorage['isloggedin'] === 'true') {
      //alert('reload after login');
        //$location.path('/login');

          $rootScope.employeedata={
            'employeeName':window.localStorage['ename'],
            'employeePhNumber': window.localStorage['pnumber'],
            'employeeWork': window.localStorage['wnumber'],
            'employeeImage': window.localStorage['empimage'],
          }
          //alert(window.localStorage['empimage']);
          //var v=$rootScope.employeedata.employeeImage;//window.localStorage['empimage'];
          // $rootScope.base64String7 = btoa(String.fromCharCode.apply(null, new Uint8Array($rootScope.employeedata.employeeImage)));
          //alert($rootScope.employeedata.employeeImage);
           $("#empProfileImage").attr('src', 'data:image/png;base64,' +$rootScope.employeedata.employeeImage);

      $rootScope.hideTabBar = "";
      $ionicNavBarDelegate.showBackButton(false);
      //$rootScope.HideInstructionTab = 'true';
      $location.path('/tab/empsearch');



    }
     else {

    }


  });







  this.setEmployeeData=function(doc)
  {
    //alert('hi set');
    $rootScope.doc2=doc;
//alert('hi service');
//alert(JSON.stringify(doc));
this.getEmployeeData(doc);
  }

  this.getEmployeeData=function(doc)
  {
//alert('hi get');
    //alert(JSON.stringify(doc));
    return $rootScope.doc2;

  }
})
