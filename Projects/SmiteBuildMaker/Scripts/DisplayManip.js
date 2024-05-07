let CurrentMenu = null;
let ItemNumbers = false;
let NonConquest = false;
let SaveNumber = 1;
let GlobalOptionsOpen = false;
let MouseInterval = null;
let xPos = null;
document.onmousemove = function(event) { xPos = event.pageX; }

/*//// Hover Text Events ////*/

for (elem of document.querySelectorAll('.item')) {
    elem.addEventListener("mouseover", () => { showToolTip(langText[47])});
    elem.addEventListener("mouseout",  hideToolTip);
}

for (elem of document.querySelectorAll('.god_icon')) {
    elem.addEventListener("mouseover", () => { showToolTip(langText[0])});
    elem.addEventListener("mouseout",  hideToolTip);
}

for (elem of document.querySelectorAll('.god_options')) {
    elem.addEventListener("mouseover", () => { showToolTip(langText[48])});
    elem.addEventListener("mouseout",  hideToolTip);
}

for (elem of document.querySelectorAll('.god_info')) {
    elem.addEventListener("mouseover", () => { showToolTip(langText[49])});
    elem.addEventListener("mouseout",  hideToolTip);
}

Information.addEventListener("mouseover", () => { showToolTip(langText[51])});
Information.addEventListener("mouseout",  hideToolTip);
News.addEventListener("mouseover", () => { showToolTip(langText[52])});
News.addEventListener("mouseout",  hideToolTip);
Files.addEventListener("mouseover", () => { showToolTip(langText[53])});
Files.addEventListener("mouseout",  hideToolTip);
Language.addEventListener("mouseover", () => { showToolTip(langText[54])});
Language.addEventListener("mouseout",  hideToolTip);
Lookup.addEventListener("mouseover", () => { showToolTip(langText[55])});
Lookup.addEventListener("mouseout",  hideToolTip);

document.querySelectorAll('#GlobalOptions .tab')[0].addEventListener("mouseover", () => { showToolTip(langText[50])});
document.querySelectorAll('#GlobalOptions .tab')[0].addEventListener("mouseout",  hideToolTip);

const BUFF_ICONS = document.querySelectorAll('.info_menu_button img');
BUFF_ICONS[0].buffName = 'Power Buff';
BUFF_ICONS[1].buffName = 'Mana Buff';
BUFF_ICONS[2].buffName = 'Speed Buff';
BUFF_ICONS[3].buffName = 'Void Buff';
BUFF_ICONS[4].buffName = 'Attack Speed Buff';
BUFF_ICONS[5].buffName = 'Health Buff';
BUFF_ICONS[6].buffName = 'Gold Buff';
BUFF_ICONS[7].buffName = 'Silver Buff';
BUFF_ICONS[8].buffName = 'E. Fire Giant';
BUFF_ICONS[9].buffName = 'Fire Giant';
BUFF_ICONS[10].buffName = 'Slash Buff';
BUFF_ICONS[11].buffName = 'Joust Buff';
BUFF_ICONS[12].buffName = 'Power Potion';
BUFF_ICONS[13].buffName = 'Defense Elixir';
BUFF_ICONS[14].buffName = 'Power Elixir';
BUFF_ICONS[15].buffName = 'Reset Buffs';

const BUFF_TEXT = [56, 59, 57, 60, 58, 61, 62, 63, 64, 65, 66, 67, 68, 70, 69, 71];

for (let buffIndex = 0; buffIndex < BUFF_ICONS.length; buffIndex++) {
    BUFF_ICONS[buffIndex].addEventListener("mouseover", () => { showToolTip(langText[BUFF_TEXT[buffIndex]]);});
    BUFF_ICONS[buffIndex].addEventListener("mouseout",  hideToolTip);
}

/*//// Functions ////*/

