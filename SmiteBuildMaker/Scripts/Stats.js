////////////////////////////////
/*//// Main Stat Function ////*/
////////////////////////////////

function updateStats(player) {
    const PLAYER_DATA = SiteData.PlayerData[player - 1];
    if (!PLAYER_DATA.God) return;
    resetStats(PLAYER_DATA);
    calculateBaseStats(PLAYER_DATA);
    clearPassiveText();
    addItemStats(PLAYER_DATA);
    /*
    addGodPassiveStats(side);
    */
    addItemPassiveStats(PLAYER_DATA);
    addNonConquestBalance(PLAYER_DATA);
    calculateAfterEffects(PLAYER_DATA);
    addBuffStats(PLAYER_DATA);
    displayStats(PLAYER_DATA);
}

//////////////////////////////
/*//// Stat Subroutines ////*/
//////////////////////////////

function resetStats(player) {
    let PlayerStats = player.Stats;
    for (key of Object.keys(PlayerStats)) PlayerStats[key] = 0;
}

function calculateBaseStats(player) {
    let PlayerStats = player.Stats;
    const GOD_STATS = player.God;
    PlayerStats.Speed += (player.Level <= 7 ? GOD_STATS.Speed * (player.Level - 1 * .03) : GOD_STATS.Speed * .18);
    PlayerStats.AttackSpeed += GOD_STATS.AttackSpeed + (GOD_STATS.AttackSpeedPL * player.Level * GOD_STATS.AttackSpeed);
    PlayerStats.Health += GOD_STATS.Health + (GOD_STATS.HealthPL * player.Level);
    PlayerStats.Mana += GOD_STATS.Mana + (GOD_STATS.ManaPL * player.Level);
    PlayerStats.HP5 += GOD_STATS.HP5 + (GOD_STATS.HP5PL * player.Level);
    PlayerStats.MP5 += GOD_STATS.MP5 + (GOD_STATS.MP5PL * player.Level);
    PlayerStats.PhysicalProtections += GOD_STATS.PhysProt + (GOD_STATS.PhysProtPL * player.Level);
    PlayerStats.MagicalProtections +=  GOD_STATS.MagProt + (GOD_STATS.MagProtPL * player.Level);
    if (GOD_STATS.Name == 'Olorun') PlayerStats.BasicAttackDamage += (GOD_STATS.Power + (GOD_STATS.PowerPL * player.Level)) * .25;
    else if (GOD_STATS.Type == 'Magical') PlayerStats.BasicAttackDamage += (GOD_STATS.Power + (GOD_STATS.PowerPL * player.Level)) * .20;
    else if (GOD_STATS.Name == 'Physical') PlayerStats.BasicAttackDamage += (GOD_STATS.Power + (GOD_STATS.PowerPL * player.Level));
}

function addItemStats(player) {
    let PlayerStats = player.Stats;
    let PlayerItems = player.Items;
    const GOD = player.God;
    const GOD_TYPE = player.God.Type;
    let Nicknames = SiteData.StatNicknames;

    for (Item of PlayerItems) {
        if (!Item) continue;
        for (ItemStat of Item.Stats) {
            let StatValue = parseInt(ItemStat.Value.replace(/[+%]/g, ''));
            if (Nicknames.Speed.includes(ItemStat.StatName)) PlayerStats.Speed += StatValue;
            if (GOD_TYPE == 'Magical' && Nicknames.MagPower.includes(ItemStat.StatName)) PlayerStats.Power += StatValue;
            if (GOD_TYPE == 'Physical' && Nicknames.PhysPower.includes(ItemStat.StatName)) PlayerStats.Power += StatValue;
            if (Nicknames.Health.includes(ItemStat.StatName)) PlayerStats.Health += StatValue;
            if (Nicknames.Mana.includes(ItemStat.StatName)) PlayerStats.Mana += StatValue;
            if (Nicknames.HP5.includes(ItemStat.StatName)) PlayerStats.HP5 += StatValue;
            if (Nicknames.MP5.includes(ItemStat.StatName)) PlayerStats.MP5 += StatValue;
            if (Nicknames.Lifesteal.includes(ItemStat.StatName)) PlayerStats.Lifesteal += StatValue;
            if (Nicknames.PhysicalProtections.includes(ItemStat.StatName)) PlayerStats.PhysicalProtections += StatValue;
            if (Nicknames.MagicalProtections.includes(ItemStat.StatName)) PlayerStats.MagicalProtections += StatValue;
            if (Nicknames.CCR.includes(ItemStat.StatName)) PlayerStats.CCR += StatValue;
            if (Nicknames.CDR.includes(ItemStat.StatName)) PlayerStats.CDR += StatValue;
            if (Nicknames.Crit.includes(ItemStat.StatName)) PlayerStats.CriticalStrike += StatValue;
            if (ItemStat.Value.includes('%') && Nicknames.Pen.includes(ItemStat.StatName)) PlayerStats.PercentPenetration += StatValue;
            if (!ItemStat.Value.includes('%') && Nicknames.Pen.includes(ItemStat.StatName)) PlayerStats.Penetration += StatValue;
            if (Nicknames.AttackSpeed.includes(ItemStat.StatName)) PlayerStats.AttackSpeed += GOD.AttackSpeed * (StatValue / 100);
            if (Nicknames.DamageRed.includes(ItemStat.StatName)) PlayerStats.DamageRed += StatValue;
        }
    }
}

