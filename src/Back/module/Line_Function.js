const { globalShortcut, app } = require("electron");
const { sleep } = require("../../module/Normal");
const { Recive_From_Front, Sent_To_Front } = require("../Remote.back");
const { Load_Character_Data } = require("./Files");

let typing = false;
Recive_From_Front("TypeText", function () {
	typing = false;
});

//----------------------------------------------

let Current_Speaker_Data = {};

async function SET_DISPLAY(Mode, Name, Skin) {
	let This_Character_Data;

	if (Mode == "Show") {
		This_Character_Data = await Load_Character_Data(Name, Skin);
		Current_Speaker_Data[Name] = This_Character_Data;
	} else {
		Current_Speaker_Data[Name] = null;
		This_Character_Data = {
			Name: Name,
		};
	}

	Sent_To_Front("Character", Mode, This_Character_Data);
}

async function SHOW(Name, Skin) {
	SET_DISPLAY("Show", Name, Skin);
}

async function HIDE(Name) {
	SET_DISPLAY("Hide", Name);
}

async function SET_POS(Name, Axis, a, b, c) {
	switch (Axis) {
		case "X":
			Current_Speaker_Data[Name].x = a;
			Current_Speaker_Data[Name].transition = b;
			break;

		case "Y":
			Current_Speaker_Data[Name].y = a;
			Current_Speaker_Data[Name].transition = b;
			break;

		case "XY":
			Current_Speaker_Data[Name].x = a;
			Current_Speaker_Data[Name].y = b;
			Current_Speaker_Data[Name].transition = c;
			break;
	}

	Sent_To_Front("Character", "Show", Current_Speaker_Data[Name]);
}

//-----------------------------------------------

async function SET_TEXT(data) {
	typing = true;
	Sent_To_Front("TypeText", data, "Data");
	console.log("Dialogue", data);
	if (data != null) {
		await WAIT_PRESSNEXT(true);
		if (typing) {
			SKIP();
			while (typing) {
				await sleep(1);
			}
			await WAIT_PRESSNEXT();
		}
	}

	return 1;
}

let Last_Speaker = null;

async function SET_SPEAKER(data) {
	console.log("Speaker", data);

	await SET_TEXT(null);
	Sent_To_Front("TypeText", "", "Speaker");

	let Speaker = data;
	if (Last_Speaker != Speaker) {
		if (Last_Speaker != null) {
			HIDE(Last_Speaker);
		}
		await sleep(500);
		SHOW(Speaker);
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
async function SKIP() {
	if (typing) {
		Sent_To_Front("TypeText", null, "Skip");
		while (typing) {
			await sleep(1);
		}
	}
}

let Press_Next = false;
async function WAIT_PRESSNEXT(Stop_When_Not_Typing) {
	if (Stop_When_Not_Typing && !typing) {
		return 1;
	}
	if (Press_Next) {
		Press_Next = false;
		return 1;
	} else {
		await sleep(1);
		return await WAIT_PRESSNEXT();
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

async function REVERSE() {
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

async function SHOW_UI(id) {
	Sent_To_Front("SHOW_UI", id);
	await sleep(500);
}

async function HIDE_UI(id) {
	Sent_To_Front("HIDE_UI", id);
	await sleep(500);
}

//------------------------------------------------

async function ASK(data) {
	
}

Recive_From_Front("Line_Function", function (function_name, ...args) {
	return module.exports[function_name](...args);
});

module.exports = {
	SET_TEXT,
	SET_SPEAKER,
	SKIP,
	WAIT_PRESSNEXT,
	SHOW_UI,
	HIDE_UI,
	REVERSE,
	SET_DISPLAY,
	SHOW,
	SET_POS,
};
