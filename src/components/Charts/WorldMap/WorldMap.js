import "./Style.css";
const { useState, useEffect, useRef, createContext } = React;
const svgMap = window.svgMap;
import { countryCodes, countryCoordinates } from "./countryCodes.js";

function colorCalulator(value) {
   const baseColor = "#c09f53";
   const maxColor = "#c09f53";
   const minColor = "#ddd29b";
   const max = 1000;
   const min = 0;
   const percent = Math.round((value - min) / (max - min) * 100);

   console.log(value, percent);


   const color = {
      r: Math.floor(parseInt(minColor.slice(1, 3), 16) * (1 - percent) + parseInt(maxColor.slice(1, 3), 16) * percent),
      g: Math.floor(parseInt(minColor.slice(3, 5), 16) * (1 - percent) + parseInt(maxColor.slice(3, 5), 16) * percent),
      b: Math.floor(parseInt(minColor.slice(5, 7), 16) * (1 - percent) + parseInt(maxColor.slice(5, 7), 16) * percent)
   }

   if (value > 1000) {
      return baseColor;
   } else {
      return `rgb(${color.r}, ${color.g}, ${color.b})`;
   }
}

export default function Map(props) {
   const data = props.data;
   const countries = data.Countries;

   if (countries != null) {

      const newArray = countries.map((country, key) => {
         if (country.country != "Unknown") {
            /* console.log(country); */
            const name = country.country;
            const code = countryCodes[name];
            return {
               [code]: {
                  date: data.date ? data.date : "No data",
                  total: country.num.total,
                  accepted: country.accepted,
                  rejected: country.declined,
                  functional: country.functional,
                  statistics: country.statics,
                  marketing: country.marketing,
                  color: colorCalulator(country.num.total)
               }
            }
         }
      });

      const mapCountries = Object.assign({}, ...newArray);

      useEffect(() => {
         document.getElementById("svgMap").innerHTML = "";
         let zoomLevel = 1.5;
         let center = [0, 0];

         // Zoom into center the area of the map where the data is
         if (countries.length > 0) {
            const min = Math.min(...countries.map(country => country.num.total));
            const max = Math.max(...countries.map(country => country.num.total));

            if (max - min > 1000) {
               zoomLevel = 1.75;

               const lat = countries.map(country => {
                  // Find the country code of the max value
                  const code = countryCodes[country.country];
                  const coords = countryCoordinates[code];
                  return coords ? [coords.lat, coords.lng] : undefined;
               }).filter((lat) => {
                  return lat !== undefined
               });

               const lng = countries.map(country => {
                  const code = countryCodes[country.country];
                  const coords = countryCoordinates[code];
                  return coords ? [coords.lat, coords.lng] : undefined;
               }).filter((lng) => {
                  return lng !== undefined;
               });

               const latMin = Math.min(...lat);
               const latMax = Math.max(...lat);

               const lngMin = Math.min(...lng);
               const lngMax = Math.max(...lng);

               center = [(latMax + latMin) / 2, (lngMax + lngMin) / 2];
            }
         }


         new svgMap({
            targetElementID: 'svgMap',

            data: {
               data: {
                  date: {
                     name: 'Date',
                     format: '{0}',
                  },
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
            initialZoom: zoomLevel,
            initialLocation: center,
         });
      }, [data])
   }

   return (
      <>
         <div className="grid-container grid-3">
            <div id="svgMap"></div>
         </div>
         <div style={{ width: "1000px" }}>
         </div>
      </>
   )
}