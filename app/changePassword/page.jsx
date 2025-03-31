'use client'
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import { useAutoAnimate } from '@formkit/auto-animate/react'

import styles from './page.module.css'
import PasswordBox from "../../components/PasswordBox";
import RuleBox from "../../components/RuleBox";



import ruleList, {sort_rules} from "../../rules/rules";

export default function Home(){
    const [pswd, setPswd] = useState("");
    const [ruleState, setRuleState] = useState([]);
    const max_unlocked_rules = useRef(0);
    const pswdBoxRef = useRef(null);
    const [aaParent, aaEnableAnimations] = useAutoAnimate();
    const [allSolved, setAllSolved] = useState(false);


    // initialization rule numbers
    useEffect(() => {

        for (let i = 0; i < ruleList.length; i++) {
            ruleList[i].num = i + 1;
        }
        max_unlocked_rules.current = 0;

        setRuleState(ruleList);

    }, []);

    useEffect(() => {
        async function saveLevel() {
            try {
                const email = localStorage.getItem("userEmail") || "unknown@example.com"; // Берём email из localStorage
                const level = max_unlocked_rules.current;
    
                await fetch("/api/saveEmail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, level }),
                });
            } catch (error) {
                console.error("Error in level save:", error);
            }
        }
    
        saveLevel();
    }, [max_unlocked_rules.current]); // Срабатывает при изменении max_unlocked_rules
    



    // callback on textbox change, check rules along with setPswd
    function setPswdAndCheckRules(txt){
        setPswd(txt);
        checkRules(txt);
    }

    
    //check rules loop
    function checkRules(txt) {
        if(ruleState.length===0) return;

        let rules = [...ruleState];

        //base case, first rule
        if(!rules[0].unlocked && txt.length > 0){
            rules[0].unlocked = true;
            max_unlocked_rules.current++;
        }
        
        let solved_count = 0;
        for(let i=0;i<rules.length;i++){

            if(i===max_unlocked_rules.current){                         // coming to rule that was not unlocked before
                if(solved_count===max_unlocked_rules.current){          // if all previous rules are solved i.e correct at this moment
                    rules[i].unlocked = true;                           // unlock this new rule
                    max_unlocked_rules.current++;                       // increment max unlocked rules
                }                                               
                else{                                                   // if all previous rules are not solved
                    break;                                              // break, do not unlock a new rule
                }
            }

            rules[i].correct = rules[i].check(txt);
            if(rules[i].correct){
                solved_count++;
            }
        }

        setRuleState(rules);
        if(solved_count===rules.length){
            setAllSolved(true);
            max_unlocked_rules.current++;
        }
        else{
            setAllSolved(false);
        }
    }

    function shakePasswordBox(boolean){
        if(boolean){
            pswdBoxRef.current.classList.add("shake");
        }
        else{
            pswdBoxRef.current.classList.remove("shake");
        }
    }

    function regenerateRule(num){
        console.log("regenerate", num);
        num--; //change to rule index
        let rules = [...ruleState];
        if("regenerate" in rules[num]){
            rules[num].regenerate();
            setRuleState(rules);
        }

    }

    return (
        <>
        <div className={styles.container}>
            
            <div className={styles.white_container}>
                <div className={styles.title}>
                    <Image
                        src="/jeka.png"
                        width={312}
                        height={118}
                        alt="logo"
                    />
                    <div className={styles.title_text}>                
                    </div>
                </div>
                            
                <PasswordBox pswd={pswd} setPswd={setPswdAndCheckRules} ref={pswdBoxRef}/>
                <div className={styles.level_container}>Уровень безопасности: {max_unlocked_rules.current}</div>
            </div>
           
            <div ref={aaParent}>
                {allSolved && <RuleBox 
                    heading={"Congratulations!"} 
                    msg={
                        <>
                            Вас обхитрили! С Первым апреля! 🎉🎉 Чтобы посмотреть таблицу рекордов нажмите на: 
                            <a href="/recordsTablePage"> эту ссылку </a>.
                        </>
                    }
                    correct={true}
                />}        
                {ruleState.filter(r => r.unlocked).sort(sort_rules).map(r => {
                    return(
                        <RuleBox 
                            key={r.num} 
                            heading={`Правило ${r.num}`} 
                            msg={r.msg} 
                            correct={r.correct} 
                            renderItem={r.renderItem}
                            propsToChild={{pswd, setPswd: setPswdAndCheckRules, shakePasswordBox, regenerateRule, correct: r.correct}}
                        />
                    )
                })}                
            </div>

        </div>
        </>
      )
}