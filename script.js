const swiper = new Swiper(".carrossel-swiper", {
  loop: false,
  speed: 700,
  spaceBetween: 24,
  slidesPerView: 1,
  watchOverflow: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const accordionItems = Array.from(document.querySelectorAll(".accordion-item"));

accordionItems.forEach((item) => {
  const trigger = item.querySelector(".accordion-item__trigger");

  if (!trigger) {
    return;
  }

  trigger.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    item.classList.toggle("is-open", !isOpen);
    trigger.setAttribute("aria-expanded", String(!isOpen));
  });
});

const showcaseCards = Array.from(
  document.querySelectorAll("[data-showcase-card]"),
);

showcaseCards.forEach((card) => {
  const buttons = Array.from(card.querySelectorAll(".cards-showcase__toggle"));

  const syncCardState = () => {
    const isOpen = card.classList.contains("cards-showcase__card--active");
    buttons.forEach((button) => {
      button.textContent = isOpen ? "Fechar" : "Abrir";
      button.setAttribute("aria-expanded", String(isOpen));
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const isOpen = card.classList.contains("cards-showcase__card--active");

      showcaseCards.forEach((otherCard) => {
        otherCard.classList.remove("cards-showcase__card--active");
        Array.from(
          otherCard.querySelectorAll(".cards-showcase__toggle"),
        ).forEach((otherButton) => {
          otherButton.textContent = "Abrir";
          otherButton.setAttribute("aria-expanded", "false");
        });
      });

      if (!isOpen) {
        card.classList.add("cards-showcase__card--active");
      }

      syncCardState();
    });
  });

  syncCardState();
});

const audioPlayer = document.querySelector("[data-audio-player]");

if (audioPlayer) {
  const media = audioPlayer.querySelector(".audio-player__media");
  const toggleButton = audioPlayer.querySelector(".audio-player__toggle");
  const icon = audioPlayer.querySelector(".audio-player__icon");
  const seek = audioPlayer.querySelector(".audio-player__seek");
  const timeLabel = audioPlayer.querySelector(".audio-player__time");
  const volume = audioPlayer.querySelector(".audio-player__volume");
  const playIconSvg = `
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M0 17.5V0L13.75 8.75L0 17.5ZM2.5 12.9375L9.0625 8.75L2.5 4.5625V12.9375Z" fill="#475569"/>
    </svg>
  `;
  const pauseIconSvg = `
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="4" height="16" rx="1" fill="#475569" />
      <rect x="9" y="1" width="4" height="16" rx="1" fill="#475569" />
    </svg>
  `;

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) {
      return "00:00";
    }

    const totalSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const remainingSeconds = (totalSeconds % 60).toString().padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  };

  const updateSeek = () => {
    if (!media.duration) {
      seek.value = "0";
      seek.style.setProperty("--seek-progress", "0%");
      return;
    }

    const percent = (media.currentTime / media.duration) * 100;
    seek.value = String(percent);
    seek.style.setProperty("--seek-progress", `${percent}%`);
    timeLabel.textContent = formatTime(media.currentTime);
  };

  const updateState = () => {
    const playing = !media.paused;
    audioPlayer.classList.toggle("is-playing", playing);
    toggleButton.setAttribute("aria-pressed", String(playing));
    toggleButton.setAttribute(
      "aria-label",
      playing ? "Pausar áudio" : "Reproduzir áudio",
    );
    icon.innerHTML = playing ? pauseIconSvg : playIconSvg;
  };

  media.volume = Number(volume.value) / 100;

  toggleButton.addEventListener("click", async () => {
    if (media.paused) {
      await media.play();
    } else {
      media.pause();
    }
    updateState();
  });

  seek.addEventListener("input", () => {
    if (!media.duration) {
      return;
    }

    media.currentTime = (Number(seek.value) / 100) * media.duration;
    seek.style.setProperty("--seek-progress", `${seek.value}%`);
  });

  volume.addEventListener("input", () => {
    media.volume = Number(volume.value) / 100;
  });

  media.addEventListener("loadedmetadata", () => {
    timeLabel.textContent = formatTime(media.duration);
    updateSeek();
  });

  media.addEventListener("timeupdate", updateSeek);
  media.addEventListener("play", updateState);
  media.addEventListener("pause", updateState);
  media.addEventListener("ended", () => {
    media.currentTime = 0;
    updateSeek();
    updateState();
  });

  updateState();
}

