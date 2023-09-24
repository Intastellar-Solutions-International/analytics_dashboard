import Fetch from "../../../Functions/fetch";
import useFetch from "../../../Functions/FetchHook";
import API from "../../../API/api";
import Authentication from "../../../Authentication/Auth";
import {Loading, CurrentPageLoading} from "../../../Components/widget/Loading";
const { useState, useEffect, useRef } = React;
const Link = window.ReactRouterDOM.Link;
const useParams = window.ReactRouterDOM.useParams;
export default function ViewOrg() {
    document.title = "My Organisation | Intastellar Analytics";
    const {handle, id} = useParams();

    const [loading, data, error, updated] = useFetch(1,API.settings.getOrganisation.url, API.settings.getOrganisation.method, API.settings.getOrganisation.headers, JSON.stringify({
        organisationMember: Authentication.getUserId()
    }))
    
    return (
        <>
            <main className="dashboard-content">
                <h1>My Organisation</h1>
                <Link className="backLink" to="/settings">Back to settings</Link>
                {
                    (loading) ? <Loading /> : data.map((d, key) => {
                        d = JSON.parse(d);
                        return (
                            <>
                                <h2 key={key} className="widget">{ d.name }</h2>
                            </>
                        )
                    })
                }
            </main>
        </>
    )
}