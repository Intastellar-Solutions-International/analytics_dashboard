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
                document.getElementById("line-chart").innerHTML = "";
            }
            let chart = anychart.line();
            
            chart.background().fill("transparent");
            chart.xAxis().title("Day");
            chart.yAxis().title(title);
            chart.tooltip().format(title + ": {%Value}");
            const series = chart.line(mapping);
    
            series.normal().stroke("#C09F53");
            series.hovered().stroke("#C09F53", 2, "10 5", "round");
            series.selected().stroke("#C09F53", 4, "10 5", "round");
    
            chart.container("line-chart");
            if(data !== null){
                chart.draw();
            }
        });
    }, [dailyData]);

    return(
        <div className={"widget no-padding"}>
            {
                (title) ? <h2>{title}</h2> : null
            }
            <div className="chart" id="line-chart">
            </div>
        </div>
    )
}