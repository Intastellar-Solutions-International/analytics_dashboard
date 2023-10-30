import SideNav from "../../../Components/Header/SideNav";
import { reportsLinks } from "../Reports";
const { useState, useEffect, useRef, createContext } = React;
import "./Style.css";
import Crawler from "../../../Components/Crawler";

export default function SiteStatus({domains}) {
    document.title = "Site Status | Intastellar Analytics";
    const [websiteStatus, setWebsiteStatus] = useState("Not Crawled");
    

    return <>
        <SideNav links={reportsLinks} />
        <div className="dashboard-content">
            <h1>Site Status {websiteStatus}</h1>
            <h3>This is a Beta version</h3>
            <p>Check the status of your website.</p>
            <Crawler domains={domains} websiteStatus={websiteStatus} setWebsiteStatus={setWebsiteStatus} />
        </div>
    </>;
}