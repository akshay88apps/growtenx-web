/* Progressive enhancements. Core navigation, service content, articles, and
   enquiry submission remain available through native HTML without JavaScript. */
"use strict";

function initNavigation() {
  const header = document.querySelector(".site-header");
  const menu = document.getElementById("navlinks");
  const toggle = document.getElementById("menuToggle");
  header.dataset.enhanced = "true";
  toggle.hidden = false;
  const setOpen = (open, restoreFocus = false) => {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener("click", () =>
    setOpen(toggle.getAttribute("aria-expanded") !== "true"),
  );
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    )
      setOpen(false, true);
  });
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });
  window
    .matchMedia("(min-width: 901px)")
    .addEventListener("change", () => setOpen(false));

  if ("IntersectionObserver" in window) {
    const links = [...menu.querySelectorAll("a:not(.button)")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            if (link.hash === "#" + entry.target.id)
              link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    links.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section) observer.observe(section);
    });
  }
}

function initServices() {
  const tablist = document.querySelector(".service-tabs");
  const tabs = [...tablist.querySelectorAll("[data-service]")];
  const panels = tabs.map((tab) =>
    document.getElementById("service-" + tab.dataset.service),
  );
  tablist.setAttribute("role", "tablist");
  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panels[index].id);
    panels[index].setAttribute("role", "tabpanel");
    panels[index].setAttribute("aria-labelledby", tab.id);
    panels[index].tabIndex = 0;
  });
  const select = (index, focus = false) => {
    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
  };
  const selectFromHash = () => {
    const panel = document.getElementById(location.hash.slice(1));
    const index = panels.findIndex(
      (candidate) => candidate === panel || candidate.contains(panel),
    );
    if (index >= 0) select(index);
    return index;
  };
  if (selectFromHash() < 0) select(0);
  window.addEventListener("hashchange", selectFromHash);
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      select(index);
    });
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft")
        next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (event.key === " ") next = index;
      if (next === undefined) return;
      event.preventDefault();
      select(next, true);
    });
  });
  document.querySelectorAll("[data-interest]").forEach((link) => {
    link.addEventListener("click", () => {
      const choice = [
        ...document.querySelectorAll('input[name="Service"]'),
      ].find((input) => input.value === link.dataset.interest);
      if (choice) choice.checked = true;
      requestAnimationFrame(() =>
        document.getElementById("full-name").focus({ preventScroll: true }),
      );
    });
  });
}

function initPrism() {
  const scene = document.querySelector(".prism-scene");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let frame = 0;
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    scene.style.removeProperty("--tilt-x");
    scene.style.removeProperty("--tilt-y");
  };
  scene.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches || !finePointer.matches || frame) return;
    frame = requestAnimationFrame(() => {
      const bounds = scene.getBoundingClientRect();
      const x = Math.max(
        -1,
        Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2),
      );
      const y = Math.max(
        -1,
        Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2),
      );
      scene.style.setProperty("--tilt-x", (x * 4).toFixed(2) + "deg");
      scene.style.setProperty("--tilt-y", (-y * 3).toFixed(2) + "deg");
      frame = 0;
    });
  });
  scene.addEventListener("pointerleave", reset);
  reducedMotion.addEventListener("change", reset);
  finePointer.addEventListener("change", reset);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) reset();
  });
}

function initArticles() {
  const dialog = document.getElementById("blogModal");
  if (typeof dialog.showModal !== "function") return;
  const articles = [...document.querySelectorAll("[data-article]")];
  const title = document.getElementById("blogModalTitle");
  const date = document.getElementById("blogModalDate");
  const content = document.getElementById("blogModalContent");
  const counter = document.getElementById("blogCounter");
  let index = 0;
  let trigger;
  let previousOverflow = "";
  const render = () => {
    const article = articles[index];
    title.textContent = article.querySelector("h3").textContent;
    date.textContent = article.querySelector(".article-date").textContent;
    // Content comes only from the site's authored HTML, never from a response or form input.
    content.innerHTML = article.querySelector(".article-content").innerHTML;
    counter.textContent = index + 1 + " / " + articles.length;
    dialog.querySelector(".dialog-content").scrollTop = 0;
  };
  const navigate = (direction) => {
    index = (index + direction + articles.length) % articles.length;
    render();
  };
  articles.forEach((article, i) => {
    const summary = article.querySelector("summary");
    summary.setAttribute("aria-haspopup", "dialog");
    summary.addEventListener("click", (event) => {
      event.preventDefault();
      index = i;
      trigger = summary;
      render();
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.showModal();
    });
  });
  dialog
    .querySelector("[data-close]")
    .addEventListener("click", () => dialog.close());
  document
    .getElementById("blogPrev")
    .addEventListener("click", () => navigate(-1));
  document
    .getElementById("blogNext")
    .addEventListener("click", () => navigate(1));
  dialog.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;
    trigger?.focus({ preventScroll: true });
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      navigate(event.key === "ArrowRight" ? 1 : -1);
    }
  });
}

function initContact() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submit = form.querySelector('[type="submit"]');
  const label = submit.querySelector("span");
  const defaultLabel = label.textContent;
  let submitting = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    if (form.elements.botcheck.checked) return;
    const key = form.elements.access_key.value;
    if (!key || key === "YOUR_WEB3FORMS_ACCESS_KEY") {
      status.dataset.state = "error";
      status.textContent =
        "The form is temporarily unavailable. Please try again shortly.";
      return;
    }
    submitting = true;
    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    label.textContent = "Sending your enquiry…";
    status.textContent = "";
    delete status.dataset.state;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Enquiry request failed");
      const result = await response.json();
      if (!result.success) throw new Error("Enquiry was not accepted");
      form.reset();
      status.dataset.state = "success";
      status.textContent =
        "Thanks — your enquiry has been sent. The AIPrism team will be in touch.";
    } catch (error) {
      status.dataset.state = "error";
      status.textContent =
        error.name === "AbortError"
          ? "The request took too long. Your details are still here; please try again."
          : "We couldn’t send your enquiry. Your details are still here; please try again shortly.";
    } finally {
      clearTimeout(timeout);
      submit.disabled = false;
      form.removeAttribute("aria-busy");
      label.textContent = defaultLabel;
      submitting = false;
    }
  });
}

initNavigation();
initServices();
initPrism();
initArticles();
initContact();
