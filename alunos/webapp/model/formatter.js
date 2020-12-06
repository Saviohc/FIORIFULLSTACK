sap.ui.define([
	"sap/ui/base/Object",
], function () {
	"use strict";

	return {
	
		/**
		 * Creates a human readable date
		 *
		 * @public
		 * @param {Date} oDate the date of the property.
		 * @returns {string} sValue the formatted date
		 */
		date: function(oDate) {
        
            if (oDate) { 
                let oLocale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage())
                let oFormat = sap.ui.core.format.DateFormat.getDateInstance({ style: "short" }, oLocale );
                // @ts-ignore
                let sDate = oFormat.format(oDate);
                return sDate;
            }
		}
	};

});
