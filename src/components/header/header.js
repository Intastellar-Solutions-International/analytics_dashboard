const { useState, useEffect, useRef, useContext } = React;
import { OrganisationContext } from "../../App";
import "./header.css";
import logo from "./logo.png";
import Fetch from "../../functions/fetch";
import API from "../../API/api";
import Authentication from "../../Authentication/Auth";

export default function Header() {
    const [Organisation, setOrganisation] = useContext(OrganisationContext);
    const profileImage = JSON.parse(localStorage.getItem("globals"))?.profile?.image;
    const Name = JSON.parse(localStorage.getItem("globals"))?.profile?.name?.first_name + " " + JSON.parse(localStorage.getItem("globals"))?.profile?.name?.last_name;

    console.log(Organisation);

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
                            <select defaultValue={Organisation} onChange={(e) => { setOrganisation({id: JSON.parse(e.target.value).id, name: JSON.parse(e.target.value).name}) }} className="dashboard-organisationSelector">
                            {
                                (!data) ? "" : data.map((d, key) => {
                                    d = JSON.parse(d);
                                    return (
                                        <>
                                            <option key={key} value={JSON.stringify({id: d.id, name: d.name})}>{ d.name }</option>
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