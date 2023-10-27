export default function DomainList(props){
    const currentDomain = props.domains;
    
    return <>
        {
            (currentDomain == null) ? "" : currentDomain.map((domain) => {
                return <p>{domain}</p>
            })
        }
    </>
}