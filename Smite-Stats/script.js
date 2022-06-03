/* Variables */

// html variables
var godSelectionDisplay = document.getElementById('god_filter_box');
var itemSelectionDisplay = document.getElementById('item_filter_box');
var godSelectionElement = document.getElementsByClassName('god_filter_child');
var itemSelectionElement = document.getElementsByClassName('item_filter_child');

var godDisplay = document.getElementsByClassName('active_god');
var godDetails = document.getElementById('god_details_display');
var itemDetails = document.getElementById('item_details_display');
var backdrop = document.getElementById('filter_backdrop');
var searchDisplay = document.getElementById('search');
var statsDisplay = document.getElementsByClassName('stats_display');
var infoDisplay = document.getElementById('info');
var levelDisplay = document.getElementById('level_selection');
var buffDisplay = document.getElementById('buff_selection');

var godDetailsTitle = document.getElementById('god_display_title');
var godDetailsSubtitle = document.getElementById('god_display_subtitle');
var godDetailsArt = document.getElementById('god_display_art');
var godDetailsDesc = document.getElementById('god_display_details');
var godDetailsPan = document.getElementById('god_display_pan');
var godDetailsRole = document.getElementById('god_display_role');
var itemDetailsTitle = document.getElementById('item_display_title');
var itemDetailsIcon = document.getElementById('item_display_icon');
var itemDetailsStats = document.getElementById('item_display_stats');
var itemDetailsDesc = document.getElementById('item_display_desc');

var activeBuffDisplay = document.getElementsByClassName('active_god_buff');
var itemList = document.getElementsByClassName('item_selection');

var godHud = document.getElementsByClassName('god_hud');
var godHudName = document.getElementsByClassName('god_hud_name');
var godHudLevel = document.getElementsByClassName('god_hud_level');

var infoNews = document.getElementById('news');
var infoAbout = document.getElementById('about');

var buildNumbersVisible = false;

const mobile = (screen.width <= 950);

// js variables
var activeSide = 0;
var activeItem = null;

var hoveredGod = null;
var hoveredItem = null;

var activeGodFilter = null;
var activeItemFilter = null;
var activeSearchQuery = null;

var godDisplayOpen = false;
var itemDisplayOpen = false;
var searchDisplayOpen = false;
var infoDisplayOpen = false;
var levelDisplayOpen = false;
var buffDisplayOpen = false;
var infoDisplayIndex = 0;

var webConsole = document.getElementById('console');
var webConsoleOpen = false;

/* Site Data */

var Info = [
  {
    currentGod: null,
    starterPosition: null,
    glyphPosition: null,
    fire_buff: 'none',
    buff: 'none',
    stance: null,
    level: 1,
    items: [null, null, null, null, null, null],
    stats: {
      speed: 0,
      attack_speed: 0,
      power: 0,
      basic_attack: 0,
      health: 0,
      mana: 0,
      hp5: 0,
      mp5: 0,
      cooldown: 0,
      crowd_control: 0,
      phys_prot: 0,
      mag_prot: 0,
      damage_red: 0,
      crit: 0,
      pen: 0,
      per_pen: 0,
      lifesteal: 0
    }
  },
  {
    currentGod: null,
    starterPosition: null,
    glyphPosition: null,
    fire_buff: 'none',
    buff: 'none',
    stance: null,
    level: 1,
    items: [null, null, null, null, null, null],
    stats: {
      speed: 0,
      attack_speed: 0,
      power: 0,
      basic_attack: 0,
      health: 0,
      mana: 0,
      hp5: 0,
      mp5: 0,
      cooldown: 0,
      crowd_control: 0,
      phys_prot: 0,
      mag_prot: 0,
      damage_red: 0,
      crit: 0,
      pen: 0,
      per_pen: 0,
      lifesteal: 0
    }
  }
]

var colorData = {
  roleName: ["Mage", "Guardian", "Assassin", "Warrior", "Hunter"],
  roleColor: ["#3399ff", "#009900", "#ffff00", "#ff4d4d", "#ff9900"],
  roleIcon: [null, null, null, null, null],
  pantheonName: ["Arthurian", "Babylonian", "Celtic", "Chinese", "Egyptian", "Great Old Ones", "Greek", "Hindu", "Japanese", "Maya", "Norse", "Polynesian", "Roman", "Slavic", "Voodoo", "Yoruba"],
  pantheonColor: ["#b32400", "#0080ff", "#29a329", "#ffff1a", "#804000", "#4d004d", "#660066", "#ff0080", "#ff6666", "#ffad33", "#e6e6e6", "#ff8000", "#997300", "#e6ac00", "#c653c6", "#ffffb3"]
}

/* Methods */

// initialize

function initializeGods() {
  
  for(i = godSelectionElement.length - 1; i >= 0; i--)
      godSelectionElement[i].parentNode.removeChild(godSelectionElement[i]); 

  for (i = 0; i < Data.Gods.length; i++) {
    if (!activeGodFilter || (activeGodFilter == Data.Gods[i].Role)) {

      if (activeSearchQuery != null &&
          !Data.Gods[i].Name.toLowerCase().includes(activeSearchQuery.toLowerCase()))
        continue;
      
      let newElem = document.createElement('div');
      godSelectionDisplay.appendChild(newElem);
      newElem.classList.add('god_filter_child');
      newElem.style.backgroundImage = 'url(' + Data.Gods[i].Icon + ')';
      newElem.id = '_' + i;
      newElem.lang = Data.Gods[i].Name;
      newElem.onclick = function() { hoverGod(this); };
    }
  }

  activeSearchQuery = null;
  
}

