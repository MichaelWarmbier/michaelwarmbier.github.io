const SERVER = 'https://server-08-kirbout.replit.app';
let ID = getCookie('ID');

let currMatchResults = null;
let currMatchData = null;
let currPlayer = null;
let ErrorCode = '';

SearchMenu.addEventListener("keydown", function(event) {
    if (event.key !== 'Enter') return;
    const INPUT = document.querySelectorAll('#SearchMenu Input')[0];
    const SECONDS = Date.now();

    if (SiteData.LastLookup !== -1 && SECONDS - SiteData.LastLookup < 10) {  return; }
    SiteData.LastLookup = SECONDS;
    document.querySelector('#SearchResults').innerHTML = '';

    try { 
        PreSearch.innerHTML = '<div class="orb_container"><div class="orb" style="animation-delay: 0s"></div><div class="orb" style="animation-delay: .25s"></div><div class="orb" style="animation-delay: .5s"></div></div>';
        setTimeout(() => { PreSearch.innerHTML = `${langText[90]}.<p>${ErrorCode}</p>`; }, 5000);
        generateRecentGames(INPUT.value);
    
    }
    catch (e) { PreSearch.innerHTML = `${langText[90]}.`; }
    INPUT.value = '';
}, false);

async function generateRecentGames(player) {
    
    await updateSession();
    let Request, Data = '';
    try { 
        if (!player) { return; }
        Request = await fetch(`${SERVER}/requestmatchhistory?ID=${ID}&USER=${player}`);
        Data = await Request.json();
        if (Data.ret_msg) throw new Error(Data.ret_msg);
    }
    catch (e) { return; }

    try {
        if (!Data || !Data[0].GodId) { return; }
        currMatchResults = Data;
    } catch(e) { return; }

    for (let recentIndex = 0; recentIndex < 10; recentIndex++) {
        const GAME = document.createElement('div');
        GAME.classList.add('search_result');
        GAME.ondblclick = () => { appendMatchData(recentIndex);  } 
        GAME.innerHTML = `<div class="search_title">${Data[recentIndex].Match_Time} ${Data[recentIndex].Queue}</div><div class="search_name">${Data[recentIndex].God}</div><div class="search_other">${Data[recentIndex].Kills}/${Data[recentIndex].Deaths}/${Data[recentIndex].Assists}</div><div class="search_status">${Data[recentIndex].Win_Status == 'Win' ? langText[22] : langText[21]}</div>`;
        SearchResults.appendChild(GAME);
    }
    generatePlayerInfo(player);
}

async function generatePlayerInfo(player) {
    let Request, Data = '';
    try { 
        if (!player) { return; }
        Request = await fetch(`${SERVER}/requestplayer?ID=${ID}&USER=${player.toLowerCase()}`);
        Data = await Request.json();
        if (Data.ret_msg) throw new Error(Data.ret_msg);
    }
    catch (e) { return; }

    if (!Data) { return; }
    currPlayer = Data;
    try { appendPlayerData(); }
    catch (e) { return; }

    SearchContent.style.display = 'block';
    PreSearch.style.display = 'none';
}

async function updateSession() {
    try {
        const STATUS = await checkSessionStatus();
        if (!STATUS) { ErrorMessage = langText[91]; return; }
    } catch (e) { ErrorMessage = langText[91]; }
}

async function checkSessionStatus() {
    let Request = await fetch(`${SERVER}/requestsession`);
    const NEW_SESSION = await Request.text();
    if (NEW_SESSION.includes('Err') || NEW_SESSION.includes('ERR')) return false;
    try { Request = await fetch(`${SERVER}/testsession?ID=${ID}`); }
    catch(e) { ErrorMessage = langText[92]; }
    let Data = await Request.json(); 
    if (Data.Status !== 'Valid') { ID = NEW_SESSION; setCookie('ID', NEW_SESSION, 1); }
    return true;
}

async function appendMatchData(index) {
    const MATCH = currMatchResults[index].Match;
    let Request = await fetch(`${SERVER}/requestmatch?ID=${ID}&MATCH_ID=${MATCH}`);
    currMatchData = await Request.json();
    toggleMenu(SearchMenu);

    ActivePlayer = 0;
    for (player of currMatchData) {
        appendGod(getGodData(player.GodId));
        ActiveItem = 0;
        for (let itemIndex = 0; itemIndex < 6; itemIndex++) {
            try { appendItem(getItemData(player[`ItemId${itemIndex + 1}`])); } catch (e) { }
            ActiveItem++;
        }
        ActivePlayer++;
    }

}

