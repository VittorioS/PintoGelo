sap.ui.define([
	"pintogeloApppintogeloApp/controller/baseController",
	"pintogeloApppintogeloApp/modules/managers/CategoryManager",
	"sap/m/MessageBox",
	"sap/ui/Device"
], function(BaseController, CategoryManager, MessageBox, Device) {
	"use strict";

	return BaseController.extend("pintogeloApppintogeloApp.controller.detailPage", {
		_dialogNewCategory: {
			control: undefined,
			fragmentName: "pintogeloApppintogeloApp.view.fragment.dialog.dialogNewCategory",
			clear: function(oView) {
				var oDialogsModel = oView.getModel("dialogs");
				oDialogsModel.setProperty("/dialogNewCategory", {
					"name": "",
					"description": ""
				});
			}
		},
		_onPressDialogAddCategory: function(oEvent) {
			var oView = this.getView();
			var oComponent = this.getOwnerComponent();
			var oCategoriesModel = oView.getModel("categories");
			var oDialogsModel = oView.getModel("dialogs");
			var sName = oDialogsModel.getProperty("/dialogNewCategory/name");
			var sDescription = oDialogsModel.getProperty("/dialogNewCategory/description");
			var aCategories = oCategoriesModel.getProperty("/categories");
			aCategories.sort(function(oCategory1, oCategory2) {
				return oCategory2.order - oCategory1.order;
			});
			var oEventDialog = jQuery.extend({}, oEvent);
			CategoryManager.addCategory(sName, sDescription, aCategories[0].order + 1)
				.attachRequestCompleted({}, function(oEventRequest) {
					var bSuccess = oEventRequest.getParameter("success");
					if (bSuccess) {
						MessageBox.success("Categoria creata", {
							onClose: function() {
								this._closeDialog(oEventDialog);
								oComponent.setModel(CategoryManager.createCategoryModel(), "categories");
							}.bind(this)
						});
					} else {
						MessageBox.error("Categoria non creata");
					}
				}, this);
		},
		_toggleEditSortCategory: function() {
			var oView = this.getView();
			var oViewsModel = oView.getModel("views");
			var sPath = "/detailPage/editSortCategory";
			var bEditSortCategory = oViewsModel.getProperty(sPath);
			var bValue = !bEditSortCategory;
			oViewsModel.setProperty(sPath, bValue);
			return bValue;
		},
		_setSortedCategory: function(bValue) {
			var oView = this.getView();
			var oViewsModel = oView.getModel("views");
			var sPath = "/detailPage/sortedCategory";
			oViewsModel.setProperty(sPath, bValue);
		},
		_getSortedCategory: function() {
			var oView = this.getView();
			var oViewsModel = oView.getModel("views");
			var sPath = "/detailPage/sortedCategory";
			return oViewsModel.getProperty(sPath);
		},

		_bNavFirstTime: true,
		_onRouteMatched: function(oEvent) {
			if (this._bNavFirstTime) {
				this._bNavFirstTime = false;
				this.navToFirstCategory();
			}
		},

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf pintogeloApppintogeloApp.view.detailPage
		 */
		onInit: function() {
			var oComponent = this.getOwnerComponent();
			var oRouter = oComponent.getRouter();
			oRouter.getRoute("detailPage").attachMatched({}, this._onRouteMatched, this);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf pintogeloApppintogeloApp.view.detailPage
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf pintogeloApppintogeloApp.view.detailPage
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf pintogeloApppintogeloApp.view.detailPage
		 */
		//	onExit: function() {
		//
		//	}

		onPressCategory: function(oEvent) {
			// var oView = this.getView();
			var oComponent = this.getOwnerComponent();
			var oItem = oEvent.getSource();
			var oBindingContext = oItem.getBindingContext("categories");
			// var oCategoryDetailModel = oView.getModel("categoryDetail");
			var oCategory = oBindingContext.getModel().getProperty(oBindingContext.getPath());
			// oCategory = CategoryManager.setCategoryDetailModel(oCategory);
			// oCategoryDetailModel.setProperty("/category", oCategory);

			oComponent.getRouter().navTo("category", {
				id: oCategory.id
			}, true);

			var oSplitApp = sap.ui.getCore().byId("__xmlview0--splitApp");
			oSplitApp.hideMaster();
		},

		onPressAddCategory: function(oEvent) {
			this._openDialog(this._dialogNewCategory, true);
		},

		onSortUpdateListCategory: function(oEvent) {
			var oList = oEvent.getSource();
			// var sPathSorter = oList.getBindingInfo("items").sorter.sPath;
			var sPathSorter = "order";
			var aItemsSorted = oEvent.getParameter("itemsSorted");
			var oBindingContextItem = aItemsSorted[0].getBindingContext("categories");
			var oModel = oBindingContextItem.getModel();
			var sFullPath;
			aItemsSorted.forEach(function(oItem, iSort) {
				oBindingContextItem = oItem.getBindingContext("categories");
				sFullPath = oBindingContextItem.getPath() + "/" + sPathSorter;
				oModel.setProperty(sFullPath, iSort + 1);
			}, this);
			this._setSortedCategory(true);
		},

		onPressEnableSortCategory: function(oEvent) {
			var oView = this.getView();
			var oViewModel = oView.getModel("views");
			var oCategoriesModel = oView.getModel("categories");
			if (this._toggleEditSortCategory()) {
				oViewModel.setProperty("/detailPage/categoriesOriginal", oCategoriesModel.getProperty("/categories"));
			}
		},

		onPressCancelSortCategories: function(oEvent) {
			var oView = this.getView();
			var oViewModel = oView.getModel("views");
			var oCategoriesModel = oView.getModel("categories");
			var oList = oView.byId("listCategories");
			oCategoriesModel.setProperty("/categories", oViewModel.getProperty("/detailPage/categoriesOriginal"));
			oList.resetSort();
			this._toggleEditSortCategory();
		},

		onPressSortCategories: function(oEvent) {
			var oView = this.getView();
			var oComponent = this.getOwnerComponent();
			var oCategoriesModel = oView.getModel("categories");
			var aCategories = oCategoriesModel.getProperty("/categories");
			if (!this._getSortedCategory()) {
				this._toggleEditSortCategory();
			} else {
				CategoryManager.sortCategory(aCategories)
					.attachRequestCompleted({}, function(oEventRequest) {
						var bSuccess = oEventRequest.getParameter("success");
						if (bSuccess) {
							MessageBox.success("Categorie ordinate", {
								onClose: function() {
									oComponent.setModel(CategoryManager.createCategoryModel(), "categories");
									this._toggleEditSortCategory();
									this._setSortedCategory(false);
								}.bind(this)
							});
						} else {
							MessageBox.error("Categorie non ordinate");
						}
					}, this);
			}
		}
	});

});