/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.List.
sap.ui.define([
	"sap/m/List",
	"sap/m/ListRenderer",
	"pintogeloApppintogeloApp/libs/jquery.ui.touch-punch"
], function(List, ListRenderer, jQueryTouchPunch) {
	"use strict";

	/**
	 * Constructor for a new List.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The List control provides a container for all types of list items.
	 * For mobile devices, the recommended limit of list items is 100 to assure proper performance. To improve initial rendering of large lists, use the "growing" feature. Please refer to the SAPUI5 Developer Guide for more information..
	 *
	 * See section "{@link topic:1da158152f644ba1ad408a3e982fd3df Lists}"
	 * in the documentation for an introduction to <code>sap.m.List</code> control.
	 *
	 * @extends sap.m.ListBase
	 *
	 * @author SAP SE
	 * @version 1.52.11
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.List
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CustomList = List.extend("pintogeloApppintogeloApp.custom.controls.List", /** @lends sap.m.List.prototype */ {
		metadata: {

			library: "sap.m",
			properties: {

				/**
				 * Sets the background style of the list. Depending on the theme, you can change the state of the background from <code>Solid</code> to <code>Translucent</code> or to <code>Transparent</code>.
				 * @since 1.14
				 */
				sortable: {
					type: "boolean",
					group: "Appearance",
					defaultValue: false
				}
			},

			events: {

				sortUpdate: {}
			}
		},

		renderer: ListRenderer
	});

	CustomList.prototype.init = function() {
		List.prototype.init.apply(this, arguments);
		this._oListHTMLReset = undefined;
	};

	CustomList.prototype._serializeToItems = function(sSerialize) {
		var aItemsString = sSerialize.split("&");
		var aItems = [];
		var aItemSplitted;
		for (var i = 0; i < aItemsString.length; i++) {
			aItemSplitted = aItemsString[i].split("[]=");
			aItems.push(this.getItem(aItemSplitted[0] + "-" + aItemSplitted[1]));
		}
		return aItems;
	};

	CustomList.prototype.getItem = function(oItem) {
		var sIdItem = oItem;
		// if (typeof oItem === "string") {

		// }

		var aItems = this.getItems();
		return aItems.find(function(oItems) {
			return oItems.getId() === sIdItem;
		});
	};

	CustomList.prototype.onAfterRendering = function() {
		List.prototype.onAfterRendering.apply(this, arguments);
		if (this.getSortable()) {
			var sIdListHTML = this.getId() + "-listUl";
			var oListHTML = jQuery("#" + sIdListHTML);
			if (oListHTML.length > 0) {
				oListHTML.sortable();
				oListHTML.sortable("option", "axis", "y");
				oListHTML.on("sortupdate", function(event, ui) {
					this.fireSortUpdate({
						itemsSorted: this._serializeToItems(oListHTML.sortable("serialize"))
					});
				}.bind(this));
			}
		}
	};

	CustomList.prototype.setSortable = function(bValue) {
		this.setProperty("sortable", bValue, true);
		var sIdListHTML = this.getId() + "-listUl";
		var oListHTML = jQuery("#" + sIdListHTML);
		if (oListHTML.length < 1) {
			return;
		}
		oListHTML.sortable();
		this._oListHTMLReset = oListHTML.clone();
		if (bValue) {
			oListHTML.sortable("option", "disabled", false);
			oListHTML.sortable("option", "axis", "y");
			oListHTML.on("sortupdate", function(event, ui) {
				this.fireSortUpdate({
					itemsSorted: this._serializeToItems(oListHTML.sortable("serialize"))
				});
			}.bind(this));
		} else {
			oListHTML.sortable("disable");
		}
	};

	CustomList.prototype.resetSort = function() {
		var sIdListHTML = this.getId() + "-listUl";
		var oListHTML = jQuery("#" + sIdListHTML);
		if (oListHTML.length < 1) {
			return;
		}
		oListHTML.replaceWith(this._oListHTMLReset);
	};

	return CustomList;

});