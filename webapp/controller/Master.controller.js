sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("zsample1.controller.Master", {
            onInit: function () {

            },

            onCreateH: function(){
				let oData = {};
				let that = this;
				let oModel = this.getView().getModel("main");
				let oCreate = oModel.getProperty('/create');
				
				oData.carrid = String(oCreate.carrid);
				oData.connid = String(oCreate.connid);
				
				let oModelS = this.getOwnerComponent().getModel();
				oModelS.create('/ES_TEMP_HSet', oData, {
					success : function(oEvent){
						
						let empty = {
								carrid : '',
								connid : ''			
							}
						oModel.setProperty('/create', empty);
						that.onSearchH();
						MessageBox.show('생성 성공');
					},
					error : function(oEvent){
						MessageBox.show('생성 실패');
					}
				})

            },

			// 조회
			onSearchH: function(oEvent){
				let oModel = this.getView().getModel("main");
				let oModelS = this.getOwnerComponent().getModel();
				oModelS.read('/ES_TEMP_HSet', {
					success : function(oEvent){
						if(oEvent.results.length > 0){
							oModel.setProperty('/it_data2', oEvent.results);
						}
                        
					},
					error : function(oEvent){
						MessageBox.show('조회 실패');
					}
				})
			},

            onCreate: function(){
				let oData = {};
				let that = this;
				let oModel = this.getView().getModel("main");
				let oCreate = oModel.getProperty('/create');
				
				oData.carrid = String(oCreate.carrid);
				oData.connid = String(oCreate.connid);
				oData.fldate = String(oCreate.fldate);
				
				let oModelS = this.getOwnerComponent().getModel();
				oModelS.create('/ES_TEMP_DSet', oData, {
					success : function(oEvent){
						
						let empty = {
								carrid : '',
								connid : '',
								fldate : ''				
							}
						oModel.setProperty('/create', empty);

						that.onSearch();

						MessageBox.show('생성 성공');
					},
					error : function(oEvent){
						MessageBox.show('생성 실패');
					}
				})

            },

			// 편집 가능 유무
			onEdit : function(oEvent){
				let oModel = this.getView().getModel("main");
				let oEdit = oModel.getProperty('/editMode');

				if(oEdit == false){
					oModel.setProperty('/editMode', true);
				}else{
					oModel.setProperty('/editMode', false);
				}
			},

			// 테이블 라인 추가
			onAdd : function(oEvent){
				let oModel = this.getView().getModel("main");
				let oData = oModel.getProperty('/it_data');

				let oAdd = {
					carrid : '',
					connid : '',
					fldate : ''						
				}

				oData.unshift(oAdd);
				oModel.refresh();
			
			},

			// 테이블 라인 삭제 (DB 삭제 X)
			onDelete : function(oEvent){
				let oModel = this.getView().getModel("main");
				let oData = oModel.getProperty('/it_data');

				let oTable = this.getView().byId('idTable');

				for(let i=oTable.getSelectedContextPaths().length; i>0; i--){
					let index = Number(oTable.getSelectedContextPaths()[i-1].slice(9));
					oData.splice(index, 1);
				}
				oTable.removeSelections();
				oModel.refresh();
			},

			// 선택한 Line DB 삭제
			onSelectedDelete : function(){

				let that = this;

				let oModel = this.getView().getModel("main");
				let oIt_data = oModel.getProperty('/it_data');
				let oTable = this.getView().byId('idTable');

				let check = oTable.getSelectedContextPaths();

				if(check.length > 1){
					MessageBox.show('삭제는 1개씩만 가능합니다.');
					return;
				}

				let aIt_data = oModel.getProperty(check[0]);
				let oData = {};
				oData.carrid = aIt_data.carrid;
				oData.connid = aIt_data.connid;
				oData.fldate = aIt_data.fldate;

				let oModelS = this.getOwnerComponent().getModel();
				let sKey = oModelS.createKey('/ES_TEMP_DSet', oData);

				oModelS.remove(sKey, {
					success: function(event) {
						MessageBox.show('삭제 성공.');
						that.onSearch();
					},
					error: function(event) {
						MessageBox.show('삭제 실패.');
					}
				});

				   oTable.removeSelections();

			},

			// 화면에 보이는 테이블 DB 업데이트 및 저장(MODIFY)
			onSave : function(oEvent){
				let that = this;
				let oModel = this.getView().getModel("main");
				let oTable = this.getView().byId('idTable');

				let check = oTable.getSelectedContextPaths();

				if(check.length > 1){
					MessageBox.show('저장은 1개씩만 가능합니다.');
					return;
				}

					let oData = {};

					let aIt_data = oModel.getProperty(check[0]);
					oData.carrid = aIt_data.carrid;
					oData.connid = aIt_data.connid;
					oData.fldate = aIt_data.fldate;
					oData.currency = aIt_data.currency;
					oData.price = aIt_data.price;
					oData.meins = aIt_data.meins;
					oData.qty = aIt_data.qty;

					let oModelS = this.getOwnerComponent().getModel();

					let sKey = oModelS.createKey('/ES_TEMP_DSet', oData);
					oModelS.update(sKey, oData, {
						success : function(result){
							MessageBox.show('저장 성공');
							that.onSearch();
						},
						error : function(result){
							MessageBox.show('저장 실패');
						}					
					})
	
					// oData.fldate = aIt_data.fldate.replace(/-/g, '');


			},

			// 조회
			onSearch: function(oEvent){
				let oModel = this.getView().getModel("main");
				let oEdit = oModel.setProperty('/editMode', false);
						
				let oFilter = oModel.getProperty('/filter');

				let mFilter = [];
				for(let sKey in oFilter){
					let oVal = oFilter[sKey];
					if(oVal) {
						mFilter.push(new Filter({
							path: sKey,
							operator: FilterOperator.Contains,
							value1: oVal,
						}));
					}
				}

                // let oTable = this.byId("idTable");
                // let oBinding = oTable.getBinding("items");
                // oBinding.filter(mFilter);

				let oModelS = this.getOwnerComponent().getModel();
				oModelS.read('/ES_TEMP_DSet', {
					filters : mFilter,
					success : function(oEvent){
						if(oEvent.results.length > 0){
							oModel.setProperty('/it_data', oEvent.results);
						}
                        
					},
					error : function(oEvent){
						MessageBox.show('조회 실패');
					}
				})
			},

			onSelect : function(oEvent){
				let oCompo = this.getOwnerComponent().getRouter();
				let path = oEvent.getSource().getBindingContextPath().substr(9);
				oCompo.navTo("detail",{
					num : window.encodeURIComponent(path)
				});
			},

        });
    });
