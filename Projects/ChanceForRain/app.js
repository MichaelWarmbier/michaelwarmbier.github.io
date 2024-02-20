/*//// HTML Elemenets ////*/

var MenuDisplay = document.getElementById('menu');
var InfoDisplay = document.getElementById('information');
var InfoTitle = document.getElementById('title');
var InfoSubTitle = document.getElementById('subtitle');
var InfoDesc = document.getElementById('description');
var InfoDetails = InfoDisplay.getElementsByClassName('detail');
var SearchQuery = document.getElementsByTagName('input')[0];
var FilterButtons = document.getElementsByClassName('filter_button');

/*//// App Variables ////*/
var isDLC = true;
var filterQuery = '';
const tagListROM = ['Items_Common', 'Items_Uncommon', 'Items_Legendary', 'Items_Boss', 'Items_Equipment', 'Items_Lunar', 'Items_Lunar_Equipment', 'Items_Void', 'Items_Elite', 'StatusEffects', 'Shrines', 'Drones'];

/*//// Main ////*/
SearchQuery.value = '';
MenuDisplay.scrollTo(0, 0);
loadItems();

/*//// Methods ////*/
function loadItems() {

  let tagList = tagListROM;
  // Check for category specific filters
  MenuDisplay.innerHTML = '';
  switch (filterQuery.toLowerCase()) {
    case 'common': tagList = ['Items_Common']; break;
    case 'uncommon': tagList = ['Items_Uncommon']; break;
    case 'legendary': tagList = ['Items_Legendary']; break;
    case 'equipment': tagList = ['Items_Equipment']; break;
    case 'boss': tagList = ['Items_Boss']; break;
    case 'lunar': tagList = ['Items_Lunar', 'Items_Lunar_Equipment']; break;
    case 'void': tagList = ['Items_Void']; break;
    case 'elite': tagList = ['Items_Elite']; break;
    case 'status effects':
    case 'status effect':
      tagList = ['StatusEffects']; break;
    case 'drone':
    case 'drones': tagList = ['Drones']; break;
    case 'shrine':
    case 'shrines': tagList = ['Shrines']; break;
  }

  // Iterate through each tags JSON data
  for (let tagIndex = 0; tagIndex < tagList.length; tagIndex++) {    
    let tagTitle = document.createElement('h1');
    tagTitle.innerHTML = GameData[tagList[tagIndex]][0];
    MenuDisplay.appendChild(tagTitle);

    // Iterate through each element of the current tag
    for (let elemIndex = 1; elemIndex < GameData[tagList[tagIndex]].length; elemIndex++) {

      // Apply filters
      if (!isDLC && GameData[tagList[tagIndex]][elemIndex].DLC) continue;
      if ((tagListROM == tagList) && (filterQuery && !GameData[tagList[tagIndex]][elemIndex].Name.toLowerCase().includes(filterQuery.toLowerCase())))
        continue;
      
      const elem = document.createElement('div');
      elem.classList.add('item');
      elem.classList.add('bg-' + GameData[tagList[tagIndex]][elemIndex].Link)
      elem.onmouseover = function(event) { displayItem(elemIndex, tagList[tagIndex]); };
      elem.onmouseout = function(event) { clearItem(); }
    MenuDisplay.appendChild(elem);
    }
  }
}

