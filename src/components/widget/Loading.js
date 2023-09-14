import "./Widget.css";
import "./Loading.css";
function Loading() {
    return (
        <>
            <div className="widget">
                <div className="bigNumIsLoading"></div>
                <div className="smallIsLoading"></div>
            </div>
        </>
    )
}

function CurrentPageLoading(){
    return(
        <>
            <div className="dashboard-content">
                <div className="bigNumIsLoading"></div>
                <div className="smallIsLoading"></div>
            </div>
        </>
    )
}

export {Loading, CurrentPageLoading}