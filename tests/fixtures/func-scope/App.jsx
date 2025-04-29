import React from "react";

const ChildComp = ({ childName, childAge }) => {
    return (
        <div>
            <p>Name: {childName}</p>
            <p>Age: {childAge}</p>
        </div>
    );
};

const ParentComp = () => {
    const childName = "John";
    const childAge = 10;

    return (
        <div>
            <h1>Parent Component</h1>
            <ChildComp ::childName ::childAge />
        </div>
    );
};

export default ParentComp;