function initializeItems() {

  for (i = itemSelectionElement.length - 1; i >= 0; i--)
    itemSelectionElement[i].parentNode.removeChild(itemSelectionElement[i]);

  let newElem = document.createElement('div');
  itemSelectionDisplay.appendChild(newElem);
  newElem.classList.add('item_filter_child');
  newElem.style.backgroundImage = 'url(assets/site/trash.png)';
  newElem.id = '_' + Data.Items.length;
  newElem.lang = 'Delete Item';
  newElem.onclick = function() { deleteItem(activeItem); itemSelectionToggle(); };

  for (i = 0; i < Data.Items.length; i++) { // add filters

    if (i == 186) continue;

    let badAdd = false;

    if (Data.Items[i].RestrictedRoles != 'no restrictions') {
      let restrictions = Data.Items[i].RestrictedRoles.split(',');
      for (j = 0; j < restrictions.length; j++)
        if (restrictions[j] == Info[activeSide].currentGod.Role.toLowerCase())
          badAdd = true;
    }

    for (j = 0; j < Info[activeSide].items.length; j++)
      if (Info[activeSide].items[j] != null && Info[activeSide].items[j].Name == Data.Items[i].Name) badAdd = true;
    
    if (badAdd) continue;

    
    if ((Data.Items[i].Ratatoskr && Info[activeSide].currentGod.Name != 'Ratatoskr') || (Info[activeSide].currentGod.Type != Data.Items[i].DamageType && Data.Items[i].DamageType != 'Neutral') ||
       (activeItemFilter == 'Tier 1' && (Data.Items[i].Tier != 1 || Data.Items[i].Starter)) ||
       (activeItemFilter == 'Tier 2' && (Data.Items[i].Tier != 2 || Data.Items[i].Starter)) ||
       (activeItemFilter == 'Tier 3' && Data.Items[i].Tier != 3) ||
       (activeItemFilter == 'Tier 4' && Data.Items[i].Tier != 4) ||
       (activeItemFilter == 's_start' && (Data.Items[i].Tier != 1 || !Data.Items[i].Starter))||
       (activeItemFilter == 'b_start' && (Data.Items[i].Tier != 2 || !Data.Items[i].Starter))||
       (activeSearchQuery != null &&
          !Data.Items[i].Name.toLowerCase().includes(activeSearchQuery.toLowerCase())))
      continue;
    
    let newElem = document.createElement('div');
    itemSelectionDisplay.appendChild(newElem);
    newElem.classList.add('item_filter_child');
    newElem.style.backgroundImage = 'url(' + Data.Items[i].URL + ')';
    newElem.id = '_' + i;
    newElem.lang = Data.Items[i].Name;
    newElem.onclick = function() { hoverItem(this); };
    
  }

  activeSearchQuery = null;
   
}

// apply changes

function appendGod(selection) {
  if (hoveredGod == null) { printToConsole('Select a God first!', 'negative'); return; }

  clearAllItems(activeSide);
  
  Info[activeSide].currentGod = hoveredGod;
  godHud[activeSide].style.display = 'block';
  godHudName[activeSide].innerHTML = hoveredGod.Name;
  godDisplay[activeSide].innerHTML = '';
  if (hoveredGod.Name == 'Hun Batz')
    godDisplay[activeSide].style.backgroundImage = 'url(assets/godfix/HunBatz.png)';
  else if (hoveredGod.Name == 'Mercury')
    godDisplay[activeSide].style.backgroundImage = 'url(assets/godfix/Mercury.png)';
  else
    godDisplay[activeSide].style.backgroundImage = 'url(' + hoveredGod.CardArt + ')';
  setDamageTypeDisplay(Info[activeSide].currentGod.Type);

  for (i = 0; i < 6; i++) itemList[activeSide].getElementsByClassName('item')[i].style.cursor = 'pointer';

  updateStats(activeSide);

  printToConsole(hoveredGod.Name + ' selected for side ' + getSide(activeSide));
}

