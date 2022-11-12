import TopWidgets from "../../components/widget/TopWidgets.js";
import Fetch from "../../functions/fetch";
import API from "../../API/api";
import Widget from "../../components/widget/widget.js";
import Loading from "../../components/widget/Loading.js";
import "./Style.css";
import Map from "../../components/Charts/WorldMap/WorldMap.js";
const { useState, useEffect, useRef } = React;

export default function Dashboard() {
    document.title = "Dashboard | Intastellar Analytics";
    const ref = useRef(null);
    const [data, setData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(Math.floor(Date.now() / 100));
    const [updated, setUpdated] = useState("");

    useEffect(() => {
        Fetch(API.getInteractions.url, API.getInteractions.method, API.getInteractions.headers).then((data) => {
            setData(data)
            setUpdated("Now");
            setLastUpdated(Math.floor(Date.now() / 1000));
        });
        const interval1 = setInterval(() => {
            if ((Math.floor(Date.now() / 1000)) - lastUpdated >= 60) {
                setUpdated(Math.floor(((Math.floor(Date.now() / 1000)) - lastUpdated) / 60) + " minute ago");
            }
        }, 1000);

        const id = setInterval(() => {
            Fetch(API.getInteractions.url, API.getInteractions.method, API.getInteractions.headers).then((data) => {
                if (data === "Err_Login_Expired") {
                    localStorage.removeItem("globals");
                    
                    window.location.href = "/login";
                    return;
                }
                setData(data);
                clearInterval(interval1);
                setUpdated("Now");

                setLastUpdated(Math.floor(Date.now() / 1000));
            });
        }, 5 * 60 * 1000);

        return()=>clearInterval(id)
    }, [lastUpdated, setLastUpdated]);

    return (
        <>
            <div className="dashboard-content">
                <h2>Analytics Dashboard</h2>
                <p>Updated: {updated}</p>
                <div className="grid-container grid-3">
                    <TopWidgets />
                </div>
                <div className="">
                    <h2>Data of user interaction</h2>
                    {(!data) ? <Loading /> : <Widget totalNumber={data.Total} overviewTotal={ true } type="Total interactions" /> }
                </div>
                <div className="grid-container grid-3">
                    {(!data) ? <Loading /> : <Widget totalNumber={data.Accepted + "%"} type="Accepted cookies" />}
                    {(!data) ? <Loading /> : <Widget totalNumber={ data.Declined + "%"} type="Declined cookies" /> }
                </div>
                <div className="grid-container grid-3">
                    {(!data) ? <Loading /> : <Widget totalNumber={data.Marketing + "%"} type="Accepted only Marketing" />}
                    {(!data) ? <Loading /> : <Widget totalNumber={data.Functional + "%"} type="Accepted only Functional" />}
                    {(!data) ? <Loading /> : <Widget totalNumber={data.Statics + "%"} type="Accepted only Statics" />}
                    {/* {(!data) ? <Loading /> : <Pie data={{
                        Accepted: data.Accepted,
                        Declined: data.Declined,
                        Marketing: data.Marketing,
                        Functional: data.Functional,
                        Statics: data.Statics
                    }} />} */}
                </div>
                <div>
                    <section className="grid-container grid-3">
                        {(!data) ? <Loading /> :
                            <section>
                                <h3>User interactions based on country</h3>
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