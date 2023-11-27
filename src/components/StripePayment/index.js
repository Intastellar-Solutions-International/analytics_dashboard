import Authentication from "../../Authentication/Auth";
import "./Style/Stripe.css";
export default function StripePayment(props) {
    return <div className="content">
        <h1>Choose a Plan</h1>
        <stripe-pricing-table class="stripe-price-table" pricing-table-id="prctbl_1OGmIdEK0yX4gMoH7rRqdg9y"
        publishable-key="pk_test_cdjFXrTVnj1SdyYXzlTz95Sk" customer-email={props.userId()}
        client-reference-id={Authentication.getOrganisation()}>
        </stripe-pricing-table>
    </div>
}