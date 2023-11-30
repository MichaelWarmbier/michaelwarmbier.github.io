//////////////////////////////////////
/*//// Initialization Functions ////*/
//////////////////////////////////////

function initializeGods() {
    const Filter = document.querySelectorAll('select')[0].value;
    const GodMenu = document.querySelector('#GodList');
    GodMenu.innerHTML = '';

    // Create trash element
    const newGod = document.createElement('div');
    newGod.classList.add('god');
    newGod.style.backgroundImage = `url("Assets/Icons/Trash.png")`
    newGod.ondblclick = function() { removeGod(); displayMenu(document.querySelector('#GodMenu')); }
    GodMenu.appendChild(newGod);

    // Create God elements
    for (God of English.Gods) {
        if (!God.Name.toLowerCase().includes(SiteData.SearchQuery)) continue;
        if (God[Filter] != SiteData.Filter && SiteData.Filter) continue;
        const newGod = document.createElement('div');
        newGod.classList.add('god');
        newGod.style.backgroundImage = `url("${God.Icon}")`
        const thisGod = God;
        newGod.onclick = function() { displayGod(thisGod.Name); }
        newGod.ondblclick = function() { removeGod(); appendGod(thisGod); }
        GodMenu.appendChild(newGod);
    }
}

function initializeItems() {
    const PLAYER = SiteData.ActivePlayerIndex;
    const God = SiteData.PlayerData[PLAYER - 1].God;
    const Filter = SiteData.Filter;
    const ItemMenu = document.querySelector('#ItemList');

    // Create trash element
    ItemMenu.innerHTML = '';
    const newItem = document.createElement('div');
    newItem.classList.add('item_elem');
    newItem.style.backgroundImage = `url("Assets/Icons/Trash.png")`
    newItem.ondblclick = function() { removeItem(SiteData.ActiveItemIndex - 1); }
    ItemMenu.appendChild(newItem);

    // Create item elements
    for (Item of English.Items) {
        if (Filter == 'Starter' && !Item.Starter) continue;
        if (!Item.Name.toLowerCase().includes(SiteData.SearchQuery)) continue;
        if (!Item.Filters.includes(Filter) && Filter) continue;
        if (Item.RestrictedRoles.includes(God.Role.toLowerCase())) continue;
        if ((Item.Name.toLowerCase()).includes('acorn') && God.Name != 'Ratatoskr') continue;
        if (Item.DamageType != 'Neutral' && Item.DamageType != God.Type) continue;
        if (Filter != 'Starter' && Filter != 'Recipe' && SiteData.TierFilter && SiteData.TierFilter != Item.Tier) continue;
        if (Filter != 'Recipe' && Item.Tier == 3 && Item.Filters.includes('Recipe')) continue;
        const newItem = document.createElement('div');
        newItem.classList.add('item_elem');
        newItem.style.backgroundImage = `url("${Item.URL}")`;
        newItem.lang = Item.Name;
        const thisItem = Item;
        newItem.onclick = function() { displayItem(thisItem.Name); }
        newItem.ondblclick = function() { appendItem(thisItem); }
        ItemMenu.appendChild(newItem);
    }
}

///////////////////////////////
/*//// Utility Functions ////*/
///////////////////////////////

function toggleGOption(option) {
    const optionElem = document.querySelectorAll('.c')[option];
    if (option) SiteData.Options[option] = !SiteData.Options[option];
    if (SiteData.Options[option]) optionElem.innerHTML = '✓';
    else optionElem.innerHTML = '';
}

function toggleSaveFile(file) {
    SiteData.SaveNumber = file;
    loadData();
}

function setFilter(name) { 
    SiteData.Filter = name; print(`Set filter to ${name}`);
    initializeGods();
    initializeItems();
}

