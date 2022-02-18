/**************************************************************************************************/
//    Product explanation		
//   ---------------
//		This product is a Dastabase reader and editor,
//		with the help of a module called run-func it runs individual functions instead of 
//		running the entire script ever time you run it in the terminal.
//		This metod is to increase user friendliness and add easier ways for user-input.
//
/*************************************************************************************************/
//
//    CLI SQLite3 database Management
//   ---------------------------------
//  * Dependencies needed for this to work
//      - Node.js v16.13.0      (Verify with "node -v" in the Terminal)
//          - Node.js can be found at https://nodejs.org/en/download/
//
//      - npm v8.1.3            (Verify with "npm -v" in the Terminal)
//          - npm can be installed via "npm install -g npm"
//
//      - Generate an empty npm project
//          - this can be done with "npm init -y"
//
//      - run-func
//          - run-fun can be installed via "npm i -g run-func"
//
//      - csv-parser is a module to create a readstream from CSV-files
//          - csv-parser can be installed with "npm install csv-parser"
//
//		- jest is a module to run tests on our code
//			- jest can be installed with "npm install --save-dev jest"
//
//
/**************************************************************************************************/
//
//     CLI Commands to Operate the Program
//    --------------------------------------
//      	Database Commands
//         -------------------
//
//      - run-func app.js showAllDatabaseData
//          - This command shows all Data currently existing in the database table.
//
//      - run-func app.js csvImportDataToDatabase
//          - This command imports all Data from the dataFill.csv file to the SQLite database.
//
//      - run-func app.js args_insertIntoDatabase ID Name Phone-number LastName Country
//          - This command INSERTs data declared in a variable into the SQLite database table.
//
//      - run-func app.js clearDatabaseFromData
//          - This command Clears the database from all data but doesnt drop the entire database nor does it delete the table.
//
//      - run-func app.js args_deleteRowFromDatabase <ID>
//          - This command Deletes a specific row from the database.
//
//      - run-func app.js args_editDataInDatabase <Name> <Phone-number> <LastName> <Country> <ID>
//          - This command Edits specific data in the database table, row is defined by the ID given.
//
//			Other Commands (logic based for Unit-testing)
//		   ----------------
//	
//		- run-func app.js checkIDdatabase <input number>
//			- This command checks the current database if the Input number is currently in the database in form of an ID.
//			- Input Example - 35 , 12 , 3 , 29
//
//		- run-func app.js args_PhoneNumbersOnly <input>
// 			- This command checks the input given if it contains special characters then if the input contains anything but a number.
//			- Input Example - 1234567 , 13!?556, 123ABCD312
//
//		- run-func app.js args_CountryInput <input>
// 			- This command checks if the input is a valid Nordic country (the valid countrys are contained in an array in the function, input can be both lower and uppercase.)
//			- Input Example - sweden, Norge, FINLAND 
//
//		- run-func app.js args_nameInputCheck <input>
// 			- This command checks if the input (name) is a variable containing only text with only a specific few special characters allowed.
//			- Input Example - Jimmy, Karl-alfred, 4l3x
//
/**************************************************************************************************/
//
//      NOTES on navigating the program.
//     ----------------------------------
//
//      - using csvImportDataToDatabase can only be done when the database is empty!
//
//      - using args_insertIntoDatabase REQUIERS a Unique ID
//
//		- Due to structure of this code and modules needed to run it, its not fit for JSDOC
//
/**************************************************************************************************/
//
//      TODO
//     ------
//		
//		- Add error handeling to functions interatcting with SQLite
//
//		- Fix Bug where - run-func app.js checkIDdatabase didnt work as intended.
//
//      - Manage to break out convertIDsToArray into two seperate working functions
//
//      - Create a function to save database to external file.
//
/**************************************************************************************************/

/**
 *  Here we initiate the requiered dependencies / Modules.
 *  @param {*} csvParser - This loads the csv-parser module.
 *  @param {*} fs - This loads the fs module.
 *  @param {*} sqlite3 - This loads the sqlite3 module.
 */
const csvParser = require("csv-parser")
const fs = require("fs")
const sqlite3 = require("sqlite3").verbose()

/**
 *  open database in memory ( Select the local .db file).
 *  @param {*} database - This is the paramater where we choose what local database we open, in this case "mydb.db".
 */
let database = new sqlite3.Database("mydb.db", (error) => {
	if (error) {
		return console.error(error.message)
	}
})

/**
 *  This function sends the SELECT * FROM table to SQLite and returns the result.
 *  @param {string} showAllDatabaseData - This is the command sent to SQLite.
 * 
 */
