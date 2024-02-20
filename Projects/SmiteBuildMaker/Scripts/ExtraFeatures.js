///////////////////////////
/*//// Randomization ////*/
///////////////////////////

function randomGod() {
    const PLAYER = SiteData.ActivePlayerIndex;
    SiteData.PlayerData[PLAYER - 1].Level = 20;
    LevelSlider.value = SiteData.PlayerData[SiteData.ActivePlayerIndex - 1].Level;
    LevelValue.innerHTML = SiteData.PlayerData[SiteData.ActivePlayerIndex - 1].Level;
    appendGod(English.Gods[Math.floor(Math.random() * (English.Gods.length))]); 
    displayMenu(SiteData.ActiveMenu);
}

function randomItems() {
    const PLAYER = SiteData.ActivePlayerIndex;
    const GOD = SiteData.PlayerData[PLAYER - 1].God;
    if (!GOD) { print('A God must be selected first', 1); return; }
    SiteData.ActiveItemIndex = 1;
    SiteData.TierFilter = 3;
    SiteData.Filter = '';
    SiteData.SearchQuery = '';
    initializeItems();
    let ItemList = [];
    for (elem of document.querySelectorAll('.item_elem')) if (!elem.lang.includes('Acorn')) ItemList.push(elem.lang);
    ItemList.reverse(); ItemList.pop(); 

    let StarterList = [];
    if (SiteData.PlayerData[PLAYER - 1].God.Name === 'Ratatoskr')
        for (Item of English.Items) if (Item.Ratatoskr && Item.Tier == 3) StarterList.push(Item.Name);
    if (SiteData.PlayerData[PLAYER - 1].God.Name !== 'Ratatoskr') {
        for (Item of English.Items) if (Item.Starter && Item.Tier == 2 && (Item.DamageType == GOD.Type || Item.DamageType == 'Neutral')) 
            StarterList.push(Item.Name);
    }

    let status = '';
    while (SiteData.ActiveItemIndex < 7) {
       let ChoosenItem = ItemList[Math.floor(Math.random() * (ItemList.length))];
       let ChoosenStarter = StarterList[Math.floor(Math.random() * (StarterList.length))];
       for (Item of English.Items) {
            if ((SiteData.ActiveItemIndex != 1 && Item.Name == ChoosenItem) || (SiteData.ActiveItemIndex == 1 && Item.Name == ChoosenStarter)) 
            { status = appendItem(Item, true); break; } 
       }

       if (status && status[0] == 'SUCCESS') SiteData.ActiveItemIndex++;
    }
    SiteData.TierFilter = 3;
    if (SiteData.ActiveMenu) displayMenu(SiteData.ActiveMenu);
}

////////////////////////////
/*//// Global Options ////*/
////////////////////////////

function toggleBuildNumbers() {
    const MOBILE = window.matchMedia("(orientation: portrait)").matches;
    const ITEMS = document.querySelectorAll('.item');
    for (let itemIndex = 0; itemIndex < 60; itemIndex++) {
        if (!SiteData.Options[0]) {
            ITEMS[itemIndex].innerHTML = (itemIndex % 6) + 1;
            if (!MOBILE) {
                ITEMS[itemIndex].style.fontSize = '1.25vw';
                ITEMS[itemIndex].style.height = '.75vw';
                ITEMS[itemIndex].style.width = '.75vw';
                ITEMS[itemIndex].style.padding = '.75vw 1.5vw 1.5vw .75vw';
            } else {
                ITEMS[itemIndex].style.fontSize = '1.5vw';
                ITEMS[itemIndex].style.height = '3.375vw';
                ITEMS[itemIndex].style.width = '3.375vw';
                ITEMS[itemIndex].style.padding = '1.125vw 4.5vw 4.5vw 1.125vw';
            }
            ITEMS[itemIndex].style.color = 'white';
        } else {
            if (itemIndex == 59) SiteData.Options[0] = false;
            if (ITEMS[itemIndex].style.backgroundImage) ITEMS[itemIndex].innerHTML = '';
            else ITEMS[itemIndex].innerHTML = '+';
            if (!MOBILE) {
                ITEMS[itemIndex].style.fontSize = '3.5vw';
                ITEMS[itemIndex].style.height = '3vw';
                ITEMS[itemIndex].style.width = '3vw';
            } else {
                ITEMS[itemIndex].style.fontSize = '5vw';
                ITEMS[itemIndex].style.height = '9vw';
                ITEMS[itemIndex].style.width = '9vw';

            }
            ITEMS[itemIndex].style.padding = '0';
            ITEMS[itemIndex].style.color = 'var(--BrightGold)';
        }
    }
    SiteData.Options[0] = true;
    toggleGOption(0);
    print('Toggled Build Numbers');
}

///////////////////////////////
/*//// Save/Share System ////*/
///////////////////////////////

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    return (document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '')
}

