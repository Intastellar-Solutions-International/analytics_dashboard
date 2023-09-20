const { useState, useEffect, useRef, useContext } = React;
import TopWidgets from "../../Components/widget/TopWidgets.js";
import useFetch from "../../Functions/FetchHook";
import Fetch from "../../Functions/fetch";
import Authentication from "../../Authentication/Auth";
import API from "../../API/api";
import Widget from "../../Components/widget/widget";
import {Loading, CurrentPageLoading} from "../../Components/widget/Loading";
import AddDomain from "../../Components/AddDomain/AddDomain";
import "./Style.css";
import Map from "../../Components/Charts/WorldMap/WorldMap.js";
import { DomainContext, OrganisationContext } from "../../App.js";
import Select from "../../Components/SelectInput/Selector.js";
import NotAllowed from "../../Components/NotAllowed/NotAllowed";
import { isJson } from "../../Functions/isJson.js";

export default function Dashboard(props){
    document.title = "Dashboard | Intastellar Analytics";
    const [currentDomain, setCurrentDomain] = useContext(DomainContext);
    const [organisation, setOrganisation] = useContext(OrganisationContext);
    const dashboardView = props.dashboardView;
    let url = API.gdpr.getInteractions.url;
    let method = API.gdpr.getInteractions.method;
    let header = API.gdpr.getInteractions.headers;
    let consent = null;

    if(dashboardView === "GDPR Cookiebanner") {
        API.gdpr.getInteractions.headers.Domains = currentDomain;
        url = API.gdpr.getInteractions.url;
        method = API.gdpr.getInteractions.method;
        header = API.gdpr.getInteractions.headers;
    };

    const [loading, data, error, getUpdated] = useFetch(5, url, method, header);
    API.gdpr.getDomainsUrl.headers.Domains = currentDomain;
    const [getDomainsUrlLoading, getDomainsUrlData, getDomainsUrlError, getDomainsUrlGetUpdated] = useFetch(5, API.gdpr.getDomainsUrl.url, API.gdpr.getDomainsUrl.method, API.gdpr.getDomainsUrl.headers);

    return (
        <>
            <div className="dashboard-content">
                <div>
                    {
                        (dashboardView === "GDPR Cookiebanner" && organisation != null &&  JSON.parse(organisation).id == 1) ? <TopWidgets dashboardView={dashboardView} API={{
                            url: API.gdpr.getTotalNumber.url,
                            method: API.gdpr.getTotalNumber.method,
                            header: API.gdpr.getTotalNumber.headers 
                        }} /> : null
                    }
                </div>
                <div className="" style={{paddingTop: "40px"}}>
                    <h2>Data of user interaction</h2>
                    {(loading) ? <Loading /> : <Widget totalNumber={data?.Total.toLocaleString("de-DE")} overviewTotal={ true } type="Total interactions" /> }
                </div>
                <div className="grid-container grid-3">
                    {(loading) ? <Loading /> : <Widget totalNumber={data?.Accepted.toLocaleString("de-DE") + "%"} type="Accepted cookies" />}
                    {(loading) ? <Loading /> : <Widget totalNumber={ data?.Declined.toLocaleString("de-DE") + "%"} type="Declined cookies" /> }
                </div>
                <div className="grid-container grid-3">
                    {(loading) ? <Loading /> : <Widget totalNumber={data?.Marketing.toLocaleString("de-DE") + "%"} type="Accepted only Marketing" />}
                    {(loading) ? <Loading /> : <Widget totalNumber={data?.Functional.toLocaleString("de-DE") + "%"} type="Accepted only Functional" />}
                    {(loading) ? <Loading /> : <Widget totalNumber={data?.Statics.toLocaleString("de-DE") + "%"} type="Accepted only Statics" />}
                </div>
                {(getDomainsUrlLoading) ? <Loading /> : <>
                        <div>
                            <h2>User consents</h2>
                            <div className="grid-container grid-3">
                            {
                                getDomainsUrlData?.map((d) => {
                                    
                                    let consent = "";
                                    if(isJson(d.consent)) {
                                        consent = JSON.parse(d.consent);
                                    }else{
                                        consent = d.consent;
                                    }

                                    return (
                                        <>
                                            <div className="user">
                                                <p>UID: {d?.uid}</p>
                                                <p>Time: {d.consents_timestamp}</p>
                                                <p>Referrer: {d.referrer}</p>
                                                <p className="lb">URL: {d.url}</p>
                                                <section>
                                                    <h4>Consent given</h4>
                                                    {
                                                        (Object.prototype.toString.call(consent) === '[object Array]') ? consent.map((c) => {
                                                                return <p>{c.type} cookies: {(!c.checked) ? "false" : c.checked}</p>
                                                            }) : <p>{consent.consent_type} cookies: {consent.consent_value}</p>
                                                    }
                                                </section>
                                            </div>
                                        </>
                                    )
                                })
                            }
                            </div>
                        </div>
                    </>}
                <div>
                    <section>
                        {(loading) ? <Loading /> :
                            <section>
                                <h3>User interactions based on country</h3>
                                <p>Updated: {getUpdated}</p>
                                {
                                    <Map data={{
                                        Marketing: data?.Marketing.toLocaleString("de-DE"),
                                        Functional: data?.Functional.toLocaleString("de-DE"),
                                        Statistic: data?.Statics.toLocaleString("de-DE"),
                                        Accepted: data?.Accepted.toLocaleString("de-DE"),
                                        Declined: data?.Declined.toLocaleString("de-DE"),
                                        Countries: data?.Countries
                                    }} />
                                }
                            </section>
                        }
                    </section>
                </div>
                {/* <div className="grid-container grid-3 widget">
                    {(!data) ? <Loading /> :
                    <PieChart data={{
                        Marketing: data.Marketing,
                        Functional: data.Functional,
                        Statistic: data.Statics,
                        Accepted: data.Accepted,
                        Declined: data.Declined
                        }} />
                    }
                </div> */}
            </div>
        </>
    )
}