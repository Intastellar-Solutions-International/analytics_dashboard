const { useState, useEffect, useRef, useContext } = React;
import { OrganisationContext, DomainContext } from "../../App";
import "./header.css";
import logo from "./logo.png";
import Fetch from "../../Functions/fetch";
import useFetch from "../../Functions/FetchHook";
import API from "../../API/api";
import Authentication from "../../Authentication/Auth";
import Select from "../SelectInput/Selector";
const useHistory = window.ReactRouterDOM.useHistory;

export default function Header() {
    const [Organisation, setOrganisation] = useContext(OrganisationContext);
    const [currentDomain, setCurrentDomain] = useContext(DomainContext);
    const profileImage = JSON.parse(localStorage.getItem("globals"))?.profile?.image;
    const Name = JSON.parse(localStorage.getItem("globals"))?.profile?.name?.first_name + " " + JSON.parse(localStorage.getItem("globals"))?.profile?.name?.last_name;
    const navigate = useHistory();
    const [data, setData] = useState(null);
    const [domains, setDomains] = useState(null);
    useEffect(() => {
        Fetch(API.gdpr.getDomains.url, API.gdpr.getDomains.method, API.gdpr.getDomains.headers).then((data) => {
            if (data === "Err_Login_Expired") {
                localStorage.removeItem("globals");
                window.location.href = "/login";
                return;
            }

            if (JSON.parse(localStorage.getItem("globals")).organisation == null) {
                JSON.parse(localStorage.getItem("globals")).organisation = data;
            }

            data.unshift({domain: "all", installed: null, lastedVisited: null});
            data = data.filter((d) => {
                return d !== undefined && d !== "" && d["domain"] !== "undefined." ;
            })
            setDomains(data); 
        });

        Fetch(API.settings.getOrganisation.url, API.settings.getOrganisation.method, API.settings.getOrganisation.headers, JSON.stringify({
            organisationMember: Authentication.getUserId()
        })).then((data) => {
            if (data === "Err_Login_Expired") {
                localStorage.removeItem("globals");
                navigate.push("/login");
                return;
            }

            if (JSON.parse(localStorage.getItem("globals")).organisation == null) {
                JSON.parse(localStorage.getItem("globals")).organisation = data;
            }
            setData(data);
        });
    }, [])
    let view = "";
    const domainList = domains?.map((d) => {
        return  d.domain;
    }).filter((d) => {
        return d !== undefined && d !== "" && d !== "undefined.";
    });

    return (
        <>
            <header className="dashboard-header">
                <div className="dashboard-profile">
                    <img className="dashboard-logo" src={ logo } alt="Intastellar Solutions Logo" />
                    {(domains && currentDomain) ?
                    <>
                        <Select defaultValue={currentDomain}
                            onChange={(e) => { 
                                const domain = e.target.value;
                                setCurrentDomain(domain);
                                window.location.href = `/view/${domain.replace('.', '%2E')}`;
                            }}
                            items={domainList} title="Choose one of your domains"
                        />
                    </> : null
                    }
                    <div className="flex">
                        <img src={profileImage} className="content-img"></img>
                        <div className="dashboard-profile__nameContainer">
                            <p className="dashboard-name">{Name}</p>
                            <div className="dashboard-organisationContainer">
                            {(data && Organisation) ?
                                <Select defaultValue={Organisation}
                                    onChange={(e) => { 
                                        setOrganisation(JSON.parse(e.target.value));
                                        localStorage.setItem("organisation", e.target.value);
                                        window.location.href = "/dashboard";}}
                                    items={data}
                                /> : null
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

{/* <select defaultValue={Organisation} onChange={(e) => { setOrganisation({ id: JSON.parse(e.target.value).id, name: JSON.parse(e.target.value).name }) }} className="dashboard-organisationSelector">
    {
        (!data) ? "" : data.map((d, key) => {
            d = JSON.parse(d);
            return (
                <>
                    <option key={key} value={JSON.stringify({ id: d.id, name: d.name })}>{d.name}</option>
                </>
            )
        })
    }
</select> */}