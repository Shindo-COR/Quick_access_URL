/**
修正対応
*/
function initStorage(callback) {
  chrome.storage.sync.get(["sets"], (data) => {
    if (!data.sets) {
      chrome.storage.sync.set({
        sets: DEFAULT_SETS,
        activeSet: "default"
      }, callback);
    } else {
      if (callback) callback();
    }
  });
}

function getStorage(callback) {
  chrome.storage.sync.get(["sets", "activeSet"], callback);
}

function saveStorage(data) {
  chrome.storage.sync.set(data);
}
