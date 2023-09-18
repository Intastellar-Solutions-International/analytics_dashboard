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
const punycode = require("punycode");

export default function Header(props) {
    const [Organisation, setOrganisation] = useContext(OrganisationContext);
    const [currentDomain, setCurrentDomain] = useState((window.location.pathname.split("/")[1] === "view") ? decodeURI(window.location.pathname.split("/")[2]?.replace("%2E", ".")) : "all");
    const profileImage = JSON.parse(localStorage.getItem("globals"))?.profile?.image;
    let domainList = null;
    const Name = JSON.parse(localStorage.getItem("globals"))?.profile?.name?.first_name + " " + JSON.parse(localStorage.getItem("globals"))?.profile?.name?.last_name;
    const navigate = useHistory();
    const [data, setData] = useState(null);
    const [domains, setDomains] = useState(null);

    useEffect(() => {

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

        Fetch(API.gdpr.getDomains.url, API.gdpr.getDomains.method, API.gdpr.getDomains.headers).then((data) => {
            if (data === "Err_Login_Expired") {
                localStorage.removeItem("globals");
                window.location.href = "/#login";
                return;
            }
    
            if(data.error === "Err_No_Domains") {
                if(window.location.href.indexOf("/add-domain") == -1){
                    window.location.href = "/add-domain";
                }
            }else{
                data.unshift({domain: "all", installed: null, lastedVisited: null});
                data?.map((d) => {
                    return  punycode.toUnicode(d.domain);
                }).filter((d) => {
                    return d !== undefined && d !== "" && d !== "undefined.";
                });
                setDomains(data);
            
                const allowedDomains = data?.map((d) => {
                    return  punycode.toUnicode(d.domain);
                }).filter((d) => {
                    return d !== undefined && d !== "" && d !== "undefined." && d !== "all";
                });
            
                localStorage.setItem("domains", JSON.stringify(allowedDomains));
    
                if(window.location.href.indexOf("/add-domain") > -1){
                    window.location.href = "/dashboard";
                }
            }
        });
    }, []);
    

    domainList = domains?.map((d) => {
        return punycode.toUnicode(d.domain)
    })

    return (
        <>
            <header className="dashboard-header">
                <div className="dashboard-profile">
                    <img className="dashboard-logo" src={ logo } alt="Intastellar Solutions Logo" />
                    {(domains && currentDomain) ?
                    <>
                        <Select defaultValue={currentDomain}
                            onChange={(e) => { 
                                const domain = e;
                                setCurrentDomain(domain);
                                window.location.href = `/view/${domain.replace('.', '%2E')}`;
                            }}
                            items={domainList} title="Choose one of your domains"
                            style={{left: "0"}}
                        />
                    </> : null
                    }
                    <div className="flex">
                        <img src={profileImage} className="content-img" onClick={() => setViewUserProfile(!viewUserProfile) } />
                        <div className="dashboard-profile__nameContainer">
                            <p className="dashboard-name">{Name}</p>
                            <div className="dashboard-organisationContainer">
                            {(data && Organisation) ?
                                <Select defaultValue={Organisation}
                                    onChange={(e) => { 
                                        setOrganisation(e);
                                        localStorage.setItem("organisation", e);
                                        window.location.reload();}}
                                    items={data}
                                    style={{right: "0"}}
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