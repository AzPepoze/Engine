async function sleep(delay) {
	return new Promise((resolve) => setTimeout(resolve, delay));
}

function WaitForElement(selector) {
	return new Promise((resolve) => {
		const checkExistence = () => {
			console.log("Wait for", selector);
			const element = document.querySelector(selector);
			element ? resolve(element) : setTimeout(checkExistence, 100);
		};
		checkExistence();
	});
}

module.exports = {
	sleep,
	WaitForElement,
};
