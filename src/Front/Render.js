const { sleep, WaitForElement } = require("../module/Normal");
const { Load_File_JSON, Get_Config } = require("../Back/module/Files");
const { ipcRenderer } = require("electron");

let Type_Speed = 30;

function isThaiUpperVowelOrTone(char) {
	const upperVowelsAndTones = /[\u0E34-\u0E39\u0E47-\u0E4C]/;
	return upperVowelsAndTones.test(char);
}

function create_line(parent) {
	const line = document.createElement("div");
	line.className = "line-each";
	parent.append(line);
	return line;
}

// ipcRenderer.send("TypeText");
let Skip = false;
async function TypeText(text, recived_id) {
	if (recived_id == "Skip") {
		Skip = true;
		return;
	}

	let id = recived_id;
	id = id == "Data" ? "#typing-text" : id;
	id = id == "Speaker" ? "#Character-name" : id;

	const typingText = await WaitForElement(id);
	console.log(text);

	// Clear the previous text
	let index = 0;
	typingText.style.transition = "all 0.1s";
	typingText.style.opacity = 0;
	await sleep(100);
	typingText.innerHTML = "";
	typingText.style.opacity = 1;

	if (text == null) return;

	let thisline = create_line(typingText);

	Type_Speed = (await Get_Config()).TypeSpeed;

	while (index < text.length) {
		let this_character = text.charAt(index);

		while (isThaiUpperVowelOrTone(text.charAt(index + 1))) {
			console.log("isThaiUpperVowelOrTone");
			index++;
			this_character += text.charAt(index);
		}

		const this_text_character = document.createElement("div");

		this_text_character.className = "text-each main-text";

		switch (this_character) {
			case " ":
				this_text_character.style.minWidth = "20px";
				break;

			case "\n":
				thisline = create_line(typingText);
				break;

			default:
				this_text_character.innerText = this_character;
				requestAnimationFrame(() => {
					this_text_character.style.transform = "translate(0px)";
					this_text_character.style.opacity = 1;
				});
				break;
		}

		thisline.append(this_text_character);

		index++;

		if (Skip) {
			continue;
		}
		await sleep(Type_Speed);
	}

	if (Skip) {
		Skip = false;
	}
	ipcRenderer.send("TypeText");

	return 1;
}

//----------------------------------------------
async function Show_UI(id) {
	const UI = await WaitForElement(`body > #${id}`);
	UI.style.opacity = 1;
	UI.style.userSelect = "";
	await sleep(500);
}

async function Hide_UI(id) {
	const UI = await WaitForElement(`body > #${id}`);
	UI.style.opacity = 0;
	UI.style.userSelect = "none";
	await sleep(500);
}
//----------------------------------------------

async function Character(Mode, Character_Data) {
	console.log(Character_Data);
	const Character_Container = await WaitForElement("#character-container");
	let Character = Character_Container.querySelector(`#${Character_Data.Name}`);
	switch (Mode) {
		case "Show":
			if (Character == null) {
				Character = document.createElement("img");
				Character.id = Character_Data.Name;
				Character.className = "Character";
				Character.src = Character_Data.src;
				Character.style.marginLeft = `${Character_Data.x}%`;
				Character.style.marginTop = `${Character_Data.y}%`;
				Character.style.transform = `scale(${Character_Data.scale})`;

				Character.style.opacity = 0;
				requestAnimationFrame(() => {
					Character.style.opacity = 1;
				});

				Character_Container.append(Character);
			}
			break;
		case "Hide":
			Character.style.opacity = 0;
			await sleep(500);
			if (Character) Character.remove();
			break;
	}
}

//----------------------------------------------
async function Run() {
	const typing_container = await WaitForElement("#typing-container");

	typing_container.addEventListener("click", function (event) {
		console.log("click");
		ipcRenderer.send("Press_Next");
		event.preventDefault();
	});
}
Run();

module.exports = {
	TypeText,
	Show_UI,
	Hide_UI,
	Character,
};