async function appendItem() {
  if (hoveredItem == null) { printToConsole('Select an item first!', 'negative'); return; }
  
  for (i = 0; i < 6; i++)
    if (Info[activeSide].items[i] == hoveredItem)
      return;

  if (hoveredItem.Starter && (Info[activeSide].starterPosition != activeItem &&
                             Info[activeSide].starterPosition != null)) {
    printToConsole('Starter item is already selected!', 'negative');
    return;
  }
  else if (hoveredItem.Starter) {
    printToConsole('Starter item added', 'positive')
    Info[activeSide].starterPosition = activeItem;
  }
  
  if (hoveredItem.isGlyph && (Info[activeSide].glyphPosition != activeItem && 
                              Info[activeSide].glyphPosition != null)) {
    printToConsole('Glyph item already selected!', 'negative');
    return;
  }
  else if (hoveredItem.isGlyph) {
    printToConsole('Glyph item added', 'positive')
    Info[activeSide].glyphPosition = activeItem;
  }
  else if (!hoveredItem.isGlyph) Info[activeSide].glyphPosition = null;
  
  let displayedItems = itemList[activeSide].getElementsByClassName('item');
  Info[activeSide].items[activeItem] = hoveredItem;
  displayedItems[activeItem].innerHTML = '';
  displayedItems[activeItem].style.backgroundImage = 'url(' + hoveredItem.URL + ')';

  updateStats(activeSide);

  printToConsole(hoveredItem.Name + ' selected for side ' + getSide(activeSide) + ' as item ' + activeItem, 'positive');
  hoveredItem = null;
  
}

// toggle visibility

function godSelectionToggle() { 
  if (godDisplayOpen) {
    backdrop.style.display = 'none';
    godSelectionDisplay.style.display = 'none';
    if (!mobile) searchDisplay.style.display = 'none';
    godDetails.style.display = 'none';
  }
  else {
    printToConsole('Current active side: ' + getSide(activeSide));
    initializeGods();
    backdrop.style.display = 'block';
    godSelectionDisplay.style.display = 'block';
    if (!mobile) searchDisplay.style.display = 'block';
    godDetails.style.display = 'block';
  }
  document.getElementById('search_input').value = '';
  godDisplayOpen = !godDisplayOpen; 
}

function itemSelectionToggle() { 
  
  if (!Info[activeSide].currentGod) {
    printToConsole('Select a character before choosing items!', 'negative'); 
    return;
  }

  if (itemDisplayOpen) {
    backdrop.style.display = 'none';
    itemSelectionDisplay.style.display = 'none';
    if (!mobile) searchDisplay.style.display = 'none';
    itemDetails.style.display = 'none';
  }
  else {
    printToConsole('Current active side: ' + getSide(activeSide));
    initializeItems();
    backdrop.style.display = 'block';
    if (!mobile) searchDisplay.style.display = 'block';
    itemSelectionDisplay.style.display = 'block';
    itemDetails.style.display = 'block';
  }
  document.getElementById('search_input').value = '';
  itemDisplayOpen = !itemDisplayOpen;
}

function searchDisplayToggle() {
  if (searchDisplayOpen) {
    backdrop.style.zIndex = '1';
    searchDisplay.style.display = 'none';
  }
  else {
    backdrop.style.zIndex = '55';
    searchDisplay.style.display = 'block';
  }
  searchDisplayOpen = !searchDisplayOpen;
}

function levelToggle() {
  if (levelDisplayOpen) {
    backdrop.style.zIndex = '0';
    backdrop.style.display = 'none';
    levelDisplay.style.display = 'none';
  }
  else {
    backdrop.style.zIndex = '55';
    backdrop.style.display = 'block';
    levelDisplay.style.display = 'flex';
  }
  levelDisplayOpen = !levelDisplayOpen;
}

function buffToggle() {
  if (buffDisplayOpen) {
    backdrop.style.zIndex = '3';
    backdrop.style.display = 'none';
    buffDisplay.style.display = 'none';
  }
  else {
    backdrop.style.zIndex = '55';
    backdrop.style.display = 'block';
    buffDisplay.style.display = 'flex';
  }
   buffDisplayOpen = !buffDisplayOpen;
}

function infoToggle() {
  if (infoDisplayOpen) {
    backdrop.style.zIndex = '3';
    backdrop.style.display = 'none';
    infoDisplay.style.display = 'none';
  }
  else {
    backdrop.style.zIndex = '55';
    backdrop.style.display = 'block';
    infoDisplay.style.display = 'block';
  }
  infoDisplayOpen = !infoDisplayOpen;
}

function infoDisplayToggle() {
  if (infoDisplayIndex) {
    infoAbout.style.display = 'none';
    infoNews.style.display = 'block';
  }
  else if (!infoDisplayIndex) {
    infoNews.style.display = 'none';
    infoAbout.style.display = 'block';
  }
  infoDisplayIndex = !infoDisplayIndex;
}

function backdropToggle() {
  if (searchDisplayOpen) searchDisplayToggle();
  else {
    if (godDisplayOpen) godSelectionToggle();
    if (itemDisplayOpen) itemSelectionToggle();
    if (infoDisplayOpen) infoToggle();
    if (levelDisplayOpen) levelToggle();
    if (buffDisplayOpen) buffToggle();
  }
}

// display details

