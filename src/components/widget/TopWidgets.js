import Widget from "../../components/widget/widget";
import Fetch from "../../functions/fetch";
import API from "../../API/api";
import Loading from "./Loading";
const { useState, useEffect, useRef } = React;

export default function TopWidgets() {
    const [data, setData] = useState(null);

    useEffect(() => {
        Fetch(API.getTotalNumber.url, API.getTotalNumber.method).then((data) => setData(data))
        
        const id = setInterval(() => {
            Fetch(API.getTotalNumber.url, API.getTotalNumber.method).then((data) => setData(data))
        }, 5 * 60 * 1000);
        return()=>clearInterval(id)
    }, []);

    return (
        <>
            {(!data) ? <Loading /> : <Widget overviewTotal={ true } totalNumber={ data.Total } type="Website" /> }
            {(!data) ? <Loading /> : <Widget totalNumber={ data.JS + "%" } type="JS" /> }
            {(!data) ? <Loading /> : <Widget totalNumber={ data.WP + "%" } type="WordPress" /> }
        </>
    )
}