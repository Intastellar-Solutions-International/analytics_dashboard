import Widget from "../../components/widget/widget";
import Fetch from "../../functions/fetch";
import API from "../../API/api";
import Loading from "./Loading";
const { useState, useEffect, useRef } = React;
const Link = window.ReactRouterDOM.Link;

export default function TopWidgets(props) {
    const [data, setData] = useState(null);
    
    const APIUrl = props.API.url;
    const APIMethod = props.API.method;
    const APIHeader = props.API.header;

    useEffect(() => {
        Fetch(APIUrl, APIMethod, APIHeader).then((data) => {
            if (data === "Err_Login_Expired") {
                localStorage.removeItem("globals");
                window.location.href = "/login";
                return;
            }
            setData(data)
        })
        
        const id = setInterval(() => {
            Fetch(APIUrl, APIMethod, APIHeader).then((data) => {
                setData(data)
            })
        }, 5 * 60 * 1000);
        return()=>clearInterval(id)
    }, []);

    return (
        <>
            {(!data) ? <Loading /> : <Link style={{textDecoration: "none"}} to="/domains"><Widget overviewTotal={ true } totalNumber={ data.Total } type="Website" /></Link> }
            {(!data) ? <Loading /> : <Widget totalNumber={ data.JS + "%" } type="JS" /> }
            {(!data) ? <Loading /> : <Widget totalNumber={ data.WP + "%" } type="WordPress" /> }
        </>
    )
}