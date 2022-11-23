import Fetch from "../../Functions/fetch";
import API from "../../API/api";
import Loading from "../../Components/widget/Loading";
const { useState, useEffect, useRef } = React;

export default function Websites() {
    const [data, setData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(Math.floor(Date.now() / 100));
    const [updated, setUpdated] = useState("");

    useEffect(() => {
        Fetch(API.gdpr.getDomains.url, API.gdpr.getDomains.method, API.gdpr.getDomains.headers).then((data) => {
            if (data === "Err_Login_Expired") {
                localStorage.removeItem("globals");
                window.location.href = "/login";
                return;
            }
            setData(data);
            setUpdated("Now");
            setLastUpdated(Math.floor(Date.now() / 1000));
        });
        const interval1 = setInterval(() => {
            if ((Math.floor(Date.now() / 1000)) - lastUpdated >= 60) {
                setUpdated(Math.floor(((Math.floor(Date.now() / 1000)) - lastUpdated) / 60) + " minute ago");
            }
        }, 1000);

        const id = setInterval(() => {
            Fetch(API.gdpr.getDomains.url, API.gdpr.getDomains.method, API.gdpr.getDomains.headers).then((data) => {
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
                <h2>Analytics</h2>
                <h3>List of all domains</h3>
                <p>On all these domains the GDPR cookiebanner is implemented</p>
                <section className="grid-container grid-3">
                    {
                        (!data) ? <Loading /> : data?.map(
                            (domain, key) => {
                                const main = domain[0];
                                const timestamp = domain[1];
                                return (
                                    <>
                                        <a key={key} className="link widget" href={"http://" + main} target="_blank" rel="noopener nofollow noreferer">
                                            {main} <br />
                                            {timestamp}
                                        </a>
                                    </>
                                )
                            }
                        )
                    }
                </section>
            </main>
        </>
    )
}