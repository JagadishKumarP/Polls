var app = angular.module('pollApp', []);

app.controller('pollCtrl', function ($scope, $http, $rootScope) {

    $rootScope.token = null;
    $rootScope.userdetails = null;

    $scope.reports = [];
    $scope.pollresponse = [];
    $scope.hide = {
        "createuser": false,
        "signin": false,
        "createpoll": true,
        "report": true,
        "viewpolls": true,
        "signout": true
    }

    var autoCloseMessage = function (action, message) {
        if (action) {
            $scope.successMessage = message;
            $("#successMessageHide").fadeTo(2000, 500).slideUp(500, function () {
                $("successMessageHide").slideUp(500);
            });
        } else {
            $scope.errorMessage = message;
            $("#errorMessageHide").fadeTo(2000, 500).slideUp(500, function () {
                $("errorMessageHide").slideUp(500);
            });
        }
    }

    $scope.createuser = function (user) {
        $scope.newuser = null;
        $http.post('/signup', user)
            .then(function success(response) {
                autoCloseMessage(response.data.success, response.data.message);
                if (response.data.success) {
                    $('.nav-tabs a[href="#' + 'signin' + '"]').tab('show');
                }
            }, function error(response) {
                autoCloseMessage(response.data.success, response.data.message);
            });
    }

    $scope.signin = function (user) {
        $scope.user = null;
        $http.post('/signin', user)
            .then(function success(response) {
                autoCloseMessage(response.data.success, response.data.message);
                //console.log(response.data);
                if (response.data.success) {
                    $rootScope.userdetails = response.data.user;
                    $rootScope.token = response.data.token;
                    if (response.data.user.is_admin) {
                        $scope.hide = {
                            "createuser": true,
                            "signin": true,
                            "createpoll": false,
                            "report": false,
                            "viewpolls": true,
                            "signout": false
                        }
                        $('.nav-tabs a[href="#' + 'createpoll' + '"]').tab('show');
                        $scope.getpollsandresponse();
                    } else {
                        $scope.hide = {
                            "createuser": true,
                            "signin": true,
                            "createpoll": true,
                            "report": true,
                            "viewpolls": false,
                            "signout": false
                        }
                        $('.nav-tabs a[href="#' + 'viewpolls' + '"]').tab('show');
                        $scope.getpolls();
                    }
                }
            }, function error(response) {
                autoCloseMessage(false, 'Server Internal Error');
                console.error(response.statusText);
            });
    }

    $scope.signout = function () {
        autoCloseMessage(true, 'Sign Out successful');
        $rootScope.token = null;
        $rootScope.userdetails = null;
        $scope.hide = {
            "createuser": false,
            "signin": false,
            "createpoll": true,
            "report": true,
            "viewpolls": true,
            "signout": true
        }
        $('.nav-tabs a[href="#' + 'signin' + '"]').tab('show');
    }

    $scope.createpoll = function (poll) {
        //console.log(poll);
        $scope.poll = null;
        $http.post('/poll/new', poll)
            .then(function success(response) {
                autoCloseMessage(response.data.success, response.data.message);
                //console.log(response.data);
            }, function error(response) {
                autoCloseMessage(response.data.success, response.data.message);
                console.error(response.statusText);
            });
    }

    $scope.getreport = function () {
        $http.get('/response/all')
            .then(function success(response) {
                autoCloseMessage(response.data.success, response.data.message);
                if (response.data.success) {
                    $scope.reports = response.data.responses;
                } else {
                    $scope.reportsMessage = response.data.message;
                }
            }, function error(response) {
                autoCloseMessage(response.data.success, response.data.message);
                console.error(response.statusText);
            });
    }

    $scope.showresponses = function (poll, index) {
        $scope.pollresponse[index].show = $scope.pollresponse[index].show ? false : true;
        if ($scope.pollresponse[index].show) {
            $("#showresponse_" + index).attr("value", "Hide Response(s)");
            $("#showresponse_" + index).removeClass("btn-info");
            $("#showresponse_" + index).addClass("btn-warning");
        } else {
            $("#showresponse_" + index).attr("value", "Show Response(s)");
            $("#showresponse_" + index).removeClass("btn-warning");
            $("#showresponse_" + index).addClass("btn-info");
        }
    }

    var getpollresponse = function (pollid, i) {
        $http.get('/response/' + pollid)
            .then(function success(response) {
                if (response.data.success) {
                    $scope.pollresponse[i] = response.data.responses;
                    $scope.pollresponse[i].show = false;
                }
            }, function error(response) {
                console.error(response.statusText);
            });
    }

    $scope.getpollsandresponse = function () {
        $http.get('/poll/all')
            .then(function success(response) {
                if (response.data.success) {
                    $scope.polls = response.data.polls;
                    $scope.pollresponse = new Array($scope.polls.length);
                    for (i in $scope.polls) {
                        getpollresponse($scope.polls[i]._id, i);
                    }
                } else {
                    $scope.pollsMessage = response.data.message;
                    $scope.pollresponse = [];
                    console.log($scope.pollsMessage);
                }
            }, function error(response) {
                autoCloseMessage(false, 'Error occurred while fetching response.');
                console.log(response.statusText);
            });
    }

    $scope.getpolls = function () {
        $http.get('/poll/all')
            .then(function success(response) {
                autoCloseMessage(response.data.success, response.data.message);
                if (response.data.success) {
                    $scope.polls = response.data.polls;
                    //console.log($scope.polls);
                } else {
                    $scope.pollsMessage = response.data.message;
                    //console.log($scope.pollsMessage);
                }
            }, function error(response) {
                autoCloseMessage(response.data.success, response.data.message);
                console.log(response.statusText);
            });
    }

    $scope.submitresponse = function (poll, index) {
        //console.log(poll);
        //console.log(index);
        var userresponse = {
            'user_id': $rootScope.userdetails._id,
            'username': $rootScope.userdetails.username,
            'poll_id': poll._id,
            'question': poll.question,
            'response': poll.userresponse
        }
        $http.post('/response/new', userresponse)
            .then(function success(response) {
                autoCloseMessage(response.data.success, response.data.message);
                //console.log(response.data);
            }, function error(response) {
                console.error(response.statusText);
                autoCloseMessage(response.data.success, response.data.message);
            });
    }

});

app.factory('httpRequestAuthInterceptor', function ($rootScope) {
    return {
        request: function (config) {
            config.headers['Authorization'] = 'Bearer ' + $rootScope.token;
            return config;
        }
    };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestAuthInterceptor');
});

