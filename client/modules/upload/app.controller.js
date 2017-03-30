(function() {
	angular
	.module('simpledropbox')
	.controller('AppController', controller);

	controller.$inject = ['$rootScope', '$scope', '$timeout', 'FileUploader', 'AppService'];

	function controller ($rootScope, $scope, $timeout, FileUploader, AppService) {

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

                data.forEach(function (file) {
                    $scope.files.push({file: file});
                });
            });
        };

		$scope.upload = function (file) {
			var data = new FormData();
			data.append('file', file._file);
			AppService.upload(data, function (error, data) {
				if(error) {
					$scope.fileError = error.code;
					file.isSuccess = false;
					file.isError = true;
					return;
				}

				file.isSuccess = true;
				file.isError = false;
			});
		};

		$scope.remove = function (file) {
			if (file.isSuccess) {
                AppService.remove({fileName: file._file.name}, function (error, data) {
                    if(error) {
                        $scope.fileError = error.code;
                        return;
                    }

                    if ($scope.files.indexOf(file)) {
                        $scope.files.splice($scope.files.indexOf(file), 1);
                    } else {
                        file.remove();
                    }
                });
			} else {
				file.remove();
			}
		};

        $scope.uploadAll = function () {
            var data = new FormData();
            for (var i = 0; i < $scope.uploader.queue.length; i++) {
                data.append('file', $scope.uploader.queue[i]._file);
            }

            AppService.upload(data, function (error, data) {
                if(error) {
                    $scope.fileError = error.code;
                    return;
                }

                uploader.clearQueue();
                $scope.files = data;
            });
        };

		$scope.removeAll = function () {
            AppService.remove({}, function (error, data) {
                if(error) {
                    $scope.fileError = error.code;
                    return;
                }

                uploader.clearQueue();
                $scope.files = [];
            });
        };
	}
})();
