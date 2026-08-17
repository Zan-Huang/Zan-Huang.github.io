(function () {
  var COLORS = [
    { id: "rot", name: "Rot", quality: "schön", pole: "Vernunft", hex: "#c45c6e", complement: "gruen" },
    { id: "orange", name: "Orange", quality: "edel", pole: "Vernunft / Verstand", hex: "#d47832", complement: "blau" },
    { id: "gelb", name: "Gelb", quality: "gut", pole: "Verstand", hex: "#d9b83a", complement: "violett" },
    { id: "gruen", name: "Grün", quality: "nützlich", pole: "Verstand / Sinnlichkeit", hex: "#7a9a58", complement: "rot" },
    { id: "blau", name: "Blau", quality: "gemein", pole: "Sinnlichkeit", hex: "#5a8aaa", complement: "orange" },
    { id: "violett", name: "Violett", quality: "unnöthig", pole: "Phantasie", hex: "#3a3f72", complement: "gelb" }
  ];

  var byId = {};
  COLORS.forEach(function (c) { byId[c.id] = c; });

  var svg = document.getElementById("farben-wheel");
  var readout = document.getElementById("farben-readout");
  var afterBtn = document.getElementById("farben-afterimage");
  var overlay = document.getElementById("afterimage");
  var field = document.getElementById("afterimage-field");
  var selected = null;
  var timer = null;

  function polar(cx, cy, r, deg) {
    var a = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function wedgePath(index, r0, r1) {
    var start = -90 + index * 60;
    var end = start + 60;
    var p0 = polar(160, 160, r1, start);
    var p1 = polar(160, 160, r1, end);
    var p2 = polar(160, 160, r0, end);
    var p3 = polar(160, 160, r0, start);
    return [
      "M", p0.x, p0.y,
      "A", r1, r1, 0, 0, 1, p1.x, p1.y,
      "L", p2.x, p2.y,
      "A", r0, r0, 0, 0, 0, p3.x, p3.y,
      "Z"
    ].join(" ");
  }

  function labelPoint(index, r) {
    return polar(160, 160, r, -90 + index * 60 + 30);
  }

  function draw() {
    var ns = "http://www.w3.org/2000/svg";
    var ring = document.createElementNS(ns, "circle");
    ring.setAttribute("cx", "160");
    ring.setAttribute("cy", "160");
    ring.setAttribute("r", "154");
    ring.setAttribute("class", "farben-rim");
    svg.appendChild(ring);

    COLORS.forEach(function (color, i) {
      var path = document.createElementNS(ns, "path");
      path.setAttribute("d", wedgePath(i, 62, 148));
      path.setAttribute("fill", color.hex);
      path.setAttribute("class", "farben-wedge");
      path.setAttribute("data-id", color.id);
      path.setAttribute("tabindex", "0");
      path.setAttribute("role", "button");
      path.setAttribute("aria-label", color.name + ", " + color.quality);
      path.addEventListener("click", function () { select(color.id); });
      path.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select(color.id);
        }
      });
      svg.appendChild(path);

      var label = document.createElementNS(ns, "text");
      var pt = labelPoint(i, 108);
      label.setAttribute("x", pt.x);
      label.setAttribute("y", pt.y);
      label.setAttribute("class", "farben-label");
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("dominant-baseline", "middle");
      label.textContent = color.quality;
      svg.appendChild(label);
    });

    var hole = document.createElementNS(ns, "circle");
    hole.setAttribute("cx", "160");
    hole.setAttribute("cy", "160");
    hole.setAttribute("r", "58");
    hole.setAttribute("class", "farben-hole");
    svg.appendChild(hole);
  }

  function select(id) {
    selected = byId[id];
    var nodes = svg.querySelectorAll(".farben-wedge");
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var nid = node.getAttribute("data-id");
      node.classList.toggle("is-chosen", nid === id);
      node.classList.toggle("is-complement", nid === selected.complement);
    }
    var opp = byId[selected.complement];
    readout.innerHTML =
      "<p><strong>" + selected.name + "</strong> — <em>" + selected.quality + "</em></p>" +
      "<p>Opposite: <strong>" + opp.name + "</strong> — <em>" + opp.quality + "</em></p>" +
      "<p class=\"farben-pole\">" + selected.pole + "</p>";
    afterBtn.disabled = false;
  }

  function paper() {
    return getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#f6f3ec";
  }

  function runAfterimage() {
    if (!selected) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      readout.innerHTML =
        "<p>The afterimage is withheld when motion is reduced. The complement of " +
        selected.name + " is " + byId[selected.complement].name + ".</p>";
      return;
    }
    clearTimeout(timer);
    overlay.hidden = false;
    field.style.background = selected.hex;
    field.classList.remove("is-paper");
    timer = setTimeout(function () {
      field.style.background = paper();
      field.classList.add("is-paper");
      timer = setTimeout(closeAfterimage, 4000);
    }, 8000);
  }

  function closeAfterimage() {
    clearTimeout(timer);
    overlay.hidden = true;
    field.classList.remove("is-paper");
  }

  afterBtn.addEventListener("click", runAfterimage);
  overlay.addEventListener("click", closeAfterimage);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAfterimage();
  });

  draw();
})();
