/**
 * invalidPhoneInputCheck  is a function to check a variable if it contains special characters then checks if its only a number.
 * @param {string} phoneInputCheck - user input conntained in a variable
 * @param {string} format - what the user input is tested against (non allowed special characters)
 * @param {RegExp} isNumber - testing if the user input is anything but a number.
 */

invalidPhoneInputCheck = function (phoneInputCheck) {	
	// Variable to check for special characters
	var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
	// If statement to check input for special characters
		if (format.test(phoneInputCheck)) {
			console.log("Phone input contains invalid special characters");
			return false;
		}	
		// If statement to check if input is only numbers
		else if (isNumber = /^\d+$/.test(phoneInputCheck)) {
			console.log("Passed all tests");
			return true;
		}
		else {
			console.log("Phone input contains Invalid Characters")
			return false;
	}
};

/**
 * invalidCountryInputCheck is a function to check if the country given is in the list for valid nordic countries for the product.
 * @param {string} countryInputCheck - user input conntained in a variable
 * @param {Array} countrys - Array containing valid countrys, user input is checked against this.
 */
invalidCountryInputCheck = function(countryInputCheck) {
	let countrys = ["sverige", "sweden", "danmark", "denmark", "norge", "norway", "finland", "island", "iceland"];
	if (countrys.some(v => countryInputCheck.includes(v))) {
		console.log("You have entered a valid Nordic Country.")
        return true;
	}
	else {
		console.log("Sorry, please provide a valid nordic Country.")
        return false;
	}
};

/**
 * nameInputCheck is a function to check if the name given doesnt include valid characters then if it contains numbers. 
 * @param {String} nameInputCheck - user input conntained in a variable 
 * @param {String} format - what the user input is tested against (non allowed special characters)
 * @param {RegExp} isText - testing if the user input is anything but a text and allowed characters.
 */
nameInputCheck = function (nameInputCheck) {
	var format = /[!@#$%^&*()_+\=\[\]{};:"\\|,.<>\/?]/;
	if (format.test(nameInputCheck)) {
		console.log("The name contains invalid characters, - and ' is allowed.")
        return false;
	}
	else if (isText = /\d/.test(nameInputCheck)){
		console.log("The name contains numbers, only letters, - and ' is allowed.")
        return false;
	}
	else {
		console.log("Name Input is Valid!")
        return true;
	}
}

/**
 * variableLengthCheck is a function to check if the name given doesnt exceed or subceed the requierd amount of letters.
 * @param {String} userInput - user input conntained in a variable 
 */
variableLengthCheck = function (userInput) {
	if (userInput.length >= 2 && userInput.length < 25) {
		console.log("Variable has a valid amount of characters.")
        return true;
}	else {
		console.log("The input you entered has to few or too many characters.")
        return false;
}};

module.exports = {
    invalidPhoneInputCheck,
    invalidCountryInputCheck,
    nameInputCheck,
    variableLengthCheck
}