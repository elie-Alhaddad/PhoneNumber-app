angular.module('PhoneNumberReport', ['appDirectives'])
    .controller('ReportPageController', ['$scope', '$http', function ($scope, $http) {
        $scope.selectedDevice = null;
        $scope.selectedStatus = null;
        $scope.phoneNumbersReport = [];

        $scope.search = function () {
            var deviceName = $scope.selectedDevice ? $scope.selectedDevice.Name : null;
            var phoneNumberStatus = $scope.selectedStatus;

            $http.get('/api/PhoneNumber/GetReservedUnreservedPhoneNumbersPerDevice', {
                params: {
                    deviceName: deviceName,
                    phoneNumberStatus: phoneNumberStatus
                }
            }).then(function (response) {
                $scope.phoneNumbersReport = response.data;
            }).catch(function (error) {
                console.log('Error:', error);
            });
        };
        $scope.search();
    }]);
