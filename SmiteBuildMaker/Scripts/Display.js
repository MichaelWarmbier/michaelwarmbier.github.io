/*//// Data ////*/

const MenuFlags = SiteData.Flags
let touchValue = 0;

const About = document.querySelector('#About');
const News = document.querySelector('#News');
const Alert = document.querySelector('#Alert');
const Info = document.querySelector('#Info');
const Lang = document.querySelector('#Lang');
const _File = document.querySelector('#File');
const Lookup = document.querySelector('#Lookup');
const AboutMenu = document.querySelector('#AboutMenu');
const NewsMenu = document.querySelector('#NewsMenu');
const AlertMenu = document.querySelector('#AlertMenu');
const InfoMenu = document.querySelector('#InfoMenu');
const OptionsMenu = document.querySelector('#OptionsMenu');
const GodFilters = document.querySelector('#GodFilters');
const GodSearch = document.querySelector('#GodSearch Input');
const ItemSearch = document.querySelector('#ItemSearch Input');
const Warning = document.querySelector('#Warning');
const SwipeNotif = document.querySelector('#SwipeNotif');
const GlobalOptions = document.querySelector('#GlobalOptions');
const Backdrop = document.querySelector('#MenuBackdrop');
const GodInfo = document.querySelector('#GodInfo');
const GodCard = document.querySelector('#GodCard');
const GodStats = document.querySelector('#GodStats');
const LevelSlider = document.querySelector('#LevelSlider');
const LevelValue = document.querySelector('#LevelValue');
const BuffValue = document.querySelector('#BuffValue');
const GodMenu = document.querySelector('#GodMenu');
const ItemMenu = document.querySelector('#ItemMenu');
const GodFilterNames = document.querySelector('#GodFilterNames');
const ExtraInfo = document.querySelector('#ExtraInfo');
const QuickChange = document.querySelector('#QuickChange');
const LOAD_DISPLAYS = document.querySelectorAll('.loading');

/////////////////////
/*//// Utility ////*/
/////////////////////

function isMenuOpen() { return ((SiteData.ActiveMenu && SiteData.ActiveMenu.style.left == '0vw') || SiteData.Flags.GlobalOptionsOpen); }

function createTextEvent(item, text) {
    item.addEventListener('mouseover', function() {
        ExtraInfo.innerHTML = '<span>🛈</span>' + text;
        if (!isMenuOpen() || SiteData.ActiveMenu == InfoMenu) ExtraInfo.style.opacity = '1';
    })
    item.addEventListener('mouseout', function() { ExtraInfo.style.opacity = '0'; })
}

function print(str, warn) { 
    if (warn) {
        console.log('[SmiteBuildMaker] [WARNING] ' + str);
        Warning.innerHTML = str;
        Warning.style.opacity = 1;
        currentWarning = setTimeout(function() { Warning.style.opacity = 0; }, 1000)

    } else { console.log('[SmiteBuildMaker] ' + str); }
}

////////////////////////////////
/*//// Display Initialize ////*/
////////////////////////////////

