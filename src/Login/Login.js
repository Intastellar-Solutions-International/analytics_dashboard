import "./Login.css";
import logo from "../components/header/logo.png";
import API from "../API/api";
import Authentication from "../Authentication/Auth";
export default function Login() {
    document.title = "Login | Intastellar Analytics";
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();
    const [errorMessage, setErrorMessage] = React.useState(null);


    return (
        <>
            <div className="loginForm-container">
                <form className="loginForm" onSubmit={(e) => { e.preventDefault(), Authentication.Login(API.Login.url, email, password, setErrorMessage) }}>
                    <img className="loginForm-logo" src={logo} alt="Intastellar Solutions Logo" />
                    <h1 className="loginForm-title">Login</h1>
                    <label>{(errorMessage != null) ? errorMessage : null }</label>
                    <label>Email:</label>
                    <input className="loginForm-inputField" type="email" placeholder="email" onChange={e => { setEmail(e.target.value); }} />
                    <label>Password:</label>
                    <input className="loginForm-inputField" type="password" placeholder="password" onChange={e => { setPassword(e.target.value); }} />
                    <button className="loginForm-inputField --btn" type="submit">Login</button>
                </form>
            </div>       
        </>
    )
}