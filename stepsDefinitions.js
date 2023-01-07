export const addOnServices = {
	onlineService: {
		serviceName: "Online Service",
		monthly: 1,
		yearly: 10
	},
	largerStorage: {
		serviceName: "Larger storage",
		monthly: 2,
		yearly: 20,
	},
	customProfile: {
		serviceName: "Customizable profile",
		monthly: 2,
		yearly: 20,
	},
};

export const availablePlans = {
	arcade: {
		monthly: "$9/mo",
		yearly: "$90/yr",
		freeMonths: "2 months free",
	},
	advanced: {
		monthly: "$12/mo",
		yearly: "$120/yr",
		freeMonths: "2 months free",
	},
	pro: {
		monthly: "$15/mo",
		yearly: "$150/yr",
		freeMonths: "2 months free",
	},
};

export let user = {
	name: "",
	email: "",
	phone: "",
	currentStep: 0,
	baseSubscription: "",
	billingFrequency : "",
	addOnServices: [],
};

