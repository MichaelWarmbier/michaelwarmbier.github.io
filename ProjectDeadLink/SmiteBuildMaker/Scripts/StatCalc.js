let playerData = null;
let godData = null;
let statData = null;
let itemData = null;
let healthData = null;
let manaData = null;

function updateStats() {
    const NO_GOD = SiteData.PlayerData[ActivePlayer].God == null;
    playerData = SiteData.PlayerData[ActivePlayer];
    godData = NO_GOD ? null : getGodData(SiteData.PlayerData[ActivePlayer].God.id);
    statData = SiteData.PlayerData[ActivePlayer].Stats;
    itemData = SiteData.PlayerData[ActivePlayer].Items;
    healthData = SiteData.PlayerData[ActivePlayer].BarHealth;
    manaData = SiteData.PlayerData[ActivePlayer].BarMana;

    try {
        resetStats();
        calculateBaseStats();
        clearPassives();
        addItemStats();
        addNonConquestBalance();
        addBuffs();
        calculateBasicAttack();
        addItemPassives();
        addModifications();
        displayStats();
    } catch (e) { }
}

function resetStats() { for (key of Object.keys(playerData.Stats)) playerData.Stats[key] = 0; }

function calculateBaseStats() {
    statData.Speed = godData.Speed + (playerData.Level <= 7 ? godData.Speed * (playerData.Level - 1) * .03 : godData.Speed * .18);
    statData.AttackSpeed = godData.AttackSpeed + (godData.AttackSpeedPerLevel * playerData.Level);
    statData.Health = godData.Health + (godData.HealthPerLevel * playerData.Level);
    statData.Mana = godData.Mana + (godData.ManaPerLevel * playerData.Level);
    statData.HP5 = godData.HealthPerFive + (godData.HP5PerLevel * playerData.Level);
    statData.MP5 = godData.ManaPerFive + (godData.MP5PerLevel * playerData.Level);
    statData.PhysicalProtections = godData.PhysicalProtection + (godData.PhysicalProtectionPerLevel * playerData.Level);
    statData.MagicalProtections =  godData.MagicProtection + (godData.MagicProtectionPerLevel * playerData.Level);
    if (godData.Type.includes('Magical'))   statData.BasicAttackDamage = (godData.MagicalPower + (godData.MagicalPowerPerLevel * playerData.Level)) * (godData.Name == 'Olorun' ? .25 : .20);
    else if (godData.Type.includes('Physical'))  statData.BasicAttackDamage = (godData.PhysicalPower + (godData.PhysicalPowerPerLevel * playerData.Level));
}

function addItemStats() {
    const STAT_NICKS = Object.keys(StatNicknames);

    for (item of itemData) {
        if (!item) continue;
        let englishItem = getItemData(item.ItemId);
        for (stat of englishItem.ItemDescription.Menuitems) {

            const VALUE = parseFloat(stat.Value.replace(/[+%]/g, ''));
            const NAME = stat.Description;

            if (StatNicknames['Speed'].includes(NAME))                              statData.Speed += statData.Speed * (VALUE / 100);
            if (StatNicknames['MagPower'].includes(NAME))                           statData.Power += VALUE;
            if (StatNicknames['PhysPower'].includes(NAME))                          statData.Power += VALUE;
            if (StatNicknames['Health'].includes(NAME))                             statData.Health += VALUE;
            if (StatNicknames['Mana'].includes(NAME))                               statData.Mana += VALUE;
            if (StatNicknames['HP5'].includes(NAME))                                statData.HP5 += VALUE;
            if (StatNicknames['MP5'].includes(NAME))                                statData.MP5 += VALUE;
            if (StatNicknames['Lifesteal'].includes(NAME))                          statData.Lifesteal += VALUE;
            if (StatNicknames['PhysicalProtections'].includes(NAME))                statData.PhysicalProtections += VALUE;
            if (StatNicknames['MagicalProtections'].includes(NAME))                 statData.MagicalProtections += VALUE;
            if (StatNicknames['CCR'].includes(NAME))                                statData.CCR += VALUE;
            if (StatNicknames['CDR'].includes(NAME))                                statData.CDR += VALUE;
            if (StatNicknames['Crit'].includes(NAME))                               statData.CriticalStrike += VALUE;
            if (StatNicknames['AttackSpeed'].includes(NAME))                        statData.AttackSpeed += godData.AttackSpeed * (VALUE / 100);
            if (StatNicknames['DamageRed'].includes(NAME))                          statData.DamageReduction += VALUE;
            if (stat.Value.includes('%') && StatNicknames['Pen'].includes(NAME))    statData.PercentPenetration += VALUE;
            if (!stat.Value.includes('%') && StatNicknames['Pen'].includes(NAME))   statData.Penetration += VALUE;

        }
    }
}

