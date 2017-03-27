(function() {
	angular
	.module('simpledropbox')
	.controller('AppController', controller)

	controller.$inject = ['$scope', 'FileUploader', 'AppService'];

	function controller ($scope, FileUploader, AppService) {

		var plant_picture;

		$scope.uploader = new FileUploader();

		// CALLBACKS
		$scope.uploader.onAfterAddingFile = function(fileItem) {
			$scope.fileError = false;
			plant_picture = fileItem._file;
		};

		$scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
			$scope.fileError = true;
			$timeout(function () { $scope.fileError = false; }, 1500);
		};

		$scope.uploader.onAfterAddingAll = function(addedFileItems) {
			if ($scope.uploader.getNotUploadedItems().length > 1) {
				$scope.uploader.removeFromQueue(0);
			}
		};

		$scope.upload = function () {
			var data = new FormData();
			data.append('file', plant_picture);
			AppService.upload(data, function (error, data) {
				if(error) {
					$scope.fileError = error.code;
					return;
				}

				$scope.success = true;
			});
		}
	}
})();
