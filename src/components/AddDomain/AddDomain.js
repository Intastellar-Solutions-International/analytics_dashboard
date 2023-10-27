import Textfield from '../InputFields/textInput';
import Button from '../Button/Button';
const { useState, useEffect, useRef, createContext } = React;
export default function AddDomain(){
    const [currentDomain, setCurrentDomain] = useState(null);
    return (
        <>
            <div className="dashboard-content">
                <h2>Add domain</h2>
                <p>Here you can add a domain to your organisation.</p>
                <p>After adding a domain you can implement the GDPR cookiebanner on your website.</p>
                <Textfield placeholder="Add domain" />
                <Button onClick={(e) => {
                    e.preventDefault();
                    console.log("Add domain");
                    setCurrentDomain(e.target.previousSibling.value);
                }} text="Add domain" />
                {
                    (currentDomain == null) ? "" : <p>{currentDomain}</p>
                }
            </div>
        </>
    )
}