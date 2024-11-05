const { WaitForElement, sleep } = require("../module/Normal");
const Render_Function = require("./Render");
const { ipcRenderer, remote } = require("electron");

function Recived_From_Back(Channel, Callback) {
	ipcRenderer.on(Channel, async (event, ...data) => {
		console.log("Front Recived", Channel, ...data);
		await Callback(...data);
	});
}

for (const Function_Name in Render_Function) {
	Recived_From_Back(Function_Name, async function (...data) {
		await Render_Function[Function_Name](...data);
		return 1;
	});
}

function Get_Window() {
	console.log("Get_Window");
	return remote.getCurrentWindow();
}
