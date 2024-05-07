/*//// Variables ////*/

let CustomGodFilter = null;
let SelectedGodFilter = null;
let CustomItemFilter = null;
let SelectedItemFilter = null;
let SpecifiedItemTier = '3';
let ActivePlayer = 0;
let ActiveItem = 0;

let GlobalOptionFlags = [0, 0];

SiteData = { "PlayerData" : [] }
for (let playerIndex = 0; playerIndex < 10; playerIndex++) 
    SiteData.PlayerData.push({
        "God": null,
        "Level": 1,
        "Buffs": [],
        "BuffTypes": [],
        "Items": [null, null, null, null, null, null],
        "GlyphIndex": -1,
        "StarterIndex": -1,
        "RecipeIndex": -1,
        "ActiveEffects": [],
        "BarHealth": 100,
        "BarMana": 100,
        "PassiveOn": false,
        "PassiveStance": 0,
        "ActiveEffects": [],
        "Stats": { 
            "Speed": 0,
            "Power": 0,
            "AttackSpeed": 0,
            "BasicAttackDamage": 0,
            "Health": 0,
            "Mana": 0,
            "HP5": 0,
            "MP5": 0,
            "CCR": 0,
            "DamageReduction": 0,
            "PhysicalProtections": 0,
            "MagicalProtections": 0,
            "Penetration": 0,
            "PercentPenetration": 0,
            "CriticalStrike": 0,
            "CDR": 0,
            "Lifesteal": 0,
            "EHP": 0
        }
    });

const StatNicknames = {
    "Speed": ["Movement Speed"],
    "MagPower": ["Magical Power", "Magical power"],
    "PhysPower": ["Physical Power", "Physical power"],
    "Health": ["Health", "Maximum Health"],
    "Mana": ["Mana"],
    "HP5": ["HP5", "HP5 & MP5"],
    "MP5": ["MP5", "HP5 & MP5"],
    "Lifesteal": ["Magical Lifesteal", "Physical Lifesteal"],
    "PhysicalProtections": ["Physical Protections", "Physical protections.", "Physical Protection", "Physical protection"],
    "MagicalProtections": ["Magical Protections", "Magical protections.", "Magical Protection", "Magical protection", "Magical Protection "],
    "CCR": ["Crowd Control Reduction", "Crowd Control Reduction:"],
    "CDR": ["Cooldown Reduction"],
    "Crit": ["Physical Critical Strike Chance", "Critical Strike Chance"],
    "Pen": ["Physical Penetration", "Magical Penetration", "Penetration"],
    "AttackSpeed": ["Attack Speed"],
    "DamageRed": ["Damage Reduction"]
};

const GlyphPairs = [
    ["Bewitched Dagger", "Eldritch Dagger", "Relic Dagger"],
    ["Bancroft's Claw", "Nimble Bancroft's Talon", "Bancroft's Talon"],
    ["Breastplate of Determination", "Breastplate of Vigilance", "Breastplate of Valor"],
    ["Magi's Shelter", "Magi's Revenge", "Magi's Cloak"],
    ["Amulet of Silence", "Amulet of the Stronghold", "Heartward Amulet"],
    ["Calamitous Rod of Tahuti", "Perfected Rod of Tahuti", "Rod of Tahuti"],
    ["Glorious Pridwen", "Reverent Pridwen", "Pridwen"],
    ["Envenomed Executioner", "The Ferocious Executioner", "The Executioner"],
    ["Jotunn's Vigor", "Jotunn's Cunning", "Jotunn's Wrath"],
    ["Malicious Deathbringer", "Devoted Deathbringer", "Deathbringer"],
    ["Flameforged Hammer", "Runebreaking Hammer", "Runeforged Hammer"],
];

/*//// Functions ////*/

