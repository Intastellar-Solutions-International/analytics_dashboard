const { useState, useEffect, useRef, useContext } = React;
import Textfield from '../InputFields/textInput';

export default function AddDomain(props){
    document.title = "Add your domain / Website | Intastellar Analytics";
    const [domainList, setDomainList] = useState([]);
    function addDomainToList(){
        const domain = document.querySelector("input[type='text']").value;
        setDomainList([...domainList, domain]);
    }
    
    console.log(domainList);

    return (
        <>
            <h2>Add domain to "{(props.organisation != null) ? props.organisation : null}"</h2>
            <p>To get started seeing some data please add a domain and implement our Cookie solution, on your Websites.</p>
            <p>Here you can add a domain to your organisation</p>
            <Textfield placeholder="Add domain" onChange={addDomainToList} />
            <input type="hidden" value={JSON.parse(localStorage.getItem("organisation")).id} />
        </>
    )
}