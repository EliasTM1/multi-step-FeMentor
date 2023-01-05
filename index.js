import { addOnServices, availablePlans, user } from "./stepsDefinitions.js";

let billingPeriod;

const formElements = {
	personalInformationForm: document.querySelector(".personal-data"),
	frequencyformStep: document.querySelector(".frequency-step"),
	addOnFormStep: document.querySelector(".add-on-step"),
	finishStep: document.querySelector(".finish-step"),
	thankYouStep: document.querySelector(".thank-you"),
	stepTitle: document.querySelector("#form-title"),
	stepSubtitle: document.querySelector("#form-description"),
	nextButton: document.querySelector("#next"),
	backButton: document.querySelector("#back"),
	nameField: document.querySelector("#nameField"),
	emailField: document.querySelector("#emailField"),
	phoneField: document.querySelector("#phoneField"),
	toggleSwitch: document.querySelector("#toggle-switch"),
	coreSubs: document.querySelectorAll(".package-container"),
	addOns: document.querySelectorAll(".add-on"),
};

// * Event Listeners
formElements.nextButton.addEventListener("click", () => form.nextStep());
formElements.backButton.addEventListener("click", (e) => form.goback(e));
formElements.toggleSwitch.addEventListener("click", (e) =>
	form.toggleSwitchState(e)
);
formElements.coreSubs.forEach((div) => {
	div.addEventListener("click", (event) => form.selectCoreSubscription(event));
});
formElements.addOns.forEach((addOn) => {
	addOn.addEventListener("click", (event) => form.includeAddOn(event));
});
formElements.nameField.addEventListener("input", (e) => form.validateName(e));
formElements.emailField.addEventListener("input", (e) => form.validateEmail(e));
formElements.phoneField.addEventListener("input", (e) => form.validatePhone(e));

