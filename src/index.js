const firebaseLoc = 'generation-comparison/';
const container = document.querySelector('#js-comparing-generations');

const comparingGenerations = {
  initData: function (tab) { // standard firebase init
    interactivesDB.database().ref(firebaseLoc).once('value').then(function (snapshot) {
      comparingGenerations.data = snapshot.val();
    }).then(function () {
      comparingGenerations.initMenu(comparingGenerations.data, 'present', 0);
    });
  },
  loadTemplate: function () {
    const template =
      `
        <div id='intContainer'>
          <div id='switch'>
    				<button class='ui left attached button mini active' id='present'>In 2017</button>
    				<button class='ui right attached button mini' id='past'>When they were younger</button>
          </div>
          <div id='dataContainer'>
            <div id='intMenu'>
              <!-- populated from the initMenu function -->
            </div>
            <div id='intBars'>
              <div id='barsTitle'></div>
              <div id='barsLegend'></div>
              <div id='barsContainer'>
                <!-- populated from the initBars function -->
              </div>
              <p class='source' id='barsSource'></p>
            </div>
          </div>
        </div>
        `;
    var interactiveContainer = document.getElementById('js-comparing-generations');
    interactiveContainer.innerHTML = template;
  },
  initMenu: function (data, time, issue) {
    let menuTemplate =
      `<div class='ui vertical pointing menu' >`;

    // loop through issue names and add them to the menu
    data[time].issues.forEach((d, index) => {
      menuTemplate += `<a class='item' data-slug='${d.slug}' data-index='${index}'>${d.name}</a>`;
    });

    menuTemplate += `</div>`;

    var intMenu = document.getElementById('intMenu');
    intMenu.innerHTML = menuTemplate;

    // First item is active on page load
    var firstMenu = document.querySelector('#intMenu .item[data-index="0" ]');
    firstMenu.classList.add('active');

    // menu's loaded, let's load the bars
    comparingGenerations.initBars(data, time, issue);

    // Clicking the menu
    let menuItems = Array.from(document.querySelectorAll('#intMenu a.item'));
    const menuClick = (e) => {
      // Remove active class from any active items and replace it for the selected item
      e.preventDefault();
      menuItems.forEach(node => {
        node.classList.remove('active');
      });
      e.currentTarget.classList.add('active');

      // Let's change issues and reload bars
      var issue = e.currentTarget.getAttribute('data-index');
      var time = document.querySelector('#switch button.active').id;
      comparingGenerations.initBars(data, time, issue);
    }
    menuItems.forEach(node => {
      node.addEventListener('click', menuClick)
    });

    // Clicking buttons
    let buttons = Array.from(document.querySelectorAll('#intContainer button'));
    const buttonClick = (e) => {
      // Remove active class from any active items and replace it for the selected item
      e.preventDefault();
      buttons.forEach(node => {
        node.classList.remove('active');
      });
      e.currentTarget.classList.add('active');

      // Let's change issues and reload bars
      var issue = document.querySelector('#intMenu .item.active').getAttribute('data-index'); // keep selected issue when changing button views
      var time = document.querySelector('#switch button.active').id;

      comparingGenerations.initBars(data, time, issue);
    }
    buttons.forEach(node => {
      node.addEventListener('click', buttonClick)
    });
  },
  initBars: function (data, time, issue) {
    var issueData = data[time].issues[issue];
    var xLabelCheck = issueData.x_labels;
    let barsTemplate =
      `<div class='ui divided items'>`;
    let legendTemplate = ``;

    // loop through generations to make a bar div for each
    issueData.y_labels.forEach((d, i) => {
      barsTemplate += `<div class='item'><div class='barLabel'><span class='genLabel'>${d.label}</span><br><span class='genSub'>${d.sub}</span></div><div class='bars'>`;
      if (typeof xLabelCheck !== 'undefined') { // some issues only have one number, so this is a check to see if it's a bar or stacked bar
        issueData.x_labels.forEach((e, j) => { // loop through data points to add them to a stacked bar
          barsTemplate += `<div class='bar' style='width:${issueData.data[i][j].value}%'><span>${issueData.data[i][j].label}</span></div>`;
        });
      } else {
        barsTemplate += `<div class='bar' style='width:${issueData.data[i][0].value}%'><span>${issueData.data[i][0].label}</span></div>`;
      }

      barsTemplate += `</div></div>`
    })

    barsTemplate += `</div>`;

    if (typeof xLabelCheck !== 'undefined') { // Make the legend
      issueData.x_labels.forEach((d) => {
        legendTemplate += `<span><div class='legendBox'></div>${d}</span>`;
      });
    }

    var barsContainer = document.getElementById('barsContainer');
    barsContainer.innerHTML = barsTemplate;
    var title = document.getElementById('barsTitle');
    title.innerHTML = issueData.title;
    var legend = document.getElementById('barsLegend');
    legend.innerHTML = legendTemplate;
    var notes = document.getElementById('barsSource');
    notes.innerHTML = issueData.notes;
  }
}

// LOAD IT UP
document.addEventListener('DOMContentLoaded', function () {
  comparingGenerations.loadTemplate();
  comparingGenerations.initData();
});

// TO-DO
// Change menu to dropdown on mobile
// Figure out styling for narrow bars