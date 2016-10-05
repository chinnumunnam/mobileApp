var contextPath = "http://192.168.1.203:9999/HubbleServices/hubbleresources";
var securityToken=btoa("admin:admin");
var app = angular.module('starter.controllers', [])
var i;
//var firstLogged;
var imgbase64;

app.controller('installationCtrl', function($scope, $ionicPlatform, $rootScope, $ionicNavBarDelegate, $state, $location, $ionicSlideBoxDelegate) {
  // Called to navigate to the main app

  $scope.startApp = function() {
    $ionicNavBarDelegate.showBackButton(false);
    $rootScope.hideTabBar = "true";
    $location.path('/login');
    //flowService.setCompleteIntroduction('true');
    window.localStorage.completedIntroduction = 'true';
  };

  // At the start of this controller
  // Lets check local storage for didTutorial
  if (window.localStorage['completedIntroduction'] === 'true') {

    $scope.startApp();

  } else {
    setTimeout(function() {
      //navigator.splashscreen.hide();
    }, 750);

  }
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})


app.controller('instructionsCtrl', function($scope, $ionicPlatform, $rootScope, $state, $location, $ionicSlideBoxDelegate) {
  $scope.startApp = function() {
    //$state.go('main');

    $rootScope.hideTabBar = "";
    $location.path('/tab/empsearch');

  };

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };
  //$scope.startApp();

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };




})

app.controller('tab1Ctrl', function($scope) {

})
app.controller('tab2Ctrl', function($scope) {

})




app.controller('empsearchCtrl', function($scope,$timeout, $rootScope, $http, $ionicPopup, backcallFactory) {

  backcallFactory.backcallfun(); {
    $scope.setEmployeeName = function(fname, id) {
      document.getElementById("firstName").value = fname;
      document.getElementById("searchId").value = id;
      document.getElementById("employeeSuggestionList").style.display = "none";
    }
    $scope.employeeSuggestionList = function(name) {

      var searchData = document.getElementById("firstName").value;

      if (searchData.length > 0) {
        //alert("Empty");
        if (!isNaN(searchData.charAt(0))) {
          for (var i = 1; i < searchData.length; i++) {
            if (isNaN(searchData.charAt(i))) {
              $ionicPopup.confirm({
                title: "Miracle ME alerts you",
                content: "Enter valid Mobile number."
              })
            }
          }

        }
        document.getElementById("employeeSuggestionList").style.display = "block";


      } else {
        document.getElementById("employeeSuggestionList").style.display = "none";
      }
      document.getElementById("empData").style.display = "none";

      $scope.searchData = name.firstName;

      $http.post(contextPath + "/generalServices/getEmployeeSuggestionList", {
        "SearchKey": $scope.searchData,
        "Authorization":securityToken

      }).then(function(response) {



                      $timeout(function(){

                        //$scope.resultdata = response;
                      //  alert($scope.resultdata.data.IsAuthenticate);
                        if(JSON.stringify(response.data.IsAuthenticate)=="true")
                        {
                          console.log("emp suggestionlist authenticated service");
                          if(JSON.stringify(response.data.isDataExisted)=="true")
                          {
                            $scope.employeeSuggestionListArray = response.data.employees;
                            //alert($scope.employeeSuggestionListArray);

                          }
                          else if(JSON.stringify(response.data.isDataExisted)=="false")
                          {
                            $ionicPopup.alert({
                              title: "Miracle ME alerts you",
                              content: "There is no employee."
                              });

                          }


                        }
                        else{
                            console.log("emp suggestionlist not authenticated service");
                        }

                        // alert(JSON.stringify($scope.resultdata));
                        // alert(JSON.stringify($scope.resultdata.data.employees));
                        //

                      });




      })
    }





    $scope.employeeSearch = function(name) {

      var fname = document.getElementById("firstName").value;
      $scope.searchId = document.getElementById("searchId").value;
      //alert(searchId);
      //alert("no fname "+fname.length)
      //alert("Fname:"+fname+" lname:"+searchId);
      document.getElementById("employeeSuggestionList").style.display = "none";

      if (!fname) {
        $ionicPopup.confirm({
          title: "Miracle ME alerts you",
          content: "Empty Search not allowed"
        })
      } else {
        // $http.get("http://172.17.12.218:3000/completeSearch?key=" + fname)
        //   .then(function(response) {
        //     $scope.result = response.data;
        //     //alert("RESULT>>"+$scope.result.length);
        //     if ($scope.result.length == 0) {
        //       document.getElementById("dTable").style.display = "none";
        //       $ionicPopup.confirm({
        //         title: "Miracle ME alerts you",
        //         content: "Sorry No Results Found!"
        //       })
        //     } else {
        //       document.getElementById("dTable").style.display = "block";
        //     }
        //     $scope.resultString3 = $scope.result;
        //   });

        $http.post(contextPath + "/generalServices/getEmployeeDetailsByLoginId", {
          "LoginId": $scope.searchId,
            "Authorization":securityToken
        }).then(function(response) {
          //alert(JSON.stringify(response));
          //$scope.resultdata = response;
              if(JSON.stringify(response.data.IsAuthenticate)=="true")
              {
                console.log("authenticated service")
                document.getElementById("empData").style.display = "block";
                $rootScope.employeeData = response;
              }
              else
              {
                console.log("not authenticated service")
              }



        })
      }
    }
  }
})


