var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function ($scope, $http) {
	var favorite = false;
	$scope.favorite = favorite;
	$scope.sortType = 'name';
	$scope.sortReverse = false;
	$scope.searchContact = '';

	$scope.group = '';

	$scope.groups = ['Friend', 'Family', 'Co-worker'];

	var refresh = function () {
		favorite = false;
		$scope.favorite = favorite;
		$http.get('/contactlist').success(function (response) {
			console.log('I got the data I requested');
			$scope.contactlist = response;
			$scope.contact = "";
		});
	};

	refresh();

	$scope.convertToClassName = function (status) {
	  return status;
	};

	$scope.toggleFavorite = function (id){
		console.log("this is toggled");
		console.log($scope.contact._id);
		if (id == undefined) {
			console.log(favorite);
			favorite = !favorite;
			$scope.favorite = favorite;
			console.log($scope.favorite);
		}
	}

	$scope.addContact = function (){
		$scope.contact["favorite"] = favorite;
		console.log($scope.contact);
		$http.post('/contactlist', $scope.contact).success(function(response) {
			console.log('SUCCESSFULLY ADDED:');
			console.log(response);	
			refresh();
		});
		favorite = false;
		$scope.favorite = favorite;
	};

	$scope.remove = function (id){
		console.log(id);
		$http.delete('/contactlist/' + id).success(function(response) {
			refresh();
		});
	};

	$scope.edit = function(id) {
		console.log(id);
		$http.get('/contactlist/' + id).success(function(response) {
			$scope.contact = response;
			$scope.favorite = $scope.contact.favorite;
			$scope.group = $scope.contact.group;
		})
	}

	$scope.update = function(id) {
		console.log($scope.contact._id);
		$scope.contact.favorite = $scope.favorite;
		$http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response) {
			refresh();
		});
	}

	$scope.deselect = function() {
		$scope.contact = "";
	}

	$scope.sortGroup = function(group) {
		$http.get('/contactlist/sortBy/' + group).success(function (response) {
			console.log('I got the data I requested SORTED BY GROUP');
			$scope.contactlist = response;
		});
	}
}]);