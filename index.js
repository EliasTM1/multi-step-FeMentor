import { addOnServices, availablePlans, user } from "./stepsDefinitions.js";

let billingPeriod;

const formElements = {
	personalInfoForm : document.querySelector(".personal-data"),
	frequencyformStep : document.querySelector(".frequency-step"),
	addOnFormStep : document.querySelector(".add-on-step"),
	finishStep : document.querySelector(".finish-step"),
	thankYouStep : document.querySelector(".thank-you"),
	stepTitle : document.querySelector("#form-title"),
	stepSubtitle : document.querySelector("#form-description"),
	nextButton : document.querySelector("#next"),
	backButton : document.querySelector("#back"),
	nameField : document.querySelector("#usrName"),
	emailField : document.querySelector("#usrMail"),
	phoneField : document.querySelector("#usrPhone"),
	toggleSwitch : document.querySelector("#toggle-switch"),
	coreSubs : document.querySelectorAll(".package-container"),
	addOns : document.querySelectorAll(".add-on")
}


// * Event Listeners
formElements.nextButton.addEventListener("click", (e) => nextStep(e));
formElements.toggleSwitch.addEventListener("click", (e) => toggleSwitchState(e));
formElements.coreSubs.forEach((div) => {
	div.addEventListener("click", (event) => selectCoreSubscription(event));
});
formElements.addOns.forEach((addOn) => {
	addOn.addEventListener("click", (event) => includeAddOn(event));
});


let formSteps = {
	1: {
		step: 1,
		title: "Personal info",
		Subtitle: "Please provide your name, email address, and phone number.",
		buttonText: "Next Step",
		formToShow: formElements.personalInfoForm,
	},
	2: {
		step: 2,
		title: "Select your plan",
		Subtitle: "You have the option of monthly or yearly billing.",
		buttonText: "Next Step",
		formToShow: formElements.frequencyformStep,
		formToHide: formElements.personalInfoForm,
	},
	3: {
		step: 3,
		title: "Pick add-ons",
		Subtitle: "Add-ons help enhance your gaming experience.",
		buttonText: "Next Step",
		formToShow: formElements.addOnFormStep,
		formToHide: formElements.frequencyformStep,
	},
	4: {
		step: 4,
		title: "Finishing up",
		Subtitle: "Double-check everything looks OK before confirming.",
		buttonText: "Confirm",
		formToShow: formElements.finishStep,
		formToHide: formElements.addOnFormStep,
	},
	5: {
		step: 5,
		title: "",
		Subtitle: "", 
		buttonText: "",
		formToShow: formElements.thankYouStep,
		formToHide: formElements.finishStep,
	},
};
const formLength = Object.values(formSteps).length;

formSteps[1].afterComplete = formSteps[2].step;
formSteps[2].afterComplete = formSteps[3].step;
formSteps[3].afterComplete = formSteps[4].step;
formSteps[4].afterComplete = formSteps[5].step;

(function setIntialState() {
	user.currentStep = formSteps[1];
	setStep(user.currentStep.step);
})();

function includeAddOn(addOnService) {
	const clickedContainer = addOnService.target.closest(".add-on");
	const textBox = clickedContainer.querySelector("input");
	
	if (addOnService.target.matches("input")){
		textBox.checked = !textBox.checked;
	}

	if (clickedContainer.classList.contains("add-on") || addOnService.target.matches("div, span") || addOnService.target.matches("input")) {
		clickedContainer.classList.toggle("package-container-active");
		textBox.checked = !textBox.checked;
	}
}

function toggleSwitchState(e) {
	let parentContainer, subscription;
	e.target.value === "monthly"
		? (e.target.value = "yearly")
		: (e.target.value = "monthly");

	if (e.target.value === "monthly") {
		user.monthlySubscrition = true;
		user.yearlySubscrition = false;
	}
	if (e.target.value === "yearly") {
		user.monthlySubscrition = false;
		user.yearlySubscrition = true;
	}

	document.querySelectorAll("#service-cost").forEach((cost) => {
		billingPeriod = formElements.toggleSwitch.value;
		parentContainer = cost.closest(".package-container");
		subscription = parentContainer.dataset.coresubs;
		cost.textContent = availablePlans[subscription][billingPeriod];
	});
}

function setStep(step) {
	// * Hide nav buttons on last Step
	if (step === formLength) {
		formElements.nextButton.style.display = "none";
		formElements.backButton.style.display = "none";
	}

	const stepProperties = formSteps[step];
	formElements.stepTitle.innerText = stepProperties.title;
	formElements.stepSubtitle.innerText = stepProperties.Subtitle;
	console.log(stepProperties, "properties")
	formElements.nextButton.value = stepProperties.afterComplete;

	if (stepProperties.formToShow) {
		stepProperties.formToShow.style.display = "flex";
	}
	if (stepProperties.formToHide) {
		stepProperties.formToHide.style.display = "none";
	}
}

function nextStep(e) {
	e.preventDefault();
	console.log(e.target)
	if (Number(e.target.value) > formLength) return;
	storeFormData(Number(e.target.value));
	setStep(Number(e.target.value++));
}

function selectCoreSubscription(event) {
	let coreSubscription, active, clickedContainer;

	if (
		event.target.classList.contains("package-container") ||
		event.target.matches("img, span")
	) {
		formElements.coreSubs.forEach((divContainer) => {
			if (divContainer.classList.contains("package-container-active")) {
				divContainer.classList.remove("package-container-active");
			}
		});
		clickedContainer = event.target.closest(".package-container");
		coreSubscription = clickedContainer.dataset.coresubs;
		active = clickedContainer.dataset.active;
		if (!clickedContainer.classList.contains("package-container-active"))
			clickedContainer.classList.add("package-container-active");
	}
}

function storeFormData(step) {
	console.log(step,  "This is step")
	switch (step) {
		case formSteps[1].step:
			if(formElements.nameField.value || formElements.nameField.value || formElements.phoneField.value) {
				console.error("Fill'em up")
			}
			console.log(user)
			break;
		case formSteps[2].step:
			user.name = formElements.nameField.value;
			user.email = formElements.emailField.value;
			user.phone = formElements.phoneField.value;
			break;

		case formSteps[3].step:
			
			document.querySelectorAll("#addOnCost").forEach((addOnService, index) => {
				let currentPlan = document.querySelectorAll(".addOnInput")
				let subs = formElements.toggleSwitch.value
				currentPlan = currentPlan[index].dataset.service
				addOnService.textContent = addOnServices[currentPlan][subs];
			});


			break;
		case formSteps[4].step:
			console.log("Welcome to resume")

			if(formElements.toggleSwitch.value === "yearly") {
				document.querySelectorAll
			}
			// * set optional add ons
			break;
		case formSteps[5].step:
			// * Show resume
			break;
	}
}
