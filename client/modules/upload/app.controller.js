(function() {
	angular
	.module('simpledropbox')
	.controller('AppController', controller)

	controller.$inject = ['$scope', '$timeout', 'FileUploader', 'AppService'];

	function controller ($scope, $timeout, FileUploader, AppService) {

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
		}

		$scope.remove = function (file) {
			if (file.isSuccess) {
				AppService.remove({fileName: file._file.name}, function (error, data) {
					if(error) {
						$scope.fileError = error.code;
						return;
					}


				});
			} else {
				file.remove();
			}
		}
	}
})();
