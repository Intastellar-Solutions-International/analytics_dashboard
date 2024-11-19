const { useState, useEffect, useRef, useContext } = React;
import Button from "../../Components/Button/Button.js";
export default function Filter({ url, method, header, setLastDays, getLastDays, setActiveData, fromDate, toDate, setFromDate, setToDate }) {
    const [loadingTimeDate, setloadingTimeDate] = useState(false);
    const [calendar, setCalendar] = useState(false);

    return <>
        <section style={{ display: "flex", alignItems: "flex-end", gap: "10px", alignItems: "center" }}>
            <select className="intInput" defaultValue={getLastDays} onChange={(e) => {
                setLastDays(e.target.value);
                header.FromDate = new Date(new Date().setDate(new Date().getDate() - e.target.value)).toISOString().split("T")[0];
                fetch(url, { method: method, headers: header }).then((res) => {
                    return res.json();
                }).then((data) => {
                    setActiveData(data);
                    setFromDate(new Date(new Date().setDate(new Date().getDate() - e.target.value)).toISOString().split("T")[0]);
                }).finally(() => {
                    setloadingTimeDate(false);
                })
            }}>
                <option value="1">Yesterday</option>
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="28">Last 28 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
            </select>
            <Button className="crawl-cta" text="Custom" onClick={() => {
                setCalendar(!calendar);
            }} />
        </section>
        {(calendar) ?

            <div style={{
                position: "absolute",
                right: 89,
                width: "400px",
                backgroundColor: " rgb(55, 55, 55)",
                top: 60,
                padding: 20,
                boxShadow: "inset 0 1px 1px 0 rgba(0,0,0,.14),inset 0 2px 1px -1px rgba(209, 209, 209, 0.12)"
            }}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    setloadingTimeDate(true);
                    fetch(url, { method: method, headers: header }).then((res) => {
                        return res.json();
                    }).then((data) => {
                        setActiveData(data);
                    }).finally(() => {
                        setloadingTimeDate(false);
                    })
                }}>
                    <h3>Last {getLastDays} days</h3>
                    <section className="grid-container grid-3">
                        <input type="date" className="intInput" defaultValue={fromDate} onChange={(e) => {
                            setFromDate(e.target.value)
                        }} min="2019-01-01" />
                        <input type="date" className="intInput" defaultValue={toDate} onChange={(e) => {
                            setToDate(e.target.value)
                        }} min="2019-01-01" />
                        <Button type="submit" disabled={(loadingTimeDate) ? true : ""} className="crawl-cta" text={loadingTimeDate ? "Loading..." : "Apply"} />
                    </section>
                </form>
            </div>
            : null}
    </>

}