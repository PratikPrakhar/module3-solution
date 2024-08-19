(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var narrowCtrl = this;
    narrowCtrl.searchTerm = "";
    narrowCtrl.found = [];
    narrowCtrl.loading = false;  // Track loading state

    narrowCtrl.getMatchedMenuItems = function () {
      if (narrowCtrl.searchTerm === "") {
        narrowCtrl.found = [];
        return;
      }

      narrowCtrl.loading = true;  // Show loader
      MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
        .then(function (foundItems) {
          narrowCtrl.found = foundItems;
        })
        .catch(function (error) {
          console.error('Error:', error);
        })
        .finally(function() {
          narrowCtrl.loading = false;  // Hide loader
        });
    };

    narrowCtrl.removeItem = function (index) {
      narrowCtrl.found.splice(index, 1);
    };
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;
  
    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
      }).then(function (result) {
        var allItems = [];
        
        // Loop through each category (A, B, C, etc.)
        for (var category in result.data) {
          if (result.data.hasOwnProperty(category)) {
            // Concatenate all menu_items into allItems array
            allItems = allItems.concat(result.data[category].menu_items);
          }
        }
    
        // Filter the items based on the search term
        var foundItems = allItems.filter(function (item) {
          return item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
        });
    
        console.log("Filtered items:", foundItems);  // Log the filtered items
    
        return foundItems;
      }).catch(function (error) {
        console.error('Error:', error);
        return [];
      });
    };
  }
  

  function FoundItemsDirective() {
    return {
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'foundItemsCtrl',
      bindToController: true
    };
  }

  function FoundItemsDirectiveController() {
    var foundItemsCtrl = this;
  }

})();
