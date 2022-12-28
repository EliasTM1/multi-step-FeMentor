
import { addOnServices, availablePlans } from "./stepsDefinitions.js";
let personalInfoForm,
	frequencyformStep,
	addOnFormStep,
	finishStep,
	thankYouStep,
	currentStep,
	stepTitle,
	stepSubtitle,
	nextButton,
	backButton,
	nameField,
	emailField,
	phoneField,
	toggleSwitch,
	coreSubs,
	addOns,
	addOnInput,
	billingPeriod
	;

let user = {
	name: "",
	email: "",
	phone: "",
	currentStep: 0,
	baseSubscription: "",
	yearlySubscrition: false,
	monthlySubscrition: false,
	addOnServices: {
		onlineService: false,
		largerStorage: false,
		customProfile: false,
	},
};

// * Form steps
personalInfoForm = document.querySelector(".personal-data");
frequencyformStep = document.querySelector(".frequency-step");
addOnFormStep = document.querySelector(".add-on-step");
finishStep = document.querySelector(".finish-step");
thankYouStep = document.querySelector(".thank-you");
// * Form Headers
stepTitle = document.querySelector("#form-title");
stepSubtitle = document.querySelector("#form-description");
// * Form buttons
nextButton = document.querySelector("#next");
backButton = document.querySelector("#back");
// * Personal form fields
nameField = document.querySelector("#usrName");
emailField = document.querySelector("#usrMail");
phoneField = document.querySelector("#usrPhone");
// * Frequency form fields
toggleSwitch = document.querySelector("#toggle-switch");
coreSubs = document.querySelectorAll(".package-container");
// * Add ons
addOns = document.querySelectorAll(".add-on");
// * Event Listeners
nextButton.addEventListener("click", (e) => nextStep(e));
toggleSwitch.addEventListener("click", (e) => toggleSwitchState(e));
coreSubs.forEach((div) => {
	div.addEventListener("click", (event) => selectCoreSubscription(event));
});
addOns.forEach((addOn) => {
	addOn.addEventListener("click", (event) => includeAddOn(event));
});



function includeAddOn(addOnService) {
	// addOnService.preventDefault();
	addOnService.stopPropagation();

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
		billingPeriod = toggleSwitch.value;
		parentContainer = cost.closest(".package-container");
		subscription = parentContainer.dataset.coresubs;
		cost.textContent = availablePlans[subscription][billingPeriod];
	});

}



let formSteps = {
	1: {
		step: 1,
		title: "Personal info",
		Subtitle: "Please provide your name, email address, and phone number.",
		buttonText: "Next Step",
		formToShow: personalInfoForm,
	},
	2: {
		step: 2,
		title: "Select your plan",
		Subtitle: "You have the option of monthly or yearly billing.",
		buttonText: "Next Step",
		formToShow: frequencyformStep,
		formToHide: personalInfoForm,
	},
	3: {
		step: 3,
		title: "Pick add-ons",
		Subtitle: "Add-ons help enhance your gaming experience.",
		buttonText: "Next Step",
		formToShow: addOnFormStep,
		formToHide: frequencyformStep,
	},
	4: {
		step: 4,
		title: "Finishing up",
		Subtitle: "Double-check everything looks OK before confirming.",
		buttonText: "Confirm",
		formToShow: finishStep,
		formToHide: addOnFormStep,
	},
	5: {
		step: 5,
		title: "",
		Subtitle: "",
		buttonText: "",
		formToShow: thankYouStep,
		formToHide: finishStep,
	},
};

const formLength = Object.values(formSteps).length;
formSteps[1].afterComplete = formSteps[2].step;
formSteps[2].afterComplete = formSteps[3].step;
formSteps[3].afterComplete = formSteps[4].step;
formSteps[4].afterComplete = formSteps[5].step;

(function setIntialState() {
	user.currentStep = formSteps[2];
	setStep(user.currentStep.step);
})();

function setStep(step) {
	// * Hide nav buttons on last Step
	if (step === formLength) {
		nextButton.style.display = "none";
		backButton.style.display = "none";
	}

	const stepProperties = formSteps[step];
	stepTitle.innerText = stepProperties.title;
	stepSubtitle.innerText = stepProperties.Subtitle;
	nextButton.value = stepProperties.afterComplete;

	if (stepProperties.formToShow) {
		stepProperties.formToShow.style.display = "flex";
	}
	if (stepProperties.formToHide) {
		stepProperties.formToHide.style.display = "none";
	}
}

function nextStep(e) {
	e.preventDefault();
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
		coreSubs.forEach((divContainer) => {
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
	switch (step) {
		case formSteps[2].step:
			user.name = nameField.value;
			user.email = emailField.value;
			user.phone = phoneField.value;
			break;

		case formSteps[3].step:
			
			document.querySelectorAll("#addOnCost").forEach((addOnService, index) => {
				let currentPlan = document.querySelectorAll(".addOnInput")
				let subs = toggleSwitch.value
				currentPlan = currentPlan[index].dataset.service
				addOnService.textContent = addOnServices[currentPlan][subs];
			});


			break;
		case formSteps[4].step:
			// * set optional add ons
			break;
		case formSteps[5].step:
			// * Show resume
			break;
	}
}