function addItemPassives() {
    
    for (item of playerData.Items) {
    if (!item) continue;
    let englishItem = getItemData(item.ItemId);
        switch (englishItem.DeviceName) {
            case "Heartward Amulet": 
                statData.MagicalProtections += 15;
                statData.MP5 += 30;
                addPassive(`[${item.DeviceName}]: +30 ${langText[13]}, +15 ${langText[95]}`);
                break;
            case "Sovereignty": 
                statData.PhysicalProtections += 15;
                statData.HP5 += 25;
                addPassive(`[${item.DeviceName}]: +25 ${langText[12]}, +15 ${langText[82]}`);
                break;
            case "Shogun's Kusari": 
                statData.AttackSpeed += godData.AttackSpeed * .30;
                addPassive(`[${item.DeviceName}]: 30% ${langText[8]}`);
                break;
            case "Telkhines Ring": 
                statData.BasicAttackDamage += 5 + (3 * playerData.Level);
                addPassive(`[${item.DeviceName}]: +5 ${langText[9]} + 3 x ${langText[5]}`);
                break;
            case "Pythagorem's Piece": 
                statData.Lifesteal += 9;
                statData.Power += 15;
                addPassive(`[${item.DeviceName}]: +15 ${langText[7]}, +9% ${langText[99]}`);
                break;
            case "Caduceus Club": 
                statData.CCR += 10;
                statData.Speed += godData.Speed * .03;
                addPassive(`[${item.DeviceName}]: +10 ${langText[14]}, +3% ${langText[6]}`);
                break;
            case "Book of Thoth": 
                statData.Power += statData.Mana * .04;
                addPassive(`[${item.DeviceName}]: 4% ${langText[11]} = ${langText[7]}`);
                break;
            case "Evolved Book of Thoth":
                statData.Power += statData.Mana * .07;
                addPassive(`[${item.DeviceName}]: 7% ${langText[11]} = ${langText[7]}`);
                break;
            case "Rod of Asclepius": 
                statData.CDR += 10;
                addPassive(`[${item.DeviceName}]: +10% ${langText[18]}`);
                break;
            case "Typhon's Fang": 
                statData.Power += statData.Lifesteal * 1.5;
                addPassive(`[${item.DeviceName}]: ${langText[7]} + ${langText[7]} x 1.5 ${langText[99]}`);
                break;
            case "Amulet of the Stronghold": 
                statData.MagicalProtections += 15;
                statData.MP5 += 30;
                statData.MagicalProtections += statData.PhysicalProtections * .15;
                addPassive(`[${item.DeviceName}]: +15 ${langText[95]}, + 30 ${langText[15]}, 15% ${langText[82]} = ${langText[95]}`);
                break;
            case "Silverbranch Bow": 
                let Bonus = Math.round((statData.AttackSpeed - 2.5) / .02);
                if (Bonus > 120) Bonus = 120;
                if (statData.AttackSpeed > 2.5) statData.Power += 3 * Bonus;
                addPassive(`[${item.DeviceName}]: .02 ${langText[8]} > 2.5 = 3 ${langText[7]}`);
                break;
            case "Nimble Bancroft's Talon": 
                statData.Power += 1.75 * (healthData < 60 ? 40 : 100 - healthData);
                statData.Lifesteal += .375 * (healthData < 60 ? 40 : 100 - healthData);
                statData.AttackSpeed += (godData.AttackSpeed * .02) * Math.floor(statData.Power / 30);
                addPassive(`[${item.DeviceName}]: +2% ${langText[8]} x 30 ${langText[7]}, +1.75 ${langText[7]} x ${langText[100]}, +.375% ${langText[99]} x ${langText[100]} (${langText[102]} 40%})`);
                break;
            case "Stone of Gaia": 
                statData.HP5 += statData.HP5 * .20;
                addPassive(`[${item.DeviceName}]: +20 ${langText[12]}`);
                break;
            case "Emerald Talisman":
                statData.HP5 += statData.Health * .01;
                addPassive(`[${item.DeviceName}]: 1% ${langText[10]} = ${langText[12]}`);
                break;
            case "Sands of Time":
                statData.MP5 += 2 * Math.floor((100 - manaData) / 10);
                addPassive(`[${item.DeviceName}]: +2 ${langText[13]} x 10% ${langText[101]}`);
                break;
            case "Fighter's Mask":
                statData.MP5 += 2 * Math.floor((100 - manaData) / 10);
                addPassive(`[${item.DeviceName}]: +2 ${langText[13]} x 10% ${langText[101]}`);
                break;
            case "Rangda's Mask":
                let stacks = 0;
                if (godData.Type.includes('Physical')) stacks = Math.floor(statData.Power / 40)
                else                                   stacks = Math.floor(statData.Power / 60)       
                statData.Speed += (.02 * stacks) * godData.Speed;      
                addPassive(`[${item.DeviceName}]: +2% ${langText[6]} x 40 ${langText[94]} ${langText[7]}/60 ${langText[93]} ${langText[7]}`);
                break;
            case "Pendulum of Ages":
                statData.MP5 += 2 * Math.floor((100 - manaData) / 10);
                statData.Power += 7 * Math.floor(manaData / 10);
                addPassive(`[${item.DeviceName}]: +2 ${langText[13]} x 10% ${langText[101]}, +7 ${langText[101]} x 10% ${langText[101]}`);
                break;
            case "Sentinel's Embrace":
                statData.PhysicalProtections += 30;
                statData.MagicalProtections += 30;
                addPassive(`[${item.DeviceName}]: +30 ${langText[82]}, +30 ${langText[95]}`);
                break;
        }
    }
    for (Active of playerData.ActiveEffects) {
        switch (Active) {
            case "Perfected Rod of Tahuti":
                statData.Speed += godData.Speed * .10;
                addPassive(`[${item.DeviceName}]: +10% ${langText[6]}`);
                break;
            case "Breasteplate of Determination":
                statData.Speed += godData.Speed * .20;
                statData.PhysicalProtections += 40;
                statData.MagicalProtections += 40;
                addPassive(`[${item.DeviceName}]: +20% ${langText[6]}, +40 ${langText[82]}, +40 ${langText[95]}`);
                break;
            case "Eldritch Dagger":
                statData.PhysicalProtections += statData.PhysicalProtections * .15;
                statData.MagicalProtections += statData.MagicalProtections * .15;
                addPassive(`[${item.DeviceName}]: +15% ${langText[82]}, +15% ${langText[95]}`);
                break;
            case "Bloodforge":
                statData.Speed += godData.Speed * .10;
                addPassive(`[${item.DeviceName}]: +10% ${langText[6]}`);
                break;
            case "Arondight":
                statData.Speed += godData.Speed * .20;
                addPassive(`[${item.DeviceName}]: +20% ${langText[6]}`);
                break;
            case "Obsidian Shard":
                statData.PercentPenetration += 20;
                addPassive(`[${item.DeviceName}]: +20% ${langText[16]}`);
                break;
            case "Titan's Bane":
                statData.PercentPenetration += 20;
                addPassive(`[${item.DeviceName}]: +20% ${langText[16]}`);
                break;
            case "Polynomicon":
                statData.BasicAttackDamage += statData.Power * .75;
                addPassive(`[${item.DeviceName}]: 75% ${langText[7]} = ${langText[9]}`);
                break
            case "Spirit Robe":
                statData.DamageReduction += 15;
                addPassive(`[${item.DeviceName}]: +15% ${langText[15]}`);
                break;
            case "Demon Blade":
                statData.PercentPenetration += 8;
                statData.AttackSpeed += godData.AttackSpeed * .10;
                addPassive(`[${item.DeviceName}]: +8% ${langText[16]}, +10% ${langText[8]}`);
                break;
            case "Dawnbringer":
                statData.Speed += godData.Speed * .05;
                statData.PhysicalProtections += statData.PhysicalProtections * .05;
                statData.MagicalProtections += statData.MagicalProtections * .05;
                addPassive(`[${item.DeviceName}]: +5% ${langText[6]}, +5% ${langText[82]}, +5% ${langText[95]}`);
                break;
            case "Brawler's Beatstick":
                statData.Power += 20 + (2 * playerData.Level);
                addPassive(`[${item.DeviceName}]: +20 ${langText[7]} + 2 x ${langText[5]}`);
                break;
            case "Manticore's Spikes":
                statData.Power += statData.Health * .06;
                addPassive(`[${item.DeviceName}]: 6% ${langText[10]} = ${langText[7]}`);
                break;
            case "Atalanta's Bow":
                statData.AttackSpeed += godData.AttackSpeed * .20;
                addPassive(`[${item.DeviceName}]: +20% ${langText[8]}`);
                break;
            case "Breastplate of Regrowth":
                statData.Speed += godData.Speed * .20;
                if (playerData.Type == 'Magical') statData.Power += 30;
                if (playerData.Type == 'Physical') statData.Power += 15;
                addPassive(`[${item.DeviceName}]: +20% ${langText[6]}, +15 ${langText[94]} ${langText[7]}/30 ${langText[93]} ${langText[7]}`);
                break;
            case "Erosion":
                statData.Speed += godData.Speed * .15;
                addPassive(`[${item.DeviceName}]: +15% ${langText[6]}`);
                break;
            case "Shadowdrinker":
                statData.Speed += godData.Speed * .30;
                addPassive(`[${item.DeviceName}]: +30% ${langText[6]}`);
                break;
            case "Bristlebush Acorn":
                statData.Lifesteal += 15;
                statData.BasicAttackDamage += statData.BasicAttackDamage * .20;
                addPassive(`[${item.DeviceName}]: +15% ${langText[99]}, +20% ${langText[9]}`);
                break;
            case "Winged Blade":
                statData.Speed += godData.Speed * .20;
                addPassive(`[${item.DeviceName}]: +20% ${langText[6]}`);
                break;
            case "Lotus Sickle":
                statData.MagicalProtections += 10;
                statData.PhysicalProtections += 10;
                addPassive(`[${item.DeviceName}]: +10% ${langText[82]}, +10% ${langText[95]}`);
                break;
            case "Stone of Gaia":
                if (playerData.Type == 'Magical') statData.Power += 25;
                if (playerData.Type == 'Physical') statData.Power += 15;
                addPassive(`[${item.DeviceName}]: +15 ${langText[94]} ${langText[7]}/25 ${langText[93]} ${langText[7]}`);
                break;
            case "Hydra's Lament":
                statData.BasicAttackDamage += statData.BasicAttackDamage * .30;
                addPassive(`[${item.DeviceName}]: +30% ${langText[9]}`);
                break;
            case "Cursed Orb":
                statData.Speed += godData.Speed * .04;
                statData.Power += 16;
                addPassive(`[${item.DeviceName}]: +16 ${langText[93]} ${langText[7]}, +4% ${langText[6]}`);
                break;
            case "Death's Temper":
                statData.BasicAttackDamage += statData.basicAttackDamage * .35;
                addPassive(`[${item.DeviceName}]: +35% ${langText[9]}`);
                break;
            case "Gilded Arrow":
                statData.AttackSpeed += godData.AttackSpeed * .25;
                addPassive(`[${item.DeviceName}]: +25% ${langText[8]}`);
                break;
            case "Diamond Arrow":
                statData.AttackSpeed += godData.AttackSpeed * .75;
                addPassive(`[${item.DeviceName}]: +75% ${langText[8]}`);
                break;
            case "Orante Arrow":
                statData.AttackSpeed += godData.AttackSpeed * .25;
                statData.CriticalStrike += 20;
                addPassive(`[${item.DeviceName}]: +25% ${langText[9]}, +20% ${langText[17]}`);
                break;
            case "Gem of Focus":
                statData.Speed += godData.Speed * .15;
                statData.Power += statData.Power * .15;
                addPassive(`[${item.DeviceName}]: +15% ${langText[6]}, +15% ${langText[93]} ${langText[7]}`)
                break;
            case "Eye of the Jungle":
                statData.HP5 += 20;
                statData.MP5 += 15;
                addPassive(`[${item.DeviceName}]: +20 ${langText[12]}, +15 ${langText[13]}`);
                break;
        }
    }
}
// Add God Passives