function appendInfo() {
    const PLAYER = SiteData.ActivePlayerIndex;
    const GOD = SiteData.PlayerData[PLAYER - 1].God;
    const PANTHEONDATA = getPantheon(GOD.Pantheon);
    const ITEM_PRICE = document.querySelectorAll('.item_price');
    document.querySelector('#GodCard').style.backgroundImage = `url("${GOD.CardArt}")`;

    // Patch for broken God art
    if (GOD.Name == 'Mercury' || GOD.Name == 'Maui'  || GOD.Name == 'Hun Batz')
        document.querySelector('#GodCard').style.backgroundImage = `url(Assets/Art/${GOD.Name.replace(' ', '')}.png)`;

    document.querySelector('#GodName').innerHTML = GOD.Name;
    document.querySelector('#GodTitle').innerHTML = GOD.Title;
    document.querySelector('#GodPantheon').innerHTML = `<span style="color:${PANTHEONDATA.Color}"><img src="Assets/Icons/${PANTHEONDATA.Icon}">${PANTHEONDATA.Name}</span>`;
    document.querySelector('#GodLevel').innerHTML = `Level: ${SiteData.PlayerData[PLAYER - 1].Level}`;
    if (!SiteData.PlayerData[PLAYER - 1].Buffs.length) document.querySelector('#GodBuffs').innerHTML = 'No Buffs Selected';
    else {
        document.querySelector('#GodBuffs').innerHTML = '';
        for (buff of SiteData.PlayerData[PLAYER - 1].Buffs)
        document.querySelector('#GodBuffs').innerHTML += buff.replace(/_/g, ' ');
        document.querySelector('#GodBuffs').innerHTML = document.querySelector('#GodBuffs').innerHTML.slice(0, -2);
    }

    let ItemDisp = document.querySelectorAll('.item_disp');
    for (Item of ItemDisp) Item.replaceWith(Item.cloneNode(true));
    ItemDisp = document.querySelectorAll('.item_disp');

    let ItemIndex = 0;
    let totalBuildPrice = 0;
    for (Item of SiteData.PlayerData[PLAYER - 1].Items) {
        ItemIndex++;
        if (!Item) {
            ItemDisp[ItemIndex - 1].style.backgroundImage = '';
            ITEM_PRICE[ItemIndex - 1].innerHTML = '0 <img src="Assets/Icons/Gold.png">';
            continue;
        }
        ItemDisp[ItemIndex - 1].style.backgroundImage = `url("${Item.URL}")`;
        let statString = '<span class="extra_stats">';
        for (Stat of Item.Stats) statString += `${Stat.StatName} ${Stat.Value}<br>`;
        createTextEvent(ItemDisp[ItemIndex - 1], `<span style="color: var(--DarkGold)">${Item.Name}</span><br><br>${Item.Description}<br><br>${statString}</span>`);
        ITEM_PRICE[ItemIndex - 1].innerHTML = Item.Gold + '<img src="Assets/Icons/Gold.png">';
        totalBuildPrice += Item.Gold;
    }
    document.querySelector('#BuildPrice').innerHTML = totalBuildPrice + '<img src="Assets/Icons/Gold.png">';
}

function getPantheon(name) { for (item of SiteData.PantheonData) if (item.Name === name) return item; }

function displayGod(name) {
    for (God of English.Gods) if (God.Name === name) {
        function getPantheon(name) { for (item of SiteData.PantheonData) if (item.Name === name) return item; }
        const PantheonData = getPantheon(God.Pantheon);
        document.querySelectorAll('#GodDetails .title')[0].innerHTML = God.Name;
        document.querySelectorAll('#GodDetails .subtitle')[0].innerHTML = God.Title;
        document.querySelectorAll('#GodDetails .label')[0].innerHTML = `<div class="pantheon_ico"></div><span style="color:${PantheonData.Color}">${PantheonData.Name}</span>`
        document.querySelectorAll('#GodDetails .type')[0].innerHTML = `${God.Type} ${God.Role}`;
        document.querySelectorAll('#GodDetails .ico')[0].style.backgroundImage = `url("${God.Icon}")`;
        document.querySelectorAll('.pantheon_ico')[0].style.backgroundImage = `url("Assets/Icons/${PantheonData.Icon}")`;
        break;
    }
}

function appendGod(God) {
    const PLAYER = SiteData.ActivePlayerIndex;
    const GodIcon = document.querySelectorAll('#App .icon')[PLAYER - 1];
    GodIcon.innerHTML = '';
    if (God) GodIcon.style.backgroundImage = `url(${God.Icon})`;
    else { GodIcon.style.backgroundImage = ''; GodIcon.innerHTML = '?' }
    SiteData.PlayerData[PLAYER - 1].God = God;
    if (God) print(`${God.Name} selected for player ${SiteData.ActivePlayerIndex % 5} of ${SiteData.ActivePlayerIndex < 6 ? 'Chaos' : 'Order'}`)
    displayMenu(document.querySelector('#GodMenu'));
}

function displayItem(name) {
    document.querySelectorAll('#ItemDetails .subtitle')[1].innerHTML = '';
    for (Item of English.Items) if (Item.Name === name) {
        document.querySelectorAll('#ItemDetails .title')[0].innerHTML = Item.Name;
        document.querySelectorAll('#ItemDetails .subtitle')[0].innerHTML = Item.Description;
        for (ItemInfo of Item.Stats)
            document.querySelectorAll('#ItemDetails .subtitle')[1].innerHTML += `${ItemInfo.StatName} ${ItemInfo.Value}<br>`;
        document.querySelectorAll('#ItemDetails .label')[0].innerHTML = `</div><span style="color:#B5A672;">${Item.Gold}</span>`;
        document.querySelectorAll('#ItemDetails .type')[0].innerHTML = `</div><span style="#A8A8A8">${Item.SelfGold}</span>`;
        break;
    }
}

