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
                            <div style={{
                                display: "flex",
                                gap: "2px",
                                borderBottom: "1px solid rgb(192, 159, 83)",
                                marginBottom: "10px",
                                paddingBottom: "10px"
                            }}>
                                {/* Users count over minutes */}
                                {
                                    liveData?.visitsOverTime.map((minute, index) => {
                                        // Calulate the position of the bar based on the number of minutes gone by.

                                        const time = new Date();
                                        const currentTime = time.getMinutes();
                                        const minuteTime = new Date(minute.minutes).getMinutes();
                                        const diff = currentTime - minuteTime;

                                        // The position should take into account the total width of the container and go from right to left.
                                        const barTransformPosition = (diff * 5) - 5;

                                        // Display a bar for each minute with the height of the bar being the number of users in that minute.
                                        // Update the bars position based on the number of users in that minute.
                                        return <div key={index} className="liveView-content-data-1" style={{
                                            // Update the bars position based on the minutes gone by and move it from right to left.
                                            transform: `translateX(${barTransformPosition}px)`,
                                            transition: "transform 0.5s",
                                            width: "maxContent",
                                        }}>
                                            <div style={{
                                                height: `${(minute.count / liveData.count) * 100
                                                    }%`,
                                                minHeight: "70px",
                                                width: "2px",
                                                backgroundColor: "rgb(192, 159, 83)",
                                            }}></div>
                                            <p className="liveView-content-data-1-text">{Math.round(minute.minutes)}</p>
                                            <p className="liveView-content-data-1-text">{minute.count}</p>
                                        </div>
                                    })
                                }
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