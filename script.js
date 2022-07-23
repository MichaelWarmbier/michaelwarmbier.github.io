window.onload = function() { initializeProjects(); }

var toolFilters = [];

function initializeProjects() {
  let work = document.getElementById('work');
  work.innerHTML = '';
  let visibleIndex = 0;

  for (let i = 0; i < Site.length; i++) {

    visibleIndex++;

    let clearToShow = 0;
    if (toolFilters.length != 0) {
      for (let j = 0; j < Site[i].Tools.length; j++)
      for (let k = 0; k < toolFilters.length; k++)
        if (Site[i].Tools[j] == toolFilters[k]) clearToShow++;
    } else {clearToShow = -1; }

    if (clearToShow != -1 && clearToShow != toolFilters.length) { visibleIndex--; continue; }
    
    let project = document.createElement('div');
    project.classList.add('project');
    work.appendChild(project);

    let preview = document.createElement('img');
    preview.classList.add('preview');

    project.innerHTML = '<div class="project_info"><h1></h1><p></p><div class="links"></div></div>';
    project.getElementsByTagName('h1')[0].innerHTML = Site[i].Title + '<br><span>' + Site[i].Year + '</span></br>'; 
    project.getElementsByTagName('p')[0].innerHTML = Site[i].Description;
    for (let j = 0; j < Site[i].Links.length; j++) {
      let link = document.createElement('a');
      project.getElementsByClassName('links')[0].append(link);
      link.href = Site[i].Links[j];
      link.innerHTML = '[ ' + Site[i].Link_Titles[j] + ' ]<br>';
    }
    for (let j = 0; j < Site[i].Tools.length; j++) {
      let tool = document.createElement('img');
      tool.classList.add('ico');
      project.getElementsByTagName('h1')[0].append(tool);
      tool.src = 'Assets/Tools/' + Site[i].Tools[j];
    }

    switch (visibleIndex % 2) {
      case 0:
        project.classList.add('left');
        project.prepend(preview);
      break;
      case 1:
        project.classList.add('right');
        project.append(preview);
      break;
    }

    preview.src = Site[i].PreviewURL;
    
  }
}

function removeCSS(style) {
  return style.replace('url(\"Assets/Tools/', '').replace('\")', '');
}

function filterSelect(elem) {
  switch (elem.style.boxShadow == '.3vw .3vw .4vw var(--blue), -.3vw .3vw .4vw var(--blue), .3vw -.3vw .4vw var(--blue), -.3vw -.3vw .4vw var(--blue)') {
    case true:
      for (let i = 0; i < toolFilters.length; i++) 
        if (toolFilters[i] == removeCSS(elem.style.backgroundImage))
          toolFilters.splice(i, 1);
      elem.style.boxShadow = 'none';
      
    break;
    case false:
      toolFilters.push(removeCSS(elem.style.backgroundImage));
      elem.style.boxShadow ='.3vw .3vw .4vw var(--blue), -.3vw .3vw .4vw var(--blue), .3vw -.3vw .4vw var(--blue), -.3vw -.3vw .4vw var(--blue)';
    break;
  }
  initializeProjects();
}