sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"pintogeloApppintogeloApp/modules/managers/CategoryManager"
], function(JSONModel, Device, CategoryManager) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oDeviceNew = jQuery.extend(Device, {
				cordova: typeof cordova === "undefined" ? false : true
			});
			var oModel = new JSONModel(oDeviceNew);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createCategoryDetailModel: function() {
			var oModel = new JSONModel({
				category: undefined
			});
			return oModel;
		}
	};
});