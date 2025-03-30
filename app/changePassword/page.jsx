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
                console.error("Ошибка при сохранении уровня:", error);
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
                        src="/28stone.jpg"
                        width={151}
                        height={60}
                        alt="28Stone logo"
                    />
                    <div className={styles.title_text}>                
                    </div>
                </div>
                            
                <PasswordBox pswd={pswd} setPswd={setPswdAndCheckRules} ref={pswdBoxRef}/>
                <div className={styles.level_container}>Security level: {max_unlocked_rules.current}</div>
            </div>
           
            <div ref={aaParent}>
                {allSolved && <RuleBox 
                    heading={"Congratulations!"} 
                    msg={"You have successfully created a password. \u{1F389}\u{1F389}"}
                    correct={true}
                />}        
                {ruleState.filter(r => r.unlocked).sort(sort_rules).map(r => {
                    return(
                        <RuleBox 
                            key={r.num} 
                            heading={`Rule ${r.num}`} 
                            msg={r.msg} 
                            correct={r.correct} 
                            renderItem={r.renderItem}
                            propsToChild={{pswd, setPswd: setPswdAndCheckRules, shakePasswordBox, regenerateRule, correct: r.correct}}
                        />
                    )
                })}                
            </div>

        </div>
        <footer className={styles.footer}>
            <a className={`${styles.flex_1} ${styles.gray_link}`} href="https://www.bamboohr.com/legal/privacy-policy" target="_blank">Privacy Policy  </a>&nbsp;·&nbsp;
            <a className={`${styles.flex_1} ${styles.gray_link}`} href="https://www.bamboohr.com/legal/terms-of-service" target="_blank">Terms of Service</a>
            <div className={styles.placeholder}> </div>
            <svg className={styles.flex_1} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3383 512" width="115px" height="17px">
				<path fill="#777270" d="M472.4 162.2c-61.4 0-94.3 21.1-117.4 44l-6.3 6.6V0h-53.1v343.8c0 103.6 79.8 168.2 171.4 168.2c100.9 0 177.3-77.7 177.3-177.5c0-92.7-79.7-172.3-172-172.3zM467 462.8c-66.8 0-123.5-52.7-123.5-123.3s47.7-128.6 124.6-128.6 122.2 62.2 122.2 127.4c0 70.9-48 124.6-123.5 124.6zM967.1 220.4h-.7c-22.6-26.6-57.3-58-116.8-58c-97.6 0-171.4 73-171.4 174.1c0 106.5 79.3 175.5 168 175.5c55.3 0 95.6-26.6 119.5-55.3h1.4v43.7h53.9V173.3h-53.9v47.1zM850.3 462.9c-79.8 0-118.3-64.3-118.3-126.4s38.5-125.7 119.6-125.7c63.5 0 115.5 50.7 115.5 127.7c0 73-56.1 124.3-116.9 124.3zm593.8-300.5c-56.7 0-96.3 34.8-112.6 67.6c-13.7-38.2-55.3-67.6-106.5-67.6c-42.3 0-75.8 22.6-97.6 51.8h-1.4v-41h-54v327.1h54V318.7c0-68.3 34.8-107.9 89.4-107.9c48.5 0 77.8 41 77.8 94.9v194.6h54.7V318.7c0-75.1 43.1-107.9 88.8-107.9c55.3 0 78.5 44.3 78.5 94.9v194.6h53.9V309.9c0-96.3-51.2-147.5-125-147.5zm724.9 0c-98.4 0-174.8 73-174.8 174.1S2070 512 2169 512 2343.8 432.8 2343.8 336.5 2270.8 162.4 2169 162.4zm0 300.4c-62.8 0-118.8-52.6-118.8-126.3s49.2-125.6 118.8-125.6 118.8 56.7 118.8 125.6-49.8 126.3-118.8 126.3zM1788.3 162.2c-61.4 0-94.3 21.1-117.4 44l-6.3 6.6V25.6h-53.1v318.2c0 103.6 79.8 168.2 171.4 168.2c100.9 0 177.3-77.7 177.3-177.5c0-92.7-79.7-172.3-172-172.3zm-5.4 300.6c-66.8 0-123.5-52.7-123.5-123.3s47.7-128.6 124.6-128.6 122.2 62.2 122.2 127.4c0 70.9-48 124.6-123.5 124.6zM2979.4 312.9l-174 0 0-139.6-39.7 0 0 327.1 39.7 0 0-151.1 174 0 0 151.1 39.8 0 0-327.1-39.8 0 0 139.6zm304.5-43.7c0-45.1-29.3-95.9-110.8-95.9h-94.5v327.1h39.8V363.7h43.7l98.7 136.7h50.4l-103.1-140.5c41.2-8.1 75.7-44.1 75.7-90.6zm-165.5 58.1V209.8h59c42.3 0 65.3 21.1 65.3 59.5c0 31.7-21.6 58.1-64.8 58.1h-59.4zm263.8-141.9c-2-4.6-4.8-8.7-8.3-12c-3.5-3.4-7.5-6.1-12.1-8s-9.6-2.9-14.8-2.9s-10.2 .9-14.9 2.9s-8.7 4.6-12.3 8s-6.3 7.4-8.3 12s-3 9.7-3 15s1 10.6 3 15.3s4.8 8.7 8.3 12.1c3.5 3.5 7.6 6.1 12.3 8s9.6 2.9 14.9 2.9s10.2-.9 14.8-2.9c4.6-1.9 8.7-4.5 12.1-8s6.2-7.5 8.3-12.1c2-4.7 3-9.7 3-15.3s-1-10.4-3-15zm-6.3 28.1c-1.6 4-3.8 7.4-6.6 10.4c-2.8 2.9-6.1 5.2-10 6.9c-3.8 1.7-7.9 2.5-12.3 2.5s-8.7-.9-12.5-2.5s-7.2-4-10-6.9s-5-6.3-6.6-10.4c-1.6-4-2.4-8.3-2.4-13s.8-8.8 2.4-12.8s3.8-7.4 6.6-10.2s6.1-5.2 10-6.9c3.8-1.7 8-2.5 12.5-2.5s8.5 .8 12.3 2.5c3.8 1.7 7.1 4 10 6.9s5 6.3 6.6 10.2c1.6 4 2.4 8.2 2.4 12.8s-.8 9-2.4 13zm-14.4-13.6c2.2-1.9 3.4-4.8 3.4-8.8c0-4.3-1.3-7.5-3.8-9.6s-6.5-3.2-11.8-3.2h-17.2v44.6h6.9v-19.2h7.4l12.1 19.2h7.4l-12.8-19.7c3.3-.4 6.1-1.4 8.4-3.3zm-15.3-1.8h-7.2v-14.2h9.2c1.2 0 2.3 .1 3.5 .3c1.2 .1 2.2 .5 3.2 .9c.9 .5 1.7 1.2 2.2 2s.9 2.1 .9 3.5c0 1.8-.3 3.2-.9 4.1c-.6 1-1.5 1.7-2.6 2.2c-1.1 .5-2.3 .8-3.7 .9c-1.4 .1-2.9 .1-4.5 .1zm-793.7-35.6c-98.4 0-174.8 73-174.8 174.1s75.8 175.5 174.8 175.5 174.8-79.2 174.8-175.5-73.1-174.1-174.8-174.1zm0 300.4c-62.8 0-118.8-52.6-118.8-126.3s49.2-125.6 118.8-125.6 118.8 56.7 118.8 125.6-49.8 126.3-118.8 126.3zM127.2 0c-.4-.1-.6 .4-.4 .7c54.4 61.4 93.9 135.8 113.6 183.5c-25-26.8-48.7-54.6-75.4-73.1C110.9 73.3 53.9 54.7 .9 47.6c-.4 0-.6 .5-.3 .8c129.7 104 99.4 158.4 268.7 179.8c.3 0 .6-.3 .4-.6c-25-77.1-33.2-134.3-75.6-179.7C180.7 33.7 141.4 4.9 127.2 0z"></path>
			</svg>

        </footer>
        </>
      )
}