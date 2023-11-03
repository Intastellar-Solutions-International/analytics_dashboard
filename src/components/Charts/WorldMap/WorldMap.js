import "./Style.css";
import styles from './Countries.module.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
export default function Map(props) {
   const data = props.data;
   const countries = data.Countries;
   const countryFill = {
      fill: "",
      country: ""
   }
   
   return (
      <>
         <div className="grid-container grid-3">
            {
               (countries != null) ? countries?.map((country, key) => {
                  return (
                      <div className="widget overviewTotal" key={key}>
                        <h3>{(country.country != "") ? country.country : "Unknown"}</h3>
                        <h4>Total: {country.num.total}</h4>
                        <section className="countryStats">
                           <p>Accepted <br />{country.accepted.toLocaleString("de-DE")}%  ({ (country.num.accept === null ) ? "0" : country.num.accept })</p>
                           <p>Declined <br />{country.declined.toLocaleString("de-DE")}% ({ (country.num.decline === null ) ? "0" : country.num.decline  })</p>
                           <p>Functional <br />{country.functional.toLocaleString("de-DE")}% ({ (country.num.functional === null) ? "0" : country.num.functional })</p>
                           <p>Marketing <br />{country.marketing.toLocaleString("de-DE")}% ({ (country.num.marketing === null ) ? "0" : country.num.marketing })</p>
                           <p>Statics <br />{country.statics.toLocaleString("de-DE")}% ({ (country.num.statics === null ) ? "0" : country.num.statics })</p>
                        </section>
                     </div>)
               }) : null
            }
         </div>
         <div style={{width: "1000px"}}>
         </div>
      </>
   )
}