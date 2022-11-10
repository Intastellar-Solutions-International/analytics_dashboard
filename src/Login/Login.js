import "./Login.css";
import logo from "../components/header/logo.png";
import API from "../API/api";
export default function Login() {
    document.title = "Login | Intastellar Analytics";
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();
    const [errorMessage, setErrorMessage] = React.useState("");
    const [display, setDisplay] = React.useState(false);

    const Authenticate = async (e) => {
        e.preventDefault();

        fetch(API.Login.url, {
            withCredentials: false,
            method: "POST",
            headers: {
                'LoginType': 'employee',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then((response) => {
            return response.json();
        }).then(response => {

            if (response?.Message === "Err_Logon_Fail") {
                setErrorMessage("We having trouble to log you in");
                return;
            }

            if (response?.Message === "Err_Logon_Deny") {
                setErrorMessage("Your account has been locked due to too many incorrect password attempts – please contact your Alsense Account Manager for assistance");
                return;
            }

            localStorage.setItem("globals", JSON.stringify(response));
            window.location.href = "/dashboard";

        })
    };

    const checkMail = function (mail) {
        const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (res.test(email)) {
            setDisplay(true)
            return;
        }
        setDisplay(false);
    }

    return (
        <>
            <div className="loginForm-container">
                <form className="loginForm" onSubmit={Authenticate}>
                    <img className="loginForm-logo" src={logo} alt="Intastellar Solutions Logo" />
                    <h1 className="loginForm-title">Login</h1>
                    <label>Email:</label>
                    <input className="loginForm-inputField" type="email" placeholder="email" onChange={e => { setEmail(e.target.value); checkMail(e.target.value) }} />
                    <div style={{display: (display) ? "block" : "none"}}>
                        <label>Password:</label>
                        <input className="loginForm-inputField" type="password" placeholder="password" onChange={e => { setPassword(e.target.value); }} />
                    </div>
                    <button className="loginForm-inputField --btn" type="submit">Login</button>
                </form>
            </div>       
        </>
    )
}