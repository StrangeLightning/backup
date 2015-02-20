'use strict';

angular.module('thesisApp')
  .controller('CatalogCtrl', ['$scope', 'cartFactory', 'catalogFactory', '$http', '$location', function($scope, cartFactory, catalogFactory, $http, $location) {
    $scope.addToCart = function(product) {
      if (cartFactory.amazonCart.items) {
        cartFactory.amazonAddProduct(product, cartFactory.amazonCart)
      } else {
        cartFactory.amazonCreateCart(product);
      }
    };

    $scope.amazonCart = cartFactory.amazonCart;
    $scope.getCartItems = function() {
      $location.path("/cart");
    };

    $scope.viewItem = function(product) {
      catalogFactory.product = product;
      catalogFactory.viewItem(product);
    };

    $scope.getImage = function(product) {
      var img = "https://s3-eu-west-1.amazonaws.com/petrus-blog/placeholder.png";
      if (product.mediumImage) {
        img = product.mediumImage;
      }

      return img;
    };

    //initially, if products empty, then call search to show items
    if (!$scope.products) {
      catalogFactory.doSearch('shoes', function(newProducts) {
        $scope.products = $scope.products || newProducts;
        $('#ajax-loader').hide();
      });
    }

    //listen for products-updated event, which is broadcasted from navbar.controller.js
    $scope.$on('products-updated', function(event, args) {
      $scope.products = args.newProducts;
    })
  }])

.factory('catalogFactory', ['$location', '$http', function($location, $http) {
  var catalog = {};
  catalog.viewItem = function() {
    $location.path('/product');
  };

  catalog.doSearch = function(searchTerm, callback) {
    return $http.post('/api/amazonproducts/', {
        term: searchTerm
      })
      .success(function(results) {
        callback(results.data);
      })
      .error(function(err) {
        console.log(err);
      });
  };

  return catalog;
}]);
