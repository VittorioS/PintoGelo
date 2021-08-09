sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"pintogeloApppintogeloApp/libs/utils"
], function(JSONModel, UtilsLib) {
	"use strict";

	return {
		/**
		 * Imposta il model CategoryDetail
		 * @public
		 * @param {object} Categoria
		 * @returns {object} Categoria modificata 
		 */
		addProduct: function(oProduct) {
			var oModel = new JSONModel();
			var sURL = "https://www.pintogelo.com/app/public/api/products";
			oModel.loadData(sURL, {
				name: oProduct.name,
				description: oProduct.description,
				price: oProduct.price,
				currency: oProduct.currency,
				photo: oProduct.photo,
				row: oProduct.row,
				column: oProduct.column,
				category: oProduct.category
			}, true, "POST");
			return oModel;
		},

		/**
		 * Imposta il model CategoryDetail
		 * @public
		 * @param {object} Categoria
		 * @returns {object} Categoria modificata 
		 */
		editProduct: function(oProduct, oProductUpdated) {
			var oModel = new JSONModel();
			var oParameters = jQuery.extend({
				_method: "PUT"
			}, oProduct, oProductUpdated);
			var sURL = "https://www.pintogelo.com/app/public/api/products/" + oProduct.id;
			oModel.loadData(sURL, oParameters, true, "POST");
			return oModel;
		},

		/**
		 * Imposta il model CategoryDetail
		 * @public
		 * @param {object} Categoria
		 * @returns {object} Categoria modificata 
		 */
		removeProduct: function(sIdProduct) {
			var oModel = new JSONModel();
			var sURL = "https://www.pintogelo.com/app/public/api/products/" + sIdProduct;
			oModel.loadData(sURL, {
				_method: "DELETE"
			}, true, "POST");
			return oModel;
		},
		
		isEqual: function() {
			var aProperty = [
				"id",
				"name",
				"description",
				"price",
				"currency",
				"photo",
				"row",
				"column",
				"category"
			];
			return UtilsLib.isEqual(aProperty, arguments);
		}
	};
});