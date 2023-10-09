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
GithubChart = { };

/*///// Main /////*/

window.onload = () => {
  window.scrollTo(0,0); 
  const ICONS = document.querySelectorAll('.EffWrap');
  const DISPLAY = document.querySelector('#CurrHover');
  for (let elem of ICONS) {
    elem.onmouseover = (e) => { 
      DISPLAY.innerHTML = e.target.alt;
      DISPLAY.style.opacity = .8;
    }
    elem.onmouseout = (e) => { DISPLAY.style.opacity = 0; }
  }

  updateDisplay(0, true); updateDisplay(0, false);
  document.querySelectorAll('iframe')[0].src = '';
}

// Chart.js

(async() => {
  let APIDataResponse = await fetch('https://api.github.com/users/MichaelWarmbier', { 'Accept': 'application/json' });
  let CommitDataResponse = await fetch('https://api.github.com/search/commits?q=author:michaelwarmbier', { 'Accept': 'application/json' });
  let IssueDataResponse = await fetch('https://api.github.com/search/issues?q=author:michaelwarmbier', { 'Accept': 'application/json' });

  if (!APIDataResponse.ok || !CommitDataResponse.ok || !IssueDataResponse.ok) { displayAPIError(); return; }

  APIData = await APIDataResponse.json();
  CommitData = await CommitDataResponse.json();
  IssueData = await IssueDataResponse.json();

  chartData = [await APIData.public_repos, await APIData.followers, await CommitData.total_count, await IssueData.total_count];
  
  
  let ctx = document.getElementById('GithubChart1').getContext('2d');
  GitHubChart1 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Public Repos', 'Followers','Issues'],
      datasets: [
        {
          backgroundColor: 'rgba(20, 20, 20, .4)', 
          borderColor: '#de993e',     
          borderWidth: 1,                           
          data: [chartData[0], chartData[1], chartData[3]]
        }
      ],
    },
    options: { 
      plugins: { legend: { display: false }},
      scales: { y: { max: 100 }}
    }
  });
  ctx = document.getElementById('GithubChart2').getContext('2d');
  GitHubChart2 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Commits'],
      datasets: [
        {
          backgroundColor: 'rgba(20, 20, 20, .4)', 
          borderColor: '#de993e',     
          borderWidth: 1,                           
          data: [chartData[2]],
        }
      ],
    },
    options: { 
      plugins: { legend: { display: false }},
      scales: { y: { max: 2000 }}
    }
  });
})();

/*///// Event Triggered /////*/

function updateDisplay(offset, level) {
  if (!level && indexes[level] + offset < SiteData[LABELS[indexes[1]]].length && indexes[level] + offset >= 0) indexes[level] += offset;
  if (level && indexes[level] + offset < LABELS.length && indexes[level] + offset >= 0) indexes[level] += offset;
  const TARGET = SiteData[LABELS[indexes[1]]][indexes[0]];
  ELEMS[1].innerHTML = LABELS[indexes[1]];
  ELEMS[0].innerHTML = TARGET.Title;
  ELEMS[2].innerHTML = TARGET.Description;
  ELEMS[4].style.background = `URL('${TARGET.PreviewURL}')`;
  ELEMS[4].style.backgroundSize = 'cover';
  ELEMS[4].style.backgroundRepeat = 'no-repeat';
  ELEMS[4].style.backgroundPosition = 'center';

  ELEMS[5].style.right = '-45%';
  setTimeout(() => { 
    ELEMS[5].innerHTML = '';
    if (!level) {
      for (let elem of TARGET.Tools) ELEMS[5].innerHTML += ` <img src='${elem}'>`; 
      ELEMS[5].style.right = 0;
    }
  }, 400);

  if (LABELS[indexes[1]] === 'Writing') document.querySelector('#PreviewPDF').src = TARGET.LocalURL;
  else document.querySelector('#PreviewPDF').src = '';

  ELEMS[3].innerHTML = '';
  
  if (!level) for (let Title = 0; Title < TARGET.Link_Titles.length; Title++) 
    ELEMS[3].innerHTML += `<a href='${TARGET.Links[Title]}'>< ${TARGET.Link_Titles[Title]} ><br></a>`;

}

function displayAPIError() {
  console.log('Error!'); //tbd
}