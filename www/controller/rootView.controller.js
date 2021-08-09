sap.ui.define([
	"pintogeloApppintogeloApp/controller/baseController",
], function(BaseController) {
	"use strict";

	return BaseController.extend("pintogeloApppintogeloApp.controller.rootView", {
		onInit: function() {
			var oComponent = this.getOwnerComponent();
			var oRouter = oComponent.getRouter();
			oRouter.getRoute("category").attachMatched({}, this._onRouteMatchedCategory, this);
			oRouter.getRoute("detailPage").attachMatched({}, this._onRouteMatchedDetailPage, this);
		},
		
		_onRouteMatchedCategory: function() {
			this.toDetail();
		},
		
		_onRouteMatchedDetailPage: function() {
			this.toMaster();
		}
	});
});