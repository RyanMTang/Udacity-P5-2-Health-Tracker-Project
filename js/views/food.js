var app = app || {};

app.foodView = Backbone.View.extend ({

	// Each food item is a table row.
	tagName: 'tr',

	// Cache the template function for a single food item.
	template: _.template( $('#foodTemplate').html()),

	// Events specific to an individual food item.
	events: {
		'click .add': 'addToSelected'
	},

	initialize: function () {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render: function () {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

	addToSelected: function() {
		var newItem = new app.foodModel({
			name: this.model.get('name'),
			brand: this.model.get('brand'),
			calories: this.model.get('calories'),
		});
		app.selectedFoods.create(newItem);
	}

});