var app = app || {};

app.AppView = Backbone.View.extend ({

	// Bind to the existing healthTrackerApp Id.
	el: '#healthTrackerApp',

	// Template for the number of items selected and total calories.
	counterTemplate: _.template( $('#counterTemplate').html()),


	events: {
		'click #searchButton': 'getJson', // Gets nutriotionix data when search button is clicked.
		'click #clearResults': 'clearResults', // Clears all search results from local storage.
		'click #clearSelected': 'clearSelected', // Clears selected items from local storage.
		'keyup #searchBar': 'processKey' // Allows user to use enter key instead of just search button click.
	},
 
 	// Sets up event listeners in order to update views when items are added to collections.
	initialize: function (){
		this.$counter = $('#counter');
		this.$searchBar = $('#searchBar');
		this.listenTo(app.foods, 'add', this.addToResults);	
		this.listenTo(app.selectedFoods, 'add', this.addToSelected);
		this.listenTo(app.selectedFoods, 'reset', this.addAll);
		this.listenTo(app.selectedFoods, 'all', this.render);	

		app.selectedFoods.fetch();
		app.foods.fetch();
	},

	// Renders the counter at the bottom of the selected items collection.
	render: function () {
		var selected = app.selectedFoods.length;
		var totalCalories = 0;
		app.selectedFoods.each(function(model){
			var calories = model.get('calories');
			totalCalories += calories;
		})

		if (app.selectedFoods.length) {
			this.$counter.show();

			this.$counter.html(this.counterTemplate ({
				selected: selected,
				totalCalories: totalCalories
			}));
		} else {
			this.$counter.hide();
		}
	},

	// Adds food views and appends them to the page.
	addToResults: function(item) {
		var searchResult = new app.foodView({
			model: item
		});
		$('#searchResults').append( searchResult.render().el );
	},

	// Adds views for selected foods and appends them to the selected results section.
	addToSelected: function(item) {
		var selectedItem = new app.selectedView({
			model: item
		});
		$('#selectedResults').append( selectedItem.render().el );
	},

	// Renders selected foods that are stored in local storage.
	addAll: function() {
		this.$('#selectedResults').html('');
		app.selectedFoods.each(this.addToSelected, this);
	},

	// Fetches food data using Nutritionix API
	getJson: function() {
		$('#searchResults').empty();
		var searchTerm = $('#searchBar').val();
		$('#searchBar').val('');
		var nutritionixUrl = 'https://api.nutritionix.com/v1_1/search/' + searchTerm + '?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat&appId=79638cff&appKey=a7129008b91c0ae9412ae2316564d518'
		$.ajax({
			method: 'GET',
			url: nutritionixUrl,
			dataType: 'json',
			success: function(data) {
				var jsonArray = data.hits;
				for (var i = 0; i < jsonArray.length; i++) {
					var resultItem = new app.foodModel({
						name: jsonArray[i].fields.item_name,
						brand: jsonArray[i].fields.brand_name,
						calories: jsonArray[i].fields.nf_calories,
					});
					app.foods.create(resultItem);
				} // End of for loop

			},
			error: function() {
				$('#searchResults').append('<p>Couldn\'t get Nutritionix data. Check your internet connection or try again later.</p>');
			}
		});
	},

	// Destroys models in foods collection.
	clearResults: function() {
      _.invoke(app.foods.toArray(), 'destroy');
      this.$searchBar.val('');
      return false;
    },

    // Destroys models in selected foods collection.
    clearSelected: function() {
      _.invoke(app.selectedFoods.toArray(), 'destroy');
      return false;
    },

    // Allows user to press enter button as well as clicking the search button.
    processKey: function(e) {
    	if(e.which === 13)
    		this.$('#searchButton').click();
    }
});

new app.AppView;
