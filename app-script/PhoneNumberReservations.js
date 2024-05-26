angular.module('PhoneNumberReservations', ['appDirectives', 'ui.bootstrap'])
    .controller('PhoneNumberReservationController', ['$scope', '$http', function ($scope, $http) {
        $scope.clientFilter = '';
        $scope.phoneNumberFilter = '';
        $scope.reservations = [];
        $scope.filteredReservations = [];

        // Function to retrieve all phone number reservations
        function getAllPhoneNumberReservations() {
            console.log('Fetching phone number reservations...');
            $http.get('/api/PhoneNumberReservation/GetPhoneNumberReservations')
                .then(function (response) {
                    console.log('Received phone number reservations:', response.data);
                    $scope.reservations = response.data;
                    $scope.filteredReservations = $scope.reservations;
                })
                .catch(function (error) {
                    console.log('Error:', error);
                });
        }

        // Function to retrieve all clients
  

        // Function to filter phone number reservations based on filters
        function searchReservations() {
            var clientFilter = $scope.selectedClient ? $scope.selectedClient.Name : '';
            var phoneNumberFilter = $scope.selectedPhoneNumber ? $scope.selectedPhoneNumber.Number : '';

            $http.get('/api/PhoneNumberReservation/GetFilteredPhoneNumberReservations', {
                params: {
                    clientFilter: clientFilter,
                    phoneNumberFilter: phoneNumberFilter
                }
            })
                .then(function (response) {
                    $scope.filteredReservations = response.data;
                })
                .catch(function (error) {
                    console.log('Error filtering phone number reservations:', error);
                });
        }

        // Initialize data
        getAllPhoneNumberReservations();
       

        // Function to trigger the search on button click
        $scope.performSearch = function () {
            searchReservations();
        };

    }]);
