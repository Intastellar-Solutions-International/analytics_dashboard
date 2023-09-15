import "./Style.css";
import styles from './Countries.module.css';
import { VectorMap } from "react-jvectormap"
const { getCode, getName, getData } = require("country-list");

export default function Map(props) {
   const data = props.data;
   const countries = data.Countries;
   
   /* const countryMap = countries?.reduce((country, key) => {
      const countryCode = getCode(country.country);
      const Total = country.num.total;
      return {countryCode, Total};
   }) */

   /* const countryMap = countries?.reduce((country, key) => {
      const countryCode = getCode(country.country);
      return {countryCode: country.num.total}
   }, {}) */

   const mapData = {
      CN: 100000,
      IN: 9900,
      SA: 86,
      EG: 70,
      SE: 0,
      FI: 0,
      FR: 0,
      US: 20
   };
   const handleClick = (e, countryCode) => {
      console.log(countryCode);
   };

   console.log(mapData);

   return (
      <>
         <div className="grid-container grid-3">
            {
            /* <VectorMap
               map={"world_mill"}
               backgroundColor="transparent" //change it to ocean blue: #0077be
               zoomOnScroll={false}
               containerStyle={{
                 width: "100%",
                 height: "520px"
               }}
               onRegionClick={handleClick} //gets the country code
               containerClassName="map"
               regionStyle={{
                 initial: {
                   fill: "#e4e4e4",
                   "fill-opacity": 0.9,
                   stroke: "none",
                   "stroke-width": 0,
                   "stroke-opacity": 0
                 },
                 hover: {
                   "fill-opacity": 0.8,
                   cursor: "pointer"
                 },
                 selected: {
                   fill: "#2938bc" //color for the clicked country
                 },
                 selectedHover: {}
               }}
               regionsSelectable={true}
               series={{
                 regions: [
                   {
                     values: mapData, //this is your data
                     scale: ["#146804", "#ff0000"], //your color game's here
                     normalizeFunction: "polynomial"
                   }
                 ]
               }}
             /> */
               
            }
         </div>
         <div style={{width: "1000px"}}>
         </div>
      </>
   )
}