function displayItem(id, type) {
  clearItem();
  let obj = GameData[type][id];
  InfoTitle.innerHTML = obj.Name;
  InfoDesc.innerHTML = obj.Description;
  switch (type) {
    case 'Items_Common':
    case 'Items_Uncommon':
    case 'Items_Legendary':
    case 'Items_Boss':
    case 'Items_Void':
    case 'Items_Lunar':
    case 'Items_Elite':
      InfoSubTitle.innerHTML = obj.Short_Desc;
      InfoDetails[0].innerHTML = 'Rarity: ' + obj.Rarity;
      InfoDetails[1].innerHTML = 'SotV DLC: ' + (obj.DLC ? 'Yes' : 'No');
      InfoDetails[2].innerHTML = 'Dropped From: ' + obj.Dropped_From;
      InfoDetails[3].innerHTML = 'Effect: ' + (obj.Active ? 'Active' : 'Passive');
      InfoDetails[4].innerHTML = 'Stack Type: ' + obj.Stack_OR_Cooldown;
    break;
    case 'Items_Equipment':
    case 'Items_Lunar_Equipment':
      InfoSubTitle.innerHTML = obj.Short_Desc;
      InfoDetails[0].innerHTML = 'Rarity: ' + obj.Rarity;
      InfoDetails[1].innerHTML = 'SotV DLC: ' + (obj.DLC ? 'Yes' : 'No');
      InfoDetails[2].innerHTML = 'Dropped From: ' + obj.Dropped_From;
      InfoDetails[3].innerHTML = 'Effect: ' + (obj.Active ? 'Active' : 'Passive');
      InfoDetails[4].innerHTML = 'Cooldown: ' + obj.Stack_OR_Cooldown;
      break;
    case 'StatusEffects':
      switch (obj.Type) {
        case 'Buff':
        case 'Affixed Buff':
          InfoSubTitle.innerHTML = 'You feel buffed!';
        break;
        case 'Debuff': InfoSubTitle.innerHTML = 'Uh oh!'; break;
        case 'Status': InfoSubTitle.innerHTML = 'You\'re current status'; break;
      }
      InfoDetails[0].innerHTML = 'Buff Type: ' + obj.Type;
      InfoDetails[1].innerHTML = 'SotV DLC: ' + (obj.DLC ? 'Yes' : 'No');
      InfoDetails[2].innerHTML = 'Has Cooldown: ' + (obj.Cooldown ? 'Yes' : 'No');
      InfoDetails[3].innerHTML = 'Is Stackable: ' + (obj.Stackable ? 'Yes' : 'No');
    break;
    case 'Drones':
      InfoSubTitle.innerHTML = 'A drone has come to aid you!';
      InfoDetails[0].innerHTML = 'SotV DLC: ' + (obj.DLC ? 'Yes' : 'No');
      let newTable = document.createElement('table');
      InfoDisplay.appendChild(newTable);
      if (obj.Damage != 'N/A') {
        newTable.innerHTML += 
        '<tr><td class="table_header"> Damage </td><td>' + obj.Damage + '</td></tr>';
        newTable.innerHTML += 
        '<tr><td class="table_header"> Damage Per Lvl </td><td>' + obj.Damage_Per_Lvl + '</td></tr>';
      }
      else {
        newTable.innerHTML += 
        '<tr><td class="table_header"> Heal </td><td>' + obj.Heal + '</td></tr>';
        newTable.innerHTML += 
        '<tr><td class="table_header"> Heal Per Lvl </td><td>' + obj.Heal_Per_Lvl + '</td></tr>';
      }
      newTable.innerHTML += 
        '<tr><td class="table_header"> Drone Health </td><td>' + obj.Health + '</td></tr>';
      newTable.innerHTML += 
        '<tr><td class="table_header"> Health Per Lvl </td><td>' + obj.Health_Per_Lvl + '</td></tr>';
      newTable.innerHTML += 
        '<tr><td class="table_header"> Health Regen </td><td>' + obj.Regen + '</td></tr>';
      newTable.innerHTML += 
        '<tr><td class="table_header"> Regen Per Lvl </td><td>' + obj.Regen_Per_Lvl + '</td></tr>';
      newTable.innerHTML += 
        '<tr><td class="table_header"> Speed </td><td>' + obj.Speed + '</td></tr>';
      newTable.innerHTML += 
        '<tr><td class="table_header"> Armor </td><td>' + obj.Armor + '</td></tr>';
    break;
    case 'Shrines':
      InfoSubTitle.innerHTML = 'A shrine awaits your offering..';
      if (obj.TE_Name_1 != 'N/A') {
        let newTable = document.createElement('table');
        InfoDisplay.appendChild(newTable);
        if (obj.Name == 'Shrine of Blood' || obj.Name == 'Shrine of Chance') {
          newTable.innerHTML += 
          '<tr><td class="table_header">' + obj.TE_Name_1 + '</td><td>' + obj.TableEntry_1 + '</td></tr>';
          newTable.innerHTML += 
          '<tr><td class="table_header">' + obj.TE_Name_2 + '</td><td>' + obj.TableEntry_2 + '</td></tr>';
          newTable.innerHTML += 
          '<tr><td class="table_header">' + obj.TE_Name_3 + '</td><td>' + obj.TableEntry_3 + '</td></tr>';
        }
        if (obj.Name != 'Shrine of Blood') {
          newTable.innerHTML += 
          '<tr><td class="table_header">' + obj.TE_Name_4 + '</td><td>' + obj.TableEntry_4 + '</td></tr>';
          newTable.innerHTML += 
          '<tr><td class="table_header">' + obj.TE_Name_5 + '</td><td>' + obj.TableEntry_5 + '</td></tr>';
        }
      }
    break;
  }
}

function clearItem() {
  InfoTitle.innerHTML = 'Hover/Tap an item!';
  InfoSubTitle.innerHTML = '';
  InfoDesc.innerHTML = '';
  for (let i = 0; i < InfoDetails.length; i++) InfoDetails[i].innerHTML = '';
  let tables = InfoDisplay.getElementsByTagName('table');
  for (let i = 0; i < tables.length; i++) tables[i].remove();
}

function toggleDLC(status) {
  isDLC = status;
  FilterButtons[0].style.boxShadow = (!isDLC ? '0 0 .4vw var(--Yellow)' : '.2vw .2vw black');
  FilterButtons[1].style.boxShadow = ( isDLC ? '0 0 .4vw var(--Purple)' : '.2vw .2vw black');
  loadItems();
}

/*//// Event Handlers ////*/

SearchQuery.addEventListener("keyup", function(event) { 
  filterQuery = SearchQuery.value;
  loadItems();
});