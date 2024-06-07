import "./Style.css";
export default function Footer(){
    const year = new Date().getFullYear();
    return <>
        <footer className="footer dashboard-content">
            <p>&copy; {year} Intastellar Solutions International. | <a href="https://www.intastellarsolutions.com/about/legal/terms" target="_blank" className="links">Terms of Service</a></p>
        </footer>
    </>
}