window.onload = function() {
    TerminalInput.value = '';

    // Reset Scroll and Initial Values 
    InfoMenu.scrollTop = 0;
    OptionsMenu.scrollTop = 0;
    GodFilters.scrollTop = 0;

    GodSearch.value = '';
    document.querySelector('#GodMenu select').value = 'Role';

    // Initialize Touch Controls
    document.addEventListener('touchstart', function(event) { event.preventDefault();touchValue = event.touches[0].clientX; })
    document.addEventListener('touchmove', function(event) {
        event.preventDefault();
        const dir = event.touches[0].clientX - touchValue;
        if (!touchValue) return;

        let left = document.querySelector('#Chaos');
        let right = document.querySelector('#Order');
        if (dir < 0) { 
            if (!MenuFlags.MenuOpen) { left.style.left = '-105%'; right.style.left = '1%'; }
            if (SiteData.ActiveMenu == InfoMenu) {
                GodInfo.style.left = '-300vw';
                GodCard.style.left = '-300vw';
                document.querySelector('#InfoMenu .item_cont').style.left = '-300vw';
                GodStats.style.left = '0vw';
                InfoMenu.scrollTop = 0;
            }
        } if (dir > 0) { 
            if (!MenuFlags.MenuOpen) { left.style.left = '0'; right.style.left = '105%'; }
            if (SiteData.ActiveMenu == InfoMenu) {
                GodInfo.style.left = '0vw';
                GodCard.style.left = '0vw';
                document.querySelector('#InfoMenu .item_cont').style.left = '0vw';
                GodStats.style.left = '300vw';
            }
        }

    })

    // Play Swipe Animation
    SwipeNotif.style.opacity = 1;
    setTimeout(function() { SwipeNotif.style.opacity = 0; }, 1000)

    // Initialize About Menu
    for (item of AboutContent) {
        const newTitle = document.createElement('span');
        newTitle.classList.add('title');
        newTitle.innerHTML = item.Title;
        AboutMenu.append(newTitle);
        const newContent = document.createElement('span');
        newContent.classList.add('content');
        newContent.innerHTML = item.Content;
        AboutMenu.append(newContent);
    }

    // Initialize News Menu
    for (item of NewsContent) {
        const newTitle = document.createElement('span');
        newTitle.classList.add('title');
        newTitle.innerHTML = item.Title;
        NewsMenu.append(newTitle);
        const newContent = document.createElement('span');
        newContent.classList.add('content');
        newContent.innerHTML = item.Content;
        NewsMenu.append(newContent);
    }

    // Initialize Alert Menu
    const newAlert = document.createElement('span');
    newAlert.classList.add('content');
    if (SiteData.SiteAlert) newAlert.innerHTML = SiteData.SiteAlert;
    else newAlert.innerHTML = "No Current Site Announcements"
    AlertMenu.append(newAlert);

    // Initialize all Event Listeners
    document.querySelectorAll('.item').forEach((i) => { createTextEvent(i, 'Select an Item'); })
    document.querySelectorAll('.icon').forEach((i) => { createTextEvent(i, 'Select a Character'); })
    document.querySelectorAll('.information').forEach((i) => { createTextEvent(i, 'View Character Information'); })
    document.querySelectorAll('.preferences').forEach((i) => { createTextEvent(i, 'Modify Character Preferences'); })
    document.querySelectorAll('.tab').forEach((i) => { createTextEvent(i, 'Modify Global Preferences'); })
    createTextEvent(About, 'Learn More About SmiteBuildMaker');
    createTextEvent(News, 'View Recent SmiteBuildMaker News');
    createTextEvent(Alert, 'View SmiteBuildMaker Announcements');
    createTextEvent(Lang, 'Select Site Language');
    createTextEvent(_File, 'Switch Local Save File');
    createTextEvent(Lookup, 'Upload Recent Game');
    print('Finished Initializing Site Display');
}

///////////////////////////////////////
/*//// Event Triggered Functions ////*/
///////////////////////////////////////

window.addEventListener('load', function () {
    document.querySelector('#LoadingScreen').style.opacity = '0';
})

function toggleGlobalOptions() {

    if (MenuFlags.GlobalOptionsOpen ) {
        print('Global Options Menu Opened');
        GlobalOptions.style.top = '-60vh';
        MenuFlags.GlobalOptionsOpen = false;
        MenuFlags.MenuOpen = false;6
    } else if (!MenuFlags.MenuOpen) {
        print('Global Options Menu Closed');
        GlobalOptions.style.top = '45vh';
        MenuFlags.GlobalOptionsOpen = true;
        MenuFlags.MenuOpen = true;
    }
}