const setupDiscursiveActivity = () => {
  const textArea = document.getElementById("atividade-textarea");
  const submitButton = document.getElementById("atividade-responder");
  const editButton = document.getElementById("atividade-alterar");
  const feedback = document.getElementById("atividade-feedback");
  const feedbackTitle = feedback?.querySelector(".atividade-feedback__title");
  const feedbackDescription = feedback?.querySelector(
    ".atividade-feedback__description",
  );

  if (
    !textArea ||
    !submitButton ||
    !editButton ||
    !feedback ||
    !feedbackTitle ||
    !feedbackDescription
  ) {
    return;
  }

  const storageKey = "atividade-discursiva-state";
  const feedbackContent = {
    title: "É isso aí!",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur commodi odio maiores accusamus aspernatur consequatur ipsam dignissimos magnam hic, velit est perferendis explicabo aperiam ratione veritatis labore.",
  };

  const saveActivityState = () => {
    const state = {
      text: textArea.value,
      isReadOnly: textArea.readOnly,
      feedbackTitle: feedbackTitle.textContent,
      feedbackDescription: feedbackDescription.textContent,
      isFeedbackHidden: feedback.hidden,
      isSubmitDisabled: submitButton.disabled,
      isEditDisabled: editButton.disabled,
    };

    sessionStorage.setItem(storageKey, JSON.stringify(state));
  };

  const restoreActivityState = () => {
    const rawState = sessionStorage.getItem(storageKey);

    if (!rawState) {
      return;
    }

    try {
      const state = JSON.parse(rawState);

      textArea.value = state.text || "";
      textArea.readOnly = Boolean(state.isReadOnly);
      feedbackTitle.textContent = state.feedbackTitle || "";
      feedbackDescription.textContent = state.feedbackDescription || "";
      feedback.hidden = state.isFeedbackHidden !== false;
      submitButton.disabled = Boolean(state.isSubmitDisabled);
      editButton.disabled = Boolean(state.isEditDisabled);
    } catch (error) {
      sessionStorage.removeItem(storageKey);
    }
  };

  const updateInputState = () => {
    const isEmpty = textArea.value.trim() === "";
    const isSubmitted = textArea.readOnly;

    textArea.setAttribute("aria-invalid", String(isEmpty));
    submitButton.disabled = isSubmitted || isEmpty;
    editButton.disabled = !isSubmitted;

    if (!isSubmitted) {
      feedback.hidden = true;
    }

    saveActivityState();
  };

  textArea.addEventListener("input", updateInputState);

  submitButton.addEventListener("click", () => {
    const answer = textArea.value.trim();

    if (!answer) {
      updateInputState();
      textArea.focus();
      return;
    }

    textArea.value = answer;
    textArea.readOnly = true;
    feedbackTitle.textContent = feedbackContent.title;
    feedbackDescription.textContent = feedbackContent.description;
    feedback.hidden = false;
    updateInputState();
  });

  editButton.addEventListener("click", () => {
    textArea.readOnly = false;
    feedbackTitle.textContent = "";
    feedbackDescription.textContent = "";
    feedback.hidden = true;
    updateInputState();
    textArea.focus();
    textArea.setSelectionRange(textArea.value.length, textArea.value.length);
  });

  restoreActivityState();
  updateInputState();
};

