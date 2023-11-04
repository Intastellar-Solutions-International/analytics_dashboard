export default function StickyPageTitle({title}){
    window.addEventListener("scroll", (e) => {
        if(window.scrollY > 0){
            document.querySelector(".infoHeader").classList.add("sticky");
        }else{
            document.querySelector(".infoHeader").classList.remove("sticky");
        }
    })
    return <>
        <div className="infoHeader" style={{padding: "40px 0"}}>
            <div className="dashboard-content">
                <h1 style={{fontSize: "1.5em"}}>{title}</h1>
            </div>
        </div>
    </>
}