angular.module('DeviceScript', ['appDirectives', 'ui.bootstrap'])
    .controller('DevicesController', ['$scope', '$uibModal', '$timeout', '$http', function ($scope, $uibModal, $timeout, $http) {
        $scope.devices = [];
      //  $scope.filteredDevices = [];

        $scope.searchText = '';


        function displayMessageForShortTime(message, time, success) {
            $scope.message = message;
            $scope.messageClass = success ? 'alert-success' : 'alert-danger';
            $timeout(function () {
                $scope.message = '';
            }, time);
        }



        $scope.search = function () {
            if ($scope.searchText) {
                $http.get('/api/Device/GetFilteredDevices', { params: { filter: $scope.searchText } })
                    .then(function (response) {
                        $scope.filteredDevices = response.data;
                        console.log('Filtered Devices:', $scope.filteredDevices);
                    })
                    .catch(function (error) {
                        console.log('Error:', error);
                    });
            }
            else {
                $scope.filteredDevices = $scope.devices;
                console.log('All Devices:', $scope.filteredDevices);
            }
        };

        $scope.openModal = function (device) {
            var modalInstance = $uibModal.open({
                templateUrl: '../app-angular/Modal.html',
                controller: 'ModalInstanceController',
                resolve: {
                    device: function () {
                        return device ? angular.copy(device) : null;
                    }
                }
            });

            modalInstance.result.then(function (newDevice) {
                if (newDevice) {
                    if (device) {
                        updateDevice(newDevice);
                    } else {
                        addDevice(newDevice);

                    }
                   
                    $scope.search();
                }
            });
        };

        function getAllDevices() {
            $http.get('/api/Device/GetAllDevices')
                .then(function (response) {
                    $scope.devices = response.data;
                    $scope.filteredDevices = $scope.devices;
                    $scope.search(); // Call the search function initially
                })
                .catch(function (error) {
                    console.log('Error:', error);
                });
        }

        function addDevice(device) {
            if (device.Name && device.Name.length >= 2)
            {
                $http.post('/api/Device/AddDevice', device)
                    .then(function (response) {
                        getAllDevices();
                        $scope.search();
                        displayMessageForShortTime('Succeeded: We added a new Device', 3000, true);

                    })
                    .catch(function (error) {
                        console.log('Error:', error);
                    });
            } else {
                displayMessageForShortTime('Failed: ' + error, 3000, false);

            }
        }

        function updateDevice(device) {
            if (device.Name && device.Name.length >= 2) {
                $http.post('/api/Device/UpdateDevice', device)
                    .then(function (response) {
                        getAllDevices();
                        $scope.search();
                        displayMessageForShortTime('Succeeded: We updated a Device', 3000, true);

                    })
                    .catch(function (error) {
                        console.log('Error:', error);
                    });
            } else {
                displayMessageForShortTime('Failed: Device name should be at least two characters.', 3000, false);

            }
        }

        getAllDevices();
    }])
    .controller('ModalInstanceController', ['$scope', '$uibModalInstance', 'device', function ($scope, $uibModalInstance, device) {
        $scope.device = device || {};

        $scope.save = function () {
            $uibModalInstance.close($scope.device);

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);