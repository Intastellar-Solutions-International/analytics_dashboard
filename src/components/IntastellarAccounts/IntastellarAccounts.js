import "./Style.css";

export default function Account(props){
    return  <>
        <div className="user_content">
            <div className="dropdown-image-name">
                <div className="dpde"></div>
                <div className="img" style={
                    {
                        position: "relative",
                        width: "max-content",
                        margin: "20px auto"
                    }
                }>
                    <img src={props.profile.image} className="content-img" />
                    <div className="ziuVxb" style={{position: "absolute", bottom: "10px", right: "20px"}}>
                        <button jsaction="click:lj3vef" aria-label="Change profile picture" className="GXg3Le LgkqPe" jsname="twx2Pc" data-cat="profile" data-cp=""
                        style={{
                            border: "none",
                            borderRadius: "50%",
                            boxShadow: "0 0 9px rgba(0, 0, 0, 0.14), 0 2px 1px rgba(0, 0, 0, 0.28)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#fff",
                            padding: "10px"
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" className="uarSJe NMm5M"><path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 14H4V7h16v12z"></path><path d="M12 9c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"></path></svg>
                        </button>
                    </div>
                </div>
                <div className="dropdown-name">
                    <div className="dpdn">Hi, {props.profile.name}!</div>
                    <div className="dpde">{props.profile.email}</div>
                    <div className="acc">
                        <a href="https://my.intastellaraccounts.com" target="_blank"><img src="https://www.intastellarsolutions.com/assets/icons/fav/favicon-96x96.png" className="logo-icon" />Manage Your Intastellar Account</a>
                    </div>
                </div>
            </div>
            <div className="dropdown-links">
            </div>
            <div className="sign_out_btn_container">
                <a className="sign_out_btn" href="https://www.intastellaraccounts.com/logout.php?continue=my.intastellaraccounts.com/&amp;service=My Account&amp;entryFlow=bXkuaW50YXN0ZWxsYXJhY2NvdW50cy5jb20=&amp;passive=true&amp;flowName=WebSignout&amp;Entry=authLogout">
                    <svg focusable="false" height="24" viewBox="0 0 24 24" width="24" className=" NMm5M"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg> Sign Out
                </a>
            </div>
        </div>
    </>
}