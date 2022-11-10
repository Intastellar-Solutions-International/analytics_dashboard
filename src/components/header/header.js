import "./header.css";
import logo from "./logo.png";

export default function Header() {
    const profileImage = JSON.parse(localStorage.getItem("globals"))?.profile?.image;
    const Name = JSON.parse(localStorage.getItem("globals"))?.profile?.name?.first_name + " " + JSON.parse(localStorage.getItem("globals"))?.profile?.name?.last_name;
    const email = JSON.parse(localStorage.getItem("globals"))?.profile?.email;

    const LogUserOut = () => {
        localStorage.removeItem("globals");
        window.location.reload();
    }
    return (
        <>
            <header className="dashboard-header">
                <div className="dashboard-profile">
                    <img className="dashboard-logo" src={ logo } alt="Intastellar Solutions Logo" />
                    <div className="flex" onClick={LogUserOut}>
                        <img src={profileImage} className="content-img"></img>
                        <p className="dashboard-name">{Name} <br /> { email }</p>
                    </div>
                </div>
            </header>
        </>
    )
}