import "./Style.css";
export default function Map(props) {
   const data = props.data;
   const countries = data.Countries;

   return (
      <div className="grid-container grid-3">
         {
            countries?.map((country, key) => {
               return (
                  <div className="widget overviewTotal" key={key}>
                     <h3>{(country.country != "") ? country.country : "Unknown"}</h3>
                     <h4>Total: {country.num.total}</h4>
                     <section className="countryStats">
                        <p>Accepted <br />{country.accepted}%  ({ (country.num.accept === null ) ? "0" : country.num.accept })</p>
                        <p>Declined <br />{country.declined}% ({ (country.num.decline === null ) ? "0" : country.num.decline  })</p>
                        <p>Functional <br />{country.functional}% ({ (country.num.functional === null) ? "0" : country.num.functional })</p>
                        <p>Marketing <br />{country.marketing}% ({ (country.num.marketing === null ) ? "0" : country.num.marketing })</p>
                        <p>Statics <br />{country.statics}% ({ (country.num.statics === null ) ? "0" : country.num.statics })</p>
                     </section>
                  </div>)
            })
         }
      </div>
   )
}