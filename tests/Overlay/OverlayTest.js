var assert = require('chai').assert,
	Backbone = require('backbone'),
	sinon    = require('sinon'),
	$        = require('jquery');
	Backbone.$ = $;
	Backbone.Marionette = require('backbone.marionette');
var Overlay = require('../../libs/Overlay/Overlay');

suite('Oerlay test', function() {
	setup(function() {
		this.testView = new Backbone.Marionette.ItemView({
			template: '#overlay_content_template'
		});
		this.testView2 = new Backbone.Marionette.ItemView({
			template: '#overlay_content_template'
		});
		this.Overlay  = new Overlay({el: "#overlay_container"});
			onCloseButtonClick : sinon.spy(this.Overlay, 'onCloseButtonClick'),
			reset              : sinon.spy(this.Overlay, 'reset'),
			unbind             : sinon.spy(this.Overlay, 'unbind'),
			onEscKeyPress      : sinon.spy(this.Overlay, 'onEscKeyPress')
		};
		this.ViewSpy = {
			unbind  : sinon.spy(this.testView, 'unbind'),
			unbind2 : sinon.spy(this.testView2, 'unbind')
		}
	});

	test('add a new View to overlay', function() {
		this.Overlay.show(this.testView);
		assert.isTrue(this.Overlay.hasView());
		assert.lengthOf($('#overlay_container').find('#overlay_content'), 1);
	});

	test('is content visible - show class added', function() {
		this.Overlay.show(this.testView);
		assert.isTrue($('#overlay_container').hasClass('show'));
	});

	test('is overlay background visible', function() {
		this.Overlay.show(this.testView);
		assert.isTrue($('#overlay_background').hasClass('show-bg'));
	});

	test('is element is hidden again after close', function() {
		this.Overlay.show(this.testView);
		this.Overlay.reset();
		assert.isFalse($('#overlay_container').hasClass('show'));
	});

	test('is overlay background is hidden again after close', function() {
		this.Overlay.show(this.testView);
		this.Overlay.reset();
		assert.isFalse($('#overlay_background').hasClass('show-bg'));
	});

	test('bind close buttons', function() {
		this.Overlay.show(this.testView);
		$("#overlay_content").find("a.close").click();
		assert.isTrue(this.OverlaySpy.onCloseButtonClick.calledOnce);
		$("#overlay_content").find("a.close").click();
		// It shoud be false, because after the click the Region should be reset and unbinded.
		assert.isFalse(this.OverlaySpy.onCloseButtonClick.calledTwice);
	});

	test('click on close button closes the overlay', function() {
		this.Overlay.show(this.testView);
		$("#overlay_content").find("a.close").click();
		assert.isFalse($('#overlay_container').hasClass('show'));
		assert.isFalse(this.Overlay.hasView());
	});

	//test('call show with a new view the previous one will be closed and unbind will be called', function() {
	//	this.Overlay.show(this.testView);
	//	this.Overlay.show(this.testView2);
	//	assert.isTrue(this.ViewSpy.unbind.calledOnce);
	//});

	test('overlay is listening to the window keypress events', function() {
		this.Overlay.show(this.testView);
		var e = $.Event("keypress");
		//e.keyCode = 27; // esc
		$(window).trigger(e);
		assert.isTrue(this.OverlaySpy.onEscKeyPress.calledOnce);
	});

	test('overlay does not call reset in onEscKeyPress method when not esc key was pressed', function() {
		this.Overlay.show(this.testView);
		var e = $.Event("keypress");
		e.keyCode = 28; // not esc
		$(window).trigger(e);
		assert.isTrue(this.OverlaySpy.onEscKeyPress.calledOnce);
		e.keyCode = 18; // not esc
		$(window).trigger(e);
		assert.isTrue(this.OverlaySpy.onEscKeyPress.calledTwice);
		assert.isTrue(this.Overlay.hasView());
	});

	test('overlay calls reset in onEscKeyPress method only when esc key was pressed', function() {
		this.Overlay.show(this.testView);
		var e = $.Event("keypress");
		e.keyCode = 27; // esc
		$(window).trigger(e);
		assert.isTrue(this.OverlaySpy.onEscKeyPress.calledOnce);
		assert.isFalse(this.Overlay.hasView());
	});
});