(function() {
	angular
	.module('simpledropbox')
	.controller('LoginController', controller)

	controller.$inject = ['$scope', '$state', 'LoginService'];

	function controller ($scope, $state, LoginService) {
		$scope.login = function (user) {
			LoginService.login(user, function (err, result) {
				if (err) {
					return $scope.error = err.message;
				}

				$state.go('home');
			});
		}
	}
})();
