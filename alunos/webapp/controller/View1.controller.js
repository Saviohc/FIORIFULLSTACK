sap.ui.define([
       "sap/ui/core/mvc/Controller",
       "sap/m/MessageToast",
       "sap/m/MessageBox",
       "sap/ui/model/json/JSONModel",
       "sap/ui/model/odata/v2/ODataModel"
	],
	/**
  
     */
	function (Controller, MessageToast, MessageBox, JSONModel, ODataModel) {
		"use strict";

		return Controller.extend("ovly.fiori50.alunos.controller.View1", {
            _oList: null,
            _oModel: null,

            onInit: function(){
              this._oList = this.byId("list");

             let oFonteDeDados = {
                    firstName: "Savio",
                    lastName: "Marques",
                    students: [
                        {  firstName: "Fulano",     lastName: "Silva"   },
                        {  firstName: "Beltrana",   lastName: "Santos"   },
                        {  firstName: "Ciclano",    lastName: "Carvalho"   }
                    ]
                };

              //  this._oModel = new JSONModel(oFonteDeDados);
              //   this._oModel = new JSONModel("https://run.mocky.io/v3/aaf6c572-fa6b-49e9-9f03-aaa0fdeac9b8");
                
               this._oModel = new ODataModel("/sap/opu/odata/sap/ZT55_50_OVLY_SRV/");
               
               //this.byId("nome").setModel(this._oModel);
                this.getView().setModel(this._oModel);
            }, 
        
 
            onPressSave: function() {

              let sNome = this.byId("nome").getValue();
              let sSobrenome = this.byId("sobrenome").getValue();

              // @ts-ignore
              let oNewItem = new sap.m.StandardListItem({title: this.byId("nome").getValue(),
                                                          description: this.byId("sobrenome").getValue(),
                                                          icon: "sap-icon://customer",
                                                          info: "dd/mm/aaaa" });
                                                      
               this._oList.addItem(oNewItem);


               MessageToast.show('Salvando', {  duration: 1000,
                                                width: "50%",
                                                at: "CenterCenter"});
            },
             onPressClear: function() {
                let oInputNome = this.byId("nome");
                let oInputSobrenome = this.byId("sobrenome");


                oInputNome.setValue("");
                oInputSobrenome.setValue("");
                MessageToast.show('Limpando');
            },
             onPressDelete: function() {
                   
     
                this._oList.removeAllItems();

                MessageBox.success('Deletado');

            }
		});
	});