module.exports.showAllDatabaseData = function () {
	let showAllDatabaseData = `SELECT * FROM customers`;
	database.all(showAllDatabaseData, [], (error, rows) => {
		if (error) {
			throw error
		}
		rows.forEach((row) => {
			console.log(row)
		})
		console.log("\x1b[33m%s\x1b[0m", "All data in the database is being displayed!")
	})

	// close the database connection
	database.close((error) => {
		if (error) {
			return console.error(error.message)
		}
	})

	// This little function kills the server after 0.1 seconds so you dont have to manually cancel it.
	setTimeout(function () {
		process.exit(1)
	}, 100)
};

/**
 * This function is for importing data from a CSV file into Node.js then sending it into SQLite
 *  @param {string} csvImportDataToDatabase - This is the command sent to SQLite.
 *  @param {string} filepath -  Here we declare the csv-file we want to load in data from.
 * 
 */
module.exports.csvImportDataToDatabase = function () {
	const filepath = "./dataFill.csv"
	let csvImportDataToDatabase = `INSERT INTO customers(ID, Name, Phone, LastName, Country) VALUES(?, ?, ?, ?, ?) `;
	fs.createReadStream(filepath)
		.on("error", () => {
			// handle error
		})
		.pipe(csvParser())
		.on("data", (row) => {
			database.run(csvImportDataToDatabase, row, function (error) {
				if (error) {
					console.log("\x1b[31m%s\x1b[0m", "Remember that when importing data, the database needs to be empty!"
					)
					throw error
				}
				console.log("\x1b[33m%s\x1b[0m", "All data from the csv-file has been imported to the database!"
				)
			})
			// close the database connection
			database.close((error) => {
				if (error) {
					return console.error(error.message)
				}
			})
		})
		.on("end", () => {
			// handle end of CSV
		})
	// This little function kills the server after 0.1 seconds so you dont have to manually cancel it.
	setTimeout(function () {
		process.exit(1)
	}, 100)
};

/**
 * This function inserts data Into the SQLite database table.
 * the ID must be Unique and is a Key value so if the database is populated it must be set to a non-existing data entry.
 * @param {Array} userInput - This variable contains the data inserted into the database.
 * @param {string} insertIntoDatabase - This is the command sent to SQLite.
 */
module.exports.insertIntoDatabase = function (userInput) {
	let insertIntoDatabase = `INSERT INTO customers(ID, Name, Phone, LastName, Country) VALUES(?, ?, ?, ?, ?) `;
	database.run(insertIntoDatabase,userInput,function (error) {
			if (error) {
				console.log("\x1b[31m%s\x1b[0m", "Remember that when INSERTing data, the ID is a keyvalue and needs to be Unique!"
				)
				throw error
				
			}
			console.log("\x1b[33m%s\x1b[0m", "New Data has been Inserted!")
		}
	)
	// close the database connection
	database.close((error) => {
		if (error) {
			return console.error(error.message)
		}
	})
	// This little function kills the server after 0.1 seconds so you dont have to manually cancel it.
	setTimeout(function () {
		process.exit(1)
	}, 100)
};

/**
 *  This is the ARGS part of insert function, it takes user input and trims it for uses in the insertIntoDatabase function.
 *  @param {*} userInput - This variable takes argv terminal input.
 *
 */
module.exports.args_insertIntoDatabase = function () {
	const userInput = process.argv.slice(3);
	//This Shift Removes the run-func function argument from the output
	userInput.shift();
	console.log(userInput)
	module.exports.insertIntoDatabase(userInput);	
};

/** 
 * This function Clears the database from data but it doesnt drop the database nor removes the existing table.
 * @param {string} clearDatabaseFromData - This is the command sent to SQLite.
 */
module.exports.clearDatabaseFromData = function () {
	let clearDatabaseFromData = "DELETE FROM customers;";
	database.run(clearDatabaseFromData, function (error) {
		if (error) {
			throw error
		}
		console.log("\x1b[33m%s\x1b[0m", "The database has been cleared")
	})

	// close the database connection
	database.close((error) => {
		if (error) {
			return console.error(error.message)
		}
	})
	// This little function kills the server after 0.1 seconds so you dont have to manually cancel it.
	setTimeout(function () {
		process.exit(1)
	}, 100)
};

