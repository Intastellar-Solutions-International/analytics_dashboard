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
    const [currentDomain, setCurrentDomain] = useState((window.location.pathname.split("/")[1] === "view") ? decodeURI(window.location.pathname.split("/")[2]?.replace("%2E", ".")) : "all");
    const profileImage = JSON.parse(localStorage.getItem("globals"))?.profile?.image;
    let domainList = null;
    const Name = JSON.parse(localStorage.getItem("globals"))?.profile?.name?.first_name + " " + JSON.parse(localStorage.getItem("globals"))?.profile?.name?.last_name;
    const navigate = useHistory();
    const [data, setData] = useState(null);
    const [domains, setDomains] = useState(props.domains);
    const [viewUserProfile, setViewUserProfile] = useState(false);

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
                    <img className="dashboard-logo" src={ logo } alt="Intastellar Solutions Logo" />
                    <section style={{display: "flex"}}>
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
                    <i className="arrowRight"></i>
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