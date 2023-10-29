const { useState, useEffect, useRef, createContext } = React;
import Select from "../SelectInput/Selector";
import Button from "../Button/Button";
import Table from "../Tabel";
import TextInput from "../InputFields/textInput";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./Style.css";

export default function Crawler({domains, websiteStatus = null, setWebsiteStatus = null}){
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [websites, setWebsites] = useState([]);
    const [crawlerItem, setCrawlerItem] = useState("");
    const [defaultValue, setDefaultValue] = useState("or Select a Website");
    if(websiteStatus === null){
        [websiteStatus, setWebsiteStatus] = useState("Not Crawled");
    }
    

    function crawlWebsite(){
        setWebsiteStatus("Crawling...");
        setLoading(true);
        fetch("https://apis.intastellarsolutions.com/crawl-website", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: "https://" + crawlerItem
            })
        }).then(res => res.json()).then(res => {
            if(res === "Err_Invalid_Website"){
                setWebsiteStatus("Invalid Website");
                setLoading(false);
                return;
            }
            setLoading(false);
            setWebsiteStatus("Crawled");
            setData(res);
        });
    }

    return <>
        <div className="form">
            <h1>Cookie checker</h1>
            <h3>This is a Beta version</h3>
            <div className="crawler-form">
                <TextInput placeholder="Enter Website" onChange={(e) => {
                    if(e.target.value.indexOf("https://") !== -1){
                        e.target.value = e.target.value.replace("https://", "");
                    }
                    setCrawlerItem(e.target.value)
                }} />
                {domains &&
                <Select defaultValue={defaultValue} key={""} items={domains?.map((d) => {
                    return d.domain;
                })} onChange={
                    (e) => {
                        setCrawlerItem(e);
                        setDefaultValue(e);
                    }
                } />}
                <Button className="crawl-cta" onClick={crawlWebsite}>Crawl Website</Button>
            </div>

            {
                websiteStatus === "Crawled" && <p>Found {data?.length} cookies on your website.</p>
            }

            {loading && <LoadingSpinner />}
            
            {!loading && data?.length > 0 && <>
                <h3>First party Cookies found on {crawlerItem.replace("https://", "").replace("http://", "").replace("www.", "")}</h3>
                <Table headers={["Name", "Value", "Domain"]} data={data} />
                {/* <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Domain</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((d, i) => <tr key={i}>
                            <td>{d.name}</td>
                            <td>{d.domain}</td>
                        </tr>)}
                    </tbody>
                </table> */}
            </>
            }
        </div>
    </>;
}