function initializeGods() {
    const GodList = document.querySelector('#GodList');
    CustomGodFilter = document.querySelectorAll('#GodMenuLeft Input')[0].value;
    GodList.innerHTML = '';

    const newTrash = document.createElement('div');
    newTrash.classList.add('god_display_elem');
    newTrash.style.backgroundImage = `url("./Assets/Icons/Trash.png")`;
    newTrash.ondblclick = function() { removeGod(); toggleMenu(GodSelectMenu); }
    GodList.appendChild(newTrash);

    for (God of English.Gods) {

        if (SelectedGodFilter != null && God.Roles != SelectedGodFilter) continue;
        if (!godLang(God).Name.toLowerCase().includes(CustomGodFilter.toLowerCase())) continue;
        const newGod = document.createElement('div');
        newGod.classList.add('god_display_elem');
        newGod.style.backgroundImage = `url("${God.godIcon_URL}")`
        const thisGod = God;
        newGod.onclick = function() { displayGod(getGodData(thisGod.id).Name); }
        newGod.ondblclick = function() { removeGod(); appendGod(thisGod); toggleMenu(GodSelectMenu); }
        GodList.appendChild(newGod);

    }
}

function initializeItems() {
    const ItemList = document.querySelector('#ItemList');
    CustomItemFilter = document.querySelectorAll('#ItemMenuLeft Input')[0].value;
    ItemList.innerHTML = '';

    const newTrash = document.createElement('div');
    newTrash.classList.add('item_display_elem');
    newTrash.style.backgroundImage = `url("./Assets/Icons/Trash.png")`;
    newTrash.ondblclick = function() { removeItem(); toggleMenu(ItemSelectMenu); }
    ItemList.appendChild(newTrash);

    const God = getGodData(SiteData.PlayerData[ActivePlayer].God.id);

    for (Item of English.Items) {

        const DMGTYPE = damageType(Item);
        const STATS = getStatNames(Item);

        let FilterFlag = false;
        if (StatNicknames[SelectedItemFilter] == null) {
            try {
                if (SelectedItemFilter == 'Starter' || SelectedItemFilter == null) FilterFlag = true;
                else if (SelectedItemFilter == 'Aura' && Item.ItemDescription.SecondaryDescription.includes('AURA')) 
                    FilterFlag = true;
                else if (SelectedItemFilter == 'Power') {
                    for (stat of STATS) 
                        if (StatNicknames['MagPower'].includes(stat))
                            FilterFlag = true;
                    for (stat of STATS) 
                        if (StatNicknames['PhysPower'].includes(stat))
                            FilterFlag = true;
                } 
            } catch (e) {}
        } else {
            for (stat of STATS) {
                if (StatNicknames[SelectedItemFilter].includes(stat))
                    FilterFlag = true;
            }
        }
        
        if (Item.ItemId == '19508') continue;
        if (!FilterFlag) continue;
        if (SelectedItemFilter == 'Starter' && !Item.StartingItem) continue;
        if (Item.RestrictedRoles.includes(God.Roles.toLowerCase())) continue;
        if ((Item.DeviceName.toLowerCase()).includes('acorn') && God.Name != 'Ratatoskr') continue;
        if (DMGTYPE != 'Neutral' && !God.Type.includes(DMGTYPE)) continue;
        if (SelectedItemFilter != 'Starter' && SpecifiedItemTier && SpecifiedItemTier != Item.ItemTier) continue;
        if (Item.ItemTier != SpecifiedItemTier) continue;
        if (!itemLang(Item).DeviceName.toLowerCase().includes(CustomItemFilter.toLowerCase())) continue;

        const newItem = document.createElement('div');
        newItem.classList.add('item_display_elem');
        newItem.style.backgroundImage = `url("${Item.itemIcon_URL}")`
        newItem.deviceName = Item.DeviceName;
        const thisItem = Item;
        newItem.onclick = function() { displayItem(getItemData(thisItem.ItemId).DeviceName); }
        newItem.ondblclick = function() { removeItem(); appendItem(thisItem); toggleMenu(ItemSelectMenu); }
        ItemList.appendChild(newItem);

    }
}

function updateLevel() { 
    SiteData.PlayerData[ActivePlayer].Level = document.querySelector('#LevelSlider').value;
    LevelLabel.innerHTML = document.querySelector('#LevelSlider').value;
}

