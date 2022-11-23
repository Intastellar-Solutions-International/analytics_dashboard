import Fetch from "../../../functions/fetch";
import API from "../../../API/api";
import Authentication from "../../../Authentication/Auth";
import Loading from "../../../components/widget/Loading";
const { useState, useEffect, useRef } = React;
const Link = window.ReactRouterDOM.Link;
export default function ViewOrg() {

    const [data, setData] = useState(null);

    useEffect(() => {
        Fetch(API.settings.getOrganisation.url, API.settings.getOrganisation.method, API.settings.getOrganisation.headers, JSON.stringify({
            organisationMember: Authentication.getUserId()
        })).then((data) => {
            if (data === "Err_Login_Expired") {
                localStorage.removeItem("globals");
                window.location.href = "/login";
                return;
            }
            setData(data);
        });
    }, [])

    return (
        <>
            <main className="dashboard-content">
                <h1>My Organisation</h1>
                <Link className="backLink" to="/settings">Back to settings</Link>
                {
                    (!data) ? <Loading /> : data.map((d, key) => {
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