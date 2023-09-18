import Widget from "./widget";
import useFetch from "../../Functions/FetchHook";
import {Loading} from "./Loading";

export default function TopWidgets(props) {
    
    const APIUrl = props.API.url;
    const APIMethod = props.API.method;
    const APIHeader = props.API.header;

    const [loading, data, error, updated] = useFetch(30, APIUrl, APIMethod, APIHeader);
    if (data === "Err_Login_Expired") {
        localStorage.removeItem("globals");
        window.location.href = "/#login";
        return;
    }
    
    console.log(loading, data, error, updated);

    return (
        <>
            <p>Updated: {updated}</p>
            <div className="grid-container grid-3">
                {(loading) ? <Loading /> : <Widget overviewTotal={ true } totalNumber={ data?.Total.toLocaleString("de-DE") } type="Website" /> }
                {(loading) ? <Loading /> : <Widget totalNumber={ data?.JS.toLocaleString("de-DE") + "%" } type="JS" /> }
                {(loading) ? <Loading /> : <Widget totalNumber={ data?.WP.toLocaleString("de-DE") + "%" } type="WordPress" /> }
            </div>
        </>
    )
}