const setupObjectiveActivity = () => {
  const optionsContainer = document.getElementById("atividade-objetiva-opcoes");
  const submitButton = document.getElementById("atividade-objetiva-responder");
  const editButton = document.getElementById("atividade-objetiva-alterar");
  const feedback = document.getElementById("atividade-objetiva-feedback");
  const feedbackTitle = feedback?.querySelector(".atividade-feedback__title");
  const feedbackDescription = feedback?.querySelector(
    ".atividade-feedback__description",
  );
  const checkboxes = optionsContainer
    ? Array.from(optionsContainer.querySelectorAll('input[type="checkbox"]'))
    : [];

  if (
    !optionsContainer ||
    !submitButton ||
    !editButton ||
    !feedback ||
    !feedbackTitle ||
    !feedbackDescription ||
    checkboxes.length === 0
  ) {
    return;
  }

  const storageKey = "atividade-objetiva-state";
  const correctAnswers = ["opcao-1", "opcao-2"];
  const successFeedback = {
    title: "É isso aí!",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur commodi odio maiores accusamus aspernatur consequatur ipsam dignissimos magnam hic, velit est perferendis explicabo aperiam ratione veritatis labore.",
  };
  const errorFeedback = {
    title: "Tente novamente!",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur commodi odio maiores accusamus aspernatur consequatur ipsam dignissimos magnam hic, velit est perferendis explicabo aperiam ratione veritatis labore.",
  };

  const getSelectedValues = () =>
    checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

  const setLockedState = (locked) => {
    optionsContainer.classList.toggle("is-locked", locked);
    checkboxes.forEach((checkbox) => {
      checkbox.disabled = locked;
    });
  };

  const saveActivityState = () => {
    const state = {
      selectedValues: getSelectedValues(),
      isLocked: checkboxes.every((checkbox) => checkbox.disabled),
      feedbackTitle: feedbackTitle.textContent,
      feedbackDescription: feedbackDescription.textContent,
      isFeedbackError: feedback.classList.contains("atividade-feedback--error"),
      isFeedbackHidden: feedback.hidden,
      isSubmitDisabled: submitButton.disabled,
      isEditDisabled: editButton.disabled,
    };

    sessionStorage.setItem(storageKey, JSON.stringify(state));
  };

  const restoreActivityState = () => {
    const rawState = sessionStorage.getItem(storageKey);

    if (!rawState) {
      return;
    }

    try {
      const state = JSON.parse(rawState);

      checkboxes.forEach((checkbox) => {
        checkbox.checked =
          state.selectedValues?.includes(checkbox.value) || false;
      });

      setLockedState(Boolean(state.isLocked));
      feedbackTitle.textContent = state.feedbackTitle || "";
      feedbackDescription.textContent = state.feedbackDescription || "";
      feedback.classList.toggle(
        "atividade-feedback--error",
        Boolean(state.isFeedbackError),
      );
      feedback.hidden = state.isFeedbackHidden !== false;
      submitButton.disabled = Boolean(state.isSubmitDisabled);
      editButton.disabled = Boolean(state.isEditDisabled);
    } catch (error) {
      sessionStorage.removeItem(storageKey);
    }
  };

  const updateInputState = () => {
    const hasSelection = getSelectedValues().length > 0;
    const isSubmitted = checkboxes.every((checkbox) => checkbox.disabled);

    submitButton.disabled = isSubmitted || !hasSelection;
    editButton.disabled = !isSubmitted;

    if (!isSubmitted) {
      feedback.hidden = true;
    }

    saveActivityState();
  };

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateInputState);
  });

  submitButton.addEventListener("click", () => {
    const selectedValues = getSelectedValues();

    if (selectedValues.length === 0) {
      updateInputState();
      checkboxes[0].focus();
      return;
    }

    const isCorrect =
      selectedValues.length === correctAnswers.length &&
      selectedValues.every((value) => correctAnswers.includes(value));

    const feedbackContent = isCorrect ? successFeedback : errorFeedback;

    setLockedState(true);
    feedback.classList.toggle("atividade-feedback--error", !isCorrect);
    feedbackTitle.textContent = feedbackContent.title;
    feedbackDescription.textContent = feedbackContent.description;
    feedback.hidden = false;
    updateInputState();
  });

  editButton.addEventListener("click", () => {
    setLockedState(false);
    feedback.classList.remove("atividade-feedback--error");
    feedbackTitle.textContent = "";
    feedbackDescription.textContent = "";
    feedback.hidden = true;
    updateInputState();
    checkboxes[0].focus();
  });

  restoreActivityState();
  updateInputState();
};

setupDiscursiveActivity();
setupObjectiveActivity();
