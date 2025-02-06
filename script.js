let attiva = document.getElementsByClassName("active");
let inizio = -1;
let giusti=0,sbagliati=0,aggiunti=0,missed=0;
let end=false;

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
    document.getElementById("solution").appendChild(div);
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
                let allSel = document.getElementsByClassName("selected");
                if(allSel.length>1){
                    allSel[1].classList.remove("selected");
                }
            }else{
                let parole = document.getElementsByClassName("word");
                if(attiva[0] != parole[0]){
                    for(i = 0; i < parole.length; i++){
                        if(parole[i] == attiva[0]){
                            attiva[0].classList.remove("active");
                            parole[i-1].classList = "word active";
                            document.getElementsByClassName("selected")[0].classList.remove("selected");
                            parole[i-1].querySelectorAll(".space, .letter")[0].classList.add("selected");
                        }
                    }
                }
            }
        }

        else if(e.key == " "){
            let word = document.getElementsByClassName("active")[0];
            let controllo = word.querySelectorAll(".wrong, .added, .letter");
            if(controllo.length>0){
                if(controllo[0].classList=="letter selected" && word.getElementsByClassName("correct").length == 0){
                    return;
                }
                word.classList.add("uncorrect");
            }else{
                word.classList.add("right")
            }
            let cerca = document.getElementsByClassName("word");
            if(cerca[cerca.length-1]==word){ //fine
                word.classList.remove("active");
                //word.classList.add("uncorrect");
                fineInserimento();
            }else{
                word.classList.remove("active");
                for(i = 0; i < cerca.length; i++){
                    if(cerca[i].classList=="word"){
                        cerca[i].classList.add("active");
                        document.getElementsByClassName("selected")[0].classList.remove("selected");
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
            let w = document.getElementsByClassName("word");
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
    /*for(let i=0;i<10;i++){
        aggiungiParola(await getParolaCasuale()+" ");
    }*/
    aggiungiParola("stefano ");
    aggiungiParola("panzetti ");
    aggiungiParola("analfabeta ");
    aggiungiParola("non ");
    aggiungiParola("sa ");
    aggiungiParola("leggere ");
    aggiungiParola("e ");
    aggiungiParola("scrivere ");
    aggiungiParola("amo ");
    aggiungiParola("yang ");
    document.getElementsByClassName("letter")[0].classList.add("selected");
    document.getElementsByClassName("word")[0].classList.add("active");
}

function fineInserimento(){
    end=true;
    let tempo,accuracy,ncorrette,wpm;
    sbagliati+= document.getElementsByClassName("uncorrect").length;
    missed+= document.getElementsByClassName("letter").length;
    console.log("giusti sbagliati aggiunti missati");
    console.log(giusti + " " + sbagliati + " " + aggiunti + " " + missed);
    accuracy= (giusti / (sbagliati+aggiunti+giusti))*100;
    accuracy=Math.round(accuracy);
    console.log(accuracy+"%");
    tempo = performance.now() - inizio;
    tempo = Math.round(tempo);
    tempo /= 1000;
    console.log(tempo+"s");
    let sel=document.getElementsByClassName("selected");
    if(sel.length>0){
        document.getElementsByClassName("selected")[0].classList.remove("selected");
    }
    ncorrette=document.getElementsByClassName("right").length;
    console.log(ncorrette+" parole su " + document.getElementsByClassName("word").length);
    wpm = Math.round( ( document.getElementsByClassName("correct").length * 60 ) / ( 5 * tempo ) );
    if(ncorrette==0){
        wpm=0;
    }
    console.log(wpm+"wpm");
    document.getElementById("solution").style.display = "none";
    document.getElementById("stats").style.display = "block";
    document.getElementById("wpm").innerHTML= wpm+" WPM";
    document.getElementById("acc").innerHTML= accuracy+"%";
    document.getElementById("time").innerHTML= tempo.toFixed(1)+" s";
    document.getElementById("recap").innerHTML= giusti + "-" + sbagliati + "-" + aggiunti + "-" + missed;
}