import SideNav from "../../../Components/Header/SideNav";
import { reportsLinks } from "../Reports";
const { useState, useEffect, useRef, createContext } = React;

export default function SiteStatus() {
    document.title = "Site Status | Intastellar Analytics";
    const [website, setWebsite] = useState("");
    const [websiteStatus, setWebsiteStatus] = useState("Not Crawled");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    function crawlWebsite(){
        setWebsiteStatus("Crawling...");
        setLoading(true);
        fetch("https://apis.intastellarsolutions.com/crawl-website", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: website
            })
        }).then(res => res.json()).then(res => {
            setLoading(false);
            setWebsiteStatus(res.status);
            setData(res);
        });
    }

    return <>
        <SideNav links={reportsLinks} />
        <div className="dashboard-content">
            <h1>Site Status</h1>
            <div className="form">
                <label>Website URL</label>
                <input type="text" value={website} onChange={e => setWebsite(e.target.value)} />
                <button onClick={crawlWebsite}>Crawl Website</button>
                <p>Website Status: {websiteStatus}</p>
                {loading && <p>Loading...</p>}
                <h2>Cookies found on your Website</h2>
                {!loading && data?.length > 0 && <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Domain</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d, i) => <tr key={i}>
                            <td>{d.name}</td>
                            <td>{d.domain}</td>
                        </tr>)}
                    </tbody>
                    </table>
                }
            </div>
        </div>
    </>;
}