(function() {
	angular
		.module('simpledropbox')
		.factory('LoginService', service);

	service.$inject = ['$http'];

	function service($http) {
		
		const URI = '/signin';

		/**
        * Functions declarations on the top for better reading and understanding
        * */
        return {
        	login: login
        };

        function login(data, callback) {
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
