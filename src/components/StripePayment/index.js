import Authentication from "../../Authentication/Auth";
import "./Style/Stripe.css";
export default function StripePayment(props) {
    document.title = "Choose a Plan | Intastellar Consents";
    const companyName = JSON.parse(localStorage.getItem("organisation"))?.name;
    return <div className="content">
        <h2>{companyName}</h2>
        <h1>Choose a Plan</h1>
        <p>Choose a plan that suits your needs. You´re about to select a plan for your company: {companyName}</p>
        <stripe-pricing-table class="stripe-price-table" pricing-table-id="prctbl_1OGmIdEK0yX4gMoH7rRqdg9y"
        publishable-key="pk_test_cdjFXrTVnj1SdyYXzlTz95Sk" customer-email={props.userId()}
        client-reference-id={Authentication.getOrganisation()}>
        </stripe-pricing-table>
    </div>
}