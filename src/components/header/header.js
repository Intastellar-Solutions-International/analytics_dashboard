const { useState, useEffect, useRef, useContext } = React;
import { OrganisationContext, DomainContext } from "../../App";
import "./header.css";
import logo from "./logo.png";
import Fetch from "../../Functions/fetch";
import useFetch from "../../Functions/FetchHook";
import API from "../../API/api";
import Authentication from "../../Authentication/Auth";
import Select from "../SelectInput/Selector";
import IntastellarAccounts from "../IntastellarAccounts/IntastellarAccounts";
const useHistory = window.ReactRouterDOM.useHistory;
const punycode = require("punycode");

export default function Header(props) {
    const [Organisation, setOrganisation] = useContext(OrganisationContext);
    const [currentDomain, setCurrentDomain] = useState((window.location.pathname.split("/")[2] === "view") ? decodeURI(window.location.pathname.split("/")[3]?.replace("%2E", ".")) : "all");
    const profileImage = JSON.parse(localStorage.getItem("globals"))?.profile?.image;
    let domainList = null;
    const Name = JSON.parse(localStorage.getItem("globals"))?.profile?.name?.first_name + " " + JSON.parse(localStorage.getItem("globals"))?.profile?.name?.last_name;
    const navigate = useHistory();
    const [allOrganisations, setallOrganisations] = useState(null);
    const [domains, setDomains] = useState(props.domains);
    const [viewUserProfile, setViewUserProfile] = useState(false);
    const Platform = (localStorage.getItem("platform") == "gdpr") ? "Platform: GDPR Cookiebanner" : "Platform: Ferry Booking";
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

            setallOrganisations(data);
        });

        Fetch(API[window.location.pathname.split("/")[1]]?.getDomains?.url, API[window.location.pathname.split("/")[1]]?.getDomains?.method, API[window.location.pathname.split("/")[1]]?.getDomains?.headers).then((data) => {
            if (data === "Err_Login_Expired") {
                localStorage.removeItem("globals");
                window.location.href = "/login";
                return;
            }
    
            if(data.error === "Err_No_Domains") {
                
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
                    <section style={{display:"flex", alignItems:"center"}}>
                        <img className="dashboard-logo" src={ logo } alt="Intastellar Solutions Logo" />
                        {Platform}
                    </section>
                    <section style={{display: "flex", justifyContent:"center", alignItems:"center"}}>
                    {(allOrganisations && Organisation) ? 
                        <Select defaultValue={Organisation}
                            onChange={(e) => { 
                                setOrganisation(e);
                                localStorage.setItem("organisation", e);
                                window.location.reload();}}
                            items={allOrganisations}
                            style={{right: "0"}}
                        />: null
                    }
                    <i className="arrowRight"></i>
                    {(domains && currentDomain) ?
                    <>
                        <Select defaultValue={currentDomain}
                            onChange={(e) => { 
                                const domain = e;
                                setCurrentDomain(domain);
                                window.location.href = `/${window.location.pathname.split("/")[1]}/view/${domain.replace('.', '%2E')}`;
                            }}
                            items={domainList} title="Choose one of your domains"
                            style={{left: "0"}}
                            icon={'dashboard-icons domains'}
                        />
                    </> : null
                    }
                    </section>
                    <div className="flex">
                        <img src={profileImage} className="content-img" onClick={() => setViewUserProfile(!viewUserProfile) } />
                    </div>
                </div>
                {(viewUserProfile) ? <IntastellarAccounts profile={{
                    image: profileImage,
                    name: JSON.parse(localStorage.getItem("globals"))?.profile?.name?.first_name,
                    email: JSON.parse(localStorage.getItem("globals"))?.profile?.email,
                }} setIsOpen={setViewUserProfile} /> : null}
            </header>
        </>
    )
}