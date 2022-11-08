import Widget from "../../components/widget/widget";
import FetchData from "../../functions/fetch";
import API from "../../API/api";

export default function TopWidgets() {
    const data = FetchData(API.getTotalNumber.url, API.getTotalNumber.method).then(data => {
        return data;
    });

    if (data) {
        console.log(data);
    }

    return (
        <>
            {(!data) ? <Loading /> : <Widget totalNumber="" type="Website" /> }
            {(!data) ? <Loading /> : <Widget totalNumber="" type="JS" /> }
            {(!data) ? <Loading /> : <Widget totalNumber="" type="WordPress" /> }
        </>
    )
}