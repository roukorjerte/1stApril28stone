import Rule from "./Rule";
import RuleWordle from "./RuleWordle/RuleWordle";
import RuleSlidingPuzzle from "./RuleSlidingPuzzle/RuleSlidingPuzzle";
import RuleMorse from "./RuleMorse/RuleMorse";
import RuleRiddle from "./RuleRiddle/RuleRiddle";
import RuleLocation from "./RuleLocation/RuleLocation";
import RuleTimeEmoji from "./RuleTimeEmoji/RuleTimeEmoji";
import RuleQR from "./RuleQR/RuleQR";
import RuleSum from "./RuleSum/RuleSum";
import RuleEarthquake from "./RuleEarthquake/RuleEarthquake";


var rules = [
    new Rule( 
        "Ваш пароль должен содержать не менее 6 символов.",
        (t) => t?.length >= 6
    ),
    new Rule( 
        "Ваш пароль должен содержать как минимум одну заглавную и одну строчную букву.",
        (t) => (/[A-Z]/.test(t) && /[a-z]/.test(t))
    ),
    new Rule( 
        "Ваш пароль должен содержать специальный символ.",
        (t) => /\W/.test(t)
    ),
    new Rule( 
        "Ваш пароль должен содержать отрицательное число.",
        (t) => /-\d/.test(t)
    ),
    new Rule( 
        "Ваш пароль должен содержать все английские гласные.",
        (t) => /a/i.test(t) && /e/i.test(t) && /i/i.test(t) && /o/i.test(t) && /u/i.test(t)
    ),
    new Rule(
        "Ваш пароль должен содержать двузначное простое число.",
        (t) => /(?:11)|(?:13)|(?:17)|(?:19)|(?:23)|(?:29)|(?:31)|(?:37)|(?:41)|(?:43)|(?:47)|(?:53)|(?:59)|(?:61)|(?:67)|(?:71)|(?:73)|(?:79)|(?:83)|(?:89)|(?:97)/.test(t)
    ),
    new RuleSum(),
    new Rule( 
        "Ваш пароль должен содержать Никнейм одного из админов.",
        (t) => /(?:potra3)|(?:dndhost)|(?:daeruss)|(?:larsulrih)|(?:kireto101)|(?:vatrox)/i.test(t)
    ),
    new Rule( 
        "Ваш пароль должен содержать название одного из континентов на английском.",
        (t) => /asia|europe|africa|australia|oceania|north america|south america|antarctica/i.test(t)
    ),
    new Rule( 
        "Ваш пароль должен содержать число пи с точностью до 5 знаков после запятой.",
        (t) => /(?:3\.14159)/.test(t)
    ),    
    
    new RuleTimeEmoji(),
    new RuleEarthquake(),
    new RuleQR(),
    new RuleMorse(),
    new RuleLocation(),
    // new RuleRiddle(),
    new Rule(
        "Ваш пароль должен содержать одинаковое количество гласных и согласных.",
        (t) => (t.match(/[aeiou]/ig) || []).length === (t.match(/[bcdfghjklmnpqrstvwxyzs]/ig) || []).length
    ),
    new RuleSlidingPuzzle(),
    new Rule(
        "Ваш пароль должен содержать количество символов в самом пароле.",
        (t) => {
            let l = t.length;
            let r = new RegExp(`${l}`);
            return r.test(t);
        }
    )
];


function sort_rules(a, b){
    if(a.correct == b.correct){
        return b.num - a.num;
    }
    else if(!a.correct && b.correct){
        return -1;
    }
    else{
        return 1;
    }
}

export default rules;
export {sort_rules};