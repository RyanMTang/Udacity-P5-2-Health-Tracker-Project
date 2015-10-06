var app = app || {};

app.AppView = Backbone.View.extend ({

	// Bind to the existing healthTrackerApp Id.
	el: '#healthTrackerApp',

	counterTemplate: _.template( $('#counterTemplate').html()),

	events: {
		'click #searchButton': 'getJson',
		'click #clearResults': 'clearResults',
		'click #clearSelected': 'clearSelected'
	},

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

	addToResults: function(item) {
		var searchResult = new app.foodView({
			model: item
		});
		$('#searchResults').append( searchResult.render().el );
	},

	addToSelected: function(item) {
		var selectedItem = new app.selectedView({
			model: item
		});
		$('#selectedResults').append( selectedItem.render().el );
	},

	addAll: function() {
		this.$('#selectedResults').html('');
		app.selectedFoods.each(this.addToSelected, this);
	},

	getJson: function() {
	
		var searchTerm = $('#searchBar').val()
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

	clearResults: function() {
      _.invoke(app.foods.toArray(), 'destroy');
      this.$searchBar.val('');
      return false;
    },

    clearSelected: function() {
      _.invoke(app.selectedFoods.toArray(), 'destroy');
      return false;
    }
});

new app.AppView;