function addNonConquestBalance() {
    if (!NonConquest) return;
    if (godData.Name == `Ah Puch`) {
        addPassive(`[${langText[88]}]: -5%${langText[73]}, -10% ${langText[74]}, +5% ${langText[75]}, +15% ${langText[76]}`);
        statData.Power -= statData.Power * .05;
    } if (godData.Name == `Artemis`) {
        addPassive(`[${langText[88]}]: -5% ${langText[73]}, +10% ${langText[75]}`);
        statData.Power -= statData.Power * .05;  
    } if (godData.Name == `Zeus`) {
        addPassive(`[${langText[88]}]: -10% ${langText[73]}, +5% ${langText[75]}`);
        statData.Power -= statData.Power * .10;
    } if (godData.Name == `Serqet`) {
        addPassive(`[${langText[89]}]: +5% ${langText[73]}, -10% ${langText[76]}`);
        statData.Power += statData.Power * .05;
    } if (godData.Name == `Susanoo`) {
        addPassive(`[${langText[88]}]: +-5% ${langText[73]}, +5% ${langText[87]}`);
        statData.Power -= statData.Power * .05;
    } if (godData.Name == `Nu Wa`) {
        addPassive(`[${langText[88]}]: +-5% ${langText[78]}, +10% ${langText[75]}`);
        statData.Power -= statData.Power * .05;
    } 
}