function toggleMenu(targetMenu) {

    if (targetMenu == SelectToClose)
        targetMenu = CurrentMenu;

    if (targetMenu == ItemSelectMenu && SiteData.PlayerData[ActivePlayer].God == null) {
        alertUser(langText[80]);
        return;
    }

    if (targetMenu == GodSelectMenu || targetMenu == ItemSelectMenu || targetMenu == SearchMenu) {
        CustomGodFilter = null;
        SelectedGodFilter = null;
        CustomItemFilter = null;
        SelectedItemFilter = null;
        SpecifiedItemTier = '3';
        focusSelf('#GodMenuMiddle .filter_option', null);
        focusSelf('#ItemMenuMiddle .filter_option', null);
        focusSelf('#ItemMenuSecondMiddle .filter_option', document.querySelectorAll('#ItemMenuSecondMiddle .filter_option')[2]);
        const ELEMS = document.querySelectorAll('.search_input');
        ELEMS[0].value = ''; ELEMS[1].value = ''; ELEMS[2].value = '';
    }


    if (targetMenu == GodInfoMenu || targetMenu == GodOptionsMenu) {

        updateBuffDisplay();

        targetMenu.querySelectorAll('h1')[1].innerHTML = `${ActivePlayer < 5 ? langText[3] : langText[4]} - ${langText[2]} ${ActivePlayer % 5 + 1}`;
        
        if (targetMenu == GodInfoMenu && SiteData.PlayerData[ActivePlayer].God == null) {
            alertUser(langText[80]);
            return;
        } else if (targetMenu == GodInfoMenu) {

            appendBuffsToDisplay();
            updateStats();
            DPSFactor.innerHTML = `${langText[81]}: ${getDPS().toFixed(2)}`;

            InfoIcon.style.backgroundImage = `URL('${SiteData.PlayerData[ActivePlayer].God.godIcon_URL}')`;
            InfoName.innerHTML = SiteData.PlayerData[ActivePlayer].God.Name;
            InfoLevel.innerHTML = `${langText[5]} ${SiteData.PlayerData[ActivePlayer].Level}`;
        
            updateGodInfoDisplay();

        }

    }

    if (targetMenu == GlobalOptions) {

        if (!GlobalOptionsOpen) {

            GlobalOptions.style.transitionDuration = '.2s';
            setTimeout(() => { GlobalOptions.style.transitionDuration = '0s'; }, 200);
            GlobalOptions.style.top = '13vh';
            CurrentMenu = targetMenu;

        } else {

            GlobalOptions.style.transitionDuration = '.2s';
            setTimeout(() => { GlobalOptions.style.transitionDuration = '0s'; }, 200);
            GlobalOptions.style.top = 'calc(-60vh + 13vh)';
            CurrentMenu = null;

        }
        GlobalOptionsOpen = !GlobalOptionsOpen;

    } 
    else {

        if (window.getComputedStyle(targetMenu).left == '0px') {

            targetMenu.style.left = '-1000vw';
            CurrentMenu = null;
            SelectToClose.style.opacity = 0;
            SelectToClose.style.pointerEvents = 'none';
            CurrentMenu = null;
            
        } else if (!GlobalOptionsOpen) {

            if (CurrentMenu !== null)
                CurrentMenu.style.left = '-1000vw';

            targetMenu.style.left = '0';
            CurrentMenu = targetMenu;
            SelectToClose.style.opacity = 1;
            SelectToClose.style.pointerEvents = 'auto';
            CurrentMenu = targetMenu;

        }

    }

    if (targetMenu == GodSelectMenu) initializeGods();
    if (targetMenu == ItemSelectMenu) initializeItems();
    
}

