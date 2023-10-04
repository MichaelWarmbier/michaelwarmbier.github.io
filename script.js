window.onload = () => {
  const ICONS = document.querySelectorAll('.EffWrap');
  const display = document.querySelector('#CurrHover');
  for (elem of ICONS) {
    elem.onmouseover = (e) => { 
      display.innerHTML = e.target.alt;
      display.style.opacity = .8;
    }
    elem.onmouseout = (e) => { display.style.opacity = 0; }
  }
}