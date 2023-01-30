window.onload = function() { initialize(); }

////// Site Data //////

let languageFilters = [];
let highlightValue = 
  ".3vw .3vw .4vw var(--blue), -.3vw .3vw .4vw var(--blue), .3vw -.3vw .4vw var(--blue), -.3vw -.3vw .4vw var(--blue)";

////// Site Methods //////

// Initialization Methods



function filterSelect(elem) { // ON: Select Project Filter
  work.innerHTML = '';
  writing.innerHTML = '';
  
  if (elem.style.boxShadow == highlightValue) {
    for (let index = 0; index < languageFilters.length; index++) 
        if (languageFilters[index] == removeCSS(elem.style.backgroundImage))
          languageFilters.splice(index, 1);
      elem.style.boxShadow = 'none';
  }
    
  else {
      languageFilters.push(removeCSS(elem.style.backgroundImage));
      elem.style.boxShadow = highlightValue;
  }
  
  initialize();
}

function initialize() { // Initialize SiteData

  let flexDirections = ["left", "right"];
  let direction = 1;

  for (let index = 0; index < Writing.length; index++)
    createWritingElement(Writing[index], index);

  let listOfProjects = []
  
  for (let index = 0; index < Projects.length; index++)
      if ((Projects[index].Tools).some(value => languageFilters.includes(value)))
        listOfProjects.push(Projects[index]);

  if (!listOfProjects.length) listOfProjects = Projects;
  if (languageFilters.length == 1 && languageFilters[0] == "asm.png")
    listOfProjects = [];

  for (let index = 0; index < listOfProjects.length; index++) {
    createProjectElement(listOfProjects[index], flexDirections[direction], index);
    direction = + !direction;
  }
  
}

// Utility Methods

function removeCSS(style) { return style.replace("url(\"Assets/Tools/", '').replace("\")", ''); }

function createProjectElement(obj, side, index) {
  work.innerHTML += "<div class='project " + side + "'><div class='project_info'></div></div>";
  let content = work.getElementsByClassName('project_info')[index];

  content.innerHTML += "<h1>" + obj.Title + "<br><span>" + obj.Year + "</span><br>";
  for (let index = 0; index < obj.Tools.length; index++) 
    content.innerHTML += "<img class='ico' src='Assets/Tools/" + obj.Tools[index] + "'></h1>";
  content.innerHTML += "<p>" + obj.Description + "</p>";
  content.innerHTML += "<div class='links'>"
  for (let index = 0; index < obj.Links.length; index++)
    content.innerHTML += "<a href='" + obj.Links[index] + "'>" + obj.Link_Titles[index] + "<br></a>";
  content.innerHTML += "</div>";

  if (side == "left")
    content.insertAdjacentHTML('beforebegin', "<img class='preview' src='" + obj.PreviewURL + "'>");
  else content.insertAdjacentHTML('afterend', "<img class='preview' src='" + obj.PreviewURL + "'>");
}

function createWritingElement(obj, index) {
  writing.innerHTML += "<div class='writing_project'></div>";
  let content = writing.getElementsByClassName('writing_project')[index];

  content.innerHTML += "<h1>" + obj.Title + "</h1>";
  content.innerHTML += "<h2>" + obj.Date + "</h2>";
  content.innerHTML += "<p>" + obj.Description + "</p>";
  content.innerHTML += "<a href='" + obj.Link + "'>[ Link to Document ]</a>";
}
