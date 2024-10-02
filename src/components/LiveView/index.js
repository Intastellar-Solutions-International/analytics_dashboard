import useFetch from "../../Functions/FetchHook";
import API from "../../API/api";
import "./Style.css";
export function LiveView(props) {
    API.liveData.headers.Domains = props.currentDomain;

    const [loading, liveData, error, updated] = useFetch(0.25, API.liveData.url, API.liveData.method, API.liveData.headers);

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
                            <div className="liveView-content-data-2">
                                {
                                    // Loop through the 'liveData.contry' object and display the country name.
                                    Object.keys(
                                        liveData?.country
                                    ).map((key, index) => {
                                        return <div key={index} className="liveView-content-country">
                                            <div className="liveView-content-flex">
                                                <p className="liveView-content-data-1-text">{key}</p>
                                                <p className="liveView-content-data-1-text">{liveData?.country[key].count}</p>
                                            </div>
                                            <div style={{
                                                width: `${(liveData?.country[key].count / liveData.count) * 100
                                                    }%`,
                                                height: "2px",
                                                backgroundColor: "rgb(192, 159, 83)",
                                                marginBottom: "10px"
                                            }}></div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                : null
        }
    </>
}