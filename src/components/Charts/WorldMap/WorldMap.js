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
      
      const newArray = countries.map((country, key) => {
         if(country.country != "Unknown"){
            /* console.log(country); */
            const name = country.country;
            const code = countrieCodes.getAlpha2Code(name, "en");
            return {
               [code]: {
                  total: country.num.total,
                  accepted: country.accepted,
                  rejected: country.declined,
                  functional: country.functional,
                  statistics: country.statics,
                  marketing: country.marketing,
               }
            }
         }
      });

      const mapCountries = Object.assign({}, ...newArray);

      useEffect(() => {
         document.getElementById("svgMap").innerHTML = "";
         new svgMap({
            targetElementID: 'svgMap',
            data: {
              data: {
               total: {
                  name: 'Total Interactions',
                  format: '{0}',
                  thousandSeparator: '.',
                  thresholdMax: 800,
                  thresholdMin: 50
               },
               accepted: {
                  name: 'Accepted Consents',
                  format: '{0} %',
                  thousandSeparator: '.',
                  thresholdMax: 800,
                  thresholdMin: 50
               },
               rejected: {
                  name: 'Rejected Consents',
                  format: '{0} %',
                  thousandSeparator: '.',
                  thresholdMax: 800,
                  thresholdMin: 50
               },
               functional: {
                  name: 'Functional Consents',
                  format: '{0} %',
                  thousandSeparator: '.',
                  thresholdMax: 800,
                  thresholdMin: 50
               },
               statistics: {
                  name: 'Statistics Consents',
                  format: '{0} %',
                  thousandSeparator: '.',
                  thresholdMax: 800,
                  thresholdMin: 50
               },
               marketing: {
                  name: 'Marketing Consents',
                  format: '{0} %',
                  thousandSeparator: '.',
                  thresholdMax: 800,
                  thresholdMin: 50
               }
              },
              applyData: 'total',
              values: mapCountries,
            },
            initialZoom: 1.1,
          });
      }, [data])
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