(function() {
	angular
		.module('simpledropbox')
		.factory('AppService', service);

	service.$inject = ['$http', '$window'];

	function service($http, $window) {
		
		const URI = '/upload/';

		/**
        * Functions declarations on the top for better reading and understanding
        * */
        return {
        	upload: upload,
            remove: remove,
            getFiles: getFiles,
            getFile: getFile
        };

        function getFiles(user, callback) {
            return $http({
                method: 'GET',
                url: URI + user,
                headers: {'Content-Type': 'application/json;charset=utf-8'}
            }).then(function(response){
                callback(null, response.data);
            }, function(error){
                callback(error.data);
            });
        }

        function getFile(user, file, callback) {
            return $http({
                method: 'GET',
                url: URI + user + '/' + file,
                headers: {'Content-Type': 'application/json;charset=utf-8'}
            }).then(function(response){
                var blob = new Blob([response.data], { type: 'text/plain' });
                var url = $window.URL || $window.webkitURL;
                var fileUrl = url.createObjectURL(blob);
                var element = angular.element('<a/>');
                element.attr({
                    href: fileUrl,
                    download: file
                })[0].click();
                callback(null, response.data);
            }, function(error){
                callback(error.data);
            });
        }

        function upload(user, data, callback) {
        	return $http({
        		method: 'POST',
        		url: URI + user,
        		data: data,
        		transformRequest: angular.identity,
        		headers: {'Content-Type': undefined}
        	}).then(function(response){
        		callback(null, response.data);
        	}, function(error){
        		callback(error.data);
        	});
        }

        function remove(user, data, callback) {
            console.log(data);
            return $http({
                method: 'DELETE',
                url: URI + user,
                data: data,
                headers: {'Content-Type': 'application/json;charset=utf-8'}
            }).then(function(response){
                callback(null, response.data);
            }, function(error){
                callback(error.data);
            });
        }
    }
})();