function displayMenu(context, override) {

    if (context != GlobalOptions && MenuFlags.GlobalOptionsOpen) return;
    
    if (context == OptionsMenu) {
        LevelSlider.value = SiteData.PlayerData[SiteData.ActivePlayerIndex - 1].Level;
        LevelValue.innerHTML = SiteData.PlayerData[SiteData.ActivePlayerIndex - 1].Level;
        updateBuffs('or');
        if (window.matchMedia("(orientation: portrait)").matches) QuickChange.style.top = '27vw';
        else QuickChange.style.top = '7.25vw';
    }

    if (context == InfoMenu) { 
        appendInfo(); 
        QuickChange.style.top = '7.25vw'; 
    }

    if (MenuFlags.MenuOpen && !context && override) { displayMenu(SiteData.ActiveMenu, 1); return; }
    if (MenuFlags.MenuOpen && SiteData.ActiveMenu != context && !override) displayMenu(SiteData.ActiveMenu, 1);
    if (context == AlertMenu) try { clearInterval(ALERT_INTERVAL); Alert.style.color = 'rgb(168, 168, 168)'; } catch(e) { }

    if (!MenuFlags.MenuOpen) {
        context.style.left = '0vw';
        Backdrop.style.opacity = 1;
        GlobalOptions.style.opacity = 0;
        Backdrop.style.pointerEvents = "auto";
        SiteData.ActiveMenu = context;
        MenuFlags.MenuOpen = true;
    } else {
        context.style.left = '200vw';
        Backdrop.style.opacity = 0;
        GlobalOptions.style.opacity = 1;
        Backdrop.style.pointerEvents = "none";
        SiteData.ActiveMenu = null;
        MenuFlags.MenuOpen = false;
        QuickChange.style.top = '-20vw';
    }
    updateStats(SiteData.ActivePlayerIndex);
}

function displayOptions(pIndex, side) {
    print(`Opening Options for Player ${(pIndex)} of ${side}`);
    SiteData.ActivePlayerIndex = pIndex;
    Menu = OptionsMenu;
    Title = Menu.getElementsByClassName('header')[0];
    Title.innerHTML = `Modify Player ${pIndex} of ${side}`;
    displayMenu(Menu);
}

function displayInfo(pIndex, side) {
    if (!SiteData.PlayerData[pIndex - 1].God) { print('A Character Must Be Selected First', 1); return; }
    
    setTimeout(function() { SwipeNotif.style.opacity = 1; }, 500)
    setTimeout(function() { SwipeNotif.style.opacity = 0; }, 1500)

    print(`Opening Information for Player ${(pIndex)} of ${side}`);
    SiteData.ActivePlayerIndex = pIndex;
    Menu = InfoMenu;
    displayMenu(Menu);
}

function updateLevelSlider() { 
    let player = SiteData.ActivePlayerIndex;
    let newLevel = LevelSlider.value;
    LevelValue.innerHTML = newLevel;
    SiteData.PlayerData[player - 1].Level = newLevel;
    print(`Level set to ${newLevel} for player ${player % 5} on side ${player <= 4 ? 'Chaos':'Order'}`)
}

function updateBuffs(buffName, type, hex) {
    let buffValue = BuffValue;
    let Player = SiteData.PlayerData[SiteData.ActivePlayerIndex - 1];
    let override = buffName == 'or';
    if (!hex) hex = '#FFFFFF';
    
    if (!buffName) {
        Player.Buffs = [];
        Player.BuffTypes = [];
        buffValue.innerHTML = 'No Buff Selected';
        print(`Buffs Cleared For Player ${(SiteData.ActivePlayerIndex - 1)}`);
    } else {
        if (override && !Player.Buffs.length) {
            buffValue.innerHTML = 'No Buff Selected';
            return;
        }

        if (Player.BuffTypes.includes(type)) {
            print(`Cannot Set Buff, But of This Type Already Selected`);
            override = true;
        }

        if (!override) {
            Player.Buffs.push('<span style="color:' + hex + '">' + buffName + '</span>, ');
            Player.BuffTypes.push(type);
            print(`Buff ${buffName} Set For Player ${(SiteData.ActivePlayerIndex - 1)}`);
        }
        buffValue.innerHTML = 'Current Buffs:';
        for (buff of Player.Buffs)
            buffValue.innerHTML += ' ' + buff.replace(/_/g, ' ');
        buffValue.innerHTML = buffValue.innerHTML.slice(0, -2);
    }
}

