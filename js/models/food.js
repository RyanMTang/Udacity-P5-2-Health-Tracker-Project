var app = app || {};

app.foodModel = Backbone.Model.extend ({
	defaults: {
		name: '',
		brand: '',
		calories: ''
	}
})