import Textfield from '../InputFields/textInput';
export default function AddDomain(){
    return (
        <>
            <h2>Add domain</h2>
            <p>Here you can add a domain to your organisation.</p>
            <p>After adding a domain you can implement the GDPR cookiebanner on your website.</p>
            <Textfield placeholder="Add domain" />
        </>
    )
}