function hoverGod(choice) {
  let id = choice.id.split("_").pop();
  hoveredGod = Data.Gods[id];
  godDetailsTitle.innerHTML = hoveredGod.Name;
  godDetailsSubtitle.innerHTML = hoveredGod.Title;
  godDetailsArt.innerHTML = '';
  
  if (hoveredGod.Name == 'Hun Batz')
    godDetailsArt.style.backgroundImage = 'url(assets/godfix/HunBatz.png)';
  else if (hoveredGod.Name == 'Mercury')
    godDetailsArt.style.backgroundImage = 'url(assets/godfix/Mercury.png)';
  else
    godDetailsArt.style.backgroundImage = 'url(' + hoveredGod.CardArt + ')';
  
  godDetailsPan.innerHTML = '<img src="assets/pantheons/' +   hoveredGod.Pantheon.replace(' Old ', '_Old_') + '.png"> ' + hoveredGod.Pantheon
  
  for (i = 0; i < colorData.pantheonName.length; i++)
    if (hoveredGod.Pantheon == colorData.pantheonName[i])
      godDetailsPan.style.color = colorData.pantheonColor[i];
  
  godDetailsRole.innerHTML = '<img src="assets/roles/' + hoveredGod.Role + '.png"> '+ hoveredGod.Role;
  
  for (i = 0; i < colorData.roleName.length; i++)
    if (hoveredGod.Role == colorData.roleName[i])
      godDetailsRole.style.color = colorData.roleColor[i];
}

function hoverItem(choice) {
  let id = choice.id.split("_").pop();
  hoveredItem = Data.Items[id];
  itemDetailsTitle.innerHTML = hoveredItem.Name;
  itemDetailsIcon.style.backgroundImage = 'url(' + hoveredItem.URL + ')';
  itemDetailsStats.innerHTML = '';
  for (i = 0; i < hoveredItem.Stats.length; i++) 
    itemDetailsStats.innerHTML += hoveredItem.Stats[i].Value + ' ' + hoveredItem.Stats[i].StatName + '</br>';
  itemDetailsDesc.innerHTML = hoveredItem.Description;
  
}

// option methods

function setLevel(level) {

  if (levelDisplayOpen) levelToggle();
  
  if (!Info[activeSide].currentGod) {
    printToConsole('Select a character before changing the level!', 'negative'); 
    return;
  }
  godHudLevel[activeSide].innerHTML = level;
  Info[activeSide].level = level;

  updateStats(activeSide);

  printToConsole('Level on side ' + getSide(activeSide) + ' set to: ' + level, 'positive');
  
}

function setFireBuff(type) {

  buffToggle();
  
  if (!Info[activeSide].currentGod) {
    printToConsole('Select a character before setting a buff!', 'negative');
    return;
  }
  
  if (type == 'none') godDisplay[activeSide].style.boxShadow = '';
  
  if (type == 'fire' && mobile) godDisplay[activeSide].style.boxShadow = '1vw 1vw 1vw #e02f38, -1vw -1vw 1vw #e02f38, 1vw -1vw 1vw #e02f38, -1vw 1vw 1vw #e02f38';
    
  else if (type == 'e_fire' && mobile) godDisplay[activeSide].style.boxShadow = '1vw 1vw 1vw #6d2ad1, -1vw -1vw 1vw #6d2ad1, 1vw -1vw 1vw #6d2ad1, -1vw 1vw 1vw #6d2ad1';
    
  else if (type == 'fire') godDisplay[activeSide].style.boxShadow = '.3vw .3vw 1vw #e02f38, -.3vw -.3vw 1vw #e02f38, .3vw -.3vw 1vw #e02f38, -.3vw .3vw 1vw #e02f38';
    
  else if (type == 'e_fire') godDisplay[activeSide].style.boxShadow = '.3vw .3vw 1vw #6d2ad1, -.3vw -.3vw 1vw #6d2ad1, .3vw -.3vw 1vw #6d2ad1, -.3vw .3vw 1vw #6d2ad1';
  
  Info[activeSide].fire_buff = type;

  updateStats(activeSide);

  printToConsole('Fire buff on side ' + getSide(activeSide) + ' set to: ' + type, 'positive');
  
}

function setBuff(type) {

  buffToggle();
  
  if (!Info[activeSide].currentGod) {
    printToConsole('Select a character before setting a buff!', 'negative');
    return;
  }

  let disp = activeBuffDisplay[activeSide];

  disp.title = '';

  if (type == 'none') disp.style.display = 'none';
  else disp.style.display = 'block';

  switch (type) {
    case 'health': 
      disp.style.backgroundImage = 'url(assets/buffs/Health_Buff.png)'; 
      disp.title = '+100 Health\n+100 Mana\n+30 Health Per 50 Protections';
    break;
    case 'speed': 
      disp.style.backgroundImage = 'url(assets/buffs/Speed_Buff.png)';
      disp.title = '+8% Speed\n+10% Crowd Control Reduction';
    break;
    case 'power': 
      disp.style.backgroundImage = 'url(assets/buffs/Power_Buff.png)'; 
      disp.title = '+10% Power\n+10 Power (Magical) OR +5 Power (Physical)';
    break;
    case 'mana': 
      disp.style.backgroundImage = 'url(assets/buffs/Mana_Buff.png)'; 
      disp.title = '+20 MP5\n+10% Cooldown Reduction';
    break;
    case 'void': 
      disp.style.backgroundImage = 'url(assets/buffs/Void_Buff.png)';
      disp.title = '+10% Attack Speed';
    break;

    case 'e_health':
      disp.style.backgroundImage = 'url(assets/buffs/Enhanced_Health_Buff.png)'; 
      disp.title = '+100 Health\n+100 Mana\n+30 Health Per 50 Protections\n+15 HP5\n+15 MP5';
      break;
    case 'e_speed': 
      disp.style.backgroundImage = 'url(assets/buffs/Enhanced_Speed_Buff.png)'; 
      disp.title = '+15% Speed\n+20% Crowd Control Reduction';
      break;
    case 'e_power': 
      disp.style.backgroundImage = 'url(assets/buffs/Enhanced_Power_Buff.png)';
      disp.title = '+10% Power\n+10 Power (Magical) OR +5 Power (Physical)\n+10% Lifesteal';
      break;
    case 'e_mana': 
      disp.style.backgroundImage = 'url(assets/buffs/Enhanced_Mana_Buff.png)'; 
      disp.title = '+20 MP5\n+20% Cooldown Reduction\n+15% Mana';
      break;
    case 'e_void': 
      disp.style.backgroundImage = 'url(assets/buffs/Enhanced_Void_Buff.png)'; 
      disp.title = '+25% Attack Speed';
      break;
  }
  
  Info[activeSide].buff = type;
  updateStats(activeSide);
  printToConsole('Buff on side ' + getSide(activeSide) + ' set to: ' + type, 'positive');
}

