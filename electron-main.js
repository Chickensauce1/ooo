const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

const APP_ID = "com.wordchain.tailgame";

function createWindow() {
  const window = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 900,
    minHeight: 620,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#fffdf8",
    icon: path.join(__dirname, "assets", "icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: false
    }
  });

  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.once("ready-to-show", () => window.show());
  window.loadFile("index.html");
}

app.setAppUserModelId(APP_ID);
Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => app.quit());
