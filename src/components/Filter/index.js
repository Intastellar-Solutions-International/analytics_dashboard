const { useState, useEffect, useRef, useContext } = React;
import Button from "../../Components/Button/Button.js";
export default function Filter({url, method, header, setActiveData, setFromDate, setToDate}) {
    const [loadingTimeDate, setloadingTimeDate] = useState(false);
    return <>
        <form onSubmit={(e) => {
        e.preventDefault();
        setloadingTimeDate(true);
        fetch(url, { method: method, headers: header} ).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
            setActiveData(data);
        }).finally(() => {
            setloadingTimeDate(false);
        })
    }}>
        <h3>Filter by date</h3>
        <section className="grid-container grid-3">
            <input type="date" className="intInput" onChange={(e) => {
                setFromDate(e.target.value)
            }} min="2019-01-01" />
            <input type="date" className="intInput" onChange={(e) => {
                setToDate(e.target.value)
            }} min="2019-01-01" />
            <Button type="submit" disabled={(loadingTimeDate) ? true : ""} className="crawl-cta" text={loadingTimeDate ? "Loading..." : "Search now"} />
        </section>
    </form>
    </>
}