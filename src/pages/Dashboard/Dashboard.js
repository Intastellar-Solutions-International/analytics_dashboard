import TopWidgets from "../../components/widget/TopWidgets.js";
import Fetch from "../../functions/fetch";
import API from "../../API/api";
import Widget from "../../components/widget/widget.js";
import Loading from "../../components/widget/Loading.js";
import "./Style.css";
const { useState, useEffect } = React;

export default function Dashboard() {
    
    const [data, setData] = useState(null);
    
    useEffect(() => {
        Fetch(API.getInteractions.url, API.getInteractions.method).then((data) => setData(data));
    }, []);

    return (
        <>
            <main className="dashboard-content">
                <h2>Analytics Dashboard</h2>
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