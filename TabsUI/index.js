const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tabs = $$(".tab-item");
const panes = $$(".tab-pane");
//console.log(tabs, panes);

const tabsActive = $(".tab-item.active");
const line = $(".line");
//console.log(tabsActive, line);

line.style.left = tabsActive.offsetLeft + "px";
line.style.width = tabsActive.offsetWidth + "px";

tabs.forEach((tab, index) => {
  const pane = panes[index];
  tab.onclick = function () {
    $(".tab-item.active").classList.remove("active");
    $(".tab-pane.active").classList.remove("active");

    pane.classList.add("active");
    this.classList.add("active");

    line.style.left = tab.offsetLeft + "px";
    line.style.width = tab.offsetWidth + "px";
  };
});
