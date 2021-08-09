/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.List.
sap.ui.define([
	"sap/ui/model/type/Unit",
	"sap/ui/core/format/NumberFormat"
], function(UnitType, NumberFormat) {
	"use strict";
	var CustomUnitType = UnitType.extend("pintogeloApppintogeloApp.custom.formatter.Currency", {
		constructor: function(oFormatOptions, oConstraints){
			// define the dynamic format options as the third argument
			// ‘aDynamicFormatOptionNames’
			UnitType.apply(this, [oFormatOptions, oConstraints, ["decimals"]]);
		}
	});
	return CustomUnitType;

});