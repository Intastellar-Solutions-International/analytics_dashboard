import Fetch from "../../Functions/FetchHook";
import API from "../../API/api";
import Loading from "../../Components/widget/Loading";
const { useState, useEffect, useRef } = React;

export default function Websites() {

    const [loading, data, error] = Fetch(10, API.gdpr.getDomains.url, API.gdpr.getDomains.method, API.gdpr.getDomains.headers);


    return (
        <>
            <main className="dashboard-content">
                <h2>Analytics</h2>
                <h3>List of all domains</h3>
                <p>On all these domains the GDPR cookiebanner is implemented</p>
                <section className="grid-container grid-3">
                    {
                        (loading) ? <Loading /> : data?.map(
                            (domain, key) => {
                                const main = domain[0];

                                const timestamp = domain[1];

                                const installed = domain[1];
                                const lastVisited = domain[2];
                                return (
                                    <>
                                        <a key={key} className="link widget" href={"http://" + main} target="_blank" rel="noopener nofollow noreferer">
                                            {main} <br />
                                            {timestamp}
                                            {installed}
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