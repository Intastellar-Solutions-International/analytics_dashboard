import Filter from "../../Filter/index.js";
export default function StickyPageTitle({title, url, method, header, setLastDays, getLastDays, setActiveData, fromDate, toDate, setFromDate, setToDate}){
    window.addEventListener("scroll", (e) => {
        if(window.scrollY > 0){
            document.querySelector(".infoHeader").classList.add("sticky");
        }else{
            document.querySelector(".infoHeader").classList.remove("sticky");
        }
    })
    return <>
        <div className="infoHeader" style={{padding: "40px 0"}}>
            <div className="dashboard-content" style={{
                display: "grid",
                gridTemplateColumns: "1fr .5fr",
                alignItems: "center",
            }}>
                <h1 style={{fontSize: "1.5em"}}>{title}</h1>
                {(url) ? <Filter url={url} method={method} header={header} setLastDays={setLastDays} getLastDays={getLastDays} setActiveData={setActiveData} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} /> : null}
            </div>
        </div>
    </>
}