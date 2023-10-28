const { useState, useEffect, useRef, createContext } = React;
import Select from "../SelectInput/Selector";
import Button from "../Button/Button";
import Table from "../Tabel";
import TextInput from "../InputFields/textInput";
import "./Style.css";

export default function Crawler({domains, websiteStatus, setWebsiteStatus}){
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [defaultValue, setDefaultValue] = useState("or Select a Website");
    const [websites, setWebsites] = useState([]);
    const [website, setWebsite] = useState("");

    function crawlWebsite(){
        setWebsiteStatus("Crawling...");
        setLoading(true);
        fetch("https://apis.intastellarsolutions.com/crawl-website", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: "https://" + website
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
            <div className="crawler-form">
                <TextInput placeholder="Enter Website" onChange={(e) => setWebsite(e.target.value.split("https://")[1])} />
                <Select defaultValue={defaultValue} key={""} items={domains?.map((d) => {
                    return d.domain;
                })} onChange={
                    (e) => {
                        setWebsite(e);
                        setDefaultValue(e);
                    }
                } />
                <Button className="crawl-cta" onClick={crawlWebsite}>Crawl Website</Button>
            </div>

            {
                websiteStatus === "Crawled" && <p>Found {data?.length} cookies on your website.</p>
            }

            {loading && <p>Loading...</p>}
            
            {!loading && data?.length > 0 && <>
                <h3>First party Cookies found on {website.replace("https://", "").replace("http://", "").replace("www.", "")}</h3>
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