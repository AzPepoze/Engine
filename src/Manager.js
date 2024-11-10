const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { Run } = require("./Back/Run");
const { setMainWindow, Sent_To_Front } = require("./Back/Remote.back");
const { Get_File_Path, Get_Config } = require("./Back/module/Files");
const { sleep } = require("./module/Normal");
const { Run_Last_Dialogue } = require("./Back/module/Scene");

const Main_HTML_Path = path.join(__dirname, "./Front/main.html");

let mainWindow;

async function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		// autoHideMenuBar: true,
		// frame: false,
		titleBarStyle: "hidden",
		webPreferences: {
			nodeIntegration: true, // Enable `require` in renderer
			contextIsolation: false, // Disable isolation to allow `require`
			// devTools: false,
			// preload: `${__dirname}/Preload.js`,
		},
		show: false,
	});

	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
	});

	setMainWindow(mainWindow);

	mainWindow.webContents.on("before-input-event", (event, input) => {
		// Prevent default shortcuts by stopping the event
		if (input.alt && input.key.toUpperCase() === "F4") {
			return; // Allow default action for Alt + F4
		}

		if (input.control || input.meta || input.alt) {
			event.preventDefault();
		}
	});

	// Load `index.html` from the `src` folder
	if (fs.existsSync(Main_HTML_Path)) {
		fs.unlinkSync(Main_HTML_Path);
	}

	let Main_HTML_Content = fs.readFileSync(path.join(__dirname, "./Front/base.html"), "utf8");

	Main_HTML_Content = Main_HTML_Content.replace("</head>", `<style>\n</head>`);

	const Fonts = fs.readdirSync(Get_File_Path("./Fonts"));
	for (let font_name of Fonts) {
		font_path = path.join(Get_File_Path("./Fonts"), font_name);
		Main_HTML_Content = Main_HTML_Content.replace(
			"</head>",
			`@font-face {
				font-family: "${path.basename(font_path, path.extname(font_path))}";
				src: url("file://${font_path.replace(/\\/g, "/")}");
			}\n</head>`
		);
	}

	Main_HTML_Content = Main_HTML_Content.replace("</head>", `</style>\n</head>`);

	await new Promise(async (resolve, reject) => {
		fs.readdir(Get_File_Path("./UI"), async (err, files) => {
			if (err) {
				console.error("Error reading directory:", err);
				reject();
				return;
			}

			console.log(files);

			const htmlFiles = files.filter((file) => path.extname(file) === ".html");
			if (htmlFiles.length == 0) {
				resolve();
			} else {
				for (let filePath of htmlFiles) {
					filePath = path.join(Get_File_Path("./UI"), filePath);
					const html = fs.readFileSync(filePath, "utf8");

					// Use regular expressions to capture content inside <head> and <body> tags
					const headMatch = html.match(/<head[^>]*?>([\s\S]*?)<\/head>/i)?.[1];
					const bodyMatch = html.match(/<body[^>]*?>([\s\S]*?)<\/body>/i)?.[1];

					// console.log(headMatch, bodyMatch);

					Main_HTML_Content = Main_HTML_Content.replace(
						"</head>",
						`${headMatch}</head>`
					);
					Main_HTML_Content = Main_HTML_Content.replace(
						"</body>",
						`<div id="${path.basename(
							filePath,
							path.extname(filePath)
						)}" class="display-content">${bodyMatch}</div></body>`
					);

					console.log(Main_HTML_Content);
				}

				resolve();
			}
		});
	});

	console.log(Main_HTML_Content);

	fs.writeFileSync(Main_HTML_Path, Main_HTML_Content, "utf8");

	mainWindow.loadFile(Main_HTML_Path);

	//-----------------------------

	mainWindow.webContents.on("context-menu", async function () {
		if ((await Get_Config()).Debug != true) return;

		Run_Last_Dialogue();
	});

	// mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	Run();
});

app.on("window-all-closed", () => {
	fs.unlinkSync(Main_HTML_Path);

	if (process.platform !== "darwin") app.quit();
});
