sap.ui.define([
       "sap/ui/core/mvc/Controller",
       "sap/m/MessageToast",
       "sap/m/MessageBox",
       "sap/ui/model/json/JSONModel",
       "sap/ui/model/odata/v2/ODataModel",
	   "ovly/fiori50/alunos/model/formatter"

	],
	/**
  
     */
	function (Controller, MessageToast, MessageBox, JSONModel, ODataModel, formatter) {
		"use strict";



		return Controller.extend("ovly.fiori50.alunos.controller.View1", {
            _oList: null,
            _oModel: null,

            formatter: formatter,

            onInit: function(){
              this._oList = this.byId("list");

             /*let oFonteDeDados = {
                    firstName: "Savio",
                    lastName: "Marques",
                    students: [
                        {  firstName: "Fulano",     lastName: "Silva"   },
                        {  firstName: "Beltrana",   lastName: "Santos"   },
                        {  firstName: "Ciclano",    lastName: "Carvalho"   }
                    ]
                };
            
                this._oModel = new JSONModel(oFonteDeDados);
                 this._oModel = new JSONModel("https://run.mocky.io/v3/aaf6c572-fa6b-49e9-9f03-aaa0fdeac9b8");
            */
              
            this.byId("nome").setModel(this._oModel);         
               this._oModel = new ODataModel("/sap/opu/odata/sap/ZT55_50_OVLY_SRV/");
               
              this.getView().setModel(this._oModel);
            }, 
        
 
            onPressSave: function() {
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
                let oInputNome = this.byId("nome");
                let oInputSobrenome = this.byId("sobrenome");
                oInputNome.setValue("");
                oInputSobrenome.setValue("");

                this.byId("dtNascimento").setValue("");
                this.byId("usuario").setValue("");

                MessageToast.show('Limpando');
            },
             onPressDelete: function() {
                   
     
                this._oList.removeAllItems();

                MessageBox.success('Deletado');

            }
		});
	});
