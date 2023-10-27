import Textfield from '../InputFields/textInput';
import Button from '../Button/Button';
import './AddDomain.css';
import DomainList from '../DomainList/DomainList';
import { clearTextfield } from '../../Utils/Utils';
const { useState, useEffect, useRef, createContext } = React;
export default function AddDomain(){
    const [currentDomain, setCurrentDomain] = useState([]);
    
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
                    setCurrentDomain([...currentDomain, e.target.previousSibling.value]);
                    clearTextfield(e.target.previousSibling);
                }} text="Next" />
                <DomainList domains={currentDomain} />
            </div>
        </>
    )
}