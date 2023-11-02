const { useState, useEffect, useRef, useContext } = React;
import TopWidgets from "../../Components/widget/TopWidgets.js";
import useFetch from "../../Functions/FetchHook";
import API from "../../API/api";
import Widget from "../../Components/widget/widget";
import {Loading, CurrentPageLoading} from "../../Components/widget/Loading";

import "./Style.css";
import Map from "../../Components/Charts/WorldMap/WorldMap.js";
import { DomainContext, OrganisationContext } from "../../App.js";
const useParams = window.ReactRouterDOM.useParams;
import Crawler from "../../Components/Crawler";
import e from "cors";
import Button from "../../Components/Button/Button.js";

export default function Dashboard(props){
    document.title = "Home | Intastellar Analytics";
    const [currentDomain, setCurrentDomain] = useContext(DomainContext);
    const [organisation, setOrganisation] = useContext(OrganisationContext);
    const { handle, id } = useParams();
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [activeData, setActiveData] = useState(null);

    const dashboardView = props.dashboardView;
    let url = API[id].getInteractions.url;
    let method = API[id].getInteractions.method;
    let header = API[id].getInteractions.headers;
    let consent = null;

    useEffect(() => {
        function handleScrollEvent() {
          if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
             console.log("you're at the bottom of the page");
             // here add more items in the 'filteredData' state from the 'allData' state source.
          }
       
        }
      
        window.addEventListener('scroll', handleScrollEvent)
      
        return () => {
          window.removeEventListener('scroll', handleScrollEvent);
        }
      }, [])
    
    API[id].getInteractions.headers.Domains = currentDomain;
    API[id].getInteractions.headers.FromDate = fromDate;
    API[id].getInteractions.headers.ToDate = toDate;
    url = API[id].getInteractions.url;
    method = API[id].getInteractions.method;
    header = API[id].getInteractions.headers;

    const [loading, data, error, getUpdated] = useFetch(5, url, method, header);
    useEffect(() => {
        if(data){
            setActiveData(data);
            console.log(data);
        }
    }, [data]);

    document.querySelectorAll(".intInput").forEach((input) => {
        input.setAttribute("max", new Date().toISOString().split("T")[0]);
    })

    return (
        <>
            <div className="dashboard-content">
                    {
                        (id === "gdpr" && organisation != null &&  JSON.parse(organisation).id == 1) ? <TopWidgets dashboardView={dashboardView} API={{
                            url: API[id].getTotalNumber.url,
                            method: API[id].getTotalNumber.method,
                            header: API[id].getTotalNumber.headers 
                        }} /> : null
                    }
                <div className="crawler">
                    <Crawler />
                </div>
                <div className="" style={{paddingTop: "40px"}}>
                    <h2>Data of user interaction</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        fetch(url, { method: method, headers: header} ).then((res) => res.json()).then((data) => {
                            console.log(data);
                            setActiveData(data);
                        })
                    }}>
                        <h3>Filter by date</h3>
                        <section className="grid-container grid-3">
                            <input type="date" className="intInput" onChange={(e) => {
                                setFromDate(e.target.value)
                            }} min="2019-01-01" />
                            <input type="date" className="intInput" onChange={(e) => {
                                setToDate(e.target.value)
                            }} min="2019-01-01" />
                            <Button type="submit" className="crawl-cta" text="Filter by date" />
                        </section>
                    </form>
                    {(loading) ? <Loading /> : <Widget totalNumber={activeData?.Total.toLocaleString("de-DE")} overviewTotal={ true } type="Total interactions" /> }
                </div>
                <div className="grid-container grid-3">
                    {(loading) ? <Loading /> : <Widget totalNumber={activeData?.Accepted.toLocaleString("de-DE") + "%"} type="Accepted cookies" />}
                    {(loading) ? <Loading /> : <Widget totalNumber={ activeData?.Declined.toLocaleString("de-DE") + "%"} type="Declined cookies" /> }
                </div>
                <div className="grid-container grid-3">
                    {(loading) ? <Loading /> : <Widget totalNumber={activeData?.Marketing.toLocaleString("de-DE") + "%"} type="Accepted only Marketing" />}
                    {(loading) ? <Loading /> : <Widget totalNumber={activeData?.Functional.toLocaleString("de-DE") + "%"} type="Accepted only Functional" />}
                    {(loading) ? <Loading /> : <Widget totalNumber={activeData?.Statics.toLocaleString("de-DE") + "%"} type="Accepted only Statics" />}
                </div>
                <div>
                    <section>
                        {(loading) ? <Loading /> :
                            <section>
                                <h3>User interactions based on country</h3>
                                <p>Updated: {getUpdated}</p>
                                {
                                    <Map data={{
                                        Marketing: activeData?.Marketing.toLocaleString("de-DE"),
                                        Functional: activeData?.Functional.toLocaleString("de-DE"),
                                        Statistic: activeData?.Statics.toLocaleString("de-DE"),
                                        Accepted: activeData?.Accepted.toLocaleString("de-DE"),
                                        Declined: activeData?.Declined.toLocaleString("de-DE"),
                                        Countries: activeData?.Countries
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