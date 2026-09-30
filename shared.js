(() => {
  const apps = [
    { id: "fractions", file: "fractions.html", label: "Brøker", icon: "½" },
    { id: "decimal-addition", file: "decimal-addition.html", label: "Decimaltal", icon: "+" },
    { id: "algebra-expressions", file: "algebra-expressions.html", label: "Algebra", icon: "a" },
    { id: "equation-lab", file: "equation-lab.html", label: "Ligninger", icon: "x" },
    { id: "coordinate-plane", file: "coordinate-plane.html", label: "Koordinater", icon: "⌖" },
    { id: "area-formulas", file: "area-formulas.html", label: "Areal", icon: "▦" }
  ];

  const challenges = [
    "Sammenlign to brøker uden først at se på tallene.",
    "Løs tre decimalopgaver og hold øje med kommaet.",
    "Få tre algebraopgaver rigtige i træk.",
    "Find det skjulte tal i to forskellige ligninger.",
    "Find tre punkter uden at bytte om på x og y.",
    "Forklar symbolerne i tre arealformler."
  ];

  const storageKey = "elina-learning-progress-v1";
  const currentFile = location.pathname.split("/").pop() || "index.html";
  const currentApp = apps.find(app => app.file === currentFile);

  const todayKey = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const readProgress = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || { apps: {}, streak: 0, lastActive: "" };
    } catch {
      return { apps: {}, streak: 0, lastActive: "" };
    }
  };

  const writeProgress = progress => {
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch { /* Progress is optional. */ }
  };

  const updateStreak = progress => {
    const today = todayKey();
    if (progress.lastActive === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
    progress.streak = progress.lastActive === yesterdayKey ? (progress.streak || 0) + 1 : 1;
    progress.lastActive = today;
  };

  const totalStars = progress => Object.values(progress.apps || {}).reduce((sum, app) => sum + (app.stars || 0), 0);

  const updateProgressUI = () => {
    const progress = readProgress();
    const total = totalStars(progress);
    const explored = apps.filter(app => (progress.apps?.[app.id]?.stars || 0) > 0).length;
    document.querySelectorAll("[data-total-stars]").forEach(element => { element.textContent = total; });
    document.querySelectorAll("[data-apps-explored]").forEach(element => { element.textContent = explored; });
    document.querySelectorAll("[data-learning-streak]").forEach(element => { element.textContent = progress.streak || 0; });

    apps.forEach(app => {
      const stars = progress.apps?.[app.id]?.stars || 0;
      document.querySelectorAll(`[data-progress-app="${app.id}"]`).forEach(element => {
        element.textContent = stars ? `⭐ ${stars}` : "Ny";
        element.dataset.started = stars ? "true" : "false";
      });
      document.querySelectorAll(`[data-action-app="${app.id}"]`).forEach(element => {
        if (stars) element.textContent = "Fortsæt →";
      });
      document.querySelectorAll(`[data-bar-app="${app.id}"]`).forEach(element => {
        element.style.width = `${Math.min(stars, 10) * 10}%`;
      });
    });
  };

  const showStarToast = message => {
    let toast = document.querySelector(".star-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "star-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.append(toast);
    }
    toast.textContent = `⭐ ${message || "En stjerne til dit univers!"}`;
    toast.classList.remove("star-toast--show");
    requestAnimationFrame(() => toast.classList.add("star-toast--show"));
    clearTimeout(showStarToast.timeout);
    showStarToast.timeout = setTimeout(() => toast.classList.remove("star-toast--show"), 2200);
  };

  window.LearningUniverse = {
    earnStar(appId, message) {
      const progress = readProgress();
      const appProgress = progress.apps[appId] || { stars: 0 };
      appProgress.stars = Math.min((appProgress.stars || 0) + 1, 99);
      appProgress.lastPlayed = new Date().toISOString();
      progress.apps[appId] = appProgress;
      updateStreak(progress);
      writeProgress(progress);
      updateProgressUI();
      showStarToast(message);
    },
    getProgress: readProgress
  };

  document.body.dataset.learningPage = currentApp?.id || "home";

  if (!document.querySelector(".site-header")) {
    const progress = readProgress();
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <div class="site-header__inner">
        <a class="site-brand" href="index.html" aria-label="Gå til forsiden">
          <span class="site-brand__mark" aria-hidden="true">E</span>
          <span class="site-brand__text">Elinas læringsunivers</span>
        </a>
        <button class="site-menu-button" type="button" aria-expanded="false" aria-controls="site-nav">
          <span aria-hidden="true">☰</span> Apps
        </button>
        <nav class="site-nav" id="site-nav" aria-label="Læringsapps">
          <a href="index.html" ${currentFile === "index.html" ? 'aria-current="page"' : ""}><span aria-hidden="true">⌂</span> Forside</a>
          ${apps.map(app => `<a href="${app.file}" ${app.file === currentFile ? 'aria-current="page"' : ""}><span aria-hidden="true">${app.icon}</span> ${app.label}</a>`).join("")}
        </nav>
        <a class="site-star-count" href="index.html#min-fremgang" aria-label="Se din fremgang"><span aria-hidden="true">⭐</span> <span data-total-stars>${totalStars(progress)}</span></a>
      </div>`;
    document.body.prepend(header);

    const button = header.querySelector(".site-menu-button");
    const nav = header.querySelector(".site-nav");
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      nav.dataset.open = String(open);
    });
  }

  const dayNumber = Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000);
  const dailyIndex = ((dayNumber % apps.length) + apps.length) % apps.length;
  const dailyApp = apps[dailyIndex];
  document.querySelectorAll("[data-daily-title]").forEach(element => { element.textContent = dailyApp.label; });
  document.querySelectorAll("[data-daily-challenge]").forEach(element => { element.textContent = challenges[dailyIndex]; });
  document.querySelectorAll("[data-daily-link]").forEach(element => { element.href = dailyApp.file; });

  if (!document.querySelector(".site-footer")) {
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `<span aria-hidden="true">✦</span> Små skridt tæller · <a href="index.html">Se alle apps</a>`;
    document.body.append(footer);
  }

  updateProgressUI();
})();
