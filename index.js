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
	addOnCost: document.querySelectorAll("#addOnCost"),
	serviceCosts: document.querySelectorAll("#service-cost"), 
	resume :{
		coreSubscription: document.getElementById("resume-core"),
		changeBasket: document.getElementById("resume-back"),
		corePrice: document.getElementById("core-price"),
		addOname: document.getElementById("resume-addon"),
		addOnPrice: document.getElementById("resume-addOn-price"),
		billingFrequency: document.getElementById("resume-frequency"),
		total: document.getElementById("total"),
	}

};

// * Event Listeners
formElements.nextButton.addEventListener("click", () => form.nextStep());
formElements.backButton.addEventListener("click", (e) => form.goback(e));
formElements.nameField.addEventListener("input", (e) => form.validateName(e));
formElements.emailField.addEventListener("input", (e) => form.validateEmail(e));
formElements.phoneField.addEventListener("input", (e) => form.validatePhone(e));
formElements.toggleSwitch.addEventListener("click", (e) => form.toggleSwitchState(e));
formElements.coreSubs.forEach((div) => { div.addEventListener("click", (event) => form.selectCoreSubscription(event));});
formElements.addOns.forEach((addOn) => {addOn.addEventListener("click", (event) => form.includeAddOn(event));});
formElements.resume.changeBasket.addEventListener('click', () => form.changeShoppingCart())
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
		// TODO : Change the defailt billing period in case the user has no previous progress
		user.billingFrequency = "monthly"
		user.baseSubscription = "arcade"
	}

	goback() {
		this.currentStep--;
		user.currentStep = this.currentStep;
		this.removeCurrentView();
		this.setStep();
	}

	nextStep() {
		if (!this.isFormValid || !this.validateSteps()) return;
		this.currentStep++;
		user.currentStep = this.currentStep;
		this.removeCurrentView();
		this.setStep();
	}


	validateSteps() {
		console.log("This is my current", this.currentStep)
		return true 
	}

	setInvalidForm(){
		this.isFormValid = false;
		formElements.nextButton.disabled = true;
		formElements.nextButton.classList.add("disabled");
	}

	setValidForm(){
		this.isFormValid = true;
		formElements.nextButton.disabled = false;
		formElements.nextButton.classList.remove("disabled");
	}

	changeShoppingCart() {
		this.currentStep = 2;
		this.removeCurrentView()
		this.setStep()

	}


	updateBill() {
		let coreSubs = this.capitalizer(user.baseSubscription);
		let coreFreq = this.capitalizer(user.billingFrequency);
		formElements.resume.coreSubscription.innerText = `${coreSubs} (${coreFreq})`;
		formElements.resume.corePrice.innerText = availablePlans[user.baseSubscription][user.billingFrequency]
		
	}

	capitalizer (lowerString) {
		return lowerString.charAt(0).toUpperCase() + lowerString.slice(1);
	}

	validateName(event) {
		let name = event.target.value;
		let nameLength = event.target.value.length;
		if (name === "" || nameLength <= 2) {
			user.name = "";
			formElements.nameField.classList.add("invalid-form-field");
			formElements.nameField.classList.remove("valid-form-field");
			this.setInvalidForm()
			return;
		}
		user.name = name;
		formElements.nameField.classList.add("valid-form-field");
		formElements.nameField.classList.remove("invalid-form-field");
		this.setValidForm()
		return;
	}

	validateEmail(event) {
		let email = event.target.value;
		const regex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

		if (!regex.test(email)) {
			user.email = "";
			formElements.emailField.classList.add("invalid-form-field");
			formElements.emailField.classList.remove("valid-form-field");
			this.setInvalidForm()
			return;
		}

		user.email = email;
		formElements.emailField.classList.add("valid-form-field");
		formElements.emailField.classList.remove("invalid-form-field");
		this.setValidForm()
		return;
	}

	validatePhone(event) {
		const phoneField = event.target.value;
		const regex = /^\(?[\d\s]{4}\)?[\d\s]{4}[\d\s]{3}$/;
		if (!regex.test(phoneField)) {
			user.phone = "";
			formElements.phoneField.classList.add("invalid-form-field");
			formElements.phoneField.classList.remove("valid-form-field");
			this.setInvalidForm()
			return;
		}
		user.phone = phoneField;
		formElements.phoneField.classList.add("valid-form-field");
		formElements.phoneField.classList.remove("invalid-form-field");
		this.setValidForm()
		return;
	}



	selectCoreSubscription(event) {
		let clickedContainer, coreSubscription, active, subscription = event.target

		if (
			subscription.classList.contains("package-container") ||
			subscription.matches("img, span")
		) {
			formElements.coreSubs.forEach((divContainer) => {
				if (divContainer.classList.contains("package-container-active")) {
					divContainer.classList.remove("package-container-active");
				}
			});
			clickedContainer = subscription.closest(".package-container");
			coreSubscription = clickedContainer.dataset.coresubs;
			active = clickedContainer.dataset.active;
			user.baseSubscription = coreSubscription;
			if (!clickedContainer.classList.contains("package-container-active"))
				clickedContainer.classList.add("package-container-active");
		}
		this.setValidForm()
	}

	toggleSwitchState(e) {
		let parentContainer, subscription;
		e.target.value === "monthly"
			? (e.target.value = "yearly")
			: (e.target.value = "monthly");
		e.target.value === "monthly"
			? (user.billingFrequency = "monthly")
			: (user.billingFrequency = "yearly");

		formElements.serviceCosts.forEach((cost) => {
			billingPeriod = formElements.toggleSwitch.value;
			parentContainer = cost.closest(".package-container");
			subscription = parentContainer.dataset.coresubs;
			cost.textContent = availablePlans[subscription][billingPeriod];
		});
	}

	includeAddOn(addOnService) {
		let addOn = addOnService.target.closest(".add-on");
		let serviceContainer = {
			price : addOn.querySelector("#addOnCost span").innerText,
			checkBox: addOn.querySelector("input"),
			serviceTitle: addOn.querySelector(".addon-description span").innerText,
			toggle: addOn.classList.toggle( "package-container-active" ),
			get service() {
				return { price : this.price  , service: this.serviceTitle };
			},
		};

		serviceContainer.toggle;
		serviceContainer.checkBox.checked = !serviceContainer.checkBox.checked;

		if (serviceContainer.checkBox.checked) {
			user.addOnServices.push(serviceContainer.service);
			console.log(user.addOnServices, "user.addOnServices")
			this.setValidForm()
			return;
		}

		user.addOnServices = user.addOnServices.filter((service) => service.service !== serviceContainer.serviceTitle);
		if (user.addOnServices.length === 0) this.setInvalidForm()
	}

	// * Circles with numbers on the left side
	activeFormStep() {
		let steps = document.querySelectorAll(".step-number");
		this.currentStep === this.formStepsLength
			? steps[steps.length - 1].classList.add("step-number-active")
			: steps[this.currentStep - 1].classList.add("step-number-active");
	}

	removeCurrentView() {
		const currentView = document.querySelector('.form-wrapper > *[style*="display: flex"]');
		const currentStep = document.querySelector(".step-number-active");
		if (currentStep) currentStep.classList.remove("step-number-active");
		currentView.style.display = "none";
	}

	setStep() {
		this.activeFormStep();
		// * Back button display management
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
		
		if (currentFormConfig.title === "Select your plan" ) this.setInvalidForm()
		
		// this.updateBill();
	}
}
// ! Finish class implementation

let form = new MultiStepForm("multiStepForm", formSteps);
form.checkForProgress();
