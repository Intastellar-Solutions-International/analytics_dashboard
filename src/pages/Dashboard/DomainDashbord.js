const { useState, useEffect, useRef, useContext } = React;
import useFetch from "../../Functions/FetchHook";
import Fetch from "../../Functions/fetch";
import API from "../../API/api";
import Widget from "../../Components/widget/widget";
import {Loading, CurrentPageLoading} from "../../Components/widget/Loading";
import "./Style.css";
import Map from "../../Components/Charts/WorldMap/WorldMap.js";
import { DomainContext } from "../../App.js";
import NotAllowed from "../../Components/NotAllowed/NotAllowed";
const useParams = window.ReactRouterDOM.useParams;
const punycode = require("punycode");

export default function DomainDashbord(){
    const { handle } = useParams();
    document.title = `${punycode.toUnicode(handle)} Dashboard | Intastellar Analytics`;

    API.gdpr.getInteractions.headers.Domains = punycode.toASCII(handle);
    const [loading, data, error, updated] = useFetch(5, API.gdpr.getInteractions.url, API.gdpr.getInteractions.method, API.gdpr.getInteractions.headers);

    return (localStorage?.getItem("domains")?.includes(handle)) ? (
        <>
            <div className="dashboard-content">
                <h1>Domain Dashboard</h1>
                <p>You´re currently viewing the data for:</p>
                <h2><a className="activeDomain" href={`https://${handle}`} target="_blank">{punycode.toUnicode(handle)}</a></h2>
                {(loading) ? <Loading /> : (data.Total === 0) ? <h1>No interactions yet</h1> : 
                <>
                    <Widget totalNumber={data.Total} overviewTotal={ true } type="Total interactions" />
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
                </>
                }
                <div className="grid-container grid-3">
                    <section>
                        {(loading) ? <Loading /> : (data.Total === 0) ? null :
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
            </div>
        </>
    ) : (loading) ? <CurrentPageLoading/> : <NotAllowed />
}   