function addNonConquestBalance(player) {
    if (!SiteData.Options[1]) return;
    const GOD = player.God.Name;
    let PlayerStats = player.Stats;
    switch (GOD) {
        case 'Ah Puch':
            addPassiveText('Non-Conquest Nerf', '-5% Damage to Gods</br>-10% Damage to Minions</br>+5% Non-Ultimate Cooldowns</br>+15% Ultimate Cooldown');
            PlayerStats.Power -= PlayerStats.Power * .05;
            break;   
        case 'Artemis':
            addPassiveText('Non-Conquest Nerf', '-5% Damage to Gods</br>+10% Ultimate Cooldown');
            PlayerStats.Power -= PlayerStats.Power * .05;   
        case 'Zeus':
            addPassiveText('Non-Conquest Nerf', '-10% damage to Gods</br>+5% Non-Ultimate Cooldowns');
            PlayerStats.Power -= PlayerStats.Power * .10;
            break;
        case 'Serqet':
            addPassiveText('Non-Conquest Buff', '-10% Damage Taken</br>+5% Damage to Gods');
            PlayerStats.Power += PlayerStats.Power * .05;
            break;
        case 'Susano':
            addPassiveText('Non-Conquest Nerf', '+5% Longer Non-Ultimate Cooldowns<br>+5% Longer Ultimate Cooldowns<br>-5% God Damage');
            PlayerStats.Power -= PlayerStats.Power * .05;
            break;
        case 'Nu Wa':
            addPassiveText('Non-Conquest Nerf', '-5% Damage Dealt<br>+10% Ultimate Cooldown');
            PlayerStats.Power -= PlayerStats.Power * .05;
            break;
    }
    for (Entries of SiteData.NonConquest) if (Entries.God === GOD) 
        addPassiveText('Non-Conquest ' + Entries.Type, Entries.Effect);
}