app.controller('empindCtrl', function($scope,$timeout, $rootScope, $http) {
  {
    $scope.empinddetails = function(loginid) {
      $scope.searchId = loginid;
      //alert($scope.searchId);
      $http.post(contextPath + "/generalServices/getEmployeeImageByLoginId", {
        "LoginId": $scope.searchId,
        "Authorization":securityToken
      }).then(function(response) {
        //alert(JSON.stringify(response));
        $scope.resultdata = response;
        if(JSON.stringify(response.data.IsAuthenticate)=="true")
        {
          $timeout(function(){
            console.log("authenticated service")
            //alert(response.data.Image);
            $scope.base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(response.data.Image)));

            $("#profileImage").attr('src', 'data:image/png;base64,' + $scope.base64String);
             $("#profileImage1").attr('src', 'data:image/png;base64,' + $scope.base64String);
            $scope.$apply();
          });



          // $("#profileImage").attr('src', 'data:image/png;base64,' + $scope.base64String);
          // $("#profileImage1").attr('src', 'data:image/png;base64,' + $scope.base64String);
          //$scope.apply();
        }
        else
         {
          console.log("not authenticated service")
        }


      });

      // document.getElementById('firstName').value = "";
      // document.getElementById("empData").style.display = "none";

    }
  }
})





app.controller('emploginCtrl', [
  'backcallFactory','employeeProfileService', '$scope', '$state',
  '$window',
  '$rootScope', '$ionicNavBarDelegate', '$ionicSideMenuDelegate', '$ionicPopup', '$http', '$location', '$ionicModal', '$ionicLoading', '$ionicHistory', '$timeout',


  function(backcallFactory,employeeProfileService, $scope, $state, $window, $rootScope, $ionicNavBarDelegate, $ionicSideMenuDelegate, $ionicPopup, $http, $location, $ionicModal, $ionicLoading, $ionicHistory, $timeout) {
    {





      backcallFactory.backcallfun();

      if (i == 0)
      {
        $scope.employeedata = employeeProfileService.getEmployeeData();
        //alert(JSON.stringify($scope.employeedata));
        //$scope.base64String2 = btoa(String.fromCharCode.apply(null, new Uint8Array($scope.employeedata.employeeImage)));

        $scope.employeedata.employeeImage=btoa(String.fromCharCode.apply(null, new Uint8Array($scope.employeedata.employeeImage1)))
        //alert($scope.employeedata.employeeImage)

        //alert($scope.base64String2);

        window.localStorage.empimage=$scope.employeedata.employeeImage;
        //$("#empProfileImage").attr('src', 'data:image/png;base64,' + $scope.base64String2);
        //$scope.$apply();
      }

      $scope.emplogin = function(name) {

        //alert(localStorage.getItem('islogged'));
        $scope.username = document.getElementById("username").value; //name.username;//
        $scope.password = document.getElementById("password").value; //name.password;//
        $scope.isChecked = name.checked;//document.getElementById("cbox").checked;
        //alert("checkbox"+name.checked);
        //alert("ischecked"+document.getElementById("cbox").checked);
        //alert($scope.username+" "+ $scope.password);
        //var token=btoa("admin:admin");

        //alert(securityToken);
        if (!$scope.username || !$scope.password) {
          //alert("Error fill all the fields");
          $ionicPopup.confirm({
            title: "Miracle ME alerts you",
            content: "Please fill all the fields."
          })
        } else {
          $http.post(contextPath + "/generalServices/generalEmployeeDetails", {
            "LoginId": $scope.username,
            "Password": $scope.password,
            "Authorization":securityToken
          }).then(function(response) {


$scope.resultdata=response;


            //alert($scope.resultdata.data.IsAuthenticate);

            if(JSON.stringify(response.data.IsAuthenticate)=="true")
            {
              console.log("authenticated service");

              if (response.data.ResultString == "InValidCredentiales")
              {
                $ionicPopup.confirm({
                  title: "Miracle ME alerts you",
                  content: "Please provide valid data."
                })
              } else if (response.data.ResultString == "Valid")
              {
                i = 0;
                window.localStorage.isloggedin = 'true';

                if(window.localStorage['firstLoggedIn']=="true")
                {
                  $rootScope.hideTabBar = "";
                  $location.path('/tab/empsearch')
                }
                else
                {
                  $location.path('/instructions');
                  window.localStorage.firstLoggedIn="true";
                  window.localStorage.completeInstruction = 'true';

                }


                //console.log(JSON.stringify($scope.resultdata));

                var doc = {
                  'employeeName': $scope.resultdata.data.FName+" "+$scope.resultdata.data.MName+" "+$scope.resultdata.data.LName,
                  'employeePhNumber': $scope.resultdata.data.WorkPhoneNo,
                  'employeeWork': $scope.resultdata.data.CellPhoneNo,
                  'employeeImage1': $scope.resultdata.data.Image,
                };

                window.localStorage.ename = $scope.resultdata.data.FName+" "+$scope.resultdata.data.MName+" "+$scope.resultdata.data.LName;
                window.localStorage.pnumber = $scope.resultdata.data.WorkPhoneNo;
                window.localStorage.wnumber = $scope.resultdata.data.CellPhoneNo;
                //window.localStorage.eimage =$scope.resultdata.data.Image;

                employeeProfileService.setEmployeeData(doc);




                //window.localStorage.isloggedin = 'true'; //for logged in
                window.localStorage.isLogout = 'false';
                window.localStorage.firstLogin = 'true';
                window.localStorage.isCheckBox = $scope.isChecked;

                window.localStorage.uname = $scope.username;
                window.localStorage.upwd = $scope.password;
                $ionicNavBarDelegate.showBackButton(false);
              }
              else {
                $ionicPopup.confirm({
                  title: "Miracle ME alerts you",
                  content: "Please provide valid data."
                })
              } //end
            }
            else
             {
              console.log("not authenticated service");
            }

          })

        }


      }



    }
  }
])

