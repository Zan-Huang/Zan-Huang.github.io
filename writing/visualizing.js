(function () {
  var AXES = ["x", "y", "z", "w", "v", "u", "t"];
  var GEN = ["#1c1b18", "#6a3a32", "#1a3d8f", "#3d6b4f", "#8a5a1a", "#4a3d6b", "#5a564c"];

  function points(n, cx, cy, r) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (2 * Math.PI * i) / Math.max(n, 1);
      pts.push({
        x: cx + r * Math.cos(a),
        y: cy + r * Math.sin(a),
        label: AXES[i]
      });
    }
    return pts;
  }

  function drawGraph(svg, n, opts) {
    opts = opts || {};
    var highlight = opts.highlight;
    var ns = "http://www.w3.org/2000/svg";
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (n < 1) return;
    var w = 240;
    var h = 240;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    var cx = w / 2;
    var cy = h / 2;
    var r = n <= 2 ? 62 : 72;
    var pts = n === 1 ? [{ x: cx, y: cy, label: AXES[0] }] : points(n, cx, cy, r);

    function edge(i, j) {
      var gen = Math.max(i, j);
      var line = document.createElementNS(ns, "line");
      line.setAttribute("x1", pts[i].x);
      line.setAttribute("y1", pts[i].y);
      line.setAttribute("x2", pts[j].x);
      line.setAttribute("y2", pts[j].y);
      line.setAttribute("stroke", GEN[gen % GEN.length]);
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("stroke-width", highlight === gen ? "2.3" : "1.2");
      line.setAttribute("stroke-opacity", highlight == null || highlight === gen ? "0.95" : "0.18");
      svg.appendChild(line);
    }

    for (var i = 0; i < n; i++) {
      for (var j = i + 1; j < n; j++) edge(i, j);
    }

    pts.forEach(function (p) {
      var c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", p.x);
      c.setAttribute("cy", p.y);
      c.setAttribute("r", n === 1 ? 5.5 : 4.2);
      c.setAttribute("fill", "#f6f3ec");
      c.setAttribute("stroke", "#1c1b18");
      c.setAttribute("stroke-width", "1.15");
      svg.appendChild(c);
      var t = document.createElementNS(ns, "text");
      var lx = p.x;
      var ly = p.y;
      if (n === 1) {
        ly = p.y + 18;
      } else {
        var dx = p.x - cx;
        var dy = p.y - cy;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        lx = p.x + (dx / len) * 18;
        ly = p.y + (dy / len) * 18;
      }
      t.setAttribute("x", lx);
      t.setAttribute("y", ly);
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("dominant-baseline", "middle");
      t.setAttribute("class", "kn-label");
      t.textContent = p.label;
      svg.appendChild(t);
    });
  }

  function mountStatics() {
    var nodes = document.querySelectorAll("[data-kn]");
    for (var i = 0; i < nodes.length; i++) {
      drawGraph(nodes[i], parseInt(nodes[i].getAttribute("data-kn"), 10));
    }
  }

  function mountInteractive() {
    var svg = document.getElementById("kn-live");
    var slider = document.getElementById("kn-n");
    var colorSlider = document.getElementById("kn-gen");
    var nRead = document.getElementById("kn-n-read");
    var eRead = document.getElementById("kn-e-read");
    var gRead = document.getElementById("kn-g-read");
    if (!svg || !slider) return;

    function edges(n) {
      return n * (n - 1) / 2;
    }

    function render() {
      var n = parseInt(slider.value, 10);
      var gen = parseInt(colorSlider.value, 10);
      colorSlider.max = String(Math.max(0, n - 1));
      if (gen > n - 1) {
        colorSlider.value = String(n - 1);
        gen = n - 1;
      }
      drawGraph(svg, n, { highlight: gen < 0 ? null : gen });
      nRead.textContent = String(n);
      eRead.textContent = String(edges(n));
      gRead.textContent = gen < 0 ? "all generations" : (gen === 0 ? "K₁" : "edges added with " + AXES[gen]);
    }

    slider.addEventListener("input", render);
    colorSlider.addEventListener("input", render);
    render();
  }

  mountStatics();
  mountInteractive();
})();