function addBuffStats(player) {
    const REGEX = />([^<]+)/;
    const TYPE = player.God.Type;
    const GOD = player.God;
    let PlayerStats = player.Stats;

    for (buff of player.Buffs) {
        let buffName = REGEX.exec(buff)[1];
        switch (buffName) {
            case ('Power_Buff'): 
                if (TYPE == 'Physical') PlayerStats.Power += 5;
                if (TYPE == 'Magical') PlayerStats.Power += 10;
                PlayerStats.Power += PlayerStats.Power * .10;
                addPassiveText('Power Buff', '10% Damage + 5 Physical/10 Magical');
                break;
            case ('Mana_Buff'): 
                PlayerStats.MP5 += 20;
                addPassiveText('Mana Buff', '20 MP5; 2% Restore Mana on Ability God Damage');
                break;
            case ('Health_Buff'): 
                PlayerStats.Health += 100 + (30 * Math.round((PlayerStats.PhysicalProtections + PlayerStats.MagicalProtections - (GOD.PhysProt + (GOD.PhysProtPL * player.Level) + GOD.MagProtPL + (GOD.MagProtPL * player.Level))) / 50));
                PlayerStats.Mana += 100;
                PlayerStats.HP5 += 10;
                PlayerStats.MP5 += 10;
                addPassiveText('Health Buff', '100 Health/Mana + 30 per 50 protections from items; 10 HP5/MP5');
                break;
            case ('Void_Buff'): 
                PlayerStats.AttackSpeed += GOD.AttackSpeed * .10;
                if (TYPE == 'Physical') PlayerStats.BasicAttackDamage += 12;
                if (TYPE == 'Magical') PlayerStats.BasicAttackDamage += 10;
                addPassiveText('Void Buff', '10% Attack Speed + 10 Magical Basic Damage/12 Physical Basic Damage');
                break;
            case ('Speed_Buff'): 
                PlayerStats.Speed += PlayerStats.Speed * .10;
                // TBA Stacks
                addPassiveText('Speed Buff', '10% Speed + 2% per Camp Kill/Assists; 3 Stacks');
                break;
            case ('Attack_Speed_Buff'): 
                PlayerStats.AttackSpeed += GOD.AttackSpeed * .15;
                if (TYPE == 'Physical') PlayerStats.BasicAttackDamage += 12;
                if (TYPE == 'Magical') PlayerStats.BasicAttackDamage += 15;
                addPassiveText('Attack Speed Buff', '15% Attack Speed + 15 Magical Basic Damage/12 Physical Basic Damage');
                break;
            case ('Fire_Giant'): 
                if (TYPE == 'Physical') PlayerStats.Power += 65;
                if (TYPE == 'Magical') PlayerStats.Power += 100;
                PlayerStats.MP5 += PlayerStats.MP5 * .02;
                PlayerStats.HP5 += PlayerStats.HP5 * .03;
                addPassiveText('Fire Giant Buff', '100 Magical Power/65 Physical Power; 3% HP5 + 2% MP5');
                break;
            case ('Slash_Buff'): 
                PlayerStats.MP5 += PlayerStats.MP5 * .02;
                PlayerStats.HP5 += PlayerStats.HP5 * .04;
                addPassiveText('Apophis Buff', '4% HP5 + 2% MP5');
                break;
            case ('Joust_Buff'): 
                PlayerStats.MP5 += PlayerStats.MP5 * .02;
                PlayerStats.HP5 += PlayerStats.HP5 * .04;
                addPassiveText('Bull Demon Buff', '4% HP5 + 2% MP5');
                break;
            case ('Silver_Buff'): 
                PlayerStats.CDR += 5 + (.75 * player.Level);
                addPassiveText('Silver Buff', '5% CDR + .75% per level');
                break;
            case ('Gold_Buff'): 
                PlayerStats.PhysicalProtections += 5 + (.5 * player.Level);
                PlayerStats.MagicalProtections += 5 + (.5 * player.Level);
                addPassiveText('Gold Buff', '5 Protections + .5 per level');
                break;
            case ('Power_Potion'): 
                if (TYPE == 'Physical') PlayerStats.Power += 40;
                if (TYPE == 'Magical') PlayerStats.Power += 70;
                PlayerStats.CDR += 10;
                addPassiveText('Power Potion', '40 Physical Power/70 Magical Power; 10% CDR');
                break;
            case ('Power_Elixir'): 
                if (TYPE == 'Physical') PlayerStats.Power += PlayerStats.Power * .25;
                if (TYPE == 'Magical') PlayerStats.PercentPenetration += 10;
                addPassiveText('Power Elixir', '25% Power; 10% Penetration');
                break;
            case ('Defense_Elixir'):
                PlayerStats.CCR += 20;
                PlayerStats.PhysicalProtections += 50;
                PlayerStats.MagicalProtections += 50;
                PlayerStats.DamageReduction += 10;
                addPassiveText('Power Elixir', '25% Power; 10% Penetration');
                break;
        }
    }
}

