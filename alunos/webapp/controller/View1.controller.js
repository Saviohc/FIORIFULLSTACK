sap.ui.define([
       "sap/ui/core/mvc/Controller",
       "sap/m/MessageToast",
       "sap/m/MessageBox",
       "sap/ui/model/json/JSONModel",
       "sap/ui/model/odata/v2/ODataModel",
       "ovly/fiori50/alunos/model/formatter",
       "sap/ui/model/Filter",
	   "sap/ui/model/FilterOperator"       

	],
	/**
  
     */
	function (Controller, MessageToast, MessageBox, JSONModel, ODataModel, formatter, Filter, FilterOperator) {
		"use strict";



		return Controller.extend("ovly.fiori50.alunos.controller.View1", {
            _oList: null,
            _oDataModel: null,
            _oFormModel: null,

            formatter: formatter,

            onInit: function(){
                this._oList = this.byId("list");

                let oFonteDeDados = {
                    primeiro_nome: "Savio",
                    ultimo_nome: "Marques",
                   // students: [
                   //     {  firstName: "Fulano",     lastName: "Silva"   },
                    //    {  firstName: "Beltrana",   lastName: "Santos"   },
                    //    {  firstName: "Ciclano",    lastName: "Carvalho"   }
                    //]
                };
            
                this._oFormModel = new JSONModel(oFonteDeDados);
                this._oDataModel = new ODataModel("/sap/opu/odata/sap/ZT55_50_OVLY_SRV/", {
                    useBatch: false
                });

               
                this.byId("detailform").setModel(this._oFormModel); 
                this.getView().setModel(this._oDataModel);

            }, 
            
            toUpperCase: function(sFirstName){
                if(!sFirstName){
                    return "???????";
                }
                return sFirstName.toUpperCase();
            },
            
            toFullName: function(sFirstName, sLastName) {
                return  `${sFirstName.toUpperCase()} ${sLastName.toUpperCase()}`
            },

            onSearch: function (oEvent) {
                // add filter for search
                //var aFilters = [];
                //var sQuery = oEvent.getSource().getValue();
                //if (sQuery && sQuery.length > 0) {
                //    var filter = new Filter("FirstName", FilterOperator.Contains, sQuery);
                //    aFilters.push(filter);
                //}

                // update list binding
                //var oList = this.byId("list");
                //var oBinding = oList.getBinding("items");
                //oBinding.filter(aFilters, "Application");
            },


            onPressSave: function() {
                let that = this;
                
                let sPath = "/Students";
                let oData = {
                    FirstName: this.byId("nome").getValue(),
                    LastName: this._oFormModel.getProperty("/ultimo_nome")
                };

                const mParameters = {
                    success: function(oStudent, oResponse) {
                        let sId = oStudent.Id;
                        MessageToast.show(`Aluno ${sId} criado com sucesso`);

                        that.onPressClear();
                    },

                    error: this.onPressSaveError.bind(this)
                    
                }

                this._oDataModel.create(sPath, oData, mParameters);
            
            },    
            onPressSaveError: function(oError) {
                let oResponseText = JSON.parse(oError.responseText);			            
                let sMessage = oResponseText.error.message.value;                        

                MessageBox.error(sMessage);   
            
            
            },
            onPressSaveOld: function() {
            /*
              let sNome         = this.byId("nome").getValue();
              let sSobrenome    = this.byId("sobrenome").getValue();
              let sDtNascimento = this.byId("dtNascimento").getValue();
              let sUsuario      = this.byId("usuario").getValue();
            */
              // @ts-ignore
              let oNewItem = new sap.m.StandardListItem({title: this.byId("nome").getValue() + 
                                                                this.byId("sobrenome").getValue(),
                                                         description: this.byId("dtNascimento").getValue(),
                                                         icon: "sap-icon://customer",
                                                         info: this.byId("usuario").getValue() });
  
               this._oList.addItem(oNewItem);


               MessageToast.show('Salvando', {  duration: 1000,
                                                width: "50%",
                                                at: "CenterCenter"});
            },

            onPressClear: function() {

                this._oFormModel.setProperty("/primeiro_nome", "");
                this._oFormModel.setProperty("/ultimo_nome", "");
                //this._oFormModel.setData({
                //     primeiro_nome: "",
                //     ultimo_nome: ""
                //});
            },


            onPressClearOld: function() {
                let oInputNome = this.byId("nome");
                let oInputSobrenome = this.byId("sobrenome");
                oInputNome.setValue("");
                oInputSobrenome.setValue("");

                this.byId("dtNascimento").setValue("");
                this.byId("usuario").setValue("");

                MessageToast.show('Limpando');
            },


            onPressDelete: function (oEvent) {
                
                var oItem = oEvent.getParameters().listItem;
                var oContext = oItem.getBindingContext();
                var oStudent = oContext.getObject();
                var sPath = oContext.getPath(); //    /Students(1234)

                function onSuccess(){

                }

                function onError(){

                }
                
                var mParameters = {
                    success: onSuccess.bind(this),
                    error: onError.bind(this)
                };

                this._oDataModel.remove(sPath, mParameters);


            }
		});
	});
