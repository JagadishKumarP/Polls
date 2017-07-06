var app = angular.module('pollApp', []);

app.controller('pollCtrl', function ($scope, $http) {

    $scope.reports = [];
    $scope.userdetails = {
        'username':'user',
        '_id': '595de84e36e24847ac3eaae3'
    };
   /* $scope.successMessageHide = false;
    $scope.errorMessageHide = false;
    var autoCloseMessage = function (action, message) {
        if (action) {
            $(".alert-success").removeAttr('hidden');
            $scope.successMessage = message;
            $(".alert-dismissible").fadeTo(3000, 500).slideUp(500, function () {
                $(".alert-success").slideUp(500);
            });
        } else {
            $(".alert-danger").removeAttr('hidden');
            $scope.errorMessage = message;
            $(".alert-dismissible").fadeTo(3000, 500).slideUp(500, function () {
                $(".alert-danger").slideUp(500);
            });
        }

    }
    autoCloseMessage(true, "Testing");
    autoCloseMessage(false, "Testing");
    */

    $scope.createuser = function (user) {
        console.log(user);
        $http.post('/user/new', user)
            .then(function success(response) {
                console.log(response.data);
            }, function error(response) {
                console.log(response.statusText);
            });
    }

    $scope.signin = function (user) {
        console.log(user);
        $http.post('/signin', user)
            .then(function success(response) {
                console.log(response.data);
            }, function error(response) {
                console.log(response.statusText);
            });
    }

    $scope.createpoll = function (poll) {
        console.log(poll);
        $http.post('/poll/new', poll)
            .then(function success(response) {
                console.log(response.data);
            }, function error(response) {
                console.log(response.statusText);
            });
    }

    $scope.getreport = function () {
        $http.get('/response/all')
            .then(function success(response) {
                if(response.data.success){
                    $scope.reports = response.data.responses;
                }else{
                    $scope.reportsMessage = response.data.message;
                }
            }, function error(response) {
                console.log(response.statusText);
            });
    }

    $scope.getpolls = function () {
        $http.get('/poll/all')
            .then(function success(response) {
                if(response.data.success){
                    $scope.polls = response.data.polls;
                    console.log($scope.polls);
                }else{
                    $scope.pollsMessage = response.data.message;
                    console.log($scope.pollsMessage);
                }
            }, function error(response) {
                console.log(response.statusText);
            });
    }

    $scope.submitresponse = function(poll, index){
        console.log(poll);
        console.log(index);
        var userresponse = {
            'user_id': $scope.userdetails._id,
            'username': $scope.userdetails.username,
            'poll_id': poll._id,
            'question':poll.question,
            'response':poll.userresponse
        }
        $http.post('/response/new', userresponse)
            .then(function success(response) {
                console.log(response.data);
            }, function error(response) {
                console.log(response.statusText);
            });
    }

});

