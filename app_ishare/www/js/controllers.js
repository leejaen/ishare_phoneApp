angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope, $http, serverConfig, User)
{
    $scope.paramters = {
        dashData: null,
    };
    $scope.doRefresh = function ()
    {
        console.log("refresh");
        $scope.$apply()
    };
    $scope.initData = function (event)
    {
        console.log("initData");
        $scope.getData();
    }
    $scope.getData = function ()
    {
        var loginUser = User.getLoginUser();
        $http.post(serverConfig.serverURL + "/signin/", { uid: loginUser.uid, type: "dash", lastPostData: "" })
        .success(function (data, status, headers, config)
        {
            if (data == "failure")
            {
                $scope.showAlert("验证失败", "是否没有注册或忘记密码？");
                return false;
            }
            else if (data == "error")
            {
                $scope.showAlert("网络错误", "验证过程中发生网络错误");
                return false;
            };
            $scope.paramters.dashData = data;
        })
    };
})

.controller('ChatsCtrl', function ($scope, Chats)
{
    $scope.chats = Chats.all();
    $scope.remove = function (chat)
    {
        Chats.remove(chat);
    }
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats)
{
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function ($scope, $http, $ionicPopover, serverConfig, Friends)
{
    $scope.paramters = {
        searchKeyword: "",
        searchData: null
    }
    $scope.friends = Friends.all();
    $ionicPopover.fromTemplateUrl('templates/popover-serchuser.html', {
        scope: $scope
    }).then(function (popover)
    {
        $scope.popover = popover;
    });
    $scope.cancelKeywordSearch = function ()
    {
        alert("cancelKeywordSearch");
    }
    $scope.performKeywordSearchInPopover = function ()
    {
        $http.post(serverConfig.serverURL + "/search_user/", { keyword: $scope.paramters.searchKeyword })
        .success(function (data, status, headers, config)
        {
            console.log(data);
            if (data == "failure")
            {
                $scope.showAlert("发布失败", "请确认是否登陆提交文字符合规定");
                return false;
            }
            else if (data == "error")
            {
                $scope.showAlert("网络错误", "发布过程中发生网络错误");
                return false;
            };
            $scope.paramters.searchData = data;
            $scope.popover.show($event);
        })
    }
    $scope.closeSearchUserPopover = function ()
    {
        $scope.popover.hide();
    };
})

.controller('FriendDetailCtrl', function ($scope, $stateParams, Friends)
{
    $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function ($scope, $state)
{
    $scope.settings = {
        enableFriends: true
    };
    $scope.signOut = function ()
    {
        $state.go('signin');
    }
})
.controller('SignUpCtrl', function ($scope, $state, $http, $ionicPopup, $timeout, User)
{
    //http://ionicframework.com/docs/api/service/$ionicPopup/
    // Triggered on a button click, or some other target
    $scope.showPopup = function ()
    {
        $scope.data = {}
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="password" ng-model="data.wifi">',
            title: 'Enter Wi-Fi Password',
            subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
              {
                  text: '<b>Save</b>',
                  type: 'button-positive',
                  onTap: function (e)
                  {
                      if (!$scope.data.wifi)
                      {
                          //don't allow the user to close unless he enters wifi password
                          e.preventDefault();
                      }
                      else
                      {
                          return $scope.data.wifi;
                      }
                  }
              }
            ]
        });
        myPopup.then(function (res)
        {
            console.log('Tapped!', res);
        });
        $timeout(function ()
        {
            myPopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);
    };
    // An alert dialog
    $scope.showAlert = function (theTitle, TheTemplate)
    {
        var alertPopup = $ionicPopup.alert({
            title: theTitle,
            template: TheTemplate
        });
        alertPopup.then(function (res)
        {
            console.log("alertPopup!");
        });
    };

    $scope.signUp = function (user, serverConfig)
    {
        if (user === undefined || user.username === undefined || user.password === undefined || user.re_password === undefined)
        {
            $scope.showAlert("信息不完整", "请正确填写您的注册信息");
            return false;
        }
        if (user.password !== user.re_password)
        {
            $scope.showAlert("密码不匹配", "请确认两次输入的密码相同");
            return false;
        }

        $http.post(serverConfig.serverURL + "/signup/"
            , { username: user.username, pwd: user.password })
        .success(function (data, status, headers, config)
        {
            // this callback will be called asynchronously
            // when the response is available
            if (data == "existUserName")
            {
                $scope.showAlert("该用户名已占用", "抱歉啦，请换一个用户名试试");
                return false;
            }
            else if (data == "failure")
            {
                $scope.showAlert("注册不成功", "抱歉，发生了个错误");
                return false;
            }
            else if (data == "error")
            {
                $scope.showAlert("网络错误", "抱歉，我们没有收到您的注册内容，请检查网络是否错误");
                return false;
            }
            else
            {
                $scope.showAlert("注册成功", "您的ID是" + data);
            };
            $state.go('signin');
        })
        .error(function (data, status, headers, config)
        {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.showAlert("注册不成功", "抱歉，发生了个错误");
        });
        return false;
    };

})
.controller('SignInCtrl', function ($scope, $state, $ionicPopup, $http, serverConfig, appCache)
{
    $scope.tips = {
        signinWithNameAndPwd: "请填入您的用户名密码登陆"
    };
    // A confirm dialog
    //$scope.showConfirm = function (theTitle, TheTemplate)
    //{
    //    var confirmPopup = $ionicPopup.confirm({
    //        title: theTitle,
    //        template: TheTemplate
    //    });
    //    confirmPopup.then(function (res)
    //    {
    //        if (res)
    //        {
    //            console.log('You are sure');
    //        } else
    //        {
    //            console.log('You are not sure');
    //        }
    //    });
    //};
    // An alert dialog
    $scope.showAlert = function (theTitle, TheTemplate)
    {
        var alertPopup = $ionicPopup.alert({
            title: theTitle,
            template: TheTemplate
        });
        alertPopup.then(function (res)
        {
            console.log("alertPopup!");
        });
    };
    $scope.signIn = function (user)
    {
        $http.post(serverConfig.serverURL + "/signin/", { username: user.username, pwd: user.password })
        .success(function (data, status, headers, config)
        {
            if (data == "failure")
            {
                $scope.showAlert("验证失败", "是否没有注册或忘记密码？");
                return false;
            }
            else if (data == "error")
            {
                $scope.showAlert("网络错误", "验证过程中发生网络错误");
                return false;
            };
            var loginUser = {
                username: user.username,
                password: user.password,
                uid: data
            }
            appCache.put("loginUser", loginUser);
            window.localStorage['loginUser'] = JSON.stringify(loginUser);
            $state.go('tab.dash');
        })
    };

})
.controller("LikesCtrl", function ($scope)
{
    //$scope.likes = Friends.get($stateParams.friendId);
})
.controller("PublishCtrl", function ($scope, $state, $http, $timeout, $ionicPopup, $ionicPopover, serverConfig, User)
{
    $scope.p = {
        text: "",
        textTips: "您的内容",
        timeFun: null
    };
    $scope.showAlert = function (theTitle, TheTemplate)
    {
        var alertPopup = $ionicPopup.alert({
            title: theTitle,
            template: TheTemplate
        });
        alertPopup.then(function (res)
        {
            console.log("alertPopup!");
        });
    };

    $ionicPopover.fromTemplateUrl('templates/popover-serchuser.html', {
        scope: $scope
    }).then(function (popover)
    {
        $scope.popover = popover;
    });

    $scope.openTextPopover = function ($event)
    {
        $scope.popover.show($event);
        //$state.go("publishtext");
    }
    $scope.closeTextPopover = function ()
    {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function ()
    {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function ()
    {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function ()
    {
        // Execute action
    });
    $scope.postText = function ()
    {
        if (!!$scope.p.text == false)
        {
            //$scope.showAlert("格式错误", "您还没有填入发布内容……");
            $timeout.cancel($scope.p.timeFun);
            $scope.p.textTips = "请在此处填写您的内容";
            $scope.p.timeFun = $timeout(function ()
            {
                $scope.p.textTips = "您的内容";
            }, 3000);
            return false;
        }
        var loginUser = User.getLoginUser();
        $http.post(serverConfig.serverURL + "/post_text/", { userID: loginUser.uid, text: $scope.p.text, type: "text" })
        .success(function (data, status, headers, config)
        {
            if (data == "failure")
            {
                $scope.showAlert("发布失败", "请确认是否登陆提交文字符合规定");
                return false;
            }
            else if (data == "error")
            {
                $scope.showAlert("网络错误", "发布过程中发生网络错误");
                return false;
            };
            alert("发布成功！");
            $scope.p.text = "";
            $scope.closeTextPopover();
            $state.go('tab.dash');
        })
    };
})
.controller('HomeTabCtrl', function ($scope)
{
    console.log('HomeTabCtrl');
});
