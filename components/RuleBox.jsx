import React from 'react';
import "./RuleBox.css";

function RuleBox({heading, msg, correct, renderItem, propsToChild}) {
    
    // Using renderItem prop to render child component so that we can pass props to them
    // the props coming from parent, that are to be passed to the child component are in 'propsToChild'
    // this pattern is discussed in: https://react.dev/reference/react/cloneElement#alternatives

    return ( 
        <div className={`rulebox ${correct? "rule-correct": "rule-err" }`}>
            <div className={`rulebox-top ${correct ? "rule-correct" : "rule-err"}`}>
            {correct ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16" id="correct-svg">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
                
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" id="wrong-svg">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"></path>
                </svg>
            )}
            {heading}
        </div>



            <div className="rulebox-desc">
                {msg}
                {renderItem===undefined? null: renderItem(propsToChild)}
            </div>
        </div> 
    );
}

export default RuleBox;