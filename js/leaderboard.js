
function getLeaderboard() { 
    if (!localStorage.getItem("leaderboard")) {
        resetLeaderboard();
    }

    let leaderboard = localStorage.getItem("leaderboard");
    return leaderboard ? JSON.parse(leaderboard) : [];
}

function addScore(username, score) {
    let leaderboard = getLeaderboard(); 
    leaderboard.push({ username, score }); 
    leaderboard.sort((a, b) => b.score - a.score); 
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard)); 
}

function saveLeaderboard(leaderboard) {
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function resetLeaderboard(){
    let defaultLeaderboard = []; 
    localStorage.setItem("leaderboard", JSON.stringify(defaultLeaderboard));
}