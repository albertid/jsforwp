"use strict";

var firebaseLoc = 'generation-comparison/';
var container = document.querySelector('#js-comparing-generations');
var comparingGenerations = {
  initData: function initData(tab) {
    // standard firebase init
    interactivesDB.database().ref(firebaseLoc).once('value').then(function (snapshot) {
      comparingGenerations.data = snapshot.val();
    }).then(function () {
      comparingGenerations.initMenu(comparingGenerations.data, 'present', 0);
    });
  },
  loadTemplate: function loadTemplate() {
    var template = "\n        <div id='intContainer'>\n          <div id='switch'>\n    \t\t\t\t<button class='ui left attached button mini active' id='present'>In 2017</button>\n    \t\t\t\t<button class='ui right attached button mini' id='past'>When they were younger</button>\n          </div>\n          <div id='dataContainer'>\n            <div id='intMenu'>\n              <!-- populated from the initMenu function -->\n            </div>\n            <div id='intBars'>\n              <div id='barsTitle'></div>\n              <div id='barsLegend'></div>\n              <div id='barsContainer'>\n                <!-- populated from the initBars function -->\n              </div>\n              <p class='source' id='barsSource'></p>\n            </div>\n          </div>\n        </div>\n        ";
    var interactiveContainer = document.getElementById('js-comparing-generations');
    interactiveContainer.innerHTML = template;
  },
  initMenu: function initMenu(data, time, issue) {
    var menuTemplate = "<div class='ui vertical pointing menu' >"; // loop through issue names and add them to the menu

    data[time].issues.forEach(function (d, index) {
      menuTemplate += "<a class='item' data-slug='".concat(d.slug, "' data-index='").concat(index, "'>").concat(d.name, "</a>");
    });
    menuTemplate += "</div>";
    var intMenu = document.getElementById('intMenu');
    intMenu.innerHTML = menuTemplate; // First item is active on page load

    var firstMenu = document.querySelector('#intMenu .item[data-index="0" ]');
    firstMenu.classList.add('active'); // menu's loaded, let's load the bars

    comparingGenerations.initBars(data, time, issue); // Clicking the menu

    var menuItems = Array.from(document.querySelectorAll('#intMenu a.item'));

    var menuClick = function menuClick(e) {
      // Remove active class from any active items and replace it for the selected item
      e.preventDefault();
      menuItems.forEach(function (node) {
        node.classList.remove('active');
      });
      e.currentTarget.classList.add('active'); // Let's change issues and reload bars

      var issue = e.currentTarget.getAttribute('data-index');
      var time = document.querySelector('#switch button.active').id;
      comparingGenerations.initBars(data, time, issue);
    };

    menuItems.forEach(function (node) {
      node.addEventListener('click', menuClick);
    }); // Clicking buttons

    var buttons = Array.from(document.querySelectorAll('#intContainer button'));

    var buttonClick = function buttonClick(e) {
      // Remove active class from any active items and replace it for the selected item
      e.preventDefault();
      buttons.forEach(function (node) {
        node.classList.remove('active');
      });
      e.currentTarget.classList.add('active'); // Let's change issues and reload bars

      var issue = document.querySelector('#intMenu .item.active').getAttribute('data-index'); // keep selected issue when changing button views

      var time = document.querySelector('#switch button.active').id;
      comparingGenerations.initBars(data, time, issue);
    };

    buttons.forEach(function (node) {
      node.addEventListener('click', buttonClick);
    });
  },
  initBars: function initBars(data, time, issue) {
    var issueData = data[time].issues[issue];
    var xLabelCheck = issueData.x_labels;
    var barsTemplate = "<div class='ui divided items'>";
    var legendTemplate = ""; // loop through generations to make a bar div for each

    issueData.y_labels.forEach(function (d, i) {
      barsTemplate += "<div class='item'><div class='barLabel'><span class='genLabel'>".concat(d.label, "</span><br><span class='genSub'>").concat(d.sub, "</span></div><div class='bars'>");

      if (typeof xLabelCheck !== 'undefined') {
        // some issues only have one number, so this is a check to see if it's a bar or stacked bar
        issueData.x_labels.forEach(function (e, j) {
          // loop through data points to add them to a stacked bar
          barsTemplate += "<div class='bar' style='width:".concat(issueData.data[i][j].value, "%'><span>").concat(issueData.data[i][j].label, "</span></div>");
        });
      } else {
        barsTemplate += "<div class='bar' style='width:".concat(issueData.data[i][0].value, "%'><span>").concat(issueData.data[i][0].label, "</span></div>");
      }

      barsTemplate += "</div></div>";
    });
    barsTemplate += "</div>";

    if (typeof xLabelCheck !== 'undefined') {
      // Make the legend
      issueData.x_labels.forEach(function (d) {
        legendTemplate += "<span><div class='legendBox'></div>".concat(d, "</span>");
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
  } // LOAD IT UP

};
document.addEventListener('DOMContentLoaded', function () {
  comparingGenerations.loadTemplate();
  comparingGenerations.initData();
}); // TO-DO
// Change menu to dropdown on mobile
// Figure out styling for narrow bars

//# sourceMappingURL=index.js.map
