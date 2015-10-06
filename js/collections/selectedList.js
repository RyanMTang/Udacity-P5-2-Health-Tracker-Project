var app = app || {};

var selectedList = Backbone.Collection.extend ({
	model: app.foodModel,

	// Save food list items under the 'selectedFoods-backbone' namespace.
	localStorage: new Backbone.LocalStorage('selectedFoods-backbone'),
});

// Create global collection of foods. 
app.selectedFoods = new selectedList(); 