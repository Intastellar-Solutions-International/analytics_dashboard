import "./Style.css";
export default function Map(props) {
   const data = props.data;
   const countries = data.Countries;

   return (
      <>
         {
            countries.map((country, key) => {
               return (
                  <div className="country" key={key}>
                     <h3>{(country.country != "") ? country.country : "Unknown"}</h3>
                     <section className="countryStats">
                        <p>Total: {country.num}</p>
                        <p>Accepted: {country.accepted}%</p>
                        <p>Declined: {country.declined}%</p>
                        <p>Functional: {country.functional}%</p>
                        <p>Marketing: {country.marketing}%</p>
                        <p>Statics: {country.statics}%</p>
                     </section>
                  </div>)
            })
         }
      </>
   )
}