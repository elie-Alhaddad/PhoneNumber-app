angular.module('ClientScript', ['appDirectives', 'ui.bootstrap'])
    .controller('ClientController', ['$scope', '$http', '$uibModal', '$filter', function ($scope, $http, $uibModal, $filter) {
        $scope.clients = [];
        $scope.filteredClients = [];

        $scope.nameFilter = '';
        $scope.typeFilter = '';

        $scope.getClientTypeData = function () {
            $scope.selectedTypeData = $scope.selectedType;

        };

        $scope.search = function () {
            $http.get('/api/Client/GetFilteredClients', {
                params: {
                    nameFilter: $scope.nameFilter,
                    typeFilter: $scope.selectedType
                }
            })
                .then(function (response) {
                    $scope.filteredClients = response.data;
                })
                .catch(function (error) {
                    console.log('Error:', error);
                });
        };

        $scope.openModal = function (client) {
            $scope.modalInstance = $uibModal.open({
                templateUrl: '../app-angular/ModalClient.html',
                controller: 'ClientModalController',
                resolve: {
                    client: function () {
                        return client ? angular.copy(client) : { Name: '', Type: '', BirthDate: null };
                    }
                }
            });

            $scope.modalInstance.result.then(function (updatedClient) {
                if (updatedClient) {
                    if (client) {
                        $scope.updateClient(updatedClient);
                    } else {
                        $scope.addClient(updatedClient);
                    }
                    $scope.search();
                }
            });
        };

        $scope.cancelModal = function () {
            $scope.closeModal();
        };

        $scope.closeModal = function () {
            $scope.modalInstance.close();
        };


        $scope.addClient = function (newClient) {
            if (newClient.BirthDate) {
                newClient.BirthDate = new Date(newClient.BirthDate);
            }

            $http.post('/api/Client/AddClient', newClient)
                .then(function (response) {
                    getAllClients();
                    $scope.newClient = { Name: '', Type: '', BirthDate: null };
                    $scope.closeModal();
                    $scope.search();
                })
                .catch(function (error) {
                    console.log('Error:', error);
                });
        };


        $scope.updateClient = function (client) {
            if (client.BirthDate) {
                client.BirthDate = new Date(client.BirthDate);
            }

            $http.post('/api/Client/UpdateClient', client)
                .then(function (response) {
                    getAllClients();
                    $scope.search();
                })
                .catch(function (error) {
                    console.log('Error:', error);
                });
        };



        function getAllClients() {
            $http.get('/api/Client/GetAllClients')
                .then(function (response) {
                    $scope.clients = response.data;

                    // Initialize phoneNumberReserved to false for all clients
                    angular.forEach($scope.clients, function (client) {
                        var isPhoneNumberReserved = localStorage.getItem('phoneNumberReserved_' + client.Id);
                        client.phoneNumberReserved = isPhoneNumberReserved === 'true';
                    });

                    $scope.filteredClients = $scope.clients;
                })
                .catch(function (error) {
                    console.log('Error:', error);
                });
        }


        getAllClients();

        $scope.isPhoneNumberActive = function (client) {
            if (client.Reservation && client.Reservation.EED) {
                const EED = new Date(client.Reservation.EED);
                const currentDate = new Date();

                // Check if the reservation is active based on the condition: x > BED && (x < EED || EED is null)
                return EED > currentDate && (!client.Reservation.EndEffectiveDate || currentDate < new Date(client.Reservation.EndEffectiveDate));
            }
            return false;
        };

       
       $scope.togglePhoneNumberReservation = function (client) {
    if (client.phoneNumberReserved) {
        $scope.openUnreserveConfirmation(client);
    } else {
        if (client.isPhoneNumberActive || client.phoneNumberReserved) {
            $scope.openUnreserveConfirmation(client);
            return;
        }

        $scope.openReserveModal(client);
    }
};

        $scope.openReserveModal = function (client) {
            // Check if the phone number is already reserved
            if (client.isPhoneNumberActive || client.phoneNumberReserved) {
                // If it's already reserved, open the unreserve confirmation modal directly
                $scope.openUnreserveConfirmation(client);
                return;
            }

            // Set the selected client in the scope before opening the modal
            $scope.selectedClient = client;

            // Fetch phone numbers from the server
            $http.get('/api/PhoneNumber/GetAllPhoneNumbersWithDeviceName')
                .then(function (response) {
                    var phoneNumbers = response.data;

                    $scope.modalInstance = $uibModal.open({
                        templateUrl: '../app-angular/ReservePhoneNumberModal.html',
                        controller: 'ReservePhoneNumberModalController',
                        resolve: {
                            client: function () {
                                return $scope.selectedClient;
                            },
                            phoneNumbers: function () {
                                return phoneNumbers;
                            }
                        }
                    });

                    $scope.modalInstance.result.then(function (selectedPhoneNumber) {
                        // The selectedPhoneNumber here will be the object of the selected phone number
                        // You can now use it to create and save the reservation
                        $scope.savePhoneNumberReservation(selectedPhoneNumber)
                            .then(function () {
                                // Update the client's isPhoneNumberActive property to true
                                $scope.selectedClient.isPhoneNumberActive = true;
                                // Update the reservation status to true
                                $scope.selectedClient.phoneNumberReserved = true;
                            });
                    });
                })
                .catch(function (error) {
                    console.log('Error fetching phone numbers:', error);
                });
        };






        $scope.openUnreserveConfirmation = function (client) {
            $scope.modalInstance = $uibModal.open({
                templateUrl: '../app-angular/UnreserveConfirmationModal.html',
                controller: 'UnreserveConfirmationModalController',
                resolve: {
                    client: function () {
                        return client;
                    }
                }
            });

            $scope.modalInstance.result.then(function (confirmed) {
                if (confirmed) {
                    // Call the API to unreserve the phone number
                    $http.post('/api/PhoneNumberReservation/UnreservePhoneNumber', { clientId: client.Id })
                        .then(function (response) {
                            // Successfully unreserved the phone number
                            client.phoneNumberReserved = false; // Update the reservation status to false
                            client.EED = new Date();
                        })
                        .catch(function (error) {
                            // Handle error, if needed
                            console.log('Error unreserving phone number:', error);
                        });
                } else {
                    // User clicked "No" or dismissed the modal, do nothing
                }
            });
        };






    }])
    .controller('ClientModalController', ['$scope', '$uibModalInstance', 'client', '$filter', '$timeout', function ($scope, $uibModalInstance, client, $filter, $timeout) {
        $scope.client = angular.copy(client);

        if ($scope.client.BirthDate) {
            $scope.client.BirthDate = new Date($filter('date')($scope.client.BirthDate, 'yyyy-MM-dd'));
        }

        $scope.saveClient = function () {
            if ($scope.client.Type === 'Organization') {
                $scope.client.BirthDate = null; // Set BirthDate to null for Organization
            } else {
                // Adjust the BirthDate to handle the issue with day being off by one
                if ($scope.client.BirthDate) {
                    var currentDate = new Date();
                    var birthDate = new Date($scope.client.BirthDate);

                    // Calculate age difference
                    var age = currentDate.getFullYear() - birthDate.getFullYear();
                    var monthDiff = currentDate.getMonth() - birthDate.getMonth();

                    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
                        age--; // Adjust age if birthday hasn't occurred yet this year
                    }

                    if (age < 18) {
                        // Display an error message using timeout
                        $scope.errorMessage = "Age must be above 18 years.";
                        $timeout(function () {
                            $scope.errorMessage = '';
                        }, 3000); // Clear the message after 3 seconds
                        return;
                    }
                }
            }

            $uibModalInstance.close($scope.client);
        };

        $scope.cancelModal = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])

    .controller('ReservePhoneNumberModalController', ['$scope', '$http', '$uibModalInstance', 'client', 'phoneNumbers', 'ClientService', function ($scope, $http, $uibModalInstance, client, phoneNumbers, ClientService) {
        $scope.selectedClient = client;
        $scope.phoneNumbers = phoneNumbers;
        $scope.selectedPhoneNumber = null; // Initialize selectedPhoneNumber
        $scope.phoneNumberReserved = false; // Initialize the reservation status

        $scope.savePhoneNumberReservation = function (selectedPhoneNumber) {
            // Check if a phone number is selected
            if (!selectedPhoneNumber) {
                console.log('No phone number selected.');
                return;
            }

            var reservationData = {
                ClientId: $scope.selectedClient.Id,
                PhoneNumberId: selectedPhoneNumber.Id,
                BeginEffectiveDate: new Date().toISOString(),
                EndEffectiveDate: null
            };
            $http.post('/api/PhoneNumberReservation/SavePhoneNumberReservation', reservationData)
                .then(function (response) {
                    // Handle success, if needed
                    console.log('Phone number reserved successfully:', response.data);

                    // Update the client's reservation
                    $scope.selectedClient.Reservation = response.data;

                    // Check if the phone number is active and set the button text
                    $scope.selectedClient.isPhoneNumberActive = ClientService.isPhoneNumberActive($scope.selectedClient);

                    // Update the reservation status to true
                    $scope.selectedClient.phoneNumberReserved = true;
                    localStorage.setItem('phoneNumberReserved_' + $scope.selectedClient.Id, true);


                    // Close the modal
                    $uibModalInstance.close();
                })
                .catch(function (error) {
                    // Handle error, if needed
                    console.log('Error reserving phone number:', error);
                });
        };

        $scope.cancelModal = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])

    .controller('UnreserveConfirmationModalController', ['$scope', '$http', '$uibModalInstance', 'client', function ($scope, $http, $uibModalInstance, client) {
        $scope.unreservePhoneNumber = function () {
            $http.post('/api/PhoneNumberReservation/UnreservePhoneNumber', { clientId: client.Id })
                .then(function (response) {
                    // Successfully unreserved the phone number
                    client.phoneNumberReserved = false; // Update the reservation status to false
                    client.EED = new Date();

                    // Save the updated reservation status to localStorage
                    localStorage.setItem('phoneNumberReserved_' + client.Id, false);
                })
                .catch(function (error) {
                    // Handle error, if needed
                    console.log('Error unreserving phone number:', error);
                });

            $uibModalInstance.close(true); // Pass true to indicate user's confirmation
        };

        $scope.cancelModal = function () {
            $uibModalInstance.dismiss(false); // Pass false to indicate user's cancellation
        };
    }])



    .service('ClientService', ['$http', function ($http) {
        var service = {};

        service.isPhoneNumberActive = function (client) {
            if (client.Reservation && client.Reservation.EED) {
                var EED = new Date(client.Reservation.EED);
                var currentDate = new Date();

                // Check if the reservation is active based on the condition: x > BED && (x < EED || EED is null)
                return EED > currentDate && (!client.Reservation.EndEffectiveDate || currentDate < new Date(client.Reservation.EndEffectiveDate));
            }
            return false;
        };

        // Add other functions as needed

        return service;
    }]);

