import TopWidgets from "../../components/widget/TopWidgets.js";
import "./Style.css";
export default function Dashboard() {
    
    return (
        <>
            <main className="dashboard-content">
                <h2>Analytics Dashboard</h2>
                <div className="grid-container grid-3">
                    <TopWidgets />
                </div>
                <div className="grid-container grid-3">
                    
                </div>
                <div className="">
                   
                </div>
                <div className="grid-container grid-3">
                    
                </div>
                <div className="grid-container grid-3">
                    
                </div>
            </main>
        </>
    )
}