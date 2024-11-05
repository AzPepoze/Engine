const fs = require("fs");
const readline = require("readline");
const { sleep } = require("../../module/Normal");
const { Load_File_Stream, Get_File_Path, Load_File_JSON } = require("./Files");
const Line_Function = require("./Line_Function");
const path = require("path");

let Now_Scene_Data = {};
let Now_Scene_Location;

async function Load_Scene_File(url) {
	const fileStream = await Load_File_Stream(path.join("./Scenes", url));
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	let lines = [];

	for await (const line of rl) {
		lines.push(line); // Add each line, trimming unnecessary spaces
	}

	return lines;
}

let Now_Run_Line = 0;
let Now_File = null;
async function LOAD(url) {
	Now_Scene_Data = await Load_Scene_File(url);
	Now_Scene_Location = url;

	for (Now_Run_Line = 0; Now_Run_Line < Now_Scene_Data.length; Now_Run_Line++) {
		await Run_Scene_Line();
	}

	LOAD(url);
}

async function Run_Last_Dialogue() {
	Now_Scene_Data = await Load_Scene_File(Now_Scene_Location);

	await Line_Function.SKIP();

	let Find_Blank = false;

	let Find_Last_Dialogue = false;
	while (Find_Last_Dialogue == false && Now_Run_Line >= 1) {
		Now_Run_Line--;

		if (
			get_tab_num(Now_Scene_Data[Now_Run_Line]) == 1 &&
			get_tab_num(Now_Scene_Data[Now_Run_Line - 1]) == 0 &&
			Find_Blank
		) {
			Find_Last_Dialogue = true;
		}

		if (
			get_tab_num(Now_Scene_Data[Now_Run_Line]) == 0 ||
			get_tab_num(Now_Scene_Data[Now_Run_Line - 1]) == 0
		) {
			Find_Blank = true;
		}
	}

	await Run_Last_Speaker();
	await Run_Scene_Line();
	return Now_Scene_Data[Now_Run_Line - 1];
}

async function Run_Last_Speaker() {
	let Find_Last_Speaker = false;
	let This_Line = Now_Run_Line;
	while (Find_Last_Speaker == false && This_Line >= 1) {
		This_Line--;

		if (
			get_tab_num(Now_Scene_Data[This_Line]) == 0 &&
			Now_Scene_Data[This_Line + 1].trim() == ""
		) {
			Find_Last_Speaker = true;
		}
	}

	await Run_Scene_Line(Now_Scene_Data[This_Line]);
}

function get_tab_num(data) {
	try {
		return (data.match(/ {5}/g) || []).length;
	} catch (e) {
		return 0;
	}
}

function remove_tab(data, num = 1) {
	for (let i = 0; i < num; i++) {
		data = data.replace(/ {5}/, "");
	}
	return data;
}

function valid_line(data) {
	return data.trim() != "";
}

let tab_Shift = 0;
let Choice_Data = {};
function START_CHOICE() {
	let END_Line;
	while (true) {
		Now_Run_Line++;
		let data = remove_tab(Now_Scene_Data[Now_Run_Line], tab_Shift);
		console.log(get_tab_num(data), data);
		if (data.startsWith("END CHOICE")) {
			END_Line = Now_Run_Line;
			break;
		}

		if (valid_line(data) && get_tab_num(data) == 0) {
			Choice_Data[data] = Now_Run_Line;
			console.log("WAHT", Choice_Data);
		}
	}

	console.log(Choice_Data);
	Choice_Data = {};
}

/**
 * Run scene line
 *
 * @param {string} data - Scene data
 */
async function Run_Scene_Line(data) {
	if (data == null) data = remove_tab(Now_Scene_Data[Now_Run_Line], tab_Shift);
	if (!valid_line(data)) return;

	const tab_num = get_tab_num(data);

	// console.log(tab_num, data);

	switch (tab_num) {
		case 0:
			if (data.startsWith("//")) return;

			for (const function_name in All_Functions) {
				if (data.replace(/ /g, "_").startsWith(function_name)) {
					let args = data
						.replace(/[\[\]]/g, "")
						.substring(function_name.length + 1)
						.split(" ");
					await All_Functions[function_name](...args);
					return;
				}
			}

			await Line_Function.SET_SPEAKER(data);
			break;
		case 1:
			let Next_Line = Now_Scene_Data[Now_Run_Line + 1];
			while (get_tab_num(Next_Line) == 1) {
				data += "\n";
				data += Next_Line;

				Now_Run_Line++;
				Next_Line = Now_Scene_Data[Now_Run_Line + 1];
			}
			await Line_Function.SET_TEXT(remove_tab(data));
			break;
	}
}

module.exports = {
	Load_Scene_File,
	LOAD,
	START_CHOICE,
	Run_Scene_Line,
	Run_Last_Dialogue,
};

let All_Functions = { ...module.exports, ...Line_Function };
