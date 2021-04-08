import React from "react";
import "./formula.css";
import teacher from "./teacher-small.png";

function Formula(props) {
    console.log(props);
    return (
        <div className="formula-wrapper">
            <div className="formula-title">{props.title}</div>
            <div className="formula-box">{props.children}</div>
            <div className="formula-teacher">
                <img src={teacher} alt="teacher" />
            </div>
        </div>
    )
}

export default Formula;