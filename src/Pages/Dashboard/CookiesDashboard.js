const { useState, useEffect, useRef, useContext } = React;
import API from "../../API/api";
const useParams = window.ReactRouterDOM.useParams;
import { DomainContext, OrganisationContext } from "../../App.js";
import useFetch from "../../Functions/FetchHook";

export default function CookiesDashboard() {
    document.title = "Cookies | Intastellar Consents";
    const { handle, id } = useParams();
    const [organisation, setOrganisation] = useContext(OrganisationContext);
    const [currentDomain, setCurrentDomain] = useContext(DomainContext);

    API[id].getCookies.headers.Domains = currentDomain;
    let url = API[id].getCookies.url;
    let method = API[id].getCookies.method;
    let header = API[id].getCookies.headers;
    let consent = null;

    const [loading, data, error, getUpdated] = useFetch(5, url, method, header);

    return (
        <>
            <div className="dashboard-content">
                <h1>Cookies Dashboard</h1>
                {
                    !loading ? data.status == "success" ? <>
                        {
                            data.data.map((cookie, index) => {
                                return (
                                    <div className="cookie" key={index}>
                                        {
                                            console.log(cookie.cookiename)
                                            
                                        }
                                        <p>{cookie.domain}</p>
                                    </div>
                                )
                            })
                        }
                    </> : null : <div className="loading"></div>
                }
            </div>
        </>
    )
}