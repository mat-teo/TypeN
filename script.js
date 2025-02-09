let attiva = CLASS("active");
let inizio = -1;
let giusti=0,sbagliati=0,aggiunti=0,missed=0;
let end=false;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
if(location.protocol=="http:"){
    location.href="https"+location.href.substring(4);
}




document.addEventListener("keydown", press);
async function caricaParole() {
    const response = await fetch('parole.txt'); 
    const text = await response.text();
    return text.split('\n'); 
}

async function getParolaCasuale() {
    const parole = await caricaParole();
    const indiceCasuale = Math.floor(Math.random() * parole.length);
    return parole[indiceCasuale].trim();
}

function aggiungiParola(p){
    let div =document.createElement("div");
    div.classList.add("word");
    ID("solution").appendChild(div);
    for(i = 0; i<p.length; i++){
        let span=document.createElement("span");
        span.innerHTML=p[i];
        span.classList.add("letter");
        div.appendChild(span);
        if(i==p.length-1){
            if(p[i]==' '){
                span.classList="space";
            }
        }
    }
}

window.onload= async function(){
    setUp();
}


async function press(e) {
    if(end){
        return;
    }
    if (!e.key || e.key.length > 1 || !/^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúÁÉÍÓÚ]$/.test(e.key)) {  
        if(e.key=="Backspace"){
            let elements = attiva[0].querySelectorAll(".correct, .wrong, .added");
            if (elements.length > 0) {
                let lastElement = elements[elements.length - 1];
            
                if (lastElement.classList.contains("correct")) {
                    lastElement.classList.remove("correct");
                    lastElement.classList.add("letter");
                    lastElement.classList.add("selected");
                } else if(lastElement.classList.contains("wrong")) {
                    lastElement.classList.remove("wrong");
                    lastElement.classList.add("letter");
                    lastElement.classList.add("selected");
                }else{
                    lastElement.remove();
                }
                let allSel = CLASS("selected");
                if(allSel.length>1){
                    allSel[1].classList.remove("selected");
                }
            }else{
                let parole = CLASS("word");
                if(attiva[0] != parole[0]){
                    for(i = 0; i < parole.length; i++){
                        if(parole[i] == attiva[0]){
                            attiva[0].classList.remove("active");
                            parole[i-1].classList = "word active";
                            CLASS("selected")[0].classList.remove("selected");
                            parole[i-1].querySelectorAll(".space, .letter")[0].classList.add("selected");
                        }
                    }
                }
            }
        }

        else if(e.key == " "){
            let word = CLASS("active")[0];
            let controllo = word.querySelectorAll(".wrong, .added, .letter");
            if(controllo.length>0){
                if(controllo[0].classList=="letter selected" && word.getElementsByClassName("correct").length == 0){
                    return;
                }
                word.classList.add("uncorrect");
            }else{
                word.classList.add("right")
            }
            let cerca = CLASS("word");
            if(cerca[cerca.length-1]==word){ //fine
                word.classList.remove("active");
                fineInserimento();
            }else{
                word.classList.remove("active");
                for(i = 0; i < cerca.length; i++){
                    if(cerca[i].classList=="word"){
                        cerca[i].classList.add("active");
                        CLASS("selected")[0].classList.remove("selected");
                        cerca[i].getElementsByClassName("letter")[0].classList.add("selected");
                        break;
                    }
                }
            }
            
        }
        return;
    }
    if(inizio==-1){
        inizio = performance.now();
    }
    let check = attiva[0].getElementsByClassName("letter");
    if(check.length==0){
        let lettera = document.createElement("span");
        lettera.classList.add("added");
        lettera.innerHTML = e.key; 
        attiva[0].insertBefore(lettera,attiva[0].getElementsByClassName("space")[0]);
        aggiunti++;
    }
    else if(check[0].textContent==e.key){
        check[0].classList = "correct";
        if(check.length>0){
            check[0].classList.add("selected");
        }else{
            let w = CLASS("word");
            if(attiva[0].getElementsByClassName("wrong").length==0 && w[w.length-1] == attiva[0] ){
                attiva[0].classList="word right"
                fineInserimento();
            }else{
                attiva[0].getElementsByClassName("space")[0].classList.add("selected");
            }
        }
        giusti++;
    }else{
        check[0].classList="wrong";
        if(check.length>0){
            check[0].classList.add("selected");
        }else{
            attiva[0].getElementsByClassName("space")[0].classList.add("selected");
        }
        sbagliati++;
    }
}

async function setUp(){
    if(localStorage.wpm){
        ID("highscore").innerHTML = "highscore: " +localStorage.wpm;
    }

    ID("solution").innerHTML="";

    for(let i=0;i<10;i++){
        aggiungiParola(await getParolaCasuale()+" ");
    }

    CLASS("letter")[0].classList.add("selected");
    CLASS("word")[0].classList.add("active");
  
    end=false;
    giusti=0;
    sbagliati=0;
    aggiunti=0;
    missed=0;
    inizio=-1;
    ID("solution").style.display = "flex";
    ID("stats").style.display = "none";
}

function fineInserimento(){
    end=true;
    let tempo,accuracy,ncorrette,wpm;
    sbagliati+= CLASS("uncorrect").length;
    missed+= CLASS("letter").length;
    accuracy= (giusti / (sbagliati+aggiunti+giusti))*100;
    accuracy=Math.round(accuracy);
    tempo = performance.now() - inizio;
    tempo = Math.round(tempo);
    tempo /= 1000;
    let sel=CLASS("selected");
    if(sel.length>0){
        CLASS("selected")[0].classList.remove("selected");
    }
    ncorrette=CLASS("right").length;
    wpm = Math.round( ( CLASS("correct").length * 60 ) / ( 5 * tempo ) );
    if(ncorrette==0){
        wpm=0;
    }
    
    if(!localStorage.wpm){
        localStorage.wpm = String(wpm);
        ID("highscore").innerHTML = "highscore: " +localStorage.wpm;
    }else{
        if(parseInt(localStorage.wpm) < wpm){
            localStorage.wpm = String(wpm);
            ID("highscore").innerHTML = "highscore: " +localStorage.wpm;
        }
    }
    console.log(localStorage.wpm);
    
    ID("solution").style.display = "none";
    ID("stats").style.display = "block";

    ID("wpm").childNodes.forEach(node =>{
        if(node.nodeType == Node.TEXT_NODE){
            node.nodeValue="";
        }
    })
    ID("wpm").innerHTML+= wpm+" WPM";

    ID("acc").childNodes.forEach(node =>{
        if(node.nodeType == Node.TEXT_NODE){
            node.nodeValue="";
        }
    })
    ID("acc").innerHTML+= accuracy+"%";

    ID("time").childNodes.forEach(node =>{
        if(node.nodeType == Node.TEXT_NODE){
            node.nodeValue="";
        }
    })
    ID("time").innerHTML += tempo.toFixed(1)+" s";

    ID("recap").childNodes.forEach(node =>{
        if(node.nodeType == Node.TEXT_NODE){
            node.nodeValue="";
        }
    })
    ID("recap").innerHTML+= giusti + "-" + sbagliati + "-" + aggiunti + "-" + missed;
}


function ID(id){
    return document.getElementById(id);
}
function CLASS(c){
    return document.getElementsByClassName(c);
}