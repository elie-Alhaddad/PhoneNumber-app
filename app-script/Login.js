angular.module('loginApp', [])
    .controller('loginController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
        $scope.loginModel = {
            username: '',
            password: ''
        };

        $scope.loginStatus = '';

        $scope.submitLogin = function () {
      
            $http.get('/api/users')
                .then(function (response) {
              
                    var users = response.data;
                    var user = users.find(u => u.Username === $scope.loginModel.username && u.Password === $scope.loginModel.password);

                    if (user) {
                       
                        $scope.loginStatus = "Login successful!";
                        $timeout(function () {
                            window.location.href = '/Home/Device';
                        }, 1000);
                    } else {
                       
                        $scope.loginStatus = "Invalid login credentials.";
                        $timeout(function () {
                            $scope.loginStatus = '';
                        }, 3000);
                    }
                })
                .catch(function (error) {
                    
                    $scope.loginStatus = "Error: " + error.statusText;
                    $timeout(function () {
                        $scope.loginStatus = '';
                    }, 3000);
                });
        };
    }]);