function addBuffs() {
    const BUFFS = SiteData.PlayerData[ActivePlayer].Buffs;
    if (BUFFS.includes(`Health Buff`)) {
        addPassive(`[${langText[61]}]: +100 Health, +100 Mana, +30 Health/Mana per 50 Protections, +10 HP5, +10 MP5`);
        statData.Health += 100 + 30 * (Math.floor((statData.MagicalProtections + statData.PhysicalProtections) / 50));
        statData.Mana += 100 + 30 * (Math.floor((statData.MagicalProtections + statData.PhysicalProtections) / 50));
        statData.HP5 += 10;
        statData.MP5 += 10;
    } if (BUFFS.includes(`Mana Buff`)) {
        addPassive(`[${langText[59]}]: +20 ${langText[13]}`);
        statData.MP5 += 20;
    } if (BUFFS.includes(`Attack Speed Buff`)) {
        addPassive(`[${langText[58]}]: +15% ${langText[8]}`);
        statData.AttackSpeed += statData.AttackSpeed * .15;
    } if (BUFFS.includes(`Speed Buff`)) {
        addPassive(`[${langText[57]}]: +10% ${langText[6]}`);
        statData.Speed += statData.Speed * .10;
    } if (BUFFS.includes(`Void Buff`)) {
        addPassive(`[${langText[60]}]: +10% ${langText[8]}, +10 ${langText[93]} ${langText[9]}, +12 ${langText[94]} ${langText[9]}`);
        if (godData.Type.includes(`Magical`)) statData.BasicAttackDamage += 10;
        if (godData.Type.includes(`Physical`)) statData.BasicAttackDamage += 12;
    } if (BUFFS.includes(`Power Buff`)) {
        addPassive(`[${langText[56]}]: +10% ${langText[7]}, +10 ${langText[93]} ${langText[7]}, +5 ${langText[93]} ${langText[7]}`);
        statData.Power += statData.Power * .10;
        if (godData.Type.includes(`Magical`)) statData.Power += 10;
        if (godData.Type.includes(`Physical`)) statData.Power += 5;
    } if (BUFFS.includes(`Silver Buff`)) {
        addPassive(`[${langText[63]}]: +5% CDR x .75 x ${langText[5]}`);
        statData.CDR += 5 + .75 * (playerData.Level);
    } if (BUFFS.includes(`Gold Buff`)) {
        addPassive(`[${langText[62]}]: +5 ${langText[82]} x ${langText[5]}, +5 ${langText[95]} x ${langText[5]},`);
        statData.PhysicalProtections += 5 * playerData.Level;
        statData.MagicalProtections += 5 * playerData.Level;
    } if (BUFFS.includes(`Fire Giant`)) {
        addPassive(`[${langText[64]}]: +75 ${langText[93]} ${langText[7]}, +55 ${langText[94]} ${langText[7]}, +3% ${langText[12]}, +2% ${langText[12]}`);
        if (godData.Type.includes(`Magical`)) statData.Power += 75;
        if (godData.Type.includes(`Physical`)) statData.Power += 55;
        statData.HP5 += statData.Health * .03;
        statData.MP5 += statData.Mana * .02;
    } if (BUFFS.includes(`E. Fire Giant`)) {
        addPassive(`[${langText[65]}]: +100 ${langText[93]} ${langText[7]}, +65 ${langText[94]} ${langText[7]}, +3% ${langText[12]}, +2% ${langText[13]}`);
        if (godData.Type.includes(`Magical`)) statData.Power += 100;
        if (godData.Type.includes(`Physical`)) statData.Power += 65;
        statData.HP5 += statData.Health * .03;
        statData.MP5 += statData.Mana * .02;
    } if (BUFFS.includes(`Joust Buff`)) {
        addPassive(`[${langText[66]}]: +4% ${langText[12]}, +2% ${langText[13]}`);
        statData.HP5 += statData.Health * .04;
        statData.MP5 += statData.Mana * .02;
    } if (BUFFS.includes(`Slash Buff`)) {
        addPassive(`[${langText[67]}]: +50 ${langText[93]} ${langText[7]}, +30 ${langText[94]} ${langText[7]}, +4% ${langText[12]}, +2% ${langText[13]}`);
        if (godData.Type.includes(`Magical`)) statData.Power += 50;
        if (godData.Type.includes(`Physical`)) statData.Power += 30;
        statData.HP5 += statData.Health * .04;
        statData.MP5 += statData.Mana * .02;
    } if (BUFFS.includes(`Power Potion`)) {
        addPassive(`[${langText[68]}]: +70 ${langText[93]} ${langText[7]}, +40 ${langText[94]} ${langText[7]}, +10 ${langText[16]}`);
        if (godData.Type.includes(`Magical`)) statData.Power += 70;
        if (godData.Type.includes(`Physical`)) statData.Power += 40;
        statData.Penetration += 10;
    } if (BUFFS.includes(`Defense Elixir`)) {
        addPassive(`[${langText[70]}]: +50 ${langText[95]}, +50 ${langText[82]}, +10% ${langText[15]}, +20% ${langText[14]}`);
        statData.MagicalProtections += 50;
        statData.PhysicalProtections += 50;
        statData.DamageReduction += 10;
        statData.CCR += 20;
    } if (BUFFS.includes(`Power Elixir`)) {
        addPassive(`[${langText[69]}]: +25% ${langText[7]}, +10% ${langText[16]}`);
        statData.Power += statData.Power * .25;
        statData.PercentPenetration += 10;
    } 
}

