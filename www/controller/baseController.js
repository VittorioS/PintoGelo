sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"pintogeloApppintogeloApp/modules/managers/CategoryManager",
	"sap/m/MessageBox",
	"sap/ui/Device",
	"sap/ui/core/routing/History"
], function(Controller, CategoryManager, MessageBox, Device, History) {
	"use strict";

	return Controller.extend("pintogeloApppintogeloApp.controller.baseController", {
		_openDialog: function(oDialogConfig, bClear, fnBeforeOpen) { //Prevedere in futuro oListener
			var oView = this.getView();
			if (oDialogConfig.destroy && oDialogConfig.control) {
				oView.removeDependent(oDialogConfig.control);
				oDialogConfig.control = oDialogConfig.control.destroy();
			}
			if (!oDialogConfig.control) {
				oDialogConfig.control = sap.ui.xmlfragment(oView.getId(), oDialogConfig.fragmentName, this);
				oView.addDependent(oDialogConfig.control);
			}
			if (typeof fnBeforeOpen === "function") {
				fnBeforeOpen();
			}
			if (bClear) {
				oDialogConfig.clear(oView);
			}
			oDialogConfig.control.open();
		},
		_closeDialog: function(oEvent) {
			var oDialog = oEvent.getSource().getParent();
			oDialog.close();
		},

		getText: function(sKey) {
			var oView = this.getView();
			var oI18nModel = oView.getModel("i18n");
			var oResourceBundle = oI18nModel.getResourceBundle();
			return oResourceBundle.getText(sKey);
		},

		navToFirstCategory: function() {
			var oView = this.getView();
			var oComponent = this.getOwnerComponent();
			var oCategoriesModel = oView.getModel("categories");
			var aCategories = oCategoriesModel.getProperty("/categories");
			var sIdCategory = aCategories[0].id;
			var oRouter = oComponent.getRouter();
			oRouter.navTo("category", {
				id: sIdCategory
			}, !Device.system.phone);
		},

		toMaster: function() {
			if (!Device.system.phone) {
				return;
			}
			var oView = this.getView();
			var oSplitApp = oView.byId("splitApp");
			var oMasterPage = oSplitApp.getMasterPages()[0];
			oSplitApp.toMaster(oMasterPage);
		},

		toDetail: function() {
			if (!Device.system.phone) {
				return;
			}
			var oView = this.getView();
			var oSplitApp = oView.byId("splitApp");
			var oDetailPage = oSplitApp.getDetailPages()[0];
			oSplitApp.toDetail(oDetailPage);
		},

		onNavBack: function() {
			var oComponent = this.getOwnerComponent();
			var sPreviousHash = History.getInstance().getPreviousHash();
			var oRouter = oComponent.getRouter();

			if (sPreviousHash !== undefined && sPreviousHash !== "") {
				history.go(-1);
			} else {
				oRouter.navTo("detailPage", {}, true);
			}
		}
	});
});