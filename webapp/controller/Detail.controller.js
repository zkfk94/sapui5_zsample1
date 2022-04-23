sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
	], function (Controller, JSONModel) {
		"use strict";
	       
		return Controller.extend("zsample1.controller.Detail", {
				onInit: function () {

				    var oRouter = this.getOwnerComponent().getRouter();
			        oRouter.getRoute("detail").attachMatched(this._onRouteMatched, this);	
				
			    },

  		_onRouteMatched : function (oEvent) {

			var oArgs = oEvent.getParameter("arguments");
			var oView = this.getView();

			oView.bindElement({
				path: '/it_data/' + window.decodeURIComponent(oEvent.getParameter("arguments").num),
				model: "main"
			    });
		    }              

		});
	});	
