import useFetch from "../../Functions/FetchHook";
import API from "../../API/api";
export function LiveView(){
    const [loading, liveData, error, updated] = useFetch(0.25, API.liveData.url, API.liveData.method, API.liveData.headers);
    
    return <>
        {
            (!loading) ?
            <div className="liveView">
                <div className="liveView-content">
                    <p className="liveView-content-title">Live View</p>
                    <div className="liveView-content-data">
                        <div className="liveView-content-data-1">
                            <p className="liveView-content-data-1-number">{liveData?.count}</p>
                            <p className="liveView-content-data-1-title">last 15 min.</p>
                        </div>
                    </div>
                </div>
            </div>
            : null
        }
    </>
}