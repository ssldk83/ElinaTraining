(() => {
  const pages = [
    { file: "index.html", label: "Forside", icon: "⌂" },
    { file: "fractions.html", label: "Brøker", icon: "½" },
    { file: "decimal-addition.html", label: "Decimaltal", icon: "+" },
    { file: "algebra-expressions.html", label: "Algebra", icon: "a" },
    { file: "equation-lab.html", label: "Ligninger", icon: "x" },
    { file: "coordinate-plane.html", label: "Koordinater", icon: "⌖" }
  ];

  const current = location.pathname.split("/").pop() || "index.html";

  document.body.dataset.learningPage = current.replace(".html", "");

  if (!document.querySelector(".site-header")) {
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <div class="site-header__inner">
        <a class="site-brand" href="index.html" aria-label="Gå til forsiden">
          <span class="site-brand__mark" aria-hidden="true">E</span>
          <span class="site-brand__text">Elinas læringsunivers</span>
        </a>
        <nav class="site-nav" aria-label="Læringsapps">
          ${pages.map(page => `<a href="${page.file}" ${page.file === current ? 'aria-current="page"' : ""}><span aria-hidden="true">${page.icon}</span> ${page.label}</a>`).join("")}
        </nav>
        <span class="site-header__age">5 apps</span>
      </div>`;
    document.body.prepend(header);
  }

  if (!document.querySelector(".site-footer")) {
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `Lavet til nysgerrig matematiktræning · <a href="index.html">Se alle apps</a>`;
    document.body.append(footer);
  }
})();