async function appendPlayerData() {
    /* Summary */
    SearchSummaryPlayer.innerHTML = currPlayer.PLAYER_INFO[0].hz_player_name;
    SearchSummaryID.innerHTML = currPlayer.PLAYER_INFO[0].Id;
    SearchSummaryRegion.innerHTML = currPlayer.PLAYER_INFO[0].Region;
    SearchSummaryStatus.innerHTML = `"${currPlayer.PLAYER_INFO[0].Personal_Status_Message}"`;
    SearchSummaryWins.innerHTML = `${currPlayer.PLAYER_INFO[0].Wins} ${langText[20]}`;
    SearchSummaryLosses.innerHTML = `${currPlayer.PLAYER_INFO[0].Losses}  ${langText[96]}`;
    SearchSummaryLeaves.innerHTML = `${currPlayer.PLAYER_INFO[0].Leaves} ${langText[97]}`;
    SearchSummaryIcon.style.backgroundImage = `URL('${currPlayer.PLAYER_INFO[0].Avatar_URL}')`;
    if (currPlayer.PLAYER_INFO[0].Avatar_URL == '') 
    SearchSummaryIcon.style.backgroundImage = 'URL("./Assets/Icons/Question_Gold.png")';

    let RankText = document.querySelectorAll('.rank_title');
    let RankIcon = document.querySelectorAll('.rank_icon');
    let RankRatio = document.querySelectorAll('.rank_ratio');

    /* Ranked */
    RankText[0].innerHTML = getRankTitle(currPlayer.PLAYER_INFO[0].Tier_Conquest);
    RankText[1].innerHTML = getRankTitle(currPlayer.PLAYER_INFO[0].Tier_Joust);
    RankText[2].innerHTML = getRankTitle(currPlayer.PLAYER_INFO[0].Tier_Duel);
    RankIcon[0].src = getRankIcon(currPlayer.PLAYER_INFO[0].Tier_Conquest);
    RankIcon[1].src = getRankIcon(currPlayer.PLAYER_INFO[0].Tier_Joust);
    RankIcon[2].src = getRankIcon(currPlayer.PLAYER_INFO[0].Tier_Duel);

    Wins = [0, 0, 0];
    Losses = [0, 0, 0];
    for (Conquest of currPlayer.CONQUEST) 
    { Wins[0] += Conquest.Wins; Losses[0] += Conquest.Losses; }
    for (Joust of currPlayer.JOUST)
    { Wins[1] += Joust.Wins; Losses[1] += Joust.Losses; }
    for (Duel of currPlayer.DUEL) 
    { Wins[2] += Duel.Wins; Losses[2] += Duel.Losses }

    RankRatio[0].innerHTML = `${Wins[0]} - ${Losses[0]}`;
    RankRatio[1].innerHTML = `${Wins[1]} - ${Losses[1]}`;
    RankRatio[2].innerHTML = `${Wins[2]} - ${Losses[2]}`;

    /* Accolades */
    let Accolade = document.querySelectorAll('.accolade_amount');

    Accolade[5].innerHTML = currPlayer.ACHIEVEMENTS.FireGiantKills;
    Accolade[0].innerHTML = currPlayer.ACHIEVEMENTS.FirstBloods;
    Accolade[2].innerHTML = currPlayer.ACHIEVEMENTS.KillingSpree;
    Accolade[3].innerHTML = currPlayer.ACHIEVEMENTS.DivineSpree;
    Accolade[4].innerHTML = currPlayer.ACHIEVEMENTS.ImmortalSpree;
    Accolade[1].innerHTML = currPlayer.ACHIEVEMENTS.GodLikeSpree;
    Accolade[6].innerHTML = currPlayer.ACHIEVEMENTS.PentaKills;
    Accolade[7].innerHTML = currPlayer.ACHIEVEMENTS.QuadraKills;
    Accolade[8].innerHTML = currPlayer.ACHIEVEMENTS.TripleKills;
    Accolade[9].innerHTML = currPlayer.ACHIEVEMENTS.DoubleKills;

    /* Performance */
    MostDeaths = (currPlayer.GOD_RANKS).reduce((max, obj) => obj['Deaths'] > max['Deaths'] ? obj : max);
    MostLosses = (currPlayer.GOD_RANKS).reduce((max, obj) => obj['Losses'] > max['Losses'] ? obj : max);
    MostAssists = (currPlayer.GOD_RANKS).reduce((max, obj) => obj['Assists'] > max['Assists'] ? obj : max);
    MostKills = (currPlayer.GOD_RANKS).reduce((max, obj) => obj['Kills'] > max['Kills'] ? obj : max);
    MostWins = (currPlayer.GOD_RANKS).reduce((max, obj) => obj['Wins'] > max['Wins'] ? obj : max);
    MostWorship = (currPlayer.GOD_RANKS).reduce((max, obj) => obj['Worshippers'] > max['Worshippers'] ? obj : max);
    try { BestKDR = (currPlayer.GOD_RANKS).reduce((max, obj) => (obj['Kills']/obj['Deaths']) > (max['Kills']/max['Deaths']) ? obj : max); }
    catch (e) { BestKDR = null; }

    let Icons = document.querySelectorAll('.performance_icon');
    let Titles = document.querySelectorAll('.performance_name');

    Icons[0].src = getGodData(MostKills.god).godIcon_URL;
    Icons[1].src = getGodData(MostDeaths.god).godIcon_URL;
    Icons[2].src = getGodData(MostAssists.god).godIcon_URL;
    Icons[3].src = getGodData(MostWorship.god).godIcon_URL;
    Icons[4].src = (BestKDR == null ? 'none' : getGodData(BestKDR.god).godIcon_URL);
    Icons[5].src = getGodData(MostWins.god).godIcon_URL;
    Icons[6].src = getGodData(MostLosses.god).godIcon_URL;

    Titles[0].innerHTML = godLang(MostKills).god;
    Titles[1].innerHTML = godLang(MostDeaths).god;
    Titles[2].innerHTML = godLang(MostAssists).godt;
    Titles[3].innerHTML = godLang(MostWorship).god;
    Titles[4].innerHTML = (BestKDR == null ? 'N/A' : godLang(BestKDR).god);
    Titles[5].innerHTML = godLang(MostWins).god;
    Titles[6].innerHTML = godLang(MostLosses).god;

    document.querySelectorAll('.performance_extra')[0].innerHTML = `${BestKDR.Kills}/${BestKDR.Deaths}`;
}