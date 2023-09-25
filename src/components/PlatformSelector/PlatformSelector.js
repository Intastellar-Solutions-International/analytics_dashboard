import Select from "../SelectInput/Selector"

export default function PlatformSelector(props) {
    const items = Object.keys(props?.platforms).map((platform) => {
        return props?.platforms[platform]
    })

    return <>
        <div className="platform">
            <h1>Please Select a Platform that you want to view data for:</h1>
            <Select style={{left: "0"}} title="Choose one of your domains" key={""} items={items} defaultValue={items[1].type} onChange={(e) => {
                props.setId(JSON.parse(e).uri);
                localStorage.setItem("platform", JSON.parse(e).uri);
                window.location.href = `/${JSON.parse(e).uri}/dashboard`;
            }} />
        </div>
    </>
}