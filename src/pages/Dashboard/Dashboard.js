const { useState, useEffect, useRef, useContext } = React;
import TopWidgets from "../../Components/widget/TopWidgets.js";
import useFetch from "../../Functions/FetchHook";
import Fetch from "../../Functions/fetch";
import API from "../../API/api";
import Widget from "../../Components/widget/widget";
import {Loading, CurrentPageLoading} from "../../Components/widget/Loading";
import "./Style.css";
import Map from "../../Components/Charts/WorldMap/WorldMap.js";
import { DomainContext, OrganisationContext } from "../../App.js";

export default function Dashboard(props){
    document.title = "Dashboard | Intastellar Analytics";
    const [currentDomain, setCurrentDomain] = useContext(DomainContext);
    const [organisation, setOrganisation] = useContext(OrganisationContext);
    const [lastUpdated, setLastUpdated] = useState("Now");
    const dashboardView = props.dashboardView;
    let url = API.gdpr.getInteractions.url;
    let method = API.gdpr.getInteractions.method;
    let header = API.gdpr.getInteractions.headers;

    if(dashboardView === "GDPR Cookiebanner") {
        API.gdpr.getInteractions.headers.Domains = currentDomain;
        url = API.gdpr.getInteractions.url;
        method = API.gdpr.getInteractions.method;
        header = API.gdpr.getInteractions.headers;
    };

    const [loading, data, error, updated] = useFetch(5, url, method, header);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        Fetch(url, method, header, signal).then((data) => {
            setData(data)
            setUpdated("Now");
            setLastUpdated(Math.floor(Date.now() / 1000));
        }).catch(err => {
            if (err.name === "AbortError") {
                console.log("cancelled")
            } else {
                
            }
        });
        const interval1 = setInterval(() => {
            if ((Math.floor(Date.now() / 1000)) - lastUpdated >= 60) {
                setUpdated(Math.floor(((Math.floor(Date.now() / 1000)) - lastUpdated) / 60) + " minute ago");
            }
        }, 1000);

        const id = setInterval(() => {
            Fetch(url, method, header, signal).then((data) => {
                if (data === "Err_Login_Expired") {
                    localStorage.removeItem("globals");
                    
                    window.location.href = "/#login";
                    return;
                }
                setData(data);
                clearInterval(interval1);
                setUpdated("Now");

                setLastUpdated(Math.floor(Date.now() / 1000));
            }).catch(err => {
                if (err.name === "AbortError") {
                    console.log("cancelled")
                } else {
                    
                }
            });;
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(id);
            controller.abort();
        }
    }, [lastUpdated, setLastUpdated, dashboardView, props.setDashboardView]);
    return (
        <>
            <div className="dashboard-content">
                <h2>Analytics Dashboard</h2>
                <p>Viewing all data for: {(organisation != null) ? JSON.parse(organisation).name : null}</p>
                {/* <select defaultValue={"GDPR Cookiebanner"} onChange={(e) => {props.setDashboardView(e.target.value)}}>
                    {
                        JSON.parse(localStorage.getItem("globals")).access.type.map((type, key) => {
                            return (
                                <option key={ key } value={type} defaultValue={"GDPR Cookiebanner"}>{ type }</option>
                            )
                        })
                    }
                </select> */}
                {
                    (dashboardView === "GDPR Cookiebanner" && organisation != null &&  JSON.parse(organisation).id == 1) ? <TopWidgets dashboardView={dashboardView} API={{
                        url: API.gdpr.getTotalNumber.url,
                        method: API.gdpr.getTotalNumber.method,
                        header: API.gdpr.getTotalNumber.headers 
                    }} /> : null
                }
                <div className="">
                    <h2>Data of user interaction</h2>
                    <p>Updated: {updated}</p>
                    {(loading) ? <Loading /> : <Widget totalNumber={data.Total} overviewTotal={ true } type="Total interactions" /> }
                </div>
                <div className="grid-container grid-3">
                    {(loading) ? <Loading /> : <Widget totalNumber={data?.Accepted + "%"} type="Accepted cookies" />}
                    {(loading) ? <Loading /> : <Widget totalNumber={ data?.Declined + "%"} type="Declined cookies" /> }
                </div>
                <div className="grid-container grid-3">
                    {(loading) ? <Loading /> : <Widget totalNumber={data?.Marketing + "%"} type="Accepted only Marketing" />}
                    {(loading) ? <Loading /> : <Widget totalNumber={data?.Functional + "%"} type="Accepted only Functional" />}
                    {(loading) ? <Loading /> : <Widget totalNumber={data?.Statics + "%"} type="Accepted only Statics" />}
                    {/* {(!data) ? <Loading /> : <Pie data={{
                        Accepted: data.Accepted,
                        Declined: data.Declined,
                        Marketing: data.Marketing,
                        Functional: data.Functional,
                        Statics: data.Statics
                    }} />} */}
                </div>
                <div>
                    <section>
                        {(loading) ? <Loading /> :
                            <section>
                                <h3>User interactions based on country</h3>
                                <p>Updated: {updated}</p>
                                {
                                    <Map data={{
                                        Marketing: data.Marketing,
                                        Functional: data.Functional,
                                        Statistic: data.Statics,
                                        Accepted: data.Accepted,
                                        Declined: data.Declined,
                                        Countries: data.Countries
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