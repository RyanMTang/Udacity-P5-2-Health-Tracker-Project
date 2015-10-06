var app = app || {};

// Model for food items.
app.foodModel = Backbone.Model.extend ({
	defaults: {
		name: '',
		brand: '',
		calories: ''
	}
})