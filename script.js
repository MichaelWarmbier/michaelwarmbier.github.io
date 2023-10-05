/*///// Data /////*/

indexes = [0, 0];
const LABELS = Object.keys(SiteData);
const ELEMS = [
  document.querySelector('#ProjectSelect h2'), 
  document.querySelector('#PreviewSelect h2'),
  document.querySelector('#DescriptionContent'),
  document.querySelector('#DescriptionLinks'),
  document.querySelector('#PreviewContent'),
  document.querySelector('#PreviewTools')
];

/*///// Main /////*/

window.onload = () => {
  const ICONS = document.querySelectorAll('.EffWrap');
  const display = document.querySelector('#CurrHover');
  for (let elem of ICONS) {
    elem.onmouseover = (e) => { 
      display.innerHTML = e.target.alt;
      display.style.opacity = .8;
    }
    elem.onmouseout = (e) => { display.style.opacity = 0; }
  }

  updateDisplay(0, true); updateDisplay(0, false);
}

/*///// Event Triggered /////*/

function updateDisplay(offset, level) {
  if (indexes[level] + offset < SiteData[LABELS[indexes[1]]].length && indexes[level] + offset >= 0) indexes[level] += offset;
  const Target = SiteData[LABELS[indexes[1]]][indexes[0]];
  ELEMS[1].innerHTML = LABELS[indexes[1]];
  ELEMS[0].innerHTML = Target.Title;
  ELEMS[2].innerHTML = Target.Description;
  ELEMS[4].style.background = `URL('${Target.PreviewURL}')`;
  ELEMS[4].style.backgroundSize = 'cover';
  ELEMS[4].style.backgroundRepeat = 'no-repeat';
  ELEMS[4].style.backgroundPosition = 'center';

  ELEMS[5].style.right = '-40%';
  setTimeout(() => { 
    ELEMS[5].innerHTML = '';
    for (let elem of Target.Tools) ELEMS[5].innerHTML += ` <img src='${elem}'>`; 
    ELEMS[5].style.right = 0;
  }, 400);

  ELEMS[3].innerHTML = '';
  for (let Title = 0; Title < Target.Link_Titles.length; Title++) 
    ELEMS[3].innerHTML += `<a href='${Target.Links[Title]}'>< ${Target.Link_Titles[Title]} ><br></a>`;

}