import React from "react";
// import "./formula.css";
// import teacher from "./teacher-small.png";

function Formula(props) {
    return (
        <div className="text-center my-4" style={{ fontSize: "larger" }}>
            <div className="mb-2"><span role="img" aria-label="">🧪</span> Formula:</div>
            <pre>
                <code>{props.children}</code>
            </pre>
        </div>
    )
    // return (
    //     <div className="formula-wrapper">
    //         <div className="formula-title">{props.title}</div>
    //         <div className="formula-box">{props.children}</div>
    //         <div className="formula-teacher">
    //             <img src={teacher} alt="" className="img-fluid" />
    //         </div>
    //     </div>
    // )
}

export default Formula;