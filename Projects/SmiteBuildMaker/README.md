# <p align="center">SmiteBuildMaker-Remake</p>

<p align="center">An open source web application that allows players of the game <a href="https://www.hirezstudios.com/">SMITE by Hi-Rez Studios</a> to interactively modify aspects of a character through customization and similar, emulated accurately to the systems within the game itself.

<p align="center">Please contact me if you wish to contribute!</p>

</p>

<hr>

<h1 align="center">Integration Guide</h1>

If you want to link SmiteBuildMaker from your own application or website, you can do so by creating a link.

The link that is created is made up of the base url `https://michaelwarmbier.github.io/Projects/SmiteBuildMaker/sbm.index`, _not_ SmiteBuildMaker.com since it's a forward URL. You can use a query string `?` to assign arguments as follows:

```js
// Set Player 1 (index 0) to God ID 1668
Example = '0g=1668`;
ActualFormat = `${playerIndex}g=${godId}`;

// Set Player 1 (index 0) to level 13
Example = '0l=13`;
ActualFormat = `${playerIndex}l = ${Level}`;

// Set Player 1 (index 0) Item 3 (index 2) to Item ID 7545
Example = '0i2=7542`;
ActualFormat = `${playerIndex}i${itemIndex}=${itemId}`;
```
Additionally, you can set the value key `bfs` to a list of buff names delimited by a comma `,`. Below is an example and list of all possible buffs:

```js
Example = `bfs=Silver Buff,Attack Speed Buff`;

/*
All Buffs

Power Buff
Speed Buff
Attack Speed Buff
Void Buff
Mana Buff
Health Buff
Silver Buff
Gold Buff
Fire Giant
E. Fire Giant
Joust Buff
Slash Buff
Power Potion
Power Elixir
Defense Elixir


*/

```

Keep in mind that **this will bypass restriction checks and any item in any order of any amount may be built**.