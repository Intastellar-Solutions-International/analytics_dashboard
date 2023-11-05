import "./Style.css";

export default function Line({data, title}){
    const dailyData = data?.map((d, i) => {
        return {
            "name": new Intl.DateTimeFormat('da-DK').format(new Date(d.date)),
            "domain": d.num
        }
    })

    anychart.onDocumentReady(function() {
        // The main JS line charting code will be here.
        const dataSet = anychart.data.set(dailyData);
        const mapping = dataSet.mapAs({x: "name", value: "domain"});

        const chart = anychart.line();

        chart.normal().stroke("#00cc99", 1, "10 5", "round");
        chart.hovered().stroke("#00cc99", 2, "10 5", "round");
        chart.selected().stroke("#00cc99", 4, "10 5", "round");

        chart.xAxis().title("Days");
        chart.yAxis().title("Active Users");
        chart.tooltip().format("Active users: {%Value}");
        chart.crosshair().enabled(true).yStroke(null).yLabel(false);
        chart.xScale().mode('continuous');

        chart.line(mapping).name("Amount");
        chart.container("chart");
        if(data !== null){
            chart.draw();
        }
    });

    return(
        <>
            <h2>{title}</h2>
            <div className="line-chart" id="chart">
            </div>
        </>
    )
}