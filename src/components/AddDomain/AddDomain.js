import Textfield from '../InputFields/textInput';
import Button from '../Button/Button';
import './AddDomain.css';
import DomainList from '../DomainList/DomainList';
import { clearTextfield, extractHostname } from '../../Utils/Utils';

const { useState, useEffect, useRef, createContext } = React;
export default function AddDomain(){
    const [currentDomain, setCurrentDomain] = useState([]);
    return (
        <>
            <div className="dashboard-content">
                <h2>Add domain</h2>
                <p>Here you can add a domain to your organisation.</p>
                <p>After adding a domain you can implement the GDPR cookiebanner on your website.</p>
                <div className='grid'>
                    <section>
                        <Textfield placeholder="Add domain" />
                        <Button onClick={(e) => {
                            e.preventDefault();
                            const domain = extractHostname(e.target.previousSibling.value)
                            setCurrentDomain([...currentDomain, domain]);
                            clearTextfield(e.target.previousSibling);
                        }} text="Add domain to list" />
                    </section>
                    <DomainList domains={currentDomain} setCurrentDomain={setCurrentDomain} />
                </div>
            </div>
        </>
    )
}