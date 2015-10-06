var app = app || {};

app.selectedView = Backbone.View.extend ({

	// Each food item is a table row.
	tagName: 'tr',

	// Cache the template function for a single food item.
	template: _.template( $('#selectedTemplate').html()),

	// Events specific to an individual food item.
	events: {
		'click .destroy': 'removeItem'
	},

	// Updates the view when a model is changed or destroyed.
	initialize: function () {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove)
	},

	// Renders the view.
	render: function () {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

	// Destroys the model when the remove button is clicked.
	removeItem: function(model) {
		this.model.destroy();
	}

});