app.controller('empLogoutCtrl', function($scope, $state, $ionicPlatform, $window, $rootScope, $ionicLoading, $http, $location, $ionicHistory, $timeout) {


  $scope.logout = function() {
    $state.go('side2');
    $rootScope.hideTabBar = 'true';
    window.localStorage.isloggedin = 'false';
    window.localStorage.isLogout = 'true';
    window.localStorage.ename = "";
    window.localStorage.pnumber = "";
    window.localStorage.wnumber ="";
    window.localStorage.empimage="";

    //window.localStorage.isCheckBox='false';
    //alert(window.localStorage['isLogout']);
    if (window.localStorage['isCheckBox'] === 'true') {
      //alert("is checkbox checked");

      document.getElementById('username').value = window.localStorage['uname']; //window.localStorage['uname']
      document.getElementById('password').value = window.localStorage['upwd'];
    } else if (window.localStorage['isCheckBox'] === 'false') {
      document.getElementById('username').value = null; //window.localStorage['uname']
      document.getElementById('password').value = null;
    }


    $timeout(function() {
      $ionicLoading.hide();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });

      //$state.go('tab.tab1');
    });

  };


})
app.controller('menuCtrl', function(employeeProfileService, $scope, $ionicPopup, $http, $location, $ionicModal, $ionicLoading, $ionicHistory, $timeout) {
  $scope.employeedata = employeeProfileService.getEmployeeData();
  //alert(JSON.stringify($scope.employeedata));
  $scope.base64String2 = btoa(String.fromCharCode.apply(null, new Uint8Array($scope.employeedata.employeeImage)));
  $("#empProfileImage").attr('src', 'data:image/png;base64,' + $scope.base64String2);
})





.factory('backcallFactory', ['$state', '$ionicPlatform', '$ionicHistory', '$timeout', function($state, $ionicPlatform, $ionicHistory, $timeout) {

  var obj = {}
  obj.backcallfun = function() {

      $ionicPlatform.registerBackButtonAction(function(event) {
        if ($state.current.name == "tab.side1") {
          navigator.app.exitApp(); //<-- remove this line to disable the exit
        }
        else if($state.current.name == "side2"){
          navigator.app.exitApp();
        }
        else {
          navigator.app.backHistory();
        }
      }, 100);

    } //backcallfun
  return obj;
}]);