// event listeners

searchDisplay.addEventListener("keyup", function(event) { 
  activeSearchQuery = document.getElementById('search_input').value;
  if (godDisplayOpen) initializeGods();
  if (itemDisplayOpen) initializeItems();
});

// stat related

function addBaseStats(side) {

  let God = Info[side].currentGod;
  let Stats = Info[side].stats;
  let Level = Info[side].level;
  
  Stats.speed += God.Speed;
  if (Level <= 7) Stats.speed += (God.Speed * (.03 * (Level - 1)));
  if (Level > 7) Stats.speed += (God.Speed * .18);
  if (God.Name == 'Olorun') Stats.basic_attack += (God.Power + (God.PowerPL * Level)) * .25;
  else if (God.Type == 'Magical') Stats.basic_attack += (God.Power + (God.PowerPL * Level)) * .20;
  else if (God.Type == 'Physical') Stats.basic_attack += God.Power + (God.PowerPL * Level);
  Stats.attack_speed += God.AttackSpeed + (God.AttackSpeedPL * Level * God.AttackSpeed);
  Stats.phys_prot += God.PhysProt + (God.PhysProtPL * Level);
  Stats.mag_prot += God.MagProt + (God.MagProtPL * Level);
  Stats.health += God.Health + (God.HealthPL * Level);
  Stats.mana += God.Mana + (God.ManaPL * Level)
  Stats.hp5 += God.HP5 + (God.HP5PL * Level);
  Stats.mp5 += God.MP5 + (God.MP5PL * Level)
}

function addItemStats(side) {

  let Stats = Info[side].stats;
  let God = Info[side].currentGod;
  
  for (i = 0; i < 6; i++) {
    let item = Info[side].items[i];
    if (item == null) continue; 

    for (j = 0; j < item.Stats.length; j++) {
      let value = parseInt(item.Stats[j].Value.replace('+','').replace('%',''))

      switch (item.Stats[j].StatName) {
        case "Movement Speed": Stats.speed += value; break;
        case "Physical Power":
        case "Physical power":
          if (God.Type == 'Physical') Stats.power += value;
        break;
        case "Magical Power":
        case "Magical power":
          if (God.Type == 'Magical') Stats.power += value;
        break;
        case "Health": Stats.health += value; break;
        case "Mana": Stats.mana += value; break;
        case "HP5": case "HP5 & MP5": Stats.hp5 += value; break;
        case "MP5": case "HP5 & MP5": Stats.mp5 += value; break;
        case "Magical Lifesteal":
        case "Physical Lifesteal":
          Stats.lifesteal += value;
        break;
        case "Physical Protections":
        case "Physical protections.":
        case "Physical Protection":
        case "Physical protection":
          Stats.phys_prot += value;
        break;
        case "Magical Protections":
        case "Magical protections.":
        case "Magical Protection":
        case "Magical protection":
          Stats.mag_prot += value;
        break;
        case "Crowd Control Reduction":
        case "Crowd Control Reduction:": 
          Stats.crowd_control += value;
        break;
        case "Cooldown Reduction": Stats.cooldown += value; break;
        case "Physical Critical Strike Chance":
        case "Critical Strike Chance":
          Stats.crit += value;
        break;
        case "Physical Penetration":
        case "Magical Penetration":
        case "Penetration":
          if (item.Stats[j].Value.includes('%')) Stats.per_pen += value;
          else Stats.pen += value;
        break;
        case "Maximum Health":
          Stats.health += Stats.health * (value / 100);
        break;
        case "Attack Speed":
          Stats.attack_speed += God.AttackSpeed * (value / 100);
        break;
        case "Damage Reduction":
          Stats.damage_red += value;
        break;
      }
      
    }
  }
  if (God.Name == 'Olorun') Stats.basic_attack += Stats.power * .25;
  else if (God.Type == 'Physical') Stats.basic_attack += Stats.power;
  else Stats.basic_attack += Stats.power * .20;
}

