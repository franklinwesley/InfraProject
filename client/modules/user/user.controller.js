(function() {
	angular
	.module('simpledropbox')
	.controller('UserController', controller)

	controller.$inject = ['$scope', '$state', 'UserService'];

	function controller ($scope, $state, UserService) {
		$scope.create = function (user) {
			console.log(user);
			UserService.create(user, function (err, result) {
				if (err) {
					return $scope.error = err.message;
				}

				$state.go('login');
			});
		}
	}
})();