function generateLink() {
    const REGEX = />([^<]+)/;
    let link = '';
    for (let playerIndex = 0; playerIndex < 10; playerIndex++) {
        if (!SiteData.PlayerData[playerIndex].God) continue;
        else link += playerIndex + 'g=' + SiteData.PlayerData[playerIndex].God.Id + '&';
        link += playerIndex + 'l=' + SiteData.PlayerData[playerIndex].Level + '&';
        for (let itemIndex = 0; itemIndex < 6; itemIndex++) {
            if (!SiteData.PlayerData[playerIndex].Items[itemIndex]) link += playerIndex + 'i' + itemIndex + '=N&';
            else link += playerIndex + 'i' + itemIndex + '=' + SiteData.PlayerData[playerIndex].Items[itemIndex].Id + '&';
        }
        link += playerIndex + 'bfs=';
        if (!SiteData.PlayerData[playerIndex].Buffs.length) link += 'N';
        for (Buffs of SiteData.PlayerData[playerIndex].Buffs) link += REGEX.exec(Buffs)[1] + ',';
        link += '&';
    }
    link += 'bn=' + SiteData.Options[0];
    return link;
}

function saveData() {
    const DUE = 10_000;
    const cookieStr = generateLink();
  
    setCookie('save_' + SiteData.SaveNumber, cookieStr, DUE);
    document.querySelector('#SaveButton').innerHTML = '✓';
    setTimeout(function() { document.querySelector('#SaveButton').innerHTML = 'Save to Local Storage'; }, 1500);
    print(`Saved data to file ${SiteData.SaveNumber}`)
  }

  function loadData(data) {
    // Access Save Data
    if (!data) {
      const DATA = getCookie('save_' + SiteData.SaveNumber);
      const SPLIT_DATA = DATA.split(/[&=]/g);
      let parsedData = [[],[]];
      for (let index = 0; index < SPLIT_DATA.length; index++)  {
        if (index % 2 == 0) parsedData[0].push(SPLIT_DATA[index]);
        else parsedData[1].push(SPLIT_DATA[index]);
      }
      data = parsedData;
    }
    // Access URL Data
    let currPlayer = 0;
    for (let dataIndex = 0; dataIndex < data[0].length; dataIndex++) {
      if (data[0][dataIndex].includes('g')) {
        currPlayer = parseInt(data[0][dataIndex][0]);
        if (data[1][dataIndex] != 'N') {
          SiteData.ActivePlayerIndex = currPlayer + 1;
          appendGod(getGodData(data[1][dataIndex]), true);
        }
      }
      if (currPlayer == data[0][dataIndex][0]) {
        if (data[0][dataIndex].includes('l')) 
          SiteData.PlayerData[currPlayer].Level = data[1][dataIndex];
        if (data[0][dataIndex].includes('i') && data[1][dataIndex] != 'N') {
          SiteData.ActiveItemIndex = parseInt(data[0][dataIndex][2]) + 1;
          appendItem(getItemData(data[1][dataIndex]), true);
        }
      }
      if (data[0][dataIndex] == 'bn' && (data[1][dataIndex] == 'true' || data[1][dataIndex] == '1'))
        toggleBuildNumbers();
    }
    document.querySelector('#LoadButton').innerHTML = '✓';
    setTimeout(function() { document.querySelector('#LoadButton').innerHTML = 'Load Local Save'; }, 1500);
    print(`Loaded file ${SiteData.SaveNumber}`)
}

function generateShareLink() {
    const SITE_URL = 'https://smite-build-maker-50-kirbout.replit.app';
    navigator.clipboard.writeText(SITE_URL + '/?' + generateLink());
    document.querySelector('#ShareButton').innerHTML = '✓ Copied!';
    setTimeout(function() { document.querySelector('#ShareButton').innerHTML = 'Create Share Link'; }, 1500);
    print(`Generated sharable link`)
}

//////////////////////////////
/*//// Passived Related ////*/
//////////////////////////////

let mouseInterval = null;
let xPos = -1;
document.onmousemove = function(event) { xPos = event.pageX; }

function updateHealthMana(elem, event) {
    const BOX = elem.getBoundingClientRect();
    mouseInterval = setInterval(function() {
        const X_OFFSET = xPos - BOX.left;
        let Percent = X_OFFSET / (elem.offsetWidth) * 100;
        if (Percent < 10) Percent = 0;
        if (Percent > 95) Percent = 100;
        if (elem.className === 'health') elem.style.background = 'linear-gradient(to right, #3cb038 ' + Percent + '%, #292929 ' + Percent + '%)';
        else elem.style.background = 'linear-gradient(to right, #4054ad ' + Percent + '%, #292929 ' + Percent + '%)';
        elem.innerHTML = Math.floor(Percent) + '%&nbsp;';
    }, 100);
}

function clearHMUpdate() { clearInterval(mouseInterval); }

/////////////////////
/*//// Backend ////*/
/////////////////////

