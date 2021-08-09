sap.ui.define([
	"pintogeloApppintogeloApp/controller/baseController",
	"pintogeloApppintogeloApp/modules/managers/CategoryManager",
	"pintogeloApppintogeloApp/modules/managers/ProductManager",
	"pintogeloApppintogeloApp/libs/utils",
	"sap/m/MessageBox"
], function(BaseController, CategoryManager, ProductManager, UtilsLib, MessageBox) {
	"use strict";

	return BaseController.extend("pintogeloApppintogeloApp.controller.category", {
		_dialogEditCategory: {
			control: undefined,
			fragmentName: "pintogeloApppintogeloApp.view.fragment.dialog.dialogEditCategory"
		},
		_dialogNewProduct: {
			control: undefined,
			fragmentName: "pintogeloApppintogeloApp.view.fragment.dialog.dialogNewProduct",
			destroy: true,
			clear: function(oView) {
				var oDialogsModel = oView.getModel("dialogs");
				oDialogsModel.setProperty("/dialogNewProduct", {
					"product": {
						"name": "",
						"description": "",
						"price": 0,
						"currency": "€",
						"photo": "_",
						"row": 0,
						"column": 0,
						"category": 0
					},
					"newRow": null,
					"fileName": ""
				});
				oView.byId("fileUploaderNewProduct").clear();
			}
		},
		_dialogEditProduct: {
			control: undefined,
			fragmentName: "pintogeloApppintogeloApp.view.fragment.dialog.dialogEditProduct",
			destroy: true
		},

		_onPressDialogEditCategory: function(oEvent) {
			var oEventDialog = jQuery.extend({}, oEvent);
			var oComponent = this.getOwnerComponent();
			var oView = this.getView();
			var oCategoryDetailModel = oView.getModel("categoryDetail");
			var oDialogsModel = oView.getModel("dialogs");
			var oCategory = oCategoryDetailModel.getProperty("/category");
			var oCategoryUpdated = oDialogsModel.getProperty("/dialogEditCategory");
			
			if (CategoryManager.isEqual(oCategory, oCategoryUpdated)) {
				return;
			}
			MessageBox.confirm(this.getText("dialogs.category.confirmedit"), {
				onClose: function(sAction) {
					if (sAction !== MessageBox.Action.OK) {
						return;
					}
					CategoryManager.editCategory(oCategory, oCategoryUpdated).attachRequestCompleted({}, function(oEventRequest) {
						var bSuccess = oEventRequest.getParameter("success");
						if (bSuccess) {
							MessageBox.success("Categoria modificata", {
								onClose: function() {
									this._closeDialog(oEventDialog);
									oComponent.setModel(CategoryManager.createCategoryModel(), "categories");
									this._refreshCategoryDetail(oCategory.id);
								}.bind(this)
							});
						} else {
							MessageBox.error("Categoria non modificata");
						}
					}, this);
				}.bind(this)
			});
		},
		_onPressDialogAddProduct: function(oEvent) {
			var oEventDialog = jQuery.extend({}, oEvent);
			// var oComponent = this.getOwnerComponent();
			var oView = this.getView();
			var oSource = oEvent.getSource();
			var oFileUploader = oView.byId("fileUploaderNewProduct");
			var bNewRow = oSource.data("newRow");
			var oDialogsModel = oView.getModel("dialogs");
			var oNewProduct = oDialogsModel.getProperty("/dialogNewProduct/product");
			var bCordova = !oFileUploader.getVisible();
			var sFilename = bCordova ? oDialogsModel.getProperty("/dialogNewProduct/fileName").trim() : oFileUploader.getValue().trim();
			oNewProduct = this._setCategoryProperty(oNewProduct, bNewRow);
			var fnCallbackSuccess = function() {
				MessageBox.success("Prodotto aggiunto", {
					onClose: function() {
						this._closeDialog(oEventDialog);
						var oCategoryDetailModel = oView.getModel("categoryDetail");
						var oCategory = oCategoryDetailModel.getProperty("/category");
						this._refreshCategoryDetail(oCategory.id);
					}.bind(this)
				});
			}.bind(this);
			ProductManager.addProduct(oNewProduct).attachRequestCompleted({}, function(oEventRequest) {
				var bSuccess = oEventRequest.getParameter("success");
				if (bSuccess) {
					var oPayloadModel = oEventRequest.getSource();
					if (sFilename !== "") {
						this._setUrlPhotoProduct(oFileUploader, oPayloadModel.getProperty("/id"));
						if (bCordova) {
							UtilsLib.uploadFile(function() {
								fnCallbackSuccess();
							}, function() {
								MessageBox.error(this.getText("dialogs.product.failedUploadFile"));
							}, {
								filename: sFilename,
								uploadUrl: oFileUploader.getUploadUrl(),
								fileKey: oFileUploader.getName(),
								mimeType: "image/jpeg"
							});
						} else {
							oFileUploader.attachUploadComplete({}, function(oEventRequestFile) {
								oFileUploader.clear();
								fnCallbackSuccess();
							}, this);
							oFileUploader.upload();
						}
					} else {
						fnCallbackSuccess();
					}
				} else {
					MessageBox.error("Prodotto non aggiunto");
				}
			}, this);
		},

		_onPressDialogEditProduct: function(oEvent) {
			var oEventDialog = jQuery.extend({}, oEvent);
			// var oComponent = this.getOwnerComponent();
			var oView = this.getView();
			var oFileUploader = oView.byId("fileUploaderEdit");
			var oDialogsModel = oView.getModel("dialogs");
			var oNewProduct = oDialogsModel.getProperty("/dialogEditProduct/product");
			var oCategoryDetailModel = oView.getModel("categoryDetail");
			var oCategory = oCategoryDetailModel.getProperty("/category");
			var bCordova = !oFileUploader.getVisible();
			var sFilename = bCordova ? oDialogsModel.getProperty("/dialogNewProduct/fileName").trim() : oFileUploader.getValue().trim();
			var oProductFound = oCategory.products.find(function(oProduct) {
				return oProduct.id === oNewProduct.id;
			});
			
			if (ProductManager.isEqual(oNewProduct, oProductFound) && sFilename === "") {
				return;
			}
			
			MessageBox.confirm(this.getText("dialogs.product.confirmedit"), {
				onClose: function(sAction) {
					if (sAction !== MessageBox.Action.OK) {
						return;
					}
					
					var fnCallbackSuccess = function() {
						MessageBox.success("Prodotto modificato", {
							onClose: function() {
								this._closeDialog(oEventDialog);
								this._refreshCategoryDetail(oCategory.id);
							}.bind(this)
						});
					}.bind(this);
					ProductManager.editProduct(oProductFound, oNewProduct).attachRequestCompleted({}, function(oEventRequest) {
						var bSuccess = oEventRequest.getParameter("success");
						if (bSuccess) {
							var oPayloadModel = oEventRequest.getSource();
							if (sFilename !== "") {
								if (bCordova) {
									UtilsLib.uploadFile(function() {
										fnCallbackSuccess();
									}, function() {
										MessageBox.error(this.getText("dialogs.product.failedUploadFile"));
									}, {
										filename: sFilename,
										uploadUrl: oFileUploader.getUploadUrl(),
										fileKey: oFileUploader.getName(),
										mimeType: "image/jpeg"
									});
								} else {
									this._setUrlPhotoProduct(oFileUploader, oPayloadModel.getProperty("/id"));
									oFileUploader.attachUploadComplete({}, function(oEventRequestFile) {
										fnCallbackSuccess();
									}, this);
									oFileUploader.upload();
								}
							} else {
								fnCallbackSuccess();
							}
						} else {
							MessageBox.error("Prodotto non modificato");
						}
					}, this);
				}.bind(this)
			});
			
		},

		// TODO Eliminare questa merda: usare il binding
		_setUrlPhotoProduct: function(oFileUploader, sIdProduct) {
			oFileUploader.setUploadUrl("https://www.pintogelo.com/app/public/api/products/" + sIdProduct + "/photo");
		},

		_setCategoryProperty: function(oProduct, bNewRow) {
			var oView = this.getView();
			var oCategoryDetailModel = oView.getModel("categoryDetail");
			var oCategory = oCategoryDetailModel.getProperty("/category");
			var aRows = oCategory.rows;
			var aProductsRow;
			var iRow = 0;
			var iColumn = 0;
			if (typeof bNewRow === "string") {
				if (aRows.length > 0) {
					aProductsRow = aRows[aRows.length - 1].products;
					if (aProductsRow.length > 0) {
						iRow = aProductsRow[aProductsRow.length - 1].row;
						iColumn = aProductsRow[aProductsRow.length - 1].column;
					}
				}
				if (bNewRow === "false") {
					iColumn++;
				}
			} else if (typeof bNewRow === "number") {
				aProductsRow = aRows[bNewRow].products;
				iRow = bNewRow;
				iColumn = aProductsRow[aProductsRow.length - 1].column + 1;
			}
			oProduct.row = iRow;
			oProduct.column = iColumn;
			oProduct.category = oCategory.id;
			return oProduct;
		},

		_onPressDialogEditProductSelectFile: function(oEvent) {
			var oView = this.getView();
			var oDialogsModel = oView.getModel("dialogs");
			UtilsLib.getPicture(function(sFilename){
				oDialogsModel.setProperty("/dialogEditProduct/fileName", sFilename);
			}, function(oError){
				oDialogsModel.setProperty("/dialogEditProduct/fileName", "");
				MessageBox.error(this.getText("dialogs.product.failedSelectFile"));
			});
		},

		_onPressDialogNewProductSelectFile: function(oEvent) {
			var oView = this.getView();
			var oDialogsModel = oView.getModel("dialogs");
			UtilsLib.getPicture(function(sFilename){
				oDialogsModel.setProperty("/dialogNewProduct/fileName", sFilename);
			}, function(oError){
				oDialogsModel.setProperty("/dialogNewProduct/fileName", "");
				MessageBox.error(this.getText("dialogs.product.failedSelectFile"));
			});
		},

		_onRouteMatched: function(oEvent) {
			var oArguments = oEvent.getParameter("arguments");
			var sIdCategory = oArguments.id;
			this._refreshCategoryDetail(sIdCategory);
		},

		_setSortProduct: function(bValue) {
			var oView = this.getView();
			var oViewsModel = oView.getModel("views");
			var sPath = "/categoryPage/sortProduct";
			oViewsModel.setProperty(sPath, bValue);
		},
		_getSortProduct: function() {
			var oView = this.getView();
			var oViewsModel = oView.getModel("views");
			var sPath = "/categoryPage/sortProduct";
			return oViewsModel.getProperty(sPath);
		},

		_refreshCategoryDetail: function(sIdCategory) {
			var oView = this.getView();
			var oCategoryDetailModel = oView.getModel("categoryDetail");
			CategoryManager.getCategory(sIdCategory, "/products").attachRequestCompleted({}, function(oEventRequest) {
				var bSuccess = oEventRequest.getParameter("success");
				if (bSuccess) {
					var oModel = oEventRequest.getSource();
					var oCategory = oModel.getProperty("/");
					oCategory = CategoryManager.setCategoryDetailModel(oCategory);
					oCategoryDetailModel.setProperty("/category", oCategory);
				} else {
					MessageBox.error("Categoria non trovata!");
				}
			}, this);
		},

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf pintogeloApppintogeloApp.view.home
		 */
		onInit: function() {
			var oComponent = this.getOwnerComponent();
			var oRouter = oComponent.getRouter();
			oRouter.getRoute("category").attachMatched({}, this._onRouteMatched, this);
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf pintogeloApppintogeloApp.view.home
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf pintogeloApppintogeloApp.view.home
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf pintogeloApppintogeloApp.view.home
		 */
		//	onExit: function() {
		//
		//	}

		onPressEditCategory: function(oEvent) {
			var oView = this.getView();
			var oCategoryDetailModel = oView.getModel("categoryDetail");
			var oDialogsModel = oView.getModel("dialogs");
			var oCategory = oCategoryDetailModel.getProperty("/category");
			oDialogsModel.setProperty("/dialogEditCategory", jQuery.extend({}, oCategory));
			this._openDialog(this._dialogEditCategory, false);
		},

		onPressDeleteCategory: function(oEvent) {
			var oComponent = this.getOwnerComponent();
			var oButton = oEvent.getSource();
			var sIdCategory = oButton.data("idCategory");
			
			MessageBox.confirm(this.getText("dialogs.category.confirmdelete"), {
				onClose: function(sAction) {
					if (sAction !== MessageBox.Action.OK) {
						return;
					}
					CategoryManager.removeCategory(sIdCategory).attachRequestCompleted({}, function(oEventRequest) {
						var bSuccess = oEventRequest.getParameter("success");
						if (bSuccess) {
							MessageBox.success("Categoria cancellatta", {
								onClose: function() {
									this.navToFirstCategory();
									oComponent.setModel(CategoryManager.createCategoryModel(), "categories");
								}.bind(this)
							});
						} else {
							MessageBox.error("Categoria non cancellata");
						}
					}, this);
				}.bind(this)
			});
		},

		onPressNewProduct: function(oEvent) {
			var oView = this.getView();
			var oButton = oEvent.getSource();
			var oDialogsModel = oView.getModel("dialogs");
			this._openDialog(this._dialogNewProduct, true);
			oDialogsModel.setProperty("/dialogNewProduct/newRow", oButton.data("newRow"));
		},

		onPressDeleteProduct: function(oEvent) {
			MessageBox.confirm(this.getText("dialogs.product.confirmdelete"), {
				onClose: function(sAction) {
					if (sAction !== MessageBox.Action.OK) {
						return;
					}
					var oView = this.getView();
					var oDialogsModel = oView.getModel("dialogs");
					var oProduct = oDialogsModel.getProperty("/dialogEditProduct/product");
					ProductManager.removeProduct(oProduct.id).attachRequestCompleted({}, function(oEventRequest) {
						var bSuccess = oEventRequest.getParameter("success");
						if (bSuccess) {
							MessageBox.success("Prodotto cancellatto", {
								onClose: function() {
									this._dialogEditProduct.control.close();
									this._refreshCategoryDetail(oProduct.category);
								}.bind(this)
							});
						} else {
							MessageBox.error("Prodotto non cancellatto");
						}
					}, this);
				}.bind(this)
			});
		},

		onPressProduct: function(oEvent) {
			var oView = this.getView();
			var oGenericTile = oEvent.getSource();
			var sAction = oEvent.getParameter("action");
			var oBindingContext = oGenericTile.getBindingContext("categoryDetail");
			var oProduct = oBindingContext.getModel().getProperty(oBindingContext.getPath());
			if (sAction === "Remove") {
				ProductManager.removeProduct(oProduct.id).attachRequestCompleted({}, function(oEventRequest) {
					var bSuccess = oEventRequest.getParameter("success");
					if (bSuccess) {
						MessageBox.success("Prodotto cancellatto", {
							onClose: function() {
								this._refreshCategoryDetail(oProduct.category);
							}.bind(this)
						});
					} else {
						MessageBox.error("Prodotto non cancellatto");
					}
				}, this);
			} else if (sAction === "Press") {
				var oDialogsModel = oView.getModel("dialogs");
				oDialogsModel.setProperty("/dialogEditProduct/product", jQuery.extend({}, oProduct));
				this._openDialog(this._dialogEditProduct, false);
			}
		},

		onPressSortProduct: function(oEvent) {
			this._setSortProduct(!this._getSortProduct());
		}
	});

});