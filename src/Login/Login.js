import "./Login.css";
import logo from "../Components/Header/logo.png";
import API from "../API/api";
import Authentication from "../Authentication/Auth";
const Link = window.ReactRouterDOM.Link;
const useLocation = window.ReactRouterDOM.useLocation;

export default function Login() {
    document.title = "Sign in | Intastellar Consents";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh"
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();
    const [isLoading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const type = "";

    return (
        <>
            <div className="loginForm-container">
                <form className="loginForm" onSubmit={(e) => { e.preventDefault(), Authentication.Login(API.Login.url, email, password, type, setErrorMessage, setLoading) }}>
                    <img className="loginForm-logo" src={logo} alt="Intastellar Solutions Logo" />
                    <h1 className="loginForm-title">Sign in to Intastellar Consents</h1>
                    <label>{(errorMessage != null) ? errorMessage : null }</label>
                    <label>Email:</label>
                    <input className="loginForm-inputField" type="email" placeholder="email" onChange={e => { setEmail(e.target.value); }} />
                    <label>Password:</label>
                    <input className="loginForm-inputField" type="password" placeholder="password" onChange={e => { setPassword(e.target.value); }} />
                    <button className="loginForm-inputField --btn" type="submit">{ (isLoading) ? "We are loggin you in..." : "SIGNIN" }</button>
                    <a className="loginForm-inputField --link" href="/forgot-password">Forgot Password?</a>
                    <Link className="loginForm-inputField --link" to="/signup">Don't have an account? Signup</Link>
                </form>
            </div>       
        </>
    )
}