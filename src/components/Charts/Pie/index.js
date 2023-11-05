const { useState, useEffect, useRef, useContext } = React;
import { use } from "i18next";
import "./Style.css";

export default function Line({data, title, fromDate, toDate}){
    const dailyData = data?.map((d, i) => {
        return {
            "name": new Intl.DateTimeFormat('da-DK').format(new Date(d.date)),
            "domain": d.num
        }
    })

    useEffect(() => {
        
        anychart.onDocumentReady(function() {
            // The main JS line charting code will be here.
            let dataSet = anychart.data.set(dailyData);
            const mapping = dataSet.mapAs({x: "name", value: "domain"});
            if(dataSet.oc != dailyData){
                document.getElementById("chart").innerHTML = "";
            }
            let chart = anychart.pie();
            
            chart.background().fill("transparent");
            chart.xAxis().title("Day");
            chart.yAxis().title("Active Users");
            chart.tooltip().format("Active users: {%Value}");
            const series = chart.pie(mapping);
    
            series.normal().stroke("#C09F53");
            series.hovered().stroke("#C09F53", 2, "10 5", "round");
            series.selected().stroke("#C09F53", 4, "10 5", "round");
    
            chart.container("chart");
            if(data !== null){
                chart.draw();
            }
        });
    }, [dailyData]);

    return(
        <div className={"widget no-padding"}>
            <h2>{title}</h2>
            <div className="line-chart" id="chart">
            </div>
        </div>
    )
}