angular.module('PhoneScript', ['appDirectives', 'ui.bootstrap', 'DeviceScript'])
    .controller('PhoneNumberController', ['$scope', '$uibModal', '$http', '$timeout', function ($scope, $uibModal, $http, $timeout) {
        $scope.numberFilter = '';
        $scope.deviceFilter = '';

        $scope.devices = [];
        $scope.phones = [];
        $scope.filteredPhones = [];

        $scope.modalTitle = '';
        $scope.modalNumber = '';
        $scope.modalDevice = null;

        // Function to retrieve all phone numbers
        function getAllPhoneNumbers() {
            $http.get('/api/PhoneNumber/GetAllPhoneNumbersWithDeviceName')
                .then(function (response) {
                    $scope.phones = response.data;
                    $scope.filteredPhones = response.data;
                    $scope.searchNumbers();
                })
                .catch(function (error) {
                    console.log('Error:', error);
                });
        }

        // Function to retrieve all devices from the API
        function getAllDevices() {
            $http.get('/api/Device/GetAllDevices')
                .then(function (response) {
                    $scope.devices = response.data;
                })
                .catch(function (error) {
                    console.log('Error:', error);
                });
        }

        // Initialize data
        getAllPhoneNumbers();
        getAllDevices();

        // Function to get selected device data from the device selector
        $scope.getData = function (selectedDeviceData) {
            $scope.selectedDevice = selectedDeviceData;
            //   $scope.searchNumbers(); // Trigger the searchNumbers function to update the filter
        };


        // Function to trigger the search on button click

        $scope.performSearch = function () {
            $scope.searchNumbers();
        };

        // Function to filter phone numbers based on filters
        $scope.searchNumbers = function () {
            $scope.filteredPhones = $scope.phones.filter(function (phone) {
                var numberFilterCondition = phone.Number.toString().includes($scope.numberFilter) || $scope.numberFilter === '';
                var deviceFilterCondition = $scope.selectedDevice ? phone.Device.Name === $scope.selectedDevice.Name : true;

                // Both filters are specified, filter based on both conditions
                return numberFilterCondition && deviceFilterCondition;
            });
        };


        // Function to add or edit a phone number
        $scope.openModal = function (phone) {
            if (phone) {
                // Edit Number
                $scope.modalTitle = 'Edit Number';
                $scope.modalNumber = phone.Number;
                $scope.modalDevice = $scope.devices.find(function (device) {
                    return device.Name === phone.Device.Name;
                });
            } else {
                // Add Number
                $scope.modalTitle = 'Add Number';
                $scope.modalNumber = '';
                $scope.modalDevice = null;
            }

            var modalInstance = $uibModal.open({
                templateUrl: '../app-angular/ModalPhone.html',
                controller: 'PhoneNumberModalController',
                scope: $scope,
                resolve: {
                    phoneToEdit: function () {
                        return phone;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    if (phone) {
                        // Edit existing phone number
                        phone.Number = result.Number;
                        phone.Device = result.Device;
                        $scope.updatePhoneNumber(phone, result);
                    } else {
                        // Add new phone number
                        $scope.addPhoneNumber(result);
                    }
                }
            });
        };

        // Function to update a phone number
        // Function to update a phone number
        $scope.updatePhoneNumber = function (phone, result) {
            phone.Number = result.Number;
            phone.Device.Id = result.Device.Id; // Use Device.Id instead of Device.Name
            $http.post('/api/PhoneNumber/UpdatePhoneNumber', phone)
                .then(function (response) {
                    console.log('Phone number updated successfully');
                    // Display a success message with a timeout and set color to green
                    $scope.displayMessage = 'Phone number updated successfully';
                    $scope.displayMessageColor = 'success'; // Set color to green
                    $scope.showMessageTimeout();

                    $scope.searchNumbers();
                })
                .catch(function (error) {
                    console.log('Error updating phone number:', error);
                });
        };

        // Function to add a new phone number
        $scope.addPhoneNumber = function (result) {
            var newPhone = {
                Number: result.Number,
                DeviceId: result.Device.Id
            };
            $http.post('/api/PhoneNumber/AddPhoneNumber', newPhone)
                .then(function (response) {
                    getAllPhoneNumbers(); // Refresh the phone numbers list
                    console.log('Phone number added successfully');
                    // Display a success message with a timeout and set color to green
                    $scope.displayMessage = 'Phone number added successfully';
                    $scope.displayMessageColor = 'success'; // Set color to green
                    $scope.showMessageTimeout();

                    $scope.searchNumbers();
                })
                .catch(function (error) {
                    console.log('Error adding phone number:', error);
                });
        };


        // Function to show a message with a timeout
        $scope.showMessageTimeout = function () {
            $scope.showMessage = true;
            $scope.displayMessageTimeout = 3000; // 3 seconds
            $timeout(function () {
                $scope.showMessage = false;
            }, $scope.displayMessageTimeout);
        };
    }])
    .controller('PhoneNumberModalController', ['$scope', '$uibModalInstance', 'phoneToEdit', function ($scope, $uibModalInstance, phoneToEdit) {
        $scope.modalNumber = phoneToEdit ? parseInt(phoneToEdit.Number) : '';
        $scope.modalDevice = phoneToEdit ? $scope.devices.find(function (device) {
            return device.Name === phoneToEdit.Device.Name;
        }) : null;

        // Function to handle the selected device change in the modal
        $scope.handleSelectedDeviceInModal = function (selectedDeviceData) {
            $scope.modalDevice = selectedDeviceData;
        };

        $scope.savePhoneNumber = function () {
            var result = {
                Number: $scope.modalNumber,
                Device: $scope.modalDevice
            };

            $uibModalInstance.close(result);
        };

        $scope.cancelModal = function () {
            $scope.modalNumber = '';
            $scope.modalDevice = null;
            $uibModalInstance.dismiss('cancel');
        };
    }]);