function calculateBasicAttack(player) {
    if (godData.Type.includes('Magical') == 'Magical')          statData.BasicAttackDamage += (statData.Power + godData.MagicalPower + (godData.MagicalPowerPerLevel * playerData.Level)) * (godData.Name == 'Olorun' ? .25 : .20);
    else if (godData.Type.includes('Physical') == 'Physical')   statData.BasicAttackDamage += (statData.Power + godData.PhysicalPower + (godData.PhysicalPowerPerLevel * playerData.Level));
}

function addModifications() {
    const MODIFY = document.querySelectorAll('.stat_modify');
    const KEYS = Object.keys(SiteData.PlayerData[ActivePlayer].Stats);
    for (let elemIndex = 0; elemIndex < MODIFY.length; elemIndex++)
        if (MODIFY[elemIndex].value != '' && MODIFY[elemIndex].value != null && MODIFY[elemIndex].value != undefined)
            SiteData.PlayerData[ActivePlayer].Stats[KEYS[elemIndex]] += parseFloat(MODIFY[elemIndex].value);
}

function displayStats() {
    const STATS = document.querySelectorAll('.stat');
    const STAT_AMOUNTS = document.querySelectorAll('.stat_amount');
    const STAT_CAPS = document.querySelectorAll('.stat_cap');
    const STAT_NAMES = Object.keys(statData);
    const STAT_BARS = document.querySelectorAll('.stat_bar');

    for (let statIndex = 0; statIndex < STATS.length; statIndex++) {
        const hasPercent = STAT_CAPS[statIndex].innerHTML.includes('%');
        const CAP = STAT_CAPS[statIndex].innerHTML.replace('%', '').replace(/&nbsp;/g, '');
        let amount = statData[STAT_NAMES[statIndex]].toFixed(2);
        const PERCENT = amount / CAP * 100
        if (amount > parseFloat(CAP)) STAT_AMOUNTS[statIndex].style.color = 'var(--BrightGold)';
        else                        STAT_AMOUNTS[statIndex].style.color = 'var(--LightGray)';

        STAT_AMOUNTS[statIndex].innerHTML = amount + (hasPercent ? '%' : '');
        if (!PERCENT) STAT_BARS[statIndex].style.backgroundColor = 'var(--InternalBlue)';
        else STAT_BARS[statIndex].style.background = 'linear-gradient(to right, var(--DarkGold) ' + PERCENT + '%, var(--InternalBlue) ' + PERCENT + '%)';
    }
}