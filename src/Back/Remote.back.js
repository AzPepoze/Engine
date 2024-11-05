const { ipcMain } = require("electron");

let mainWindow;

function setMainWindow(win) {
	mainWindow = win;
}

function Sent_To_Front(channel, ...data) {
	if (mainWindow && mainWindow.webContents) {
		mainWindow.webContents.send(channel, ...data);
		console.log("Back > Front", channel, ...data);
	} else {
		console.error("mainWindow is not available");
	}
}

function Recive_From_Front(channel, callback) {
	ipcMain.on(channel, (event, ...data) => {
		callback(...data);
	});
}

function get_MainWindow() {
	return mainWindow;
}

Recive_From_Front("Window", function (mode) {
	switch (mode) {
		case "Close":
			mainWindow.close();
			break;

		case "Maximize":
			if (mainWindow.isMaximized()) {
				mainWindow.restore();
			} else {
				mainWindow.maximize();
			}
			break;

		case "Minimize":
			mainWindow.minimize();
			break;
	}
});

module.exports = {
	setMainWindow,
	Sent_To_Front,
	Recive_From_Front,
	get_MainWindow,
};