LookupMenu.addEventListener("keydown", function(event) {
    if (event.key !== 'Enter') return;
    const INPUT = document.querySelectorAll('#LookupMenu Input')[0];
    const SECONDS = Date.now();

    if (SiteData.LastLookup !== -1 && SECONDS - SiteData.LastLookup < 10) { print('You are doing that too fast!', 1); return; }
    SiteData.LastLookup = SECONDS;
    document.querySelector('#LookupWrap').innerHTML = '';

    LOAD_DISPLAYS[0].style.opacity = 1;
    const LIMIT = setTimeout(() => { LOAD_DISPLAYS[0].style.opacity = 0; print('Could not find player', 1); }, 5000);
    try { generateRecentGames(INPUT.value, LIMIT); }
    catch (e) { print('Unable to load data', 1); LOAD_DISPLAYS[0].style.opacity = 0; }
    INPUT.value = '';
}, false);

let ID = getCookie('ID');

async function generateRecentGames(player, searchLimit) {
    await updateSession();
    let Request, Data = '';
    try { 
        if (!player) { print('Please enter a player name', 1); return; }
        Request = await fetch(`https://server-08-kirbout.replit.app/requestmatchhistory?ID=${ID}&USER=${player}`);
        Data = await Request.json();
        if (Data.ret_msg) throw new Error('');
    }
    catch (e) { print('Unable to retrieve match data', 1); return; }

    if (!Data || !Data[0].GodId) { print('Player not found', 1); return; }
    console.log(Data);

    for (let recentIndex = 0; recentIndex < 10; recentIndex++) {
        const GAME = document.createElement('div');
        GAME.classList.add('recent_game');
        const GOD = getGodData(Data[recentIndex].GodId);
        GAME.innerHTML = `<div class="game_god" style="background:URL('${GOD.Icon}'); background-size: cover"></div>`;
        for (let itemIndex = 0; itemIndex < 6; itemIndex++) {
            const ITEM_ID = Data[recentIndex]['ItemId' + parseInt(itemIndex + 1)];
            let Item = getItemData(ITEM_ID);
            if (Item) GAME.innerHTML += `<div class="game_item" style="background: URL('${Item.URL}'); background-size: cover"></div>`;
            else GAME.innerHTML += `<div class="game_item"></div>`;
        }
        if (Data[recentIndex].Win_Status === 'Win') GAME.style.backgroundColor = 'RGB(5, 57, 36)';
        else GAME.style.backgroundColor = 'RGB(45, 17, 36)';
        GAME.Lang = Data[recentIndex].Match;
        GAME.innerHTML += `<div class="game_duration">${Data[recentIndex].Queue} | ${Data[recentIndex].Match_Time}</div>`;
        GAME.ondblclick = function() { appendMatchData(GAME.Lang); displayMenu(SiteData.ActiveMenu); }
        document.querySelector('#LookupWrap').appendChild(GAME);
    }
    LOAD_DISPLAYS[0].style.opacity = 0;
    clearTimeout(searchLimit);
}

async function appendMatchData(match) {
    let Data = null;
    try {
        const REQUEST = await fetch(`https://server-08-kirbout.replit.app/requestmatch?ID=${ID}&MATCH_ID=${match}`)
        Data = await REQUEST.json();
        if (!Data || !Data[0].GodId) throw new Error('');
    } catch (e) { print('Unable to fetch match data', 1); }
    const TEAM_SIZE = Data.length / 2;
    let playerIndex = 0;

    for (player of Data) {
        SiteData.ActivePlayerIndex = playerIndex + 1;
        appendGod(getGodData(player.GodId));
        SiteData.PlayerData[playerIndex].Level = player.Final_Match_Level;
        for (let itemIndex = 0; itemIndex < 6; itemIndex++) {
            SiteData.ActiveItemIndex = itemIndex + 1;
            if (!player['Item_Purch_' + parseInt(itemIndex + 1)]) continue;
            const ITEM = getItemData(player['ItemId' + parseInt(itemIndex + 1)]);
            appendItem(ITEM);
            if (ITEM.isGlyph) SiteData.PlayerData[playerIndex].GlyphIndex = itemIndex;
            if (ITEM.Starter) SiteData.PlayerData[playerIndex].StarterIndex = itemIndex;
            if (ITEM.Filters.includes('Recipe')) SiteData.PlayerData[playerIndex].RecipeIndex = itemIndex;
        }
        if (playerIndex == TEAM_SIZE - 1) playerIndex = 5;
        else playerIndex++;
    }
}

async function updateSession() {
    const STATUS = await checkSessionStatus();
    if (!STATUS) { print('Unable to establish connection.', 1); return; }
    else print('Connection estbalished under session ' + ID);
}

async function checkSessionStatus() {
    let Request = await fetch('https://server-08-kirbout.replit.app/requestsession');
    const NEW_SESSION = await Request.text();
    if (NEW_SESSION.includes('Err') || NEW_SESSION.includes('ERR')) return false;
    try { Request = await fetch(`https://server-08-kirbout.replit.app/testsession?ID=${ID}`); }
    catch(e) {  print(e); return false; }
    let Data = await Request.json(); 
    if (Data.Status !== 'Valid') { ID = NEW_SESSION; setCookie('ID', NEW_SESSION, 1); }
    return true;
}