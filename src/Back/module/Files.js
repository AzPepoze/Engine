const fs = require("fs");
const path = require("path");

function Get_File_Path(url, custom) {
	if (custom == true) return url;

	if (fs.existsSync(path.join(__dirname, "GameData"))) {
		return path.join(__dirname, "GameData", url);
	} else {
		return path.join(__dirname, "../../../../GameData/", url);
	}
}

async function Load_File_Stream(url, custom) {
	const filePath = await Get_File_Path(url, custom);
	return fs.createReadStream(filePath);
}

async function Load_File_JSON(url, custom) {
	const filePath = await Get_File_Path(url, custom);
	// console.log(filePath);
	try {
		const fileContent = fs.readFileSync(filePath, "utf8"); // Synchronous read
		const data = JSON.parse(fileContent); // Parse JSON separately
		return data;
	} catch (err) {
		console.error("Error reading or parsing JSON:", err);
		return {}; // Return empty object on failure
	}
}

async function Get_Config() {
	return await Load_File_JSON("Game.Config.json");
}

function Get_Character_Folder() {
	return Get_File_Path("Characters");
}

async function Load_Character_Data(Character_Name, Skin) {
	let This_Chracter_Path = path.join(Get_Character_Folder(), Character_Name);
	let Character_Config_Path = path.join(This_Chracter_Path, `Character.Config.json`);

	let Character_Config_Data = {};
	if (fs.existsSync(Character_Config_Path)) {
		Character_Config_Data = await Load_File_JSON(Character_Config_Path, true);
	}

	console.log(Character_Config_Data);

	if (Skin == null) {
		Skin = "Default";
	}

	let Character_Data = Character_Config_Data[Skin] || {};
	let Skin_src = Character_Data.src;
	if (Skin_src != null) {
		Character_Data.src = path.join(This_Chracter_Path, Skin_src);
	} else {
		Character_Data.src = path.join(This_Chracter_Path, `${Skin}.png`);
	}
	Character_Data.Name = Character_Name;

	return Character_Data;
}

module.exports = {
	Load_File_Stream,
	Get_File_Path,
	Load_File_JSON,
	Get_Config,
	Load_Character_Data,
	Get_Character_Folder,
};
