(function() {
	angular
	.module('simpledropbox')
	.controller('LoginController', controller);

	controller.$inject = ['$rootScope', '$scope', '$state', 'LoginService'];

	function controller ($rootScope, $scope, $state, LoginService) {
		$scope.login = function (user) {
			LoginService.login(user, function (err, result) {
				if (err) {
					return $scope.error = err.message;
				}

                $rootScope.user = user.username;
				$state.go('home');
			});
		}
	}
})();