function appendGod(GodObj) {
    SiteData.PlayerData[ActivePlayer].God = GodObj;
    const PLAYERS = document.querySelectorAll('.god_icon .icon');
    PLAYERS[ActivePlayer].style.backgroundImage = `URL('${GodObj.godIcon_URL}')`;
    updateHealthMana(document.querySelectorAll('.god_mana')[ActivePlayer], null);
}
function removeGod() { 
    SiteData.PlayerData[ActivePlayer].God = null;
    const PLAYERS = document.querySelectorAll('.god_icon .icon');
    PLAYERS[ActivePlayer].style.backgroundImage = 'URL("./Assets/Icons/Question_Gold.png")';
    for (let itemIndex = 0; itemIndex < 6; itemIndex++) {
        ActiveItem = itemIndex;
        removeItem();
    }
}

function appendItem(itemObj, flag=0) { 

    /* Logic Filters */
    const CURR_ITEMS = SiteData.PlayerData[ActivePlayer].Items;

    // No Duplicates
    if (CURR_ITEMS.includes(itemObj)) 
        { if (!flag) alertUser(langText[86]); return; }
    // No Two Starters
    if (SiteData.PlayerData[ActivePlayer].StarterIndex != -1 && itemObj.StartingItem) 
        { if (!flag) alertUser(langText[84]); return; }
    // No Tier III and respective Tier IV
    for (pair of GlyphPairs) for (item of CURR_ITEMS)
        if (item && pair.includes(item.DeviceName) && pair.includes(itemObj.DeviceName)) 
            { if (!flag) alertUser(langText[85]); return; }
    // No Two Acorns
    for (item of CURR_ITEMS) if (item && item.DeviceName.toLowerCase().includes('acorn') && itemObj.DeviceName.toLowerCase().includes('acorn'))
    { if (!flag) alertUser(langText[83]); return; }

    // No Parent
    for (item of CURR_ITEMS) if (item && getChildren(item).includes(itemObj.DeviceName))
    { if (!flag) alertUser(langText[104]); return; }

    // No Parent
    for (item of CURR_ITEMS) if (item && getChildren(itemObj).includes(item.DeviceName))
    { if (!flag) alertUser(langText[103]); return; }

    if (itemObj.StartingItem) SiteData.PlayerData[ActivePlayer].StarterIndex = ActiveItem;
    SiteData.PlayerData[ActivePlayer].Items[ActiveItem] = itemObj;
    const ITEMS = document.querySelectorAll('.item');
    ITEMS[ActivePlayer * 6 + ActiveItem].style.backgroundImage = `URL('${itemObj.itemIcon_URL}')`;
}
function removeItem() {
    const ITEM = SiteData.PlayerData[ActivePlayer].Items[ActiveItem];

    if (ITEM && ITEM.StartingItem) 
        SiteData.PlayerData[ActivePlayer].StarterIndex = -1;

    if (ITEM == null) return;

    const ITEM_DISPLAY = document.querySelectorAll('.info_item');
    ITEM_DISPLAY[ActiveItem].style.boxShadow = '';
    removeActiveEffect(ITEM.DeviceName);

    SiteData.PlayerData[ActivePlayer].Items[ActiveItem] = null;
    const ITEMS = document.querySelectorAll('.item');
    ITEMS[ActivePlayer * 6 + ActiveItem].style.backgroundImage = `URL("./Assets/Icons/Plus_Gold.png")`;
} 

function randomItems() {
    if (SiteData.PlayerData[ActivePlayer].God == null) { alertUser(langText[80]); return; }

    CustomItemFilter = null;
    SelectedItemFilter = 'Starter';
    SpecifiedItemTier = '2';

    const ACORNS = ['Bristlebush Acorn', 'Thistlethorn Acorn', 'Thickbark Acorn', 'Evergreen Acorn'];

    for (let itemIndex = 0; itemIndex < 6; itemIndex++) {

        ActiveItem = itemIndex;
        initializeItems();

        if (itemIndex == 0 && SiteData.PlayerData[ActivePlayer].God.Name == 'Ratatoskr') {
            const RANDOM_ACORN = ACORNS[Math.floor(Math.random() * ACORNS.length)];
            const RANDOM_ITEM = getItemData(RANDOM_ACORN);
            try { appendItem(RANDOM_ITEM, true); } catch (e) { return; }
            SelectedItemFilter = null;
            SpecifiedItemTier = '3';
            continue;
        }
      
        const ITEMS = document.querySelectorAll('.item_display_elem');
        const RANDOM_INDEX = Math.floor(Math.random() * (ITEMS.length - 1) + 1);
        const RANDOM_ITEM = getItemData(ITEMS[RANDOM_INDEX].deviceName, langRef);
        appendItem(RANDOM_ITEM, true);
        SelectedItemFilter = null;
        SpecifiedItemTier = '3';

        if (itemIndex == 5 && SiteData.PlayerData[ActivePlayer].Items.includes(null)) itemIndex = 0;
    }
    toggleMenu(GodOptionsMenu);
}