let formSteps = {
	1: {
		step: 1,
		title: "Personal info",
		Subtitle: "Please provide your name, email address, and phone number.",
		buttonText: "Next Step",
		formToShow: formElements.personalInformationForm,
		afterComplete: 2,
	},
	2: {
		step: 2,
		title: "Select your plan",
		Subtitle: "You have the option of monthly or yearly billing.",
		buttonText: "Next Step",
		formToShow: formElements.frequencyformStep,
		formToHide: formElements.personalInformationForm,
		afterComplete: 3,
	},
	3: {
		step: 3,
		title: "Pick add-ons",
		Subtitle: "Add-ons help enhance your gaming experience.",
		buttonText: "Next Step",
		formToShow: formElements.addOnFormStep,
		formToHide: formElements.frequencyformStep,
		afterComplete: 4,
	},
	4: {
		step: 4,
		title: "Finishing up",
		Subtitle: "Double-check everything looks OK before confirming.",
		buttonText: "Confirm",
		formToShow: formElements.finishStep,
		formToHide: formElements.addOnFormStep,
		afterComplete: 5,
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

// !Start class implementation
// !Start class implementation
// !Start class implementation
// !Start class implementation
// !Start class implementation

class MultiStepForm {
	constructor(formId, formDefinitions) {
		this.form = document.getElementById(formId);
		this.form.addEventListener("submit", this.handleSubmit.bind(this));
		this.formStepsLength = Object.values(formDefinitions).length;
		this.currentStep = 1;
		this.currentFormConfig = formSteps[this.currentStep];
	}

	currentView = formSteps[this.currentStep];
	isFormValid = false;
	handleSubmit(event) {
		event.preventDefault();
	}

	checkForProgress() {
		this.setStep(this.currentStep);
	}

	goback() {
		this.currentStep--;
		user.currentStep = this.currentStep;
		this.removeCurrentView();
		this.setStep();
	}

	nextStep() {
		if (!this.isFormValid) return;
		this.currentStep++;
		user.currentStep = this.currentStep;
		this.removeCurrentView();
		this.setStep();
	}

	validateName(event) {
		let name = event.target.value;
		let nameLength = event.target.value.length;
		if (name === "" || nameLength <= 2) {
			user.name = "";
			this.isFormValid = false;
			formElements.nextButton.disabled = true;
			formElements.nextButton.classList.add("disabled");
			formElements.nameField.classList.add("invalid-form-field");
			formElements.nameField.classList.remove("valid-form-field");
			return;
		}
		user.name = name;
		this.isFormValid = true;
		formElements.nextButton.disabled = false;
		formElements.nextButton.classList.remove("disabled");
		formElements.nameField.classList.add("valid-form-field");
		formElements.nameField.classList.remove("invalid-form-field");
		return;
	}

	validateEmail(event) {
		let email = event.target.value;
		const regex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

		if (!regex.test(email)) {
			user.email = "";
			this.isFormValid = false;
			formElements.nextButton.disabled = true;
			formElements.nextButton.classList.add("disabled");
			formElements.emailField.classList.add("invalid-form-field");
			formElements.emailField.classList.remove("valid-form-field");
			return;
		}

		user.email = email;
		this.isFormValid = true;
		formElements.nextButton.disabled = false;
		formElements.nextButton.classList.remove("disabled");
		formElements.emailField.classList.add("valid-form-field");
		formElements.emailField.classList.remove("invalid-form-field");
		return;
	}

	validatePhone(event) {
		const phoneField = event.target.value;
		const regex = /^\(?[\d\s]{4}\)?[\d\s]{3}[\d\s]{4}$/;
		if (!regex.test(phoneField)) {
			user.phone = "";
			this.isFormValid = false;
			formElements.nextButton.disabled = true;
			formElements.nextButton.classList.add("disabled");
			formElements.phoneField.classList.add("invalid-form-field");
			formElements.phoneField.classList.remove("valid-form-field");
			return;
		}
		user.phone = phoneField;
		this.isFormValid = true;
		formElements.nextButton.disabled = false;
		formElements.nextButton.classList.remove("disabled");
		formElements.phoneField.classList.add("valid-form-field");
		formElements.phoneField.classList.remove("invalid-form-field");
		return
	}

	selectCoreSubscription(event) {
		let clickedContainer, coreSubscription, active;

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
			user.baseSubscription = coreSubscription;
			if (!clickedContainer.classList.contains("package-container-active"))
				clickedContainer.classList.add("package-container-active");
		}
	}

	toggleSwitchState(e) {
		let parentContainer, subscription;
		e.target.value === "monthly"
			? (e.target.value = "yearly")
			: (e.target.value = "monthly");

		if (e.target.value === "monthly") {
			user.billingFrequency = "monthly";
		}
		if (e.target.value === "yearly") {
			user.billingFrequency = "yearly";
		}

		document.querySelectorAll("#service-cost").forEach((cost) => {
			billingPeriod = formElements.toggleSwitch.value;
			parentContainer = cost.closest(".package-container");
			subscription = parentContainer.dataset.coresubs;
			cost.textContent = availablePlans[subscription][billingPeriod];
		});
	}

	includeAddOn(addOnService) {
		const clickedContainer = addOnService.target.closest(".add-on");
		const textBox = clickedContainer.querySelector("input");

		if (addOnService.target.matches("input")) {
			textBox.checked = !textBox.checked;
		}

		if (
			clickedContainer.classList.contains("add-on") ||
			addOnService.target.matches("div, span") ||
			addOnService.target.matches("input")
		) {
			clickedContainer.classList.toggle("package-container-active");
			textBox.checked = !textBox.checked;
		}
	}

	activeFormStep() {
		let steps = document.querySelectorAll(".step-number");
		this.currentStep === this.formStepsLength
			? steps[steps.length - 1].classList.add("step-number-active")
			: steps[this.currentStep - 1].classList.add("step-number-active");
	}

	removeCurrentView() {
		const currentView = document.querySelector(
			'.form-wrapper > *[style*="display: flex"]'
		);
		const currentStep = document.querySelector(".step-number-active");
		if (currentStep) {
			currentStep.classList.remove("step-number-active");
		}
		currentView.style.display = "none";
	}

	setStep() {
		this.activeFormStep();

		if (this.currentStep === 1) {
			formElements.backButton.style.display = "none";
			formElements.nextButton.style.display = "block";
		} else if (this.currentStep === this.formStepsLength) {
			formElements.nextButton.style.display = "none";
			formElements.backButton.style.display = "none";
		} else {
			formElements.backButton.style.display = "block";
		}

		// * Hide nav buttons on last Step
		const currentFormConfig = formSteps[this.currentStep];

		// * Set the titles of curent Step step
		formElements.stepTitle.innerText = currentFormConfig.title;
		formElements.stepSubtitle.innerText = currentFormConfig.Subtitle;
		currentFormConfig.formToShow.style.display = "flex";

		// * Show/hide corresponding step
		if (currentFormConfig.formToHide) {
			currentFormConfig.formToHide.style.display = "none";
		}
	}
}
// ! Finish class implementation
// ! Finish class implementation
// ! Finish class implementation
// ! Finish class implementation
// ! Finish class implementation

let form = new MultiStepForm("multiStepForm", formSteps);
form.checkForProgress();