// This function Clears the database from data but it doesnt drop the database nor removes the existing table.
module.exports.deleteRowFromDatabase = function (userInput) {
	let clearDatabaseFromData = "DELETE FROM customers WHERE ID IN ("+userInput+")";
	database.run(clearDatabaseFromData, function (error) {
		if (error) {
			throw error
		}
		console.log("\x1b[33m%s\x1b[0m", "The Specified row has been deleted!")
	})

	// close the database connection
	database.close((error) => {
		if (error) {
			return console.error(error.message)
		}
	})
	// This little function kills the server after 0.1 seconds so you dont have to manually cancel it.
	setTimeout(function () {
		process.exit(1)
	}, 100)
};

// This is the ARGS part of the delete row function, it takes user input and uses it in the function.
module.exports.args_deleteRowFromDatabase = function () {
	const userInput = process.argv.slice(3);
	//This Shift Removes the run-func function argument from the output
	userInput.shift();
	module.exports.deleteRowFromDatabase(userInput);	
};

// This function Edits data in the table.
// the ID must be Unique and is a Key value so if the database is populated it must be set to a non-existing data entry.
//let chooseIDToEdit;
module.exports.editDataInDatabase = function (chooseIDToEdit, userInput) {
	let editDataInDatabase = "UPDATE customers SET Name=?, Phone=?,LastName=?, Country=? WHERE ID ="+chooseIDToEdit;
	database.run(
		editDataInDatabase,
		userInput,
		function (error) {
			if (error) {
				throw error
			}
			console.log("\x1b[33m%s\x1b[0m", "Data has been updated!")
		}
	)
	// close the database connection
	database.close((error) => {
		if (error) {
			return console.error(error.message)
		}
	})
	// This little function kills the server after 0.1 seconds so you dont have to manually cancel it.
	setTimeout(function () {
		process.exit(1)
	}, 100)
};
// This is the ARGS part of the edit (UPDATE), it takes user input and uses it in the function.
module.exports.args_editDataInDatabase = function () {
	const userInput = process.argv.slice(3);
	//This Shift Removes the run-func function argument from the output
	userInput.shift();
	//This takes the ID given and puts it into a variable used in editDataInDatabase
	chooseIDToEdit = userInput.pop();
	console.log(userInput)
	module.exports.editDataInDatabase(chooseIDToEdit, userInput);	
};

// ----------------------------------------------------------------------------------------------------------------------------------------
// Here ends The Normal Database - interaction functions.
// ----------------------------------------------------------------------------------------------------------------------------------------

// checkIDdatabase is a SQL tied function to check if the ID given via Args is in the database or not.
// To use this function use:
// run-func app.js checkIDdatabase <input>
// remember that the given input is checked towards the current mydb.db database if it is there or is not.
// example input is a number 1 or above.
// NOTE** max sample data size ready to be imported has a ID as high as 40.

let idsInDatabase = [];
module.exports.checkIDdatabase = function () {
	const args = process.argv.slice(4);
	console.log(args)
	let showIDDatabaseData = `SELECT ID FROM customers`;
	database.all(showIDDatabaseData, [], (error, rows) => {
		if (error) {
			throw error
		}
		else {
			idsInDatabase = rows.map(function (obj) {
				return obj.ID
			});
			if (idsInDatabase.includes(Number(args))) {
				console.log("It does")
			} else {
				console.log("It does NOT")
			}
		}
	});
	// close the database connection
	database.close((error) => {
		if (error) {
			return console.error(error.message)
		}
	})
	// This little function kills the server after 0.1 seconds so you dont have to manually cancel it.
	setTimeout(function () {
		process.exit(1)
	}, 100)
};

/*
THIS COMMENTED OUT PART IS A WORK IN PROGRESS AND IS SO FAR UNSUCCESSFUL
// convertIDsToArray is my attempt to split the above (checkIDdatabase) function into two functions for testability but so-far it has failed.
module.exports.convertIDsToArray = function () {
	let showIDDatabaseData = `SELECT ID FROM customers`;
	database.all(showIDDatabaseData, [], (error, rows) => {
		if (error) {
			throw error
		}
		else {
			idsInDatabase = rows.map(function (obj) {
				return obj.ID				
			});
			console.log(idsInDatabase)
		}
	});
	// close the database connection
	database.close((error) => {
		if (error) {
			return console.error(error.message)
		}
	})
	// This little function kills the server after 0.1 seconds so you dont have to manually cancel it.
	setTimeout(function () {
		process.exit(1)
	}, 100)
};

// doesArrayIncludeID is the second part of the above function to try and split checkIDdatabase into two testable functions.
// doesArrayIncludeID currently checks if input argument via args is contained in the bellow array.
// To use this function use:
// run-func app.js doesArrayIncludeID <input>
// <input> example input could be any number, string or number.
// other characters will not pass since its checking towards a array if the pre-set data is there.

module.exports.doesArrayIncludeID = function () {
	const args = process.argv.slice(4);
	console.log(args)
	console.log(sampleID)
		if (sampleID.includes(Number(args))) {
			console.log("It does")
		} else {
			console.log("It does NOT")
		}
};

*/

