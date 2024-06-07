import "./Login.css";
import API from "../API/api";
import logo from "../Components/Header/logo.png";
const Link = window.ReactRouterDOM.Link;
const useLocation = window.ReactRouterDOM.useLocation;
import Authentication from "../Authentication/Auth";
export default function Signup() {
    document.title = "SignUp | Intastellar Consents";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh"
    const [email, setEmail] = React.useState();
    const [firstname, setFirstName] = React.useState();
    const [lastname, setLastName] = React.useState();
    const [password, setPassword] = React.useState();
    const [companyName, setCompanyName] = React.useState();
    const [isLoading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const type = "";

    return <>
        <div className="loginForm-container">
            <form className="loginForm signup" onSubmit={(e) => { e.preventDefault(), Authentication.SignUp(API.SignUp.url, email, password, firstname, lastname, type, companyName, setErrorMessage, setLoading) }}>
                <img className="loginForm-logo" src={logo} alt="Intastellar Solutions Logo" />
                <h1 className="loginForm-title">Sign up to Intastellar Consents</h1>
                <label>{(errorMessage != null) ? errorMessage : null }</label>
                <label>Company Name:</label>
                <input className="loginForm-inputField" type="text" placeholder="Enter your company name here" onChange={e => { setCompanyName(e.target.value); }} />
                <label>Firstname:</label>
                <input className="loginForm-inputField" type="text" placeholder="Enter your Firstname here" onChange={e => { setFirstName(e.target.value); }} />
                <label>Lastname:</label>
                <input className="loginForm-inputField" type="text" placeholder="Enter your Lastname here" onChange={e => { setLastName(e.target.value); }} />
                <label>Email:</label>
                <input className="loginForm-inputField" type="email" placeholder="Enter your Work email here" onChange={e => { setEmail(e.target.value); }} />
                <label>Password:</label>
                <input className="loginForm-inputField" type="password" placeholder="Create your password here" onChange={e => { setPassword(e.target.value); }} />
                <input type="checkbox" id="tos"/><label htmlFor="tos">I accept <a href="https://www.intastellarsolutions.com/about/legal/terms" target="_blank">Terms and Conditions</a></label>
                <button className="loginForm-inputField --btn" type="submit">{ (isLoading) ? "We are loggin you in..." : "SIGNUP" }</button>
                <Link className="loginForm-inputField --link" to="/login">Have an account? Login</Link>
            </form>
        </div>
    </>
}