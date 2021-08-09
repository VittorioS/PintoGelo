sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"pintogeloApppintogeloApp/libs/utils"
], function(JSONModel, UtilsLib) {
	"use strict";

	return {
		createCategoryModel: function() {
			var oModel = this.getCategories("");
			oModel.attachRequestCompleted({}, function(oEvent){
				var aCategories = oModel.getProperty("/");
				aCategories.sort(function(oCategory1, oCategory2){
					return oCategory1.order - oCategory2.order;
				});
				oModel.setData({
					categories: aCategories
				});
			}, this);
			return oModel;
		},
		/**
		 * Restituisce tutte le categorie con i prodotti associati
		 * @public
		 * @param {string} Parametri aggiuntivi per l'URL
		 * @returns {object} sap.ui.model.json.JSONModel
		 */
		getCategories: function(sExtendUrl) {
			var oModel = new JSONModel();
			var sURL = "https://www.pintogelo.com/app/public/api/categories";
			if (typeof sExtendUrl === "string") {
				sURL += sExtendUrl;
			}
			oModel.loadData(sURL, {}, true, "GET");
			return oModel;
		},
		/**
		 * Restituisce la categoria con l'id selezionato
		 * @public
		 * @param {string} Parametri aggiuntivi per l'URL
		 * @returns {object} sap.ui.model.json.JSONModel
		 */
		getCategory: function(sId, sExtendUrl) {
			var oModel = new JSONModel();
			var sURL = "https://www.pintogelo.com/app/public/api/categories/" + sId;
			if (typeof sExtendUrl === "string") {
				sURL += sExtendUrl;
			}
			oModel.loadData(sURL, {}, true, "GET");
			return oModel;
		},
		/**
		 * Imposta il model CategoryDetail
		 * @public
		 * @param {object} Categoria
		 * @returns {object} Categoria modificata 
		 */
		addCategory: function(sName, sDescription, iOrder) {
			var oModel = new JSONModel();
			var sURL = "https://www.pintogelo.com/app/public/api/categories";
			oModel.loadData(sURL, {
				name: sName,
				description: sDescription,
				order: iOrder
			}, true, "POST");
			return oModel;
		},
		/**
		 * Imposta il model CategoryDetail
		 * @public
		 * @param {object} Categoria
		 * @returns {object} Categoria modificata 
		 */
		editCategory: function(oCategory, oCategoryUpdated) {
			var oModel = new JSONModel();
			var oParameters = jQuery.extend({
				_method: "PUT"
			}, oCategory, oCategoryUpdated);
			var sURL = "https://www.pintogelo.com/app/public/api/categories/" + oCategory.id;
			oModel.loadData(sURL, oParameters, true, "POST");
			return oModel;
		},
		/**
		 * Imposta il model CategoryDetail
		 * @public
		 * @param {object} Categoria
		 * @returns {object} Categoria modificata 
		 */
		sortCategory: function(aCategories) {
			var oModel = new JSONModel();
			var oParameters = jQuery.extend({
				_method: "PUT"
			}, {
				categories: aCategories.map(function(oCategory){
					return {
						id: oCategory.id,
						order: oCategory.order
					};
				})
			});
			var sURL = "https://www.pintogelo.com/app/public/api/categories/sort";
			oModel.loadData(sURL, oParameters, true, "POST");
			return oModel;
		},
		/**
		 * Imposta il model CategoryDetail
		 * @public
		 * @param {object} Categoria
		 * @returns {object} Categoria modificata 
		 */
		removeCategory: function(sIdCategory) {
			var oModel = new JSONModel();
			var sURL = "https://www.pintogelo.com/app/public/api/categories/" + sIdCategory;
			oModel.loadData(sURL, {
				_method: "DELETE" //PUT
			}, true, "POST");
			return oModel;
		},
		/**
		 * Imposta il model CategoryDetail
		 * @public
		 * @param {object} Categoria
		 * @returns {object} Categoria modificata 
		 */
		addProduct: function(sName, sDescription, iOrder) {
			var oModel = new JSONModel();
			var sURL = "https://www.pintogelo.com/app/public/api/products";
			oModel.loadData(sURL, {
				name: sName,
				description: sDescription,
				order: iOrder
			}, true, "POST");
			return oModel;
		},
		/**
		 * Imposta il model CategoryDetail
		 * @public
		 * @param {object} Categoria
		 * @returns {object} Categoria modificata 
		 */
		setCategoryDetailModel: function(oCategory) {
			var aProducts = oCategory.products.map(function(oProduct) {
				oProduct.row = Number(oProduct.row);
				oProduct.column = Number(oProduct.column);
				return oProduct;
			});

			aProducts.sort(function(oProduct1, oProduct2) {
				return oProduct1["row"] - oProduct2["row"] || oProduct1["column"] - oProduct2["column"];
			});

			var aRows = [];
			var aProductsRow = [];
			aProducts.forEach(function(oProduct, i, aArrayProducts) {
				if (i > 0) {
					if (oProduct.row > aArrayProducts[i - 1].row) {
						aRows.push({
							id: aRows.length,
							products: aProductsRow
						});
						aProductsRow = [];
					}
				}
				aProductsRow.push(oProduct);
			});
			if (aProductsRow.length > 0) {
				aRows.push({
					id: aRows.length,
					products: aProductsRow
				});
			}
			oCategory.rows = aRows;
			return oCategory;
		},

		isEqual: function() {
			var aProperty = [
				"id",
				"name",
				"description",
				"order"
			];
			return UtilsLib.isEqual(aProperty, arguments);
		}

	};
});