function displayGod(name) {
    const GOD = getGodData(name);
    document.querySelector('#GodMenuRight #HoveredGodName').innerHTML = godLang(GOD).Name;
    document.querySelector('#GodMenuRight #HoveredGodTitle').innerHTML = godLang(GOD).Title;
    document.querySelector('#GodMenuRight #HoveredGodIcon').style.backgroundImage = `URL('${GOD.godIcon_URL}')`;
    document.querySelector('#GodMenuRight #HoveredGodPantheon').innerHTML = godLang(GOD).Pantheon;
    document.querySelector('#GodMenuRight #HoveredGodDamage').innerHTML = godLang(GOD).Type;
    document.querySelector('#GodMenuRight #HoveredGodClass').innerHTML = godLang(GOD).Roles;

    switch (GOD.Pantheon) {
        case 'Arthurian':       document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#a3190f'; break;
        case 'Babylonian':      document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#8fc9eb'; break;
        case 'Celtic':          document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '"#0f7013'; break;
        case 'Chinese':         document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#edea32'; break;
        case 'Egyptian':        document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#a13d12'; break;
        case 'Great Old Ones':  document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#4f0b8a'; break;
        case 'Greek':           document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#6b19b3'; break;
        case 'Hindu':           document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#d911bb'; break;
        case 'Japanese':        document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#e61919'; break;
        case 'Maya':            document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#eda70e'; break;
        case 'Norse':           document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#b3b3b3'; break;
        case 'Polynesian':      document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#ffb74a'; break;
        case 'Roman':           document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#bf7f1d'; break;
        case 'Slavic':          document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#ed9d21'; break;
        case 'Voodoo':          document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#d664ed'; break;
        case 'Yoruba':          document.querySelector('#GodMenuRight #HoveredGodPantheon').style.color = '#799e0b'; break;
    }

    switch (GOD.Type.includes('Magical')) {
        case true:         document.querySelector('#GodMenuRight #HoveredGodDamage').style.color = '#6169d4'; break;
        case false:        document.querySelector('#GodMenuRight #HoveredGodDamage').style.color = '#c75d78'; break;
    }

    switch (GOD.Roles) {
        case 'Mage':            document.querySelector('#GodMenuRight #HoveredGodClass').style.color = '#3b46c4'; break;
        case 'Warrior':         document.querySelector('#GodMenuRight #HoveredGodClass').style.color = '#6037b8'; break;
        case 'Assassin':        document.querySelector('#GodMenuRight #HoveredGodClass').style.color = '#c9bb38'; break;
        case 'Guardian':        document.querySelector('#GodMenuRight #HoveredGodClass').style.color = '#2cb838'; break;
        case 'Hunter':          document.querySelector('#GodMenuRight #HoveredGodClass').style.color = '#ba6529'; break;
    }

}

function displayItem(name) {

    const ITEM = getItemData(name);
    document.querySelector('#ItemMenuRight #HoveredItemName').innerHTML = itemLang(ITEM).DeviceName;
    document.querySelector('#ItemMenuRight #HoveredItemFullDesc').innerHTML = itemLang(ITEM).ItemDescription.SecondaryDescription;
    
    let childItem = ITEM; let fullPrice = 0;
    for (let limitIndex = 0; limitIndex < 4; limitIndex++) {
        fullPrice += childItem.Price;
        if (childItem.ChildItemId == 0 || childItem.ChildItemId == null || !childItem.ChildItemId) break;
        childItem = getItemData(childItem.ChildItemId);   
    }   

    document.querySelector('#ItemMenuRight #HoveredItemSinglePrice').innerHTML = ITEM.Price;
    document.querySelector('#ItemMenuRight #HoveredItemFullPrice').innerHTML = fullPrice;
    document.querySelector('#ItemMenuRight #HoveredItemIcon').style.backgroundImage = `URL('${ITEM.itemIcon_URL}')`;

    document.querySelector('#ItemMenuRight #HoveredItemStats').innerHTML = '';
    for (stat of itemLang(ITEM).ItemDescription.Menuitems) 
        document.querySelector('#ItemMenuRight #HoveredItemStats').innerHTML += `${stat.Description} ${stat.Value}<br>`;

}

function toggleSearchMenu(index) {

    let NavElems = document.querySelectorAll('.search_nav_elem');
    let Menus = document.querySelectorAll('.search_display_menu');
    for (let navIndex = 0; navIndex < NavElems.length; navIndex++) {

        if (index == navIndex) {
            NavElems[navIndex].style.color = 'var(--BrightGold)';
            if (navIndex < 2) Menus[navIndex].style.display = 'block';
            else               Menus[navIndex].style.display = 'flex';
        } else  {
            NavElems[navIndex].style.color = 'var(--DarkGold)';
            Menus[navIndex].style.display = 'none';
        }

    }

}

function toggleGlobalOptions(index) {
    const OPTIONS = document.querySelectorAll('#GlobalOptions .option');
    const CHECKS = document.querySelectorAll('#GlobalOptions .check');

    if (index <= 2) {
        if (!GlobalOptionFlags[index]) CHECKS[index].style.backgroundImage = 'URL("./Assets/Icons/Check.png")';
        else                           CHECKS[index].style.backgroundImage = '';
        GlobalOptionFlags[index] = !GlobalOptionFlags[index];

        if (index == 0) toggleItemNumbers();
        if (index == 1) NonConquest = !NonConquest;
    }
}

