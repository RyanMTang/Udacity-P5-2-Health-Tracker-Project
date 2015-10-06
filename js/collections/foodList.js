var app = app || {};

// Declares a variable for the food list collection.
var foodList = Backbone.Collection.extend ({
	model: app.foodModel,

	// Save food list items under the 'foods-backbone' namespace.
	localStorage: new Backbone.LocalStorage('foods-backbone'),
});

// Create global collection of foods. 
app.foods = new foodList(); 