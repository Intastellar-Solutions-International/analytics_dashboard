const { useState, useEffect, useRef, useContext } = React;
import TopWidgets from "../../Components/widget/TopWidgets.js";
import useFetch from "../../Functions/FetchHook";
import API from "../../API/api";
import Widget from "../../Components/widget/widget";
import {Loading} from "../../Components/widget/Loading";

import "./Style.css";
import Map from "../../Components/Charts/WorldMap/WorldMap.js";
import { DomainContext, OrganisationContext } from "../../App.js";
const useParams = window.ReactRouterDOM.useParams;
import Crawler from "../../Components/Crawler";
import Line from "../../Components/Charts/Line";
import Pie from "../../Components/Charts/Pie";
import StickyPageTitle from "../../Components/Header/Sticky/index.js";
import { LiveView } from "../../components/LiveView/index.js";
import {PremiumTier, BasicTier, ProTier} from "../../Components/tiers/index.js";

export default function Dashboard(props){
    document.title = "Home | Intastellar Analytics";
    const [currentDomain, setCurrentDomain] = useContext(DomainContext);
    const [organisation, setOrganisation] = useContext(OrganisationContext);
    const subscriptionStatus = JSON.parse(localStorage.getItem("subscription"));
    const { handle, id } = useParams();
    const [activeData, setActiveData] = useState(null);
    const [getLastDays, setLastDays] = useState((localStorage.getItem("settings") != null) ? JSON.parse(localStorage.getItem("settings")).dateRange : 30);
    const today = new Date();
    const [fromDate, setFromDate] = useState(new Date(new Date().setDate(today.getDate() - getLastDays)).toISOString().split("T")[0]);
    const [toDate, setToDate] = useState(new Date(new Date().setDate(today.getDate() - 1)).toISOString().split("T")[0]);

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
        }
    }, [data]);

    document.querySelectorAll(".intInput").forEach((input) => {
        input.setAttribute("max", new Date().toISOString().split("T")[0]);
    })

    return (
        <>
            <StickyPageTitle title="Home" url={url} method={method} header={header} setLastDays={setLastDays} getLastDays={getLastDays} setActiveData={setActiveData} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
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
                    <div className="grid-container grid-2">
                        <h2>User Interactions</h2>
                        <LiveView />
                    </div>
                    <div className="grid-container" style={{gridTemplateColumns: "1fr .5fr", gap: "20px"}}>
                    {(loading) ? <>
                        <Loading />
                        <Loading />
                    </> : <>
                        {(activeData) ? <Line data={activeData?.dailyNum} data2={activeData?.dailyNum} fromDate={fromDate} toDate={toDate} title={"Daily user interactions"}/> : null}
                        <div className={"widget no-padding"}>
                            <Map  data={{
                                Countries: activeData?.Countries
                            }} />
                        </div>
                    </>}
                    </div>
                </div>
                
                {subscriptionStatus?.tier === "premium" ?
                    <PremiumTier loading={loading} activeData={activeData} />
                : (subscriptionStatus?.tier === "professional") ?
                    <ProTier loading={loading} activeData={activeData} />
                : <BasicTier />
                }
            </div>
        </>
    )
}