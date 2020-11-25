/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"ovly/T55/fiori50/plantas/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});