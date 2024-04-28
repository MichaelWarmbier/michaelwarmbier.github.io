function printSBM(text, flag) {
    console.log(`[SmiteBuildMaker] ${text}`);
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) { return (document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '') }
function getGodData(id, o=English) { for (God of o.Gods) if (God.id == id || God.Name == id) return God; }
function getItemData(id, o=English) { for (Item of o.Items) if (Item.ItemId == id || Item.DeviceName == id) return Item; }
function godLang(godObj) { for (God of langRef.Gods) if (God.id == godObj.id) return God; return godObj; }
function itemLang(itemObj) { for (Item of langRef.Items) if (Item.ItemId == itemObj.ItemId) return Item; return itemObj; }

function getRankTitle(id) {
    if (id <= 0) return 'N/A';
    id--;
    const RANKS = [langText[23], langText[24], langText[25], langText[26], langText[27] ,langText[28], langText[23]];
    const TIERS = ['V', 'IV', 'III', 'II', 'I'];

    return `${RANKS[Math.floor(id / 5)]} ${TIERS[id % 5]}`;
}

function getRankIcon(id) {
    id--;
    if (id <= 0) id = 1;
    const RANKS = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster'];
    return `./Assets/Icons/${RANKS[Math.floor(id / 5)]}.png`;
}

function alertUser(msg) {
    Message.innerHTML = msg;
    Message.style.opacity = 1;
    setTimeout(() => { Message.style.opacity = 0; }, 3000);
}

function flashText(obj) {
    obj.style.borderColor = '#30cf67';
    setTimeout(() => { obj.style.borderColor = 'var(--ThinBorderColor)'; }, 2000);
}

function damageType(itemObj) {
    for (stat of itemObj.ItemDescription.Menuitems) if (StatNicknames['PhysPower'].includes(stat.Description)) return 'Physical';
    for (stat of itemObj.ItemDescription.Menuitems) if (StatNicknames['MagPower'].includes(stat.Description)) return 'Magical';
    return 'Neutral';
}

function getStatNames(itemObj) {
    let returnList = [];
    for (stat of itemObj.ItemDescription.Menuitems) returnList.push(stat.Description);
    return returnList;
}

function help() {
    console.log('This method does.. this');
}