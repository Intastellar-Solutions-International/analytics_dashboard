import TopWidgets from "../../components/widget/TopWidgets.js";
import Fetch from "../../functions/fetch";
import API from "../../API/api";
import Widget from "../../components/widget/widget.js";
import Loading from "../../components/widget/Loading.js";
import "./Style.css";
const { useState, useEffect, useRef } = React;

export default function Dashboard() {
    const ref = useRef(null);
    const [data, setData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(Math.floor(Date.now() / 100));
    const [updated, setUpdated] = useState("");

    useEffect(() => {
        Fetch(API.getInteractions.url, API.getInteractions.method).then((data) => {
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
            Fetch(API.getInteractions.url, API.getInteractions.method).then((data) => {
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
            <main className="dashboard-content">
                <h2>Analytics Dashboard</h2>
                <p>Updated: { updated }</p>
                <div className="grid-container grid-3">
                    <TopWidgets />
                </div>
                <div className="grid-container grid-3">
                    
                </div>
                <div className="">
                    <h2>User Interactions</h2>
                    {(!data) ? <Loading /> : <Widget totalNumber={ data.Total } type="Total interactions" /> }
                </div>
                <div className="grid-container grid-3">
                    {(!data) ? <Loading /> : <Widget totalNumber={data.Accepted + "%"} type="Accepted cookies" />}
                    {(!data) ? <Loading /> : <Widget totalNumber={ data.Declined + "%"} type="Declined cookies" /> }
                </div>
                <div className="grid-container grid-3">
                    {(!data) ? <Loading /> : <Widget totalNumber={data.Marketing + "%"} type="Accepted only Marketing" />}
                    {(!data) ? <Loading /> : <Widget totalNumber={data.Functional + "%"} type="Accepted only Functional" />}
                    {(!data) ? <Loading /> : <Widget totalNumber={ data.Statics + "%"} type="Accepted only Statics" /> }
                </div>
            </main>
        </>
    )
}