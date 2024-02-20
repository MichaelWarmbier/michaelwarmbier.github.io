/*//// Data ////*/

let Terminal = document.querySelector('#Terminal');
let TerminalInput = Terminal.querySelectorAll('input')[0];

/*//// Open Terminal ////*/

document.addEventListener('keydown', function(event) {
    if (event.key != '`') return;
    if (!SiteData.Flags.TerminalOpen) Terminal.style.bottom = '0';
    else Terminal.style.bottom = '-100vh';
    SiteData.Flags.TerminalOpen = !SiteData.Flags.TerminalOpen;
})

/*//// Enter Terminal Value ////*/

TerminalInput.addEventListener('keydown', function(event) {
    if (event.keyCode != 13) return;
    let passedValue = TerminalInput.value;
    TerminalInput.value = '';
});