// invalidPhoneInputCheck  is a function to check a variable if it contains special characters then checks if its only a number.
// To use this function use:
// run-func app.js args_PhoneNumbersOnly <input>
// <input> example input should be any form of input but should only pass if the input is only numbers.

module.exports.invalidPhoneInputCheck = function (phoneInputCheck) {	
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
// This is the ARGS part of the PhoneNumbersOnly function, it takes user input and uses it in the function.
// args_PhoneNumbersOnly is a function to take in Args and put it thru the invalidPhoneInputCheck and see if whats written passes or not.
module.exports.args_PhoneNumbersOnly = function () {
	let phoneInputCheck = [];
	const args = process.argv.slice(3);
	phoneInputCheck.push(args)
	//This Shift Removes the run-func function argument from the output
	args.shift();
	console.log(args);
	module.exports.invalidPhoneInputCheck(phoneInputCheck);	
};

// invalidCountryInputCheck is a function to check if the country given is in the list for valid nordic countries for the product.
// invalidCountryInputCheck currently checks if input argument via args is contained in the bellow array.
// To use this function use:
// run-func app.js args_CountryInput <input>
// <input> example input could be a country contained in the array, lower or uppercase.

module.exports.invalidCountryInputCheck = function(countryInputCheck) {
	let countrys = ["sverige", "sweden", "danmark", "denmark", "norge", "norway", "finland", "island", "iceland"];
	if (countrys.some(v => countryInputCheck.includes(v))) {
		console.log("You have entered a valid Nordic Country.")
	}
	else {
		console.log("Sorry, please provide a valid nordic Country.")
	}
};

// This is the ARGS part of the CountryInput function, it takes user input and uses it in the function.
// args_CountryInput is a function to take in Args and put it thru the invalidCountryInputCheck and see if whats written passes or not.
module.exports.args_CountryInput = function () {
	let countryInputCheck = [];
	const args = process.argv.slice(3);
	countryInputCheck += countryInputCheck.push(args)
	countryInputCheck += countryInputCheck.toLowerCase();
	//This Shift Removes the run-func function argument from the output
	args.shift();
	console.log(args);
	module.exports.invalidCountryInputCheck(countryInputCheck);	
};

// nameInputCheck is a function to check if the name given doesnt include valid characters then if it contains numbers. 
// To use this function use:
// run-func app.js args_nameInputCheck <input>
// <input> example input could be Jimmy, m4rtin, a!ex, karl-alfred

module.exports.nameInputCheck = function (nameInputCheck) {
	var format = /[!@#$%^&*()_+\=\[\]{};:"\\|,.<>\/?]/;
	if (format.test(nameInputCheck)) {
		console.log("The name contains invalid characters, - and ' is allowed.")
	}
	else if (isText = /\d/.test(nameInputCheck)){
		console.log("The name contains numbers, only letters, - and ' is allowed.")

	}
	else {
		console.log("Name Input is Valid!")
	}
}

// This is the ARGS part of the nameInputCheck function, it takes user input and uses it in the function.
// args_nameInputCheck is a function to take in Args and put it thru the nameInputCheck and see if whats written passes or not.
module.exports.args_nameInputCheck = function () {
	let nameInputCheck = [];
	const args = process.argv.slice(3);
	nameInputCheck.push(args)
	//This Shift Removes the run-func function argument from the output
	args.shift();
	console.log(args);
	module.exports.nameInputCheck(nameInputCheck);	
};

// variableLengthCheck is a function to check if the name given doesnt exceed or subceed the requierd amount of letters.
// To use this function use:
// run-func app.js args_variableLengthCheck <input>
// <input> example input could a text of diffrent variable length. anything between 2 and 24 is passed.

module.exports.variableLengthCheck = function (userInput) {
	userInput = userInput.join();
	if (userInput.length >= 2 && userInput.length < 25) {
		console.log("Variable has a valid amount of characters.")
        return true;
}	else {
		console.log("The input you entered has to few or too many characters.")
        return false;
}};

// This is the ARGS part of the variableLengthCheck function, it takes user input and uses it in the function.
module.exports.args_variableLengthCheck = function () {
	let userInput = [];
	const args = process.argv.slice(3);
	userInput.push(args)
	//This Shift Removes the run-func function argument from the output
	args.shift();
	console.log(args);
	module.exports.variableLengthCheck(userInput);	
};
