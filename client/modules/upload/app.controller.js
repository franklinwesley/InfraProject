(function() {
	angular
	.module('simpledropbox')
	.controller('AppController', controller);

	controller.$inject = ['$rootScope', '$scope', '$timeout', 'FileUploader', 'AppService', 'FileSaver'];

	function controller ($rootScope, $scope, $timeout, FileUploader, AppService, FileSaver) {

		$scope.uploader = new FileUploader();
		$scope.files = [];

		// CALLBACKS
		$scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
			$scope.fileError = true;
			$timeout(function () { $scope.fileError = false; }, 1500);
		};

		$scope.uploader.onAfterAddingAll = function(addedFileItems) {
			if ($scope.uploader.getNotUploadedItems().length > 1) {
				$scope.uploader.removeFromQueue(0);
			}
		};

        $scope.getFiles = function () {
            AppService.getFiles($rootScope.user, function (error, data) {
                if(error) {
                    $scope.fileError = error.code;
                    return;
                }

                data.forEach(function (element) {
                    var file = {file: element};
                    file.isSuccess = true;
                    $scope.files.push(file);
                });
            });
        };

        $scope.getFile = function (file) {
        	var start = moment();
            var fileName = file._file ? file._file.name : file.file.name;
            AppService.getFile($rootScope.user, fileName, function (error, data) {
                if(error) {
                    $scope.fileError = error.code;
                }

                var fileBlob = new Blob([data], { type: 'text/plain;charset=utf-8' });
                console.log('timer', moment().diff(start));
                FileSaver.saveAs(fileBlob, fileName);
            });
        };

		$scope.upload = function (file) {
            var start = moment();
			var data = new FormData();
			data.append('file', file._file);
			AppService.upload($rootScope.user, data, function (error, data) {
				if(error) {
					$scope.fileError = error.code;
					file.isSuccess = false;
					file.isError = true;
					return;
				}

				file.isSuccess = true;
				file.isError = false;
                console.log('timer', moment().diff(start));
			});
		};

		$scope.remove = function (file) {
			if (file.isSuccess) {
			    var fileName = { fileName: file._file ? file._file.name : file.file.name};
                AppService.remove($rootScope.user, fileName, function (error, data) {
                    if(error) {
                        $scope.fileError = error.code;
                        return;
                    }

                    if ($scope.uploader.queue.indexOf(file) >= 0) {
                        file.remove();
                    } else {
                        $scope.files.splice($scope.files.indexOf(file), 1);
                    }
                });
			} else {
				file.remove();
			}
		};
	}
})();
