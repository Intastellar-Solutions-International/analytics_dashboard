import useFetch from "../../Functions/FetchHook";
import API from "../../API/api";
export function LiveView(){
    const [loading, liveData, error, updated] = useFetch(0.25, API.liveData.url + "?ev=cykelfaergen.info", API.liveData.method, API.liveData.headers);
    
    return <>
        {
            (!loading) ?
            <div className="liveView">
                <div className="liveView-content">
                    <p className="liveView-content-title">USERS IN LAST 30 MINUTES</p>
                    <div className="liveView-content-data">
                        <div className="liveView-content-data-1">
                            <p className="liveView-content-data-1-number">{liveData?.count}</p>
                        </div>
                    </div>
                </div>
            </div>
            : null
        }
    </>
}