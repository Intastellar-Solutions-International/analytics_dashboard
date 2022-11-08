import API from "../API/api";
export default function Login() {
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();
    const [errorMessage, setErrorMessage] = React.useState("");
    const [disabled, setDisabled] = React.useState(true);

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

    return (
        <>
            <form onSubmit={ Authenticate }>
                <input type="email" placeholder="email" onChange={e => { setEmail(e.target.value); }}/>
                <input type="password" placeholder="password" onChange={e => { setPassword(e.target.value); }} />
                <button type="submit">Login</button>
            </form>       
        </>
    )
}