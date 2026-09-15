// Sequential baking journey
const BAKING_JOURNEY = [
  { id: "mix", name: "Mixing Ingredients", type: "work", minutes: 25 },
  { id: "rest", name: "Let Dough Rest", type: "break", minutes: 5 },
  { id: "bake", name: "Bake in Oven", type: "work", minutes: 25 },
  { id: "cool", name: "Let Cool", type: "break", minutes: 5 },
  { id: "enjoy", name: "Enjoy in Cafe", type: "work", minutes: 25 },
];

let currentStepIndex = 0;
let selectedItem = null;
let timeRemaining = 0;
let timerInterval = null;
let isTimerRunning = false;

// === View Management ===
function showView(viewId) {
  console.log(`[View Manager] Attempting to display view: #${viewId}`);

  const allViews = document.querySelectorAll(".view");
  console.log(
    `[View Manager] Found ${allViews.length} views with class ".view"`,
  );

  // Hide current page
  allViews.forEach((v) => {
    v.classList.remove("active");
    console.log(`[View Manager] Hiding view: #${v.id}`);
  });

  // Show next page
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add("active");
    console.log(
      `[View Manager] Successfully activated view: #${targetView.id}`,
    );
  } else {
    console.error(
      `[View Manager] Error: Target view #${viewId} does not exist in DOM.`,
    );
  }
}

// Show menu (triggered by clicking storefront door)
function showMenu() {
  console.log("[Interaction] Door clicked -> Executing showMenu()");
  showView("view-menu");
}

// Show timer (triggered when a recipe is selected from menu)
function selectRecipe(recipeName) {
  console.log(`[Interaction] Recipe chosen: ${recipeName}`);
  selectedItem = recipeName;
  currentStepIndex = 0;
  showView("view-timer");

  if (typeof loadPhase === "function") {
    loadPhase();
  }
}

// === Timer Engine Logic ===
// Populate title and reset timer duration for current phase
function loadPhase() {
  const currentPhase = BAKING_JOURNEY[currentStepIndex];
  console.log(
    `[Timer] Loaded Phase ${currentStepIndex + 1}/${BAKING_JOURNEY.length}: ${currentPhase.name}`,
  );

  // Update UI Elements
  document.getElementById("phase-title").innerText = currentPhase.name;
  document.getElementById("selected-recipe-badge").innerText = selectedItem
    ? `Recipe: ${selectedItem}`
    : "";
  document.getElementById("step-badge").innerText =
    `Step ${currentStepIndex + 1}/${BAKING_JOURNEY.length}`;

  // Set initial time
  timeRemaining = currentPhase.minutes * 60;
  updateDisplay();
}

// Format time display to MM:SS
function updateDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeDisplay = document.getElementById("time-display");

  if (timeDisplay) {
    timeDisplay.innerText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
}

function toggleTimer() {
  if (isTimerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  isTimerRunning = true;
  document.getElementById("action-btn").innerText = "Pause";
  console.log("[Timer] Started.");

  timerInterval = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      updateDisplay();
    } else {
      finishPhase();
    }
  }, 1000);
}

function pauseTimer() {
  isTimerRunning = false;
  clearInterval(timerInterval);
  const actionBtn = document.getElementById("action-btn");
  if (actionBtn) actionBtn.innerText = "Start";
  console.log("[Timer] Paused.");
}

function skipPhase() {
  console.log("[Timer] Phase skipped by user.");
  pauseTimer();
  advancePhase();
}

// Called when timer reaches 00:00
function finishPhase() {
  console.log("[Timer] Phase complete!");
  pauseTimer();

  // Play notification chime sound if available here

  // Step index 4 corresponds to the 3rd work session ("Enjoy in Cafe")
  if (currentStepIndex === 4) {
    showView("view-branch");
    return;
  }

  advancePhase();
}

function advancePhase() {
  currentStepIndex++;
  if (currentStepIndex < BAKING_JOURNEY.length) {
    loadPhase();
  } else {
    // Loop reset
    currentStepIndex = 0;
    showView("view-menu");
  }
}

function confirmExitTimer() {
  const currentPhase = BAKING_JOURNEY[currentStepIndex];
  const totalSecondsForPhase = currentPhase.minutes * 60;
  const hasProgress =
    currentStepIndex > 0 ||
    isTimerRunning ||
    timeRemaining < totalSecondsForPhase;

  if (hasProgress) {
    console.log("[Modal] Active progress detected. Showing exit confirmation.");
    document.getElementById("custom-modal").classList.add("active");
  } else {
    console.log("[Modal] No progress made yet. Returning to menu.");
    showView("view-menu");
  }
}

// User clicked "Stay" in the modal
function closeModal() {
  document.getElementById("custom-modal").classList.remove("active");
}

// User clicked "Exit in the modal"
function confirmExit() {
  document.getElementById("custom-modal").classList.remove("active");
  pauseTimer();
  showView("view-menu");
}

function makeChoice(choice) {
  console.log(`[Branch Choice] Selected: ${choice}`);

  if (choice === "bake") {
    // Return to menu to select a new pastry
    currentStepIndex = 0;
    showView("view-menu");
  } else if (choice === "cafe") {
    // Dynamically append ongoing cafe focus and break phases
    BAKING_JOURNEY.push(
      {
        id: `cafe_work_${BAKING_JOURNEY.length}`,
        name: "Cafe Focus",
        type: "work",
        minutes: 25,
      },
      {
        id: `cafe_break_${BAKING_JOURNEY.length}`,
        name: "Sip Coffee",
        type: "break",
        minutes: 5,
      },
    );
    currentStepIndex++;
    showView("view-timer");
    loadPhase();
  }
}
