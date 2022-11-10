import Fetch from "../../functions/fetch";
import API from "../../API/api";
import Loading from "../../components/widget/Loading";
const { useState, useEffect, useRef } = React;

export default function Websites() {
    const [data, setData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(Math.floor(Date.now() / 100));
    const [updated, setUpdated] = useState("");

    useEffect(() => {
        Fetch(API.getDomains.url, API.getDomains.method, API.getDomains.headers).then((data) => {
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
            Fetch(API.getDomains.url, API.getDomains.method, API.getDomains.headers).then((data) => {
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
            <main className="dashboard-content">
                <h2>Analytics Dashboard</h2>
                <h3>List of all Websites</h3>
                {
                    (!data) ? <Loading /> : data.map(
                        (domain) => {
                            return (
                                <>
                                    <a href={ "http://" + domain }>{domain}</a><br />
                                </>
                            )
                        }
                    )
                }
            </main>
        </>
    )
}