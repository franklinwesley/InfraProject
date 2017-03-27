(function() {
	angular
		.module('simpledropbox')
		.factory('UserService', service);

	service.$inject = ['$http'];

	function service($http) {
		
		const URI = '/user';

		/**
        * Functions declarations on the top for better reading and understanding
        * */
        return {
        	create: create
        };

        function create(data, callback) {
        	return $http({
        		method: 'POST',
        		url: URI,
        		data: data
        	}).then(function(response){
        		callback(null, response.data);
        	}, function(error){
        		callback(error.data);
        	});
        }
    }
})();
