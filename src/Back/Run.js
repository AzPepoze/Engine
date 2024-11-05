const Scene = require("./module/Scene");

async function Run() {
	console.log(await Scene.LOAD("start.ffs"));
}

module.exports = {
	Run,
};
