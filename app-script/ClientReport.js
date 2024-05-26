angular.module('ClientReport', ['appDirectives'])
    .controller('ReportPageController', ['$scope', '$http', function ($scope, $http) {
        $scope.clients = []; // Initialize the array to store the client data
        $scope.selectedType = ''; // Initialize the selected type to empty string

        // Function to fetch client count per type from the API
        $scope.getClientsCountByType = function (typeFilter) {
            $http.get('/api/Client/GetClientsCountByType', { params: { TypeFilter: typeFilter } })
                .then(function (response) {
                    $scope.clients = response.data;
                })
                .catch(function (error) {
                    console.error('Error fetching client count by type:', error);
                });
        };

        // Function to apply the filter and fetch filtered data
        $scope.search = function () {
            // Call the API to get filtered data based on the selected type
            $scope.getClientsCountByType($scope.selectedType);
        };

        // Initial data load when the page loads
        $scope.getClientsCountByType(); // Fetch all clients data initially
    }]);
