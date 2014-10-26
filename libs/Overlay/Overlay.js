var Backbone = require('backbone'),
	_          = require('underscore'),
	$          = require('jquery');
	Backbone.$ = $;
	Backbone.Marionette = require('backbone.marionette');
module.exports = Backbone.Marionette.Region.extend({

	ui: {
		closeButton : 'a.close'
	},

	/**
	 * Standard initializer.
	 */
	 initialize: function() {
		this._overlayBg = $('#overlay_background');
	},

	/**
	 * Overrides the Region.show method
	 */
	 show: function() {
		this._overlayBg.toggleClass('show-bg');
		this.$el.addClass('show');

		Backbone.Marionette.Region.prototype.show.apply(this, arguments);

		if (this.$el.find(this.ui.closeButton).length) {
			this.$el.find(this.ui.closeButton).on('click', _.bind(this.onCloseButtonClick, this));
		}
		$(window).on('keypress', _.bind(this.onEscKeyPress, this));
	 },

	/**
	 * Handles a click event on a close button.
	 * @param {Object} ev   JQuery.Event object
	 */
	 onCloseButtonClick: function(ev) {
		ev.preventDefault();
		this.reset();
	 },

	/**
	 * Handles a keypress event on a close button.
	 * @param {Object} ev   JQuery.Event object
	 */
	onEscKeyPress: function(ev) {
		if (ev.keyCode === 27) {
			this.reset();
		}
	 },

	/**
	 * Overrides Region.reset method.
	 */
	 reset: function() {
		if (!_.isUndefined(this.$el)) { // Do not throw error when reset called multiple times
			this._overlayBg.toggleClass('show-bg');
			this.$el.removeClass('show');
			if (this.$el.find(this.ui.closeButton).length) {
				this.$el.find(this.ui.closeButton).off('click', _.bind(this.onCloseButtonClick, this));
			}
		}
		$(window).off('keypress', _.bind(this.onEscKeyPress, this));
		Backbone.Marionette.Region.prototype.reset.apply(this, arguments);
	 }
});