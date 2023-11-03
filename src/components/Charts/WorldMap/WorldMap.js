import "./Style.css";
const { useState, useEffect, useRef, createContext } = React;
const svgMap = window.svgMap;
var countrieCodes = require("i18n-iso-countries");
// in a browser environment: countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countrieCodes.registerLocale(require("i18n-iso-countries/langs/en.json"));
countrieCodes.registerLocale(require("i18n-iso-countries/langs/fr.json"));
export default function Map(props) {
   const data = props.data;
   const countries = data.Countries;

   if(countries != null){
      
      countries.map((country, key) => {
         if(country.country != "Unknown"){
            const name = country.country;
            console.log(countrieCodes.getAlpha2Codes(name));
            const countryObj = {};
            countryObj[countrieCodes.getAlpha2Codes(name)] = {
               accepted: country.accepted
            }
         }
      });

   
      new svgMap({
         targetElementID: 'svgMap',
         data: {
           data: {
             gdp: {
               name: 'GDP per capita',
               format: '{0} USD',
               thousandSeparator: ',',
               thresholdMax: 50000,
               thresholdMin: 1000
             }
           },
           applyData: 'gdp',
           values: countries
         }
       });
   }
   
   return (
      <>
         <div className="grid-container grid-3">
            <div id="svgMap"></div>
         </div>
         <div style={{width: "1000px"}}>
         </div>
      </>
   )
}