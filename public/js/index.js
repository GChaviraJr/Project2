// Get references to page elements
var $userCityInput = $("#cityInput");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#searchBtn");
var $restaurantList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  searchRestaurants: function(cityInput) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/restaurants",
      data: JSON.stringify(cityInput)
    });
  },
  getRestaurants: function() {
    return $.ajax({
      url: "api/restaurants",
      type: "GET"
    });
  },
  deleteRestaurants: function(id) {
    return $.ajax({
      url: "api/examples/",
      type: "DELETE"
    });
  }
};

var deleteRestaurantsInCurrentDatabase = function() {
  API.deleteRestaurants().then(function() {
    console.log("DELETE!");;
  });
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshRestaurants = function() {
  API.getRestaurants().then(function(data) {
    var $restaurants = data.map(function(restaurant) {
      var $a = $("<a>")
        .text(restaurant.name)
        .append(" " + restaurant.address)
        .attr("href", restaurant.URL);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": restaurant.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("Select");

      $li.append($button);

      return $li;
    });

    $restaurantList.empty();
    $restaurantList.append($restaurants);
  });
};

// handleUserInput
//  is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleUserInput = function(event) {
  event.preventDefault();
  deleteRestaurantsInCurrentDatabase();
  var cityInput = {
    text: $userCityInput.val().trim()
  };

  if (!cityInput.text) {
    alert("You must enter an example text and description!");
    return;
  }

  API.searchRestaurants(cityInput).then(function() {
    refreshRestaurants();
  });

  $userCityInput.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteRestaurants(idToDelete).then(function() {
    refreshRestaurants();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleUserInput);
$restaurantList.on("click", ".delete", handleDeleteBtnClick);