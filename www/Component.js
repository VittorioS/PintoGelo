sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"pintogeloApppintogeloApp/model/models",
	"pintogeloApppintogeloApp/modules/managers/CategoryManager"
], function(UIComponent, Device, models, CategoryManager) {
	"use strict";

	return UIComponent.extend("pintogeloApppintogeloApp.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			var oCategoryModel = CategoryManager.createCategoryModel();
			this.setModel(oCategoryModel, "categories");
			this.setModel(models.createCategoryDetailModel(), "categoryDetail");
			oCategoryModel.attachRequestCompleted({}, function(oEvent) {
				this.getModel("views").refresh();
				var oRouter = this.getRouter();
				oRouter.initialize();
			}, this);
		}
	});
});