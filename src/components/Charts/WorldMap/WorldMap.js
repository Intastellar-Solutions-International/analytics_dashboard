import "./Style.css";
const { useState, useEffect, useRef, createContext } = React;
const svgMap = window.svgMap;
import countryCodes from "./countryCodes.js";
export default function Map(props) {
   const data = props.data;
   const countries = data.Countries;

   if(countries != null){
      
      const newArray = countries.map((country, key) => {
         if(country.country != "Unknown"){
            /* console.log(country); */
            const name = country.country;
            const code = countryCodes[name];
            return {
               [code]: {
                  total: country.num.total,
                  accepted: country.accepted,
                  rejected: country.declined,
                  functional: country.functional,
                  statistics: country.statics,
                  marketing: country.marketing,
                  color: "#c09f53"
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
                  thresholdMin: 10
               },
               accepted: {
                  name: 'Accepted Consents',
                  format: '{0} %',
                  thousandSeparator: '.',
                  thresholdMax: 800,
                  thresholdMin: 10
               },
               rejected: {
                  name: 'Rejected Consents',
                  format: '{0} %',
                  thousandSeparator: '.',
                  thresholdMax: 800,
                  thresholdMin: 10
               },
               functional: {
                  name: 'Functional Consents',
                  format: '{0} %',
                  thousandSeparator: '.',
                  thresholdMax: 800,
                  thresholdMin: 10
               },
               statistics: {
                  name: 'Statistics Consents',
                  format: '{0} %',
                  thousandSeparator: '.',
                  thresholdMax: 800,
                  thresholdMin: 10
               },
               marketing: {
                  name: 'Marketing Consents',
                  format: '{0} %',
                  thousandSeparator: '.',
                  thresholdMax: 800,
                  thresholdMin: 10
               }
              },
              applyData: 'total',
              values: mapCountries,
            },
            initialZoom: 1.15,
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