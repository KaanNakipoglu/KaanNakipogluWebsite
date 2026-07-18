(() => {
  "use strict";

  /* ── Disable right-click & dev-tools keys ───────────────────────────── */
  document.addEventListener("contextmenu", event => event.preventDefault());

  document.addEventListener("keydown", event => {
    const blocked =
      event.keyCode === 123 ||
      (event.ctrlKey &&
        event.shiftKey &&
        [73, 74].includes(event.keyCode)) ||
      (event.ctrlKey && event.keyCode === 85);

    if (blocked) {
      event.preventDefault();
    }
  });

  const initializeWebsite = () => {
    /* ── Classic ⇄ Frutiger Aqua gimmick ─────────────────────────────── */
    const aquaButton =
      document.getElementById("aqua-toggle-button");

    const aquaLabel =
      aquaButton?.querySelector(".aqua-toggle-label");

    const aquaIcon =
      aquaButton?.querySelector("i");

    const renderAquaState = enabled => {
      document.body.classList.toggle(
        "aqua-mode",
        enabled
      );

      if (!aquaButton) {
        return;
      }

      aquaButton.setAttribute(
        "aria-pressed",
        String(enabled)
      );

      aquaButton.setAttribute(
        "aria-label",
        enabled
          ? "Return to the classic website style"
          : "Turn on Frutiger Aqua mode"
      );

      aquaButton.title = enabled
        ? "Return to the classic website style"
        : "Turn on Frutiger Aqua mode";

      if (aquaLabel) {
        aquaLabel.textContent = enabled
          ? "Classic Mode"
          : "Aqua Mode";
      }

      if (aquaIcon) {
        aquaIcon.className = enabled
          ? "fas fa-rotate-left"
          : "fas fa-water";
      }
    };

    /*
     * The original dark website is always the default
     * whenever the page is loaded or refreshed.
     */
    renderAquaState(false);

    aquaButton?.addEventListener("click", () => {
      const enableAqua =
        !document.body.classList.contains("aqua-mode");

      /*
       * Use the View Transition API when supported.
       * Older browsers use the normal fallback.
       */
      if (
        typeof document.startViewTransition === "function"
      ) {
        document.startViewTransition(() => {
          renderAquaState(enableAqua);
        });
      } else {
        renderAquaState(enableAqua);
      }
    });

    /* ── Dynamic footer year ─────────────────────────────────────────── */
    const year =
      document.getElementById("year");

    if (year) {
      year.textContent =
        new Date().getFullYear();
    }

    /* ── Project ⇄ Skills highlighting ───────────────────────────────── */
    const projects =
      document.querySelectorAll(".project-item");

    const pills =
      document.querySelectorAll(".skills-list li");

    let hoverOK = true;
    let timer;

    const clear = () => {
      pills.forEach(pill => {
        pill.classList.remove("active");
      });
    };

    const setAir = skills => {
      clear();

      skills.forEach(skill => {
        pills.forEach(pill => {
          const pillName =
            pill.textContent
              .trim()
              .toLowerCase();

          const skillName =
            skill
              .trim()
              .toLowerCase();

          if (pillName === skillName) {
            pill.classList.add("active");
          }
        });
      });
    };

    const act = (event, click) => {
      const item =
        event.currentTarget;

      const link =
        item.querySelector(".project-title a");

      const strong =
        item.querySelector(".project-title strong");

      const data = link
        ? link.dataset.skills
        : strong
          ? strong.dataset.skills
          : null;

      if (data) {
        const list =
          data.split(",");

        if (click) {
          hoverOK = false;

          clearTimeout(timer);

          setAir(list);

          document
            .getElementById("skills")
            ?.scrollIntoView({
              behavior: "smooth"
            });

          timer = setTimeout(() => {
            clear();
            hoverOK = true;
          }, 5000);

          if (link) {
            return true;
          }
        } else if (hoverOK) {
          setAir(list);
        }
      }

      if (!link || !click) {
        event.preventDefault();
      }

      return false;
    };

    projects.forEach(project => {
      project.addEventListener(
        "mouseenter",
        event => act(event, false)
      );

      project.addEventListener(
        "mouseleave",
        () => {
          if (hoverOK) {
            clear();
          }
        }
      );

      project.addEventListener(
        "click",
        event => act(event, true)
      );
    });

    /* ── Mobile menu auto-close ──────────────────────────────────────── */
    const navToggle =
      document.getElementById("nav-toggle");

    document
      .querySelectorAll(
        ".nav-links a, .overlay"
      )
      .forEach(element => {
        element.addEventListener(
          "click",
          () => {
            if (navToggle) {
              navToggle.checked = false;
            }
          }
        );
      });

    window.addEventListener(
      "scroll",
      () => {
        if (navToggle) {
          navToggle.checked = false;
        }
      },
      {
        passive: true
      }
    );

    /* ── Dynamic e-mail subject (“Project Offer – John Doe”) ─────────── */
    const nameField =
      document.getElementById("nameField");

    const subjectField =
      document.getElementById("subjectField");

    const hiddenSubject =
      document.getElementById("hidden-subject");

    const contactForm =
      document.getElementById("contactForm");

    const updateSub = () => {
      if (!hiddenSubject) {
        return;
      }

      const subject =
        subjectField?.value || "Inquiry";

      const name =
        (
          nameField?.value || "No Name"
        ).trim();

      hiddenSubject.value =
        `${subject} – ${name}`;
    };

    nameField?.addEventListener(
      "input",
      updateSub
    );

    subjectField?.addEventListener(
      "change",
      updateSub
    );

    contactForm?.addEventListener(
      "submit",
      updateSub
    );

    updateSub();
  };

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeWebsite,
      {
        once: true
      }
    );
  } else {
    initializeWebsite();
  }
})();