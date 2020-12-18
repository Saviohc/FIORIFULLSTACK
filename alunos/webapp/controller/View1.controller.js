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

                let oAlunoPadrao = {
                    isUpdate: false,
                    id: "",
                    nome: "",
                    sobrenome: "",
                    dtNascimento: "",
                    usuario: ""
                };
            
                this._oFormModel = new JSONModel(oAlunoPadrao);
                this._oDataModel = new ODataModel("/sap/opu/odata/sap/ZT55_50_OVLY_SRV/", {
                    useBatch: false
                });

               
                this.byId("detailform").setModel(this._oFormModel, "form"); 
                this.byId("Bar").setModel(this._oFormModel, "form"); 
                this.getView().setModel(this._oDataModel);

            }, 
            
            toUpperCase: function(sFirstName){
                if(!sFirstName){
                    return "???????";
                }
                return sFirstName.toUpperCase();
            },
            
            toFullName: function(sFirstName, sLastName) {
                return  `${sFirstName} ${sLastName}`
            },

            onSearch: function (oEvent) {
                // add filter for search
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter({
                        path: "FirstName", 
                        operator: FilterOperator.Contains,
                        value1: sQuery
                    });
                    aFilters.push(filter);
                }

                // update list binding
                var oList = this.byId("list");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            },
             
            onPressItem: function(oEvent) {
  
                // item que foi clicado
                var oItem = oEvent.getSource().getSelectedItem();
                // Contexto do item clicado (armazena os dados do back end)
                var oAlunoContext = oItem.getBindingContext();
                //var oFormModel = this.getView().getModel("form"); // JSONModel
                // ID do aluno que foi selecionado
                var sIdItemClicado = oAlunoContext.getProperty("Id") ;
                // ID do último aluno selecionado
                var sIdAtual = this._oFormModel.getProperty("/id") ;
                // Se o mesmo aluno selecionado, desligar update e limpar JSONModel
                if (sIdAtual === sIdItemClicado) {
                    this._oFormModel.setProperty("/isUpdate", false );
                    this._oFormModel.setProperty("/id", "" );
                    this._oFormModel.setProperty("/nome", "" );
                    this._oFormModel.setProperty("/sobrenome", "" );
                    this._oFormModel.setProperty("/dtNascimento","");
                    this._oFormModel.setProperty("/usuario", "");
                } else { // se um novo aluno foi selecionado, atualiza o formulário
                    this._oFormModel.setProperty("/isUpdate", true ) ;
                    this._oFormModel.setProperty("/id", sIdItemClicado ) ;
                    this._oFormModel.setProperty("/nome", oAlunoContext.getProperty("FirstName"));
                    this._oFormModel.setProperty("/sobrenome",oAlunoContext.getProperty("LastName"));
                    this._oFormModel.setProperty("/dtNascimento", oAlunoContext.getProperty("BirthDate"));
                    this._oFormModel.setProperty("/usuario",oAlunoContext.getProperty("UserName")) ;

                    
                }
            },

            onPressSave: function() {
                let that = this;
                
                let sPath = "/Students";
                let oData = {
                    FirstName: this._oFormModel.getProperty("/nome"),
                    LastName:  this._oFormModel.getProperty("/sobrenome"),
                    BirthDate: this._oFormModel.getProperty("/dtNascimento"),
                    UserName:  this._oFormModel.getProperty("/usuario")
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
            /*
            onPressSaveOld: function() {
            /*
              let sNome         = this.byId("nome").getValue();
              let sSobrenome    = this.byId("sobrenome").getValue();
              let sDtNascimento = this.byId("dtNascimento").getValue();
              let sUsuario      = this.byId("usuario").getValue();
            /*
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
            */
            onPressClear: function() {

                this._oFormModel.setProperty("/nome", "");
                this._oFormModel.setProperty("/sobrenome", "");
                this._oFormModel.setProperty("/dtNascimento", "");
                this._oFormModel.setProperty("/usuario", "");
                //this._oFormModel.setData({
                //     primeiro_nome: "",
                //     ultimo_nome: ""
                //});
            },
            
            onPressUpdate: function(oEvent) {
                //oFormModel = this.getView().getModel("form"); // JSONModel
                // Dados que serão enviados ao back end
                var oAluno = {
                    FirstName : this._oFormModel.getProperty ("/nome") ,
                    LastName :  this._oFormModel.getProperty("/sobrenome"),
                    BirthDate:  this._oFormModel.getProperty("/dtNascimento"),
                    UserName:   this._oFormModel.getProperty("/usuario")
                };
                // callback de sucesso
                function onSuccess() {
                var sMensagem = "Aluno atualizado com sucesso";
                    MessageToast.show(sMensagem);
                }
                // callback de erro
                function onError (oErro) {
                    var sMensagem = JSON.parse(oErro.responseText).error.message.value;
                MessageBox.error(sMensagem) ;
                }
                // parametro de configuracao da chamada
                var mParameters = {
                success : onSuccess ,
                error : onError
                };
                // @type sap.ui.model.odata.v2.ODataModel
                //var oDataModel = this.getView().getModel();
                // URL para o update /Students('1234')
                var sPath = this._oDataModel.createKey("Students", {
                    Id : this._oFormModel.getProperty("/id")
                } ) ;
                // chama o back end
                this._oDataModel.update("/" + sPath , oAluno , mParameters);
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
                
       
                let oList = this.byId("list");
                let oListItem = oList.getSelectedItem();
                let oContext = oListItem.getBindingContext();
                let oStudent = oContext.getObject();
                let sPath    = oContext.getPath();

                /*    
                var oBinding = oList.getBinding("items");

                var oItem = oEvent.getParameters().listItem;
                var oContext = oItem.getBindingContext();
                var oStudent = oContext.getObject();
                var sPath = oContext.getPath(); //    /Students(1234)
                */
                function onSuccess(){
                    oList.removeItem(oListItem);
                    MessageToast.show(`Aluno ${oStudent.FirstName} eliminado`);

                };

                function onError(){
                    MessageBox.alert('Erro ao eliminar')
                };
                
                var mParameters = {
                    success: onSuccess.bind(this),
                    error: onError.bind(this)
                };
                // after deletion put the focus back to the list
			    oList.attachEventOnce("updateFinished", oList.focus, oList);
                this._oDataModel.remove(sPath, mParameters);


            }
		});
	});