function adjustMenu(dir) {

    let tempIndex = ActivePlayer + dir;

    if (CurrentMenu == GodOptionsMenu) {
    
        if (tempIndex < 0) tempIndex = 9;
        if (tempIndex > 9) tempIndex = 0;

        ActivePlayer = tempIndex;
        toggleMenu(GodOptionsMenu);
        setTimeout(() => { toggleMenu(GodOptionsMenu); }, 200);

    } else if (CurrentMenu == GodInfoMenu) {
        
        for (let menuIndex = 0; menuIndex < 15; menuIndex++) {
            if (tempIndex < 0) tempIndex = 9;
            if (tempIndex > 9) tempIndex = 0;
            if (menuIndex == 14) tempIndex = ActivePlayer + dir;
            if (SiteData.PlayerData[tempIndex].God != null) { break; } 
            else { tempIndex += dir; }
        }

        ActivePlayer = tempIndex;
        toggleMenu(GodInfoMenu);
        setTimeout(() => { toggleMenu(GodInfoMenu); }, 200);

    }

}

function toggleItemNumbers() {

    
    for (elem of document.querySelectorAll('.player')) {
        const ITEMS = elem.querySelectorAll('.item');
        for (let itemIndex = 0; itemIndex < 6; itemIndex++) {
            if (!ItemNumbers) ITEMS[itemIndex].style.backgroundImage = `URL('./Assets/Icons/${itemIndex + 1}.png')`;
            else              ITEMS[itemIndex].style.backgroundImage = 'URL("./Assets/Icons/Plus_Gold.png")';
        }
    }
    
    ItemNumbers = !ItemNumbers;
}

function focusSelf(className, obj) {
    const FAMILY = document.querySelectorAll(className);

    for (child of FAMILY) 
        if (child != obj) child.style.backgroundColor = 'var(--InternalBlue)';
        else              child.style.backgroundColor = 'var(--LightGrayBlue)';
}

function showToolTip(msg) { ToolTip.style.opacity = '1'; ToolTip.innerHTML = msg; }
function hideToolTip() { ToolTip.style.opacity = '0'; }
function addPassive(msg) { 
    if (PassiveContent.innerHTML.includes(langText[19])) PassiveContent.innerHTML = '';
    PassiveContent.innerHTML += `<br>${msg}<br>`;
}
function clearPassives() { PassiveContent.innerHTML = `<span style="opacity: .5">${langText[19]}<span>`; }

function appendBuffsToDisplay() {
    InfoBuffs.innerHTML = '';
    for (item of SiteData.PlayerData[ActivePlayer].Buffs)
        for (icon of document.querySelectorAll('.info_menu_button img'))
            if (icon.buffName == item) InfoBuffs.innerHTML += `<img src='./Assets/Icons/${icon.src.split('/')[icon.src.split('/').length - 1]}'>`;
}

function updateBuffDisplay() {
    const BUFFS = SiteData.PlayerData[ActivePlayer].Buffs;
    const ICONS = document.querySelectorAll('.info_menu_button img');
    for (elem of ICONS) 
        if (BUFFS.includes(elem.buffName)) elem.style.boxShadow = '2px 2px 4px white, -2px -2px 4px white, -2px 2px 4px white, 2px -2px 4px white';
        else                               elem.style.boxShadow = '';
}

function updateHealthMana(elem, event) {
    const CURR_GOD = SiteData.PlayerData[ActivePlayer].God.Name;
    if (elem.className == 'god_mana' && (CURR_GOD == 'Cu Chulainn' || CURR_GOD == 'Yemoja')) {

        elem.style.background = 'var(--LightGray)';
        elem.innerHTML = '---';

    } else if (elem.className == 'god_mana') {

        elem.style.backgroundColor = '#4b5fe3';
        elem.innerHTML = '&nbsp;100%&nbsp;';

    }
    if (elem.className == 'god_mana' && (CURR_GOD == 'Cu Chulainn' || CURR_GOD == 'Yemoja') || event == null) return;

    const BOX = elem.getBoundingClientRect();
    MouseInterval = setInterval(function() {

        const X_OFFSET = xPos - BOX.left;
        let Percent = X_OFFSET / (elem.offsetWidth) * 100;
        if (Percent < 5) Percent = 0;
        if (Percent > 95) Percent = 100;
        if (elem.className === 'god_health') elem.style.background = 'linear-gradient(to right, #58d665 ' + Percent + '%, #292929 ' + Percent + '%)';
        else elem.style.background = 'linear-gradient(to right, #4b5fe3 ' + Percent + '%, #292929 ' + Percent + '%)';
        elem.innerHTML = '&nbsp;' + Math.floor(Percent) + '%&nbsp;';
        SiteData.PlayerData[ActivePlayer].BarHealth = Percent;
        SiteData.PlayerData[ActivePlayer].BarMana = Percent;

    }, 100);
}

