const { useState, useEffect, useRef, useContext } = React;
import Select from "../../Components/SelectInput/Selector.js";
import NotAllowed from "../../Components/NotAllowed/NotAllowed";
import { isJson } from "../../Functions/isJson.js";
import AddDomain from "../../Components/AddDomain/AddDomain";
import useFetch from "../../Functions/FetchHook";
import Unknown from "../../Components/Error/Unknown.js";
import { Loading } from "../../Components/widget/Loading.js";
import API from "../../API/api.js";
import "./Style.css";
import SideNav from "../../Components/Header/SideNav.js";
import { DomainContext, OrganisationContext } from "../../App.js";

export default function UserConsents(props) {
    const [currentDomain, setCurrentDomain] = useContext(DomainContext);
    const [organisation, setOrganisation] = useContext(OrganisationContext);
    const organisations = props.organisations;


    API.gdpr.getDomainsUrl.headers.Domains = currentDomain;
    const [getDomainsUrlLoading, getDomainsUrlData, getDomainsUrlError, getDomainsUrlGetUpdated] = useFetch(5, API.gdpr.getDomainsUrl.url, API.gdpr.getDomainsUrl.method, API.gdpr.getDomainsUrl.headers);
    return (
        <>
            <SideNav links={[
                {
                    name: "User Consents",
                    path: "/reports/user-consents",
                    icon: "user-consents"
                }
            ]} />
            <article style={{flex: "1"}}>
                <section style={{padding: "40px", backgroundColor: "rgb(218, 218, 218)", color: "#626262"}}>
                    <h1>Reports</h1>
                    <h2 style={{display: "flex"}}>Organisation: {
                        <Select style={{marginLeft: "10px"}} defaultValue={organisation}
                        onChange={(e) => { 
                            setOrganisation(e);
                            localStorage.setItem("organisation", e);
                            window.location.reload();}}
                        items={organisations} title="Choose one of your domains"/>
                    }</h2>
                </section>
                <div className="dashboard-content">
                    <h1>User Consents</h1>
                    {(getDomainsUrlLoading && !getDomainsUrlError) ? <Loading /> : (getDomainsUrlError) ? <Unknown /> : <>
                        <div className="grid-container grid-3">
                        {
                            getDomainsUrlData?.map((d) => {
                                
                                let consent = "";
                                if(isJson(d?.consent)) {
                                    consent = JSON.parse(d.consent);
                                }else{
                                    consent = d.consent;
                                }

                                return (
                                    <>
                                        <div className="user">
                                            <p>UID: {d?.uid}</p>
                                            <p>Time: {d?.consents_timestamp}</p>
                                            <p className="lb">Referrer: {d?.referrer}</p>
                                            <p className="lb">URL: {d.url}</p>
                                            <section>
                                                <h4>Consent given</h4>
                                                {
                                                    (Object.prototype.toString.call(consent) === '[object Array]') ? consent.map((c) => {
                                                            return <p>{c?.type} cookies: {(!c.checked) ? "declined" : (c?.checked == "checked" || c?.checked == "1") ? "Accepted" : c?.checked}</p>
                                                        }) : <p>{consent?.consent_type} cookies: {(consent?.consent_value == "1" || consent?.consent_value == "checked") ? "Accepted" : "declined"}</p>
                                                }
                                            </section>
                                        </div>
                                    </>
                                )
                            })
                        }
                        </div>
                    </>}
                </div>
            </article>
        </>
    )
}