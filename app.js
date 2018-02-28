(function() {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      itemsx: '<',
      onRemove: '&'
    },

  };

  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
	var nar = this;

	nar.searchItem = "";

	nar.doSearch = function (){

		nar.items = MenuSearchService.getMatchedMenuItems(nar.searchItem);

	 };

  	nar.removeItem = function (itemIndex) { 
    	MenuSearchService.removeItem(nar.items, itemIndex);
  	};

}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath){
	var service = this;

	service.getMatchedMenuItems = function(searchItem){

		var promise = $http({
      		method: "GET",
      		url: (ApiBasePath + "/menu_items.json")
    	});
		
		var found = [];
    	promise.then(function (response) {
			
			for (var i = 0; i < response.data.menu_items.length; i++) {
	      		var name = response.data.menu_items[i].name;
	      		if (name.toLowerCase().indexOf(searchItem) !== -1) {
	        		//add to found
	        		found.push(response.data.menu_items[i]);
	      		}
	    	}

		})
	  	.catch(function (error) {
	    	console.log("Something went terribly wrong.");
	  	});

	  	return found;
  	};

  	service.removeItem = function (items, itemIndex) {
    items.splice(itemIndex, 1);
  };

}



})();