function clearHMUpdate() { clearInterval(MouseInterval); }

function summonKirby() {
    const AMOUNT = document.querySelectorAll('.kirby').length - 1;
    const HEIGHT = Math.floor(Math.random() * 100) + 1;
    document.querySelector('content').insertAdjacentHTML('afterbegin', `<img class='kirby' src='./Assets/Icons/KirbyFly.gif' style='top:${HEIGHT}%'>`);
    setTimeout(() => { for (elem of document.querySelectorAll('.kirby')) if (getComputedStyle(elem).opacity == '0') elem.remove(); }, 9_000);
    return document.querySelectorAll('.kirby')[AMOUNT];
}

function activeVisualToggle(index, elem) {
    const ITEM_DATA = SiteData.PlayerData[ActivePlayer].Items[index];
    if (!ITEM_DATA) return;
    const NAME = getItemData(ITEM_DATA.ItemId).DeviceName;
    ActiveItem = index;
    if (SiteData.PlayerData[ActivePlayer].ActiveEffects.includes(NAME)) removeActiveEffect(NAME);
    else                                                                applyActiveEffect(NAME);
    updateGodInfoDisplay();
}

function updateGodInfoDisplay() {
    const ITEMS = document.querySelectorAll('.info_item');
    const ITEM_PRICES = document.querySelectorAll('.info_item_label');
    const ITEM_DATA = SiteData.PlayerData[ActivePlayer].Items;
    const PLAYER = SiteData.PlayerData[ActivePlayer];

    for (let elemIndex = 0; elemIndex < 6; elemIndex++) {
        if (ITEM_DATA[elemIndex] != null) {
            ActiveItem = elemIndex;

            const NAME = getItemData(PLAYER.Items[elemIndex].ItemId).DeviceName;
            if (PLAYER.ActiveEffects.includes(NAME)) ITEMS[elemIndex].style.boxShadow = '2px 2px 4px orange, -2px -2px 4px orange, -2px 2px 4px orange, 2px -2px 4px orange';
            else                                     ITEMS[elemIndex].style.boxShadow = '';

            ITEMS[elemIndex].style.backgroundImage = `URL('${ITEM_DATA[elemIndex].itemIcon_URL}')`;

            if (ITEM_DATA[elemIndex].DeviceName.includes('Evolved'))
                ITEM_PRICES[elemIndex].innerHTML = getItemFullPrice(getItemData(ITEM_DATA[elemIndex].DeviceName.replace('Evolved ', '')));
            else 
                ITEM_PRICES[elemIndex].innerHTML = getItemFullPrice(ITEM_DATA[elemIndex]);

            ITEMS[elemIndex].addEventListener("mouseover", 
                () => { 
                    try { showToolTip(`<span style='color:var(--DarkGold)'>${itemLang(ITEM_DATA[elemIndex]).DeviceName}</span><br>${itemLang(ITEM_DATA[elemIndex]).ItemDescription.SecondaryDescription}<br><span style='color:var(--DarkGold)'>${langText[98]}</span>`);
                    } catch (e) {}
                });
            ITEMS[elemIndex].addEventListener("mouseout",  hideToolTip);
                
        } else {

            ITEMS[elemIndex].style.backgroundImage = '';
            ITEM_PRICES[elemIndex].innerHTML = '0';
            ITEMS[elemIndex].addEventListener("mouseover", () => { showToolTip(langText[72]); });
            ITEMS[elemIndex].addEventListener("mouseout",  hideToolTip);

        }
    }

    let totalGold = 0;
    for (item of ITEM_DATA) if (item != null) totalGold += getItemFullPrice(item);
    InfoGold.innerHTML = `${totalGold} <img src="./Assets/Icons/Money.png">`;
}