/*global l2proxy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebase service
 * - exposes the model to the template and provides event handlers
 */
l2proxy.controller('KeyCtrl', function KeyCtrl($scope, $location, $firebase) {
	var url = 'https://l2proxy.firebaseio.com/';
	var fireRef = new Firebase(url);
	var keysRef = fireRef.child('keys');

	$scope.$watch('keys', function () {
		var total = 0;
		$scope.keys.$getIndex().forEach(function (index) {
			var key = $scope.keys[index];

			if (!key || !key.xorKey) {
				return;
			}

			total++;
		});

		$scope.totalCount = total;
	}, true);

	/**
	 * [addKey description]
	 */
	$scope.addKey = function () {
		var gameKey = $scope.gameKey.trim(),
			xorKey = $scope.xorKey.trim();

		if (!gameKey.length || !xorKey.length) {
			return;
		}

		keysRef.child(gameKey).set({
			xorKey: xorKey,
			date: new Date().getTime()
		});

		$scope.gameKey = '';
		$scope.xorKey = '';
	};

	/**
	 * [removeKey description]
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	$scope.removeKey = function (id) {
		$scope.keys.$remove(id);
	};

	if ($location.path() === '') {
		$location.path('/');
	}
	$scope.location = $location;

	// Bind the keys to the firebase provider.
	$scope.keys = $firebase(keysRef);
	$scope.today = new Date().getTime();
});