function addFireBuffStats(side) {
  let Stats = Info[side].stats;
  
  switch (Info[side].fire_buff) {
    case 'e_fire':
      if (Info[side].currentGod.Type == 'Physical') Stats.power += 15;
      else Stats.power += 30;
    case 'fire':
      if (Info[side].currentGod.Type == 'Physical') Stats.power += 50;
      else Stats.power += 70;
      break;
    default: break;
  }
  
}

function addBuffStats(side) {
  let Stats = Info[side].stats;

  switch (Info[side].buff) {
    case 'e_health':
      Stats.hp5 += 15;
      Stats.mp5 += 15;
    case 'health': 
      Stats.health += 100;
      Stats.mana += 100;
      Stats.health += 30 * Math.floor((Stats.phys_prot + Stats.mag_prot)/50);
      break;
    case 'e_speed':
      Stats.speed += (Stats.speed * .07);
      Stats.crowd_control += 10;
    case 'speed': 
      Stats.speed += (Stats.speed * .08);
      Stats.crowd_control += 10;
      break;
    case 'e_power': 
      Stats.lifesteal += 10;
    case 'power':
      if (Info[side].currentGod.Type == 'Physical') Stats.power += 5;
      else Stats.power += 10;
      Stats.power += (Stats.power * .1)
      break;
    case 'e_mana': 
      Stats.mana += (Stats.mana * .15);
      Stats.cooldown += 10;
    case 'mana': 
      Stats.mp5 += 20;
      Stats.cooldown += 10;
      break;
    case 'e_void':
      Stats.attack_speed += (Stats.attack_speed * .15);
    case 'void': 
      Stats.attack_speed += (Stats.attack_speed * .10);
      break;
  }
}

function clearStats(side) {
  let God = Info[side].currentGod;
  let Stats = Info[side].stats;
  let Level = Info[side].level;
  
  Stats.speed = 0;
  Stats.basic_attack = 0;
  Stats.attack_speed = 0;
  Stats.phys_prot = 0;
  Stats.mag_prot = 0;
  Stats.health = 0;
  Stats.mana = 0;
  Stats.hp5 = 0;
  Stats.mp5 = 0;
  Stats.cooldown = 0;
  Stats.lifesteal = 0;
  Stats.crowd_control = 0;
  Stats.damage_red = 0;
  Stats.power = 0;
  Stats.crit = 0;
  Stats.per_pen = 0;
  Stats.pen = 0;
}

function displayStats(side) {
  
  let stat = statsDisplay[side].getElementsByClassName('stat_value');
  let God = Info[side].currentGod;
  let Stats = Info[side].stats;

  if (Stats.speed > 1000) Stats.speed = 1000;
  if (Stats.basic_attack > 10000) Stats.basic_attack = 10000;
  if (Stats.attack_speed > 2.5) Stats.attack_speed = 2.5;
  if (Stats.phys_prot > 325) Stats.phys_prot = 325;
  if (Stats.mag_prot > 325) Stats.mag_prot = 325;
  if (Stats.health > 5500) Stats.health = 5500;
  if (Stats.mana > 4000) Stats.mana = 4000;
  if (Stats.crit > 100) Stats.crit = 100;
  if (Stats.hp5 > 100) Stats.hp5 = 100;
  if (Stats.mp5 > 100) Stats.mp5 = 100;
  if (Stats.cooldown > 40) Stats.cooldown = 40;
  if (Stats.crowd_control > 40) Stats.crowd_control = 40;
  if (Stats.lifesteal > 65 && God.Type == 'Magical') Stats.lifesteal = 65;
  else if (Stats.lifesteal > 100) Stats.lifesteal = 100;
  if (Stats.pen > 50) Stats.pen = 50;
  if (Stats.per_pen > 40) Stats.per_pen = 40;
  

  stat[0].innerHTML = Math.round(Stats.speed);
  stat[1].innerHTML = Math.round(Stats.basic_attack);
  stat[2].innerHTML = Math.round(Stats.attack_speed * 100) / 100;
  stat[3].innerHTML = Math.round(Stats.phys_prot);
  stat[4].innerHTML = Stats.power;
  stat[5].innerHTML = Math.round(Stats.mag_prot);
  stat[6].innerHTML = Math.round(Stats.health);
  stat[7].innerHTML = Stats.pen;
  stat[8].innerHTML = Math.round(Stats.mana);
  stat[9].innerHTML = Stats.per_pen;
  stat[10].innerHTML = Math.round(Stats.hp5 * 10) / 10;
  stat[11].innerHTML = Stats.crit;
  stat[12].innerHTML = Math.round(Stats.mp5 * 10) / 10;
  stat[13].innerHTML = Stats.cooldown;
  stat[14].innerHTML = Stats.crowd_control
  stat[15].innerHTML = Stats.lifesteal;
}

