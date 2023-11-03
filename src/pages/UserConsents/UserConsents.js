const { useState, useEffect, useRef, useContext } = React;
import { isJson } from "../../Functions/isJson.js";
import useFetch from "../../Functions/FetchHook";
import Unknown from "../../Components/Error/Unknown.js";
import NoDataFound from "../../Components/Error/NoDataFound.js";
import { Loading } from "../../Components/widget/Loading.js";
import API from "../../API/api.js";
import { reportsLinks } from "../Reports/Reports.js";
import "./Style.css";
import SideNav from "../../Components/Header/SideNav.js";
import Filter from "../../Components/Filter/index.js";
import { DomainContext, OrganisationContext } from "../../App.js";
const useParams = window.ReactRouterDOM.useParams;
const urlParams = new URLSearchParams(window.location.search);

export default function UserConsents(props) {
    document.title = "User consents | Intastellar Analytics";
    const [currentDomain, setCurrentDomain] = useContext(DomainContext);
    const [organisation, setOrganisation] = useContext(OrganisationContext);
    const { handle, id } = useParams();
    const page = urlParams.get("page") || 1;

    const today = new Date();
    const [fromDate, setFromDate] = useState(new Date(new Date().setDate(today.getDate() - 30)).toISOString().split("T")[0]);
    const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
    const [activeData, setActiveData] = useState(null);

    API[id].getDomainsUrl.headers.Domains = currentDomain;
    API[id].getDomainsUrl.headers.Offset = page;
    API[id].getDomainsUrl.headers.FromDate = fromDate;
    API[id].getDomainsUrl.headers.ToDate = toDate;

    const header = API[id].getDomainsUrl.headers;
    const url = API[id].getDomainsUrl.url;
    const method = API[id].getDomainsUrl.method;

    const [getDomainsUrlLoading, getDomainsUrlData, getDomainsUrlError, getDomainsUrlGetUpdated] = useFetch(5, API[id].getDomainsUrl.url, API[id].getDomainsUrl.method, API[id].getDomainsUrl.headers);
    
    return (
        <>
            <SideNav links={reportsLinks} />
            <article style={{flex: "1"}}>
                <section style={{padding: "40px", backgroundColor: "rgb(218, 218, 218)", color: "#626262", marginBottom: "20px"}}>
                    <h1>Reports - User consents</h1>
                </section>
                <div className="dashboard-content">
                    <section className="filter">
                        <Filter url={url} method={method} header={header} setActiveData={setActiveData} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
                    </section>
                    {(getDomainsUrlLoading && !getDomainsUrlError) ? <Loading /> : (getDomainsUrlError) ? <Unknown /> : ( getDomainsUrlData == "Err_No_Data_Found") ? <NoDataFound /> : <>
                        <div className="grid-container grid-3">
                        {
                            getDomainsUrlData?.map((d, key) => {
                                
                                let consent = "";
                                if(isJson(d?.consent)) {
                                    consent = JSON.parse(d?.consent);
                                }else{
                                    consent = d?.consent;
                                }

                                return (
                                    <>
                                        <div className="user" key={key}>
                                            <p>UID: {d?.uid}</p>
                                            <p>Time: {new Date(d?.consents_timestamp).toLocaleString('de-DE', { timeZone: 'Europe/Copenhagen' })}</p>
                                            <p className="lb">Referrer: {d?.referrer}</p>
                                            <p className="lb">URL: {d?.url}</p>
                                            <section>
                                                <h4>Consent given</h4>
                                                {
                                                    (Object.prototype.toString.call(consent) === '[object Array]') ? consent?.map((c, key) => {
                                                            return <p key={key}>{c?.type} cookies: {(!c.checked) ? "declined" : (c?.checked == "checked" || c?.checked == "1") ? "Accepted" : c?.checked}</p>
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