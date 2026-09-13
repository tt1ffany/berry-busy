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

  if (typeof loadPhase === 'function') {
    loadPhase();
  }
}

// === Timer Engine Logic ===
function loadPhase() {
    
}