function openGodMenu(pIndex, side) {
    SiteData.Filter = '';
    SiteData.SearchQuery = '';
    SiteData.ActivePlayerIndex = pIndex + 5 * (side == 'Order');
    if (!SiteData.PlayerData[pIndex].God) displayGod('Zeus');
    GodSearch.value = '';
    initializeGods();
    displayMenu(GodMenu);
}

function openItemMenu(iIndex, pIndex, side) {
    if (!SiteData.PlayerData[pIndex + 5 * (side == 'Order') - 1].God) { print('A Character Must Be Selected First', 1); return; }
    SiteData.SearchQuery = '';
    SiteData.ActivePlayerIndex = pIndex + 5 * (side == 'Order');
    SiteData.ActiveItemIndex = iIndex;
    if (!SiteData.PlayerData[pIndex].God) displayItem('Breastplate of Valor');
    ItemSearch.value = '';
    initializeItems();
    displayMenu(ItemMenu);
}

function updateFilters() {
    const Filter = document.querySelector('#GodFilters select');
    const Names = GodFilterNames;

    for (item of SiteData.GodCategories) 
        if (item.Name === Filter.value) {
            Names.innerHTML = '';
            for (subItem of item.Choices) 
                Names.innerHTML += `<button onclick="setFilter('${subItem}');">${subItem}</button>`;
            return;
        }
}

function updateSearch() {
    if (SiteData.ActiveMenu == GodMenu)
        SiteData.SearchQuery = GodSearch.value.toLowerCase();
        if (SiteData.ActiveMenu == ItemMenu)
        SiteData.SearchQuery = ItemSearch.value.toLowerCase();
    initializeGods();
    initializeItems();
}

function changeMenu(sign) {
    const MENU = SiteData.ActiveMenu;
    const PLAYER = SiteData.ActivePlayerIndex;
    if ((sign == '+' && PLAYER + 1 > 10) || (sign != '+' && PLAYER - 1 < 1)) return;
    if (MENU != OptionsMenu && MENU != InfoMenu) return;
    if (MENU == OptionsMenu)  {
        SiteData.ActivePlayerIndex += 1 - (2 * (sign != '+'));
        displayMenu(MENU);
        setTimeout(displayOptions(SiteData.ActivePlayerIndex, SiteData.ActivePlayerIndex <= 5 ? 'Chaos' : 'Order'), 400); 
        return;
    }
    else if (sign == '+') for (let playerIndex = 0; playerIndex < 10; playerIndex++) { 
        if (SiteData.PlayerData[playerIndex].God && playerIndex > PLAYER - 1) {
            SiteData.ActivePlayerIndex = playerIndex + 1;
            break;
        } 
    }
    else for (let playerIndex = 9; playerIndex >= 0; playerIndex--) { 
        if (SiteData.PlayerData[playerIndex].God && playerIndex < PLAYER - 1) {
            SiteData.ActivePlayerIndex = playerIndex + 1;
            break;
        } 
    }

    updateStats(PLAYER);
    displayMenu(MENU); 
    setTimeout(displayMenu(MENU), 400);
}

function addPassiveText(title, text) { 
    let PassiveDisplay = document.querySelector('#PassiveDisplay');
    if (PassiveDisplay.innerHTML === '<span>🛈</span><br>No Passive Effects Active') PassiveDisplay.innerHTML = '<span>🛈</span>';
    PassiveDisplay.innerHTML += `<span class="passive_title">${title}</span><br>${text}`;
}

function clearPassiveText() { document.querySelector('#PassiveDisplay').innerHTML = '<span>🛈</span><br>No Passive Effects Active'; }

//////////////////////////////////
/*//// Persistent Functions ////*/
//////////////////////////////////

const ALERT_INTERVAL = setInterval(function() {
    if (!SiteData.SiteAlert) clearInterval(ALERT_INTERVAL);
    else {
        AlertButton = Alert;
        AlertColor = window.getComputedStyle(AlertButton).color;
        if (AlertColor == 'rgb(168, 168, 168)') AlertButton.style.color = '#d17524';
        else AlertButton.style.color = 'rgb(168, 168, 168)';
    }
}, 750);