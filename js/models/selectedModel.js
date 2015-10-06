var app = app || {};

app.selectedModel = Backbone.Model.extend ({
	defaults: {
		name: '',
		brand: '',
		calories: 0
	}
})