function addPassiveStats(side) {
  let God = Info[side].currentGod.Name;
  let Stance = Info[side].stance;
  let Stats = Info[side].stats;
  let Level = Info[side].level;

  switch (God) {
    case 'Achilles': /* Stance */ break;
    case 'Amaterasu': /* Stance */ break;
    case 'Anubis': Stats.crowd_control += 30; break;
    case 'Ares': break;
    case 'Cabrakan': /* Display anyway */ break;
    case 'Cu Chulainn': break;
    case 'Freya': Stats.lifesteal += 10 + (.25 * Level); break;
    case 'Hel': /* Stance */ break;
    case 'Kukulkan': Stats.power += Stats.mana * .04; break;
    case 'Olorun':
      if (Stats.power >= 150)
        Stats.crit += 15 + parseInt((Stats.power - 150) / 10);
      if (Stats.crit > 70) Stats.crit = 70;
    break;
    case 'Shiva': break;
    case 'Ullr': /* Stance */ break;
    case 'Vamana':
      Stats.attack_speed += Stats.attack_speed * (Stats.phys_prot * .10) / 100;
      Stats.power += Stats.phys_prot * .20;
    break;
    case 'Yemoja': break;
  }
}

function addStatGradients(side) {
  let Stat = statsDisplay[side].getElementsByClassName('stat');

  for (i = 0; i < 16; i++) {
    let value = Stat[i].getElementsByClassName('stat_value')[0].innerHTML.replace('%', '');
    let cap = Stat[i].getElementsByClassName('stat_cap')[0].innerHTML.replace('%', '');

    if (i == 11) { cap = 50 }

    percent = (value/cap)*100;
    
    Stat[i].getElementsByClassName('stat_numbers')[0].style.background = 
      'linear-gradient(to right, #827751 ' + percent + '%, #111821 ' + percent + '%)';
  }
  
}

function updateStats(side) {
  clearStats(side);
  addBaseStats(side);
  addItemStats(side);
  addPassiveStats(side);
  addFireBuffStats(side);
  addBuffStats(side);
  displayStats(side);
  addStatGradients(side);
  printToConsole('Stats updated!', 'positive');
}

// Console Stuff

function printToConsole(string, arg) {
  console.log(string);
  if (mobile) return;
  let content = document.getElementById('console_content');
  if (arg == null)
    content.innerHTML += '> ' + string + '<br>';
  else if (arg == 'negative')
    content.innerHTML += '><span style="color:#eb4034"> ' + string + '<span><br>';
  else if (arg == 'positive')
    content.innerHTML += '><span style="color:#00ed2c"> ' + string + '<span><br>';

}

function consoleSlider(obj) {
  webConsole.style.opacity = obj.value / 100;
}

function toggleConsole() {
  if (mobile) return;
  if (webConsoleOpen) {
    webConsole.style.bottom = '-13vw';
    document.getElementById('console_range').style.display = 'none';
  }
  else {
    webConsole.style.bottom = '0';    
    document.getElementById('console_range').style.display = 'block';
  }
  webConsoleOpen = !webConsoleOpen;
}

addEventListener('keypress', function(key) {
  if (key.keyCode == 96 || key.keyCode == 126) {
    toggleConsole();
  }
});

function getSide(index) {
  if (!index) return 'L';
  else return 'R';
}

// Other

function deleteItem(activeItem) {
  if (Info[activeSide].items[activeItem] == null) { printToConsole('No item to delete!', 'negative'); return; }
  
  printToConsole(Info[activeSide].items[activeItem].Name + ' deleted from position ' + activeItem + ' on side ' + getSide(activeSide));
  
  if (Info[activeSide].starterPosition == activeItem) Info[activeSide].starterPosition = null;
  if (Info[activeSide].glyphPosition == activeItem)
    Info[activeSide].glpyhPosition = null;
  let displayedItems = itemList[activeSide].getElementsByClassName('item');
  Info[activeSide].items[activeItem] = null;
  displayedItems[activeItem].innerHTML = '+';
  displayedItems[activeItem].style.backgroundImage = '';

  updateStats(activeSide);
  
}

function clearAllItems(side) {

  let displayedItems = itemList[activeSide].getElementsByClassName('item');
  for (i = 0; i < 6; i++) {
    Info[side].items[i] = null;
    displayedItems[i].innerHTML = '+';
    displayedItems[i].style.backgroundImage = '';
  }

  printToConsole('Cleared all items on side ' + getSide(side));
}

function setDamageTypeDisplay(type) {
  
  let stat = statsDisplay[activeSide].getElementsByClassName('stat');
  if (type == "Physical") {
    stat[4].getElementsByClassName('stat_icon')[0].src = 'assets/stats/p_power.png';
    stat[7].getElementsByClassName('stat_icon')[0].src = 'assets/stats/p_armour.png';
    stat[9].getElementsByClassName('stat_icon')[0].src = 'assets/stats/p_armour.png';
    stat[15].getElementsByClassName('stat_icon')[0].src = 'assets/stats/p_lifesteal.png';
    stat[15].getElementsByClassName('stat_cap')[0].innerHTML = '100%';
      }
  else {
    stat[4].getElementsByClassName('stat_icon')[0].src = 'assets/stats/m_power.png';
    stat[7].getElementsByClassName('stat_icon')[0].src = 'assets/stats/m_armour.png';
    stat[9].getElementsByClassName('stat_icon')[0].src = 'assets/stats/m_armour.png';
    stat[15].getElementsByClassName('stat_icon')[0].src = 'assets/stats/m_lifesteal.png';
    stat[15].getElementsByClassName('stat_cap')[0].innerHTML = '65%';
  }
}

