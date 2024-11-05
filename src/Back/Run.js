const Scene = require("./module/Scene");

async function Run() {
	console.log(await Scene.Run_Scene_File("start.ffs"));
}

module.exports = {
	Run,
};
