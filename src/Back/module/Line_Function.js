const { globalShortcut, app } = require("electron");
const { sleep } = require("../../module/Normal");
const { Recive_From_Front, Sent_To_Front } = require("../Remote.back");
const { Load_Character_Data } = require("./Files");

let typing = false;
Recive_From_Front("TypeText", function () {
	typing = false;
});

async function Set_Dialogue_Data(data) {
	typing = true;
	Sent_To_Front("TypeText", data, "Data");
	console.log("Dialogue", data);
	if (data != null) {
		await Wait_Press_Next(true);
		if (typing) {
			Skip_Dialogue();
			while (typing) {
				await sleep(1);
			}
			await Wait_Press_Next();
		}
	}

	return 1;
}

let Last_Speaker = null;

async function Set_Character_Display(Mode, Character_Data) {
	Sent_To_Front("Character", Mode, Character_Data);
}

async function Set_Dialogue_Speaker(data) {
	console.log("Speaker", data);

	await Set_Dialogue_Data(null);
	Sent_To_Front("TypeText", "", "Speaker");

	let Speaker = data;
	if (Last_Speaker != Speaker) {
		if (Last_Speaker != null) {
			Set_Character_Display("Hide", await Load_Character_Data(Last_Speaker, null));
		}
		await sleep(500);
		Set_Character_Display("Show", await Load_Character_Data(Speaker, null));
		Last_Speaker = Speaker;
	}

	typing = true;
	Sent_To_Front("TypeText", Speaker, "Speaker");
	while (typing) {
		await sleep(1);
	}

	return 1;
}

//Skip---------------------------------------------
async function Skip_Dialogue() {
	if (typing) {
		Sent_To_Front("TypeText", null, "Skip");
		while (typing) {
			await sleep(1);
		}
	}
}

let Press_Next = false;
async function Wait_Press_Next(Stop_When_Not_Typing) {
	if (Stop_When_Not_Typing && !typing) {
		return 1;
	}
	if (Press_Next) {
		Press_Next = false;
		return 1;
	} else {
		await sleep(1);
		return await Wait_Press_Next();
	}
}

app.on("browser-window-focus", function () {
	globalShortcut.register("Space", () => {
		Press_Next = true;
	});
	globalShortcut.register("Enter", () => {
		Press_Next = true;
	});
});

Recive_From_Front("Press_Next", function () {
	Press_Next = true;
});

app.on("browser-window-blur", function () {
	globalShortcut.unregister("Space");
	globalShortcut.unregister("Enter");
});

//------------------------------------------------

async function Reverse_Dialogue() {
	// console.log("REVERSE");
	if (typing) {
		Press_Next = true;
		while (typing) {
			await sleep(1);
		}
	}
	return 1;
}

//------------------------------------------------

async function Show_UI(id) {
	Sent_To_Front("Show_UI", id);
	await sleep(500);
}

async function Hide_UI(id) {
	Sent_To_Front("Hide_UI", id);
	await sleep(500);
}

module.exports = {
	Set_Dialogue_Data,
	Set_Dialogue_Speaker,
	Skip_Dialogue,
	Wait_Press_Next,
	Show_UI,
	Hide_UI,
	Reverse_Dialogue,
};

Recive_From_Front("Line_Function", function (function_name, ...args) {
	return module.exports[function_name](...args);
});
