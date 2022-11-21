const { useState, useEffect, useRef } = React;
import "./header.css";
import logo from "./logo.png";
import Fetch from "../../functions/fetch";
import API from "../../API/api";
import Authentication from "../../Authentication/Auth";

export default function Header() {
    const profileImage = JSON.parse(localStorage.getItem("globals"))?.profile?.image;
    const Name = JSON.parse(localStorage.getItem("globals"))?.profile?.name?.first_name + " " + JSON.parse(localStorage.getItem("globals"))?.profile?.name?.last_name;
    const email = JSON.parse(localStorage.getItem("globals"))?.profile?.email;

    const [data, setData] = useState(null);

    useEffect(() => {
        Fetch(API.settings.getOrganisation.url, API.settings.getOrganisation.method, API.settings.getOrganisation.headers, JSON.stringify({
            organisationMember: Authentication.getUserId()
        })).then((data) => {
            if (data === "Err_Login_Expired") {
                localStorage.removeItem("globals");
                window.location.href = "/login";
                return;
            }

            if (JSON.parse(localStorage.getItem("globals")).organisation == null) {
                JSON.parse(localStorage.getItem("globals")).organisation = data;
            }
            
            setData(data);
        });
    }, [])

    return (
        <>
            <header className="dashboard-header">
                <div className="dashboard-profile">
                    <img className="dashboard-logo" src={ logo } alt="Intastellar Solutions Logo" />
                    <div className="flex">
                        <img src={profileImage} className="content-img"></img>
                        <div>
                            <p className="dashboard-name">{Name}</p>
                            <select className="dashboard-organisationSelector">
                            {
                                (!data) ? "" : data.map((d, key) => {
                                    return (
                                        <>
                                            <option key={key}>{ d }</option>
                                        </>
                                    )
                                })
                            }
                            </select>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}