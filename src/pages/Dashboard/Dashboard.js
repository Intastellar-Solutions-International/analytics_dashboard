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
import Filter from "../../Components/Filter";

export default function Dashboard(props){
    document.title = "Home | Intastellar Analytics";
    const [currentDomain, setCurrentDomain] = useContext(DomainContext);
    const [organisation, setOrganisation] = useContext(OrganisationContext);
    const { handle, id } = useParams();
    const [activeData, setActiveData] = useState(null);
    const today = new Date();
    const [fromDate, setFromDate] = useState(new Date(new Date().setDate(today.getDate() - 30)).toISOString().split("T")[0]);
    const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);

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
            <div className="dashboard-content">
                <div style={{padding: "40px 0"}}>
                    <h1 style={{fontSize: "1.5em"}}>Home</h1>
                </div>
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
                    <Filter url={url} method={method} header={header} setActiveData={setActiveData} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
                    <div className="grid-container grid-2">
                    {(loading) ? <>
                        <Loading />
                        <Loading />
                    </> : <>
                        <Widget totalNumber={activeData?.Total.toLocaleString("de-DE")} type="Total interactions" />
                        <div className={"widget no-padding"}>
                            <Map  data={{
                                Countries: activeData?.Countries
                            }} />
                        </div>
                    </>}
                    </div>
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
            </div>
        </>
    )
}