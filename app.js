(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItems);

function FoundItems() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope:{
      list : '=found',
      onRemove: '&'
    }
  };

  return ddo;
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService){
  var menu = this;
  var itemToSearch = "";
  var items = [];

  menu.loadItems = function(){
    console.log("load items "+menu.itemToSearch);

    var promise = MenuSearchService.getMatchedMenuItems(menu.itemToSearch);
    promise.then(function (response){
      console.log(response);
      menu.items = response.data;
    });
  }

  menu.removeItem = function(itemIndex){
    console.log("remove "+itemIndex);
    menu.items.splice(itemIndex, 1);
  }
}

MenuSearchService.$inject = ['$http','ApiBasePath']
function MenuSearchService($http,ApiBasePath){
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {

    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    });

    response.then(
        function(resp){
          var items = [];
          for(var i = 0; i< resp.data.menu_items.length;i++){
                var obj = resp.data.menu_items[i];
                if(obj.name.toLowerCase().indexOf(searchTerm) != -1){
                  //console.log(obj);
                  items.push(obj);
                }
              }

          resp.data = items;
          return resp;
        }
    ).catch(function (error){
      console.log("Something went terribly wrong.");
    });

    return response;
  };

}


})();