function addItemPassiveStats(player) {
    const GOD = player.God;
    let PlayerStats = player.Stats;
    for (item of player.Items) if (item) switch (item.Name) {
        case "Heartward Amulet": 
            PlayerStats.MagicalProtections += 15;
            PlayerStats.MP5 += 30;
            addPassiveText('Heartward Amulet', '+15 Magical Protections; +30 MP5');
            break;
        case "Sovereignty": 
            PlayerStats.PhysicalProtections += 15;
            PlayerStats.HP5 += 25;
            addPassiveText('Sovereignty', '+15 Physical Protections; +25 HP5');
            break;
        case "Shogun's Kusari": 
            PlayerStats.AttackSpeed += GOD.AttackSpeed * .30;
            addPassiveText('Shogun\'s Kusari', '+30% Attack Speed');
            break;
        case "Telkhines Ring": 
            PlayerStats.BasicAttackDamage += 5 + (3 * player.Level);
            addPassiveText('Telkhines Ring', '+5 Basic Attack Damage +3 per level');
            break;
        case "Pythagorem's Piece": 
            PlayerStats.Lifesteal += 8;
            PlayerStats.Power += 20;
            addPassiveText('Pythagorem\'s Piece', '+8% Magical Lifesteal; +20 Magical Power');
            break;
        case "Caduceus Club": 
            PlayerStats.CCR += 10;
            PlayerStats.Speed += GOD.Speed * .03;
            addPassiveText('Caduceus Club', '+10 Crowd Control Reduction; +3% Movement Speed');
            break;
        case "Book of Thoth": 
            PlayerStats.Power += PlayerStats.Mana * .04;
            addPassiveText('Book of Thoth', '4% Mana Converted to Power; 7 Mana per Stack');
            break;
        case "Rod of Asclepius": 
            PlayerStats.CDR += 10;
            addPassiveText('Rod of Asclepius', '+10% Cooldown Reduction');
            break;
        case "Typhon's Fang": 
            PlayerStats.Power += PlayerStats.Lifesteal * 2;
            addPassiveText('Typhon\'s Fang', 'Magical Power increased by 2x Magical Lifesteal');
            break;
        case "Amulet of the Stronghold": 
            PlayerStats.MagicalProtections += PlayerStats.PhysicalProtections * .15;
            addPassiveText('Typhon\'s Fang', 'Increase Magical Protections by 15% of Physical Protections');
            break;
        case "Silverbranch Bow": 
            let Bonus = Math.round((PlayerStats.AttackSpeed - 2.5) / .02);
            if (Bonus > 120) Bonus = 120;
            if (PlayerStats.AttackSpeed > 2.5) PlayerStats.Power += 3 * Bonus;
            addPassiveText('Silverbranch Bow', '+3 Power per .02 Attack Speed above 2.5');
            break;
        case "Nimble Bancroft's Talon": 
            PlayerStats.AttackSpeed += (GOD.AttackSpeed * .02) * Math.floor(PlayerStats.Power / 30);
            addPassiveText('Nimble Bancroft\'s Talon', '+2% Attack Speed per 30 Magical Power');
            break;
    }
}

function calculateAfterEffects(player) {
    let PlayerStats = player.Stats;
    const GOD_STATS = player.God;
    if (GOD_STATS.Name == 'Olorun') PlayerStats.BasicAttackDamage += (PlayerStats.Power + GOD_STATS.Power + (GOD_STATS.PowerPL * player.Level)) * .25;
    else if (GOD_STATS.Type == 'Magical') PlayerStats.BasicAttackDamage += (PlayerStats.Power + GOD_STATS.Power + (GOD_STATS.PowerPL * player.Level)) * .20;
    else if (GOD_STATS.Type == 'Physical') PlayerStats.BasicAttackDamage += (PlayerStats.Power + GOD_STATS.Power + (GOD_STATS.PowerPL * player.Level));
    PlayerStats.EHP = Math.round(PlayerStats.Health / (1 - (PlayerStats.DamageReduction / 100)));
}


function displayStats(player) {
    let PlayerStats = player.Stats;
    let StatDisplays = document.querySelectorAll('#GodStats .stat .stat_amount');
    let StatBars = document.querySelectorAll('#GodStats .stat .stat_bar');
    let StatCaps = document.querySelectorAll('#GodStats .stat .stat_cap');
    let StatIndex = 0;
    for (key of Object.keys(PlayerStats)) {
        let hasPercent = (StatCaps[StatIndex].innerHTML.includes('%'));
        let Percent = PlayerStats[key] / StatCaps[StatIndex].innerHTML.replace('%', '') * 100;
        if (!PlayerStats[key]) Percent = 0;
        if (PlayerStats[key] > StatCaps[StatIndex].innerHTML.replace('%', '')) PlayerStats[key] = StatCaps[StatIndex].innerHTML.replace('%', '');
        StatDisplays[StatIndex].innerHTML = (Math.round(PlayerStats[key] * 100) / 100);
        if (hasPercent) StatDisplays[StatIndex].innerHTML += '%';
        StatBars[StatIndex].style.background = 'linear-gradient(to right, #827751 ' + Percent + '%, #111821 ' + Percent + '%)';
        StatIndex++;
    }
}
