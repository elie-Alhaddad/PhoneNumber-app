

angular.module('appDirectives', [])
    .directive('clientTypeSelector', function () {
        return {
            restrict: 'E',
            templateUrl: '../app-angular/ClientTypeSelectorTemplate.html',
            scope: {
                selectedType: '=', // Use two-way binding for selectedType
                getData: '&'        // Define the getData function without any parameters
            },
            controller: ['$scope', function ($scope) {
                $scope.selectType = function () {
                    // Call the getData function without passing any parameters
                    // The getData function will be executed in the context of the parent scope
                    $scope.getData();
                };
            }]
        };
    })
   .directive('deviceSelector', ['$http', function ($http) {
    return {
        restrict: 'E',
        templateUrl: '../app-angular/deviceSelectorTemplate.html',
        scope: {
            selectedDevice: '=' // Use two-way binding for selectedDevice
        },
        link: function ($scope, element, attrs) {
            // Retrieve the devices from the API instead of the hard-coded list
            $http.get('/api/Device/GetAllDevices')
                .then(function (response) {
                    $scope.devices = response.data;
                })
                .catch(function (error) {
                    console.log('Error:', error);
                });

            // Function to handle the selected device change
            $scope.handleDeviceChange = function () {
                // No need to pass data to parent controller; selectedDevice is already two-way bound.
            };

            // Watch for changes in the selectedDevice variable and trigger the handleDeviceChange function
            $scope.$watch('selectedDevice', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.handleDeviceChange();
                }
            });
        }
    };
}])

.directive('clientSelector', ['$http', function ($http) {
    return {
        restrict: 'E',
        templateUrl: '../app-angular/clientSelectorTemplate.html',
        link: function ($scope, element, attrs) {
            // Retrieve the clients from the API
            $http.get('/api/Client/GetAllClients')
                .then(function (response) {
                    $scope.clients = response.data;
                })
                .catch(function (error) {
                    console.log('Error:', error);
                });

            // Function to handle the selected client change
            $scope.handleClientChange = function () {
                console.log('Client Filter:', $scope.selectedClient.Name);
                // No need to pass data to the parent controller; selectedClient is already two-way bound.
            };

            // Watch for changes in the selectedClient variable and trigger the handleClientChange function
            $scope.$watch('selectedClient', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.handleClientChange();
                }
            });
        }
    };
}])
    .directive('phoneNumberSelector', ['$http', function ($http) {
        return {
            restrict: 'E',
            templateUrl: '../app-angular/phoneNumberSelectorTemplate.html',
            link: function ($scope, element, attrs) {
                // Retrieve the phone numbers from the API
                $http.get('/api/PhoneNumber/GetAllPhoneNumbersWithDeviceName')
                    .then(function (response) {
                        $scope.phoneNumbers = response.data;
                    })
                    .catch(function (error) {
                        console.log('Error:', error);
                    });

                // Function to handle the selected phone number change
                $scope.handlePhoneNumberChange = function () {
                    var phoneNumberFilter = $scope.selectedPhoneNumber ? $scope.selectedPhoneNumber.Number : '';
                    console.log('Phone Number Filter:', phoneNumberFilter);
                    // No need to pass data to the parent controller; selectedPhoneNumber is already two-way bound.
                };

                // Watch for changes in the selectedPhoneNumber variable and trigger the handlePhoneNumberChange function
                $scope.$watch('selectedPhoneNumber', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $scope.handlePhoneNumberChange();
                    }
                });
            }
        };
    }])
    .directive('statusFilter', function () {
        return {
            restrict: 'E', // Restrict the directive to be used as an element
            templateUrl: '../app-angular/StatusFilterTemplate.html', // Path to the template file
            scope: {
                selectedStatus: '=', // Two-way binding for selectedStatus
                selectStatus: '&' // Define the selectStatus function without any parameters
            }
        };
    });

