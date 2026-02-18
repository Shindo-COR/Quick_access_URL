initStorage(() => {
  getStorage(data => {
    AppState.sets = data.sets;
    AppState.active = data.activeSet;
    renderTabs();
    renderButtons();
    startAutoSave();
  });
});