function appendItem(Item, RandomProcess=false) {
    const PLAYER = SiteData.ActivePlayerIndex;
    const ITEM = SiteData.ActiveItemIndex;
    const CURR_ITEMS = SiteData.PlayerData[PLAYER - 1].Items;
    const PAIRS = SiteData.GlyphPairs;
    let Starter = SiteData.PlayerData[PLAYER - 1].StarterIndex;
    let Glyph = SiteData.PlayerData[PLAYER - 1].GlyphIndex;
    let Recipe = SiteData.PlayerData[PLAYER - 1].RecipeIndex;

    // Item checks
    if (Item && SiteData.PlayerData[PLAYER - 1].Items.includes(Item)) { if (!RandomProcess) print('Item already selected', 1); return; }
    if (Item && Starter != -1 && Item.Starter && ITEM != Starter) { if (!RandomProcess) print('Cannot select two starter items', 1); return; }
    if (Item && Glyph != -1 && Item.isGlyph && ITEM != Glyph) { if (!RandomProcess) print('Cannot select two glyph items', 1); return; }
    if (Item && Recipe != -1 && Item.Filters.includes('Recipe') && ITEM != Recipe) { if (!RandomProcess) print('Cannot select two recipes', 1); return; }
    for (checkItem of CURR_ITEMS) for (pair of PAIRS) {
        if (Item && checkItem && pair.Pair.includes(Item.Name) && pair.Pair.includes(checkItem.Name) && checkItem != CURR_ITEMS[ITEM - 1])  
        { if (!RandomProcess) print('Cannot select Tier IV and its respective Tier III', 1); return; }
    }

    // Item appending
    let ItemIcon = document.querySelectorAll('.item')[((PLAYER - 1) * 6) + ITEM - 1];
    ItemIcon.replaceWith(ItemIcon.cloneNode(true));
    ItemIcon = document.querySelectorAll('.item')[((PLAYER - 1) * 6) + ITEM - 1];
    SiteData.PlayerData[PLAYER - 1].Items[ITEM - 1] = Item;
    if (Item && Item.Starter) SiteData.PlayerData[PLAYER - 1].StarterIndex = ITEM;
    if (Item && Item.isGlyph) SiteData.PlayerData[PLAYER - 1].GlyphIndex = ITEM;
    if (Item && Item.Filters.includes('Recipe')) SiteData.PlayerData[PLAYER - 1].RecipeIndex = ITEM;

    if (Item) {
        if (!SiteData.Options[0]) ItemIcon.innerHTML = '';
        ItemIcon.style.backgroundImage = `url(${SiteData.PlayerData[PLAYER - 1].Items[ITEM - 1].URL})`;
        let statString = '<span class="extra_stats">';
        for (Stat of Item.Stats) statString += `${Stat.StatName} ${Stat.Value}<br>`;
        createTextEvent(ItemIcon, `<span style="color: var(--DarkGold)">${Item.Name}</span><br><br>${Item.Description}<br><br>${statString}</span>`);
    }
    else {
        if (!SiteData.Options[0]) ItemIcon.innerHTML = '+'
        ItemIcon.style.backgroundImage = '';
        createTextEvent(ItemIcon, 'Select an Item');
    }

    if (SiteData.ActiveMenu == ItemMenu) displayMenu(document.querySelector('#ItemMenu'));
    if (Item) print(`${Item.Name} selected for player ${SiteData.ActivePlayerIndex % 5} of ${SiteData.ActivePlayerIndex < 6 ? 'Chaos' : 'Order'}`);
    return ['SUCCESS', Item];
}

function removeItem(item) {
    SiteData.ActiveItemIndex = item + 1;
    appendItem(null);
    SiteData.PlayerData[SiteData.ActivePlayerIndex - 1].Items[item - 1] = null;
    print(`Item ${item} removed for player ${SiteData.ActivePlayerIndex % 5} of ${SiteData.ActivePlayerIndex < 6 ? 'Chaos' : 'Order'}`)
}

function removeGod() {
    for (let itemIndex = 0; itemIndex < 6; itemIndex++) removeItem(itemIndex);
    appendGod(null);
    SiteData.PlayerData[SiteData.ActivePlayerIndex - 1].God = null;
    print(`God removed for player ${SiteData.ActivePlayerIndex % 5} of ${SiteData.ActivePlayerIndex < 6 ? 'Chaos' : 'Order'}`)
    displayMenu(document.querySelector('#GodMenu'));
}

function setTier(tier) {
    SiteData.TierFilter = tier;
    let TierButtons = document.querySelectorAll('.tier_filter');
    for (Button of TierButtons) Button.style.color = 'var(--DarkGrayed)';
    TierButtons[tier - 1].style.color = 'var(--DarkGold)';
}

function getGodData(id) { for (God of English.Gods) if (God.Id == id) return God; }
function getItemData(id) { for (Item of English.Items) if (Item.Id == id) return Item; }