function randomGod() {
    const RANDOM_GOD = Math.floor(Math.random() * English.Gods.length);
    appendGod(English.Gods[RANDOM_GOD]);
    SiteData.PlayerData[ActivePlayer].Level = 20;
    toggleMenu(GodOptionsMenu);
}

function randomAll() {
    randomGod();
    randomItems();
    toggleMenu(GodOptionsMenu);
}

function randomEverything() {
    for (let playerIndex = 0; playerIndex < 10; playerIndex++) {
        ActivePlayer = playerIndex;
        randomAll();
    }
}

function generateLink() {
    const REGEX = />([^<]+)/;
    let link = '';

    for (let playerIndex = 0; playerIndex < 10; playerIndex++) {
        if (!SiteData.PlayerData[playerIndex].God) continue;

        else link += playerIndex + 'g=' + SiteData.PlayerData[playerIndex].God.id + '&';
        link += playerIndex + 'l=' + SiteData.PlayerData[playerIndex].Level + '&';

        for (let itemIndex = 0; itemIndex < 6; itemIndex++) {
            if (!SiteData.PlayerData[playerIndex].Items[itemIndex]) link += playerIndex + 'i' + itemIndex + '=N&';
            else link += playerIndex + 'i' + itemIndex + '=' + SiteData.PlayerData[playerIndex].Items[itemIndex].ItemId + '&';
        }

        link += playerIndex + 'bfs=';
        if (!SiteData.PlayerData[playerIndex].Buffs.length) link += 'N';
        for (Buffs of SiteData.PlayerData[playerIndex].Buffs) link += Buffs + ',';
        link += '&';

    }
    return link;
}

function generateShareLink() {
    const URL = ((window.location.href).split('?'))[0];
    navigator.clipboard.writeText(`${URL}?${generateLink()}`);
}

function selectBuff(elem) {
    const BUFFS = SiteData.PlayerData[ActivePlayer].Buffs;
    if (elem == null) SiteData.PlayerData[ActivePlayer].Buffs = []; 
    if (elem != null && !BUFFS.includes(elem.buffName)) BUFFS.push(elem.buffName);
    updateBuffDisplay();
}

function getDPS() {
    const PLAYER = SiteData.PlayerData[ActivePlayer];
    let modifier = 1.75;
    if (!PLAYER.God) return 0;

    if (PLAYER.God.Name == 'Heimdallr') modifier *= .6;

    if (PLAYER.Items.includes(getItemData('Deathbringer')) ||
        PLAYER.Items.includes(getItemData('Devoted Deathbringer'))  ||
        PLAYER.Items.includes(getItemData('Nalicious'))) modifier = 2;

    return PLAYER.Stats.BasicAttackDamage * PLAYER.Stats.AttackSpeed + (modifier * PLAYER.Stats.BasicAttackDamage * PLAYER.Stats.AttackSpeed) * (PLAYER.Stats.CriticalStrike / 100);
}

function applyActiveEffect(name) {
    const EFFECTS = SiteData.PlayerData[ActivePlayer].ActiveEffects;
    if (!EFFECTS.includes(name)) EFFECTS.push(name);
    
    if (getItemData(`Evolved ${name}`)) {

        SiteData.PlayerData[ActivePlayer].Items[ActiveItem] = itemLang(getItemData(`Evolved ${name}`));

    } else if (getItemData(name.replace('Evolved ', ''))) {

        SiteData.PlayerData[ActivePlayer].Items[ActiveItem] = itemLang(getItemData(name.replace('Evolved ', '')));

    }
    updateStats();
}

function removeActiveEffect(name) {
    const EFFECTS = SiteData.PlayerData[ActivePlayer].ActiveEffects;
    if (EFFECTS.includes(name)) EFFECTS.splice(EFFECTS.indexOf(name), 1);
    updateStats();
}