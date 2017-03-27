(function() {
	angular
		.module('simpledropbox')
		.factory('AppService', service);

	service.$inject = ['$http'];

	function service($http) {
		
		const URI = '/upload';

		/**
        * Functions declarations on the top for better reading and understanding
        * */
        return {
        	upload: upload
        };

        function upload(data, callback) {
        	return $http({
        		method: 'POST',
        		url: URI,
        		data: data,
        		transformRequest: angular.identity,
        		headers: {'Content-Type': undefined}
        	}).then(function(response){
        		callback(null, response.data);
        	}, function(error){
        		callback(error.data);
        	});
        }
    }
})();