function toggleBuildNumbers() {
  let displays = document.getElementsByClassName('item_numbers');
  for (i = 0; i < displays.length; i++)
    if (!buildNumbersVisible) {
      document.getElementsByClassName('item_numbers')[i].style.display = 'block';
    }
    else {
      document.getElementsByClassName('item_numbers')[i].style.display = 'none';
    }
    buildNumbersVisible = !buildNumbersVisible;
}

function generateLink() {
  var link = 'https://michaelwarmbier.github.io/Smite-Stats/?';

  for (j = 0; j < 2; j++) {
    if (j == 1) link += '&';
    if (Info[j].currentGod != null) link += getSide(j) + 'g=' + Info[j].currentGod.Id;
    else link += getSide(j) + 'g=N';

    link += '&' + getSide(j) + 'l=' + Info[j].level;

    for (i = 0; i < 6; i++) {
      if (Info[j].items[i] != null) link += '&' + getSide(j) + 'i' + i + '=' + Info[j].items[i].Id;
      else link += '&' + getSide(j) + 'i' + i + '=N';
    }

    if (Info[j].buff != null) link += '&' + getSide(j) + 'b=' + Info[j].buff;
    else link += '&' + getSide(j) + 'b=N';

    if (Info[j].fire_buff != null) link += '&' + getSide(j) + 'fb=' + Info[j].fire_buff;
    else link += '&' + getSide(j) + 'fb=N';
  }

  if (buildNumbersVisible) link += '&bn=true';
  
  navigator.clipboard.writeText(link);
  printToConsole('Link copied!<br><a target="_" href="' + link.replace('smitebuildmaker.com', '') + '">' + link.replace('smitebuildmaker.com', '') + '</a>', 'positive');
  
  document.getElementById('link_copy_notif').style.top= '0';
  document.getElementById('link_copy_notif').style.opacity = '1';
  setTimeout(function() {
    document.getElementById('link_copy_notif').style.top = '-4vw';
    document.getElementById('link_copy_notif').style.opacity = '0';
  }, 3000)
}

window.onload = function () { 
  const paramList = new URLSearchParams(window.location.search);
  if (paramList == null) return;
  
  for (let i = 0; i < 2; i++) {
    
    for (let j = 0; j < Data.Gods.length; j++) {
      if (paramList.get(getSide(i) + 'g') == 'N') continue;
      if (Data.Gods[j].Id == paramList.get(getSide(i) + 'g')) {
        activeSide = i;
        hoveredGod = Data.Gods[j]; appendGod(hoveredGod);
      }     
    }

    for (let k = 0; k < 6; k++) {
      for (let j = 0; j < Data.Items.length; j++) {
        if (paramList.get(getSide(i) + 'i' + k) == 'N') continue;
        if (Data.Items[j].Id == paramList.get(getSide(i) + 'i' + k)) {
          activeSide = i; activeItem = k;
          hoveredItem = Data.Items[j]; appendItem(hoveredItem);
        }
      }
    }   
    
    activeSide = i;
    if (Info[i].currentGod != null) {
      setBuff(paramList.get(getSide(i) + 'b'));
      setFireBuff(paramList.get(getSide(i) + 'fb'));
      levelDisplayOpen = true;
      setLevel(paramList.get(getSide(i) + 'l'), i); 
     }
  }

  if (paramList.get('bn') == 'true')
    toggleBuildNumbers();
  if (mobile)
    toggleBuildNumbers();
  
  hoveredGod = null;
  hoveredItem = null;
  if (Info[0].currentGod != null || Info[1].currentGod != null) 
    printToConsole('Save link loaded!', 'positive');
}

async function randomize() {
  let totalGods = Data.Gods.length;

  hoveredGod = Data.Gods[Math.floor(Math.random() * totalGods)];
  appendGod();

  initializeItems();
  let items = document.getElementsByClassName('item_filter_child');
  let totalItems = items.length;
  let selectedItem = null;

  setLevel(20);

  for (let i = 0; i < 6; i++) {
    let k = Math.floor(Math.random() * totalItems);
    for(let j = 0; j < Data.Items.length; j++) {
      if (items[k].lang == Data.Items[j].Name) {
        selectedItem = Data.Items[j];
        console.log(i + ' ' + Data.Items[j].Name);
        break;
      }
    }
    if ((selectedItem.isGlyph == true && Info[activeSide].glyphPosition != null) ||
        (selectedItem.Starter == false && i == 0) ||
        (selectedItem.Starter == true && (i != 0 || selectedItem.Tier != 2)) ||
        ((selectedItem.Tier != 3 && selectedItem.Tier != 4)
         && selectedItem.Starter == false)) {
      i--;
      continue;
    }

    for (let i = 0; i < 6; i++)
      if (Info[activeSide].items[i] == selectedItem) {
        i--;
        break; continue;
    }
      
    hoveredItem = selectedItem;
    activeItem = i; await appendItem();
  }

  for (let i = 0; i < 6; i++) 
    if (Info[activeSide].items[i] == null) {
      randomize();
    }

  printToConsole('Side ' + getSide(activeSide) + ' randomized!');
  
}