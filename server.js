var http = require("http");
var url = require("url");

const {
	register,
	addMoney,
	payMoney,
	checkTollStation,
	checkMoney,
	listTransaction,
	Validator,
} = require("./function");

getPost = async (req) => {
	return new Promise((resolve) => {
		let req_input = [];
		req
			.on("data", (chunk) => {
				req_input.push(chunk);
			})
			.on("end", () => {
				let req_obj = JSON.parse(Buffer.concat(req_input).toString());
				resolve(req_obj);
			});
	});
};

http
	.createServer(async function (req, res) {
		var path = url.parse(req.url, true);

		var message = "";
		var data;
		var status = 200;

		let response_object = {
			statusCode: status,
			message: message,
			data: data,
		};

		switch (path.pathname) {
			case "/register":
				try {
					if (req.method == "POST") {
						let data = await getPost(req);
						let { firstname, lastname, address, phone, email, money } = data;
						if (
							new Validator(firstname).regName.test(firstname) &&
							new Validator(lastname).regName.test(lastname) &&
							new Validator(address).regAddress.test(address) &&
							new Validator(phone).regPhone.test(phone) &&
							new Validator(email).regEmail.test(email) &&
							new Validator(money).regMoney.test(money)
						) {
							response_object.data = await register(data);
							response_object.message = "success";
						} else {
							if (!new Validator(firstname).regName.test(firstname)) {
								response_object.message = `Please enter correct firstname. (first letter must have 1 upper case and lower case 1 word or more.)`;
							} else if (!new Validator(lastname).regName.test(lastname)) {
								response_object.message = `Please enter correct lastname. (first letter must have 1 upper case and lower case 1 word or more.)`;
							} else if (!new Validator(address).regAddress.test(address)) {
								response_object.message = `Please input address (Must have 1 to 100 word.)`;
							} else if (!new Validator(phone).regPhone.test(phone)) {
								response_object.message = `Please enter correct phone. (First letter must have 0 and second letter must have 6,8,and 9.)`;
							} else if (!new Validator(email).regEmail.test(email)) {
								response_object.message = `Please enter correct email.`;
							} else if (!new Validator(money).regMoney.test(money)) {
								response_object.message = `Please enter number.`;
							}
						}
					} else {
						response_object.message =
							"Incorrect sent method,that is not a POST method.";
						response_object.statusCode = 405;
					}
				} catch (error) {
					response_object.message = error;
					response_object.statusCode = 404;
					console.log(error);
				}
				break;
			case "/add":
				try {
					if (req.method == "PUT") {
						let data = await getPost(req);
						let { id, amount } = data;
						if (
							new Validator(id).regMoney.test(id) &&
							new Validator(amount).regMoney.test(amount)
						) {
							response_object.data = await addMoney(data);
							response_object.message = "success";
						} else {
							if (!new Validator(id).regMoney.test(id)) {
								response_object.message = `ID is not number.`;
							} else if (!new Validator(amount).regMoney.test(amount)) {
								response_object.message = `Amount is not number.`;
							}
						}
					} else {
						response_object.message = "Incorrect sent method,that is not a PUT method.";
						response_object.statusCode = 405;
					}
				} catch (error) {
					response_object.message = error;
					response_object.statusCode = 404;
					console.log(error);
				}
				break;
			case "/pay":
				try {
					if (req.method == "PUT") {
						let data = await getPost(req);
						let { id, station_name } = data;
						if (
							new Validator(id).regMoney.test(id) &&
							new Validator(station_name).regAddress.test(station_name)
						) {
							response_object.data = await payMoney(data);
							response_object.message = "success";
						} else {
							if (!new Validator(id).regMoney.test(id)) {
								response_object.message = `Id is not number.`;
							} else if (
								!new Validator(station_name).regAddress.test(station_name)
							) {
								response_object.message = `Please enter correct station name.`;
							}
						}
					} else {
						response_object.message = "Incorrect sent method,that is not a PUT method.";
						response_object.statusCode = 405;
					}
				} catch (error) {
					response_object.message = error;
					response_object.statusCode = 404;
					console.log(error);
				}
				break;
			case "/checkToll":
				try {
					if (req.method == "GET") {
						if (
							new Validator(path.query.name).regAddress.test(path.query.name)
						) {
							response_object.data = checkTollStation(path.query.name);
							response_object.message = "success";
						} else {
							response_object.message = `Please enter name.`;
						}
					} else {
						response_object.message =
							"Incorrect sent method,that is not a GET method.";
						response_object.statusCode = 405;
					}
				} catch (error) {
					response_object.message = error;
					response_object.statusCode = 404;
					console.log(error);
				}
				break;
			case "/checkMoney":
				try {
					if (req.method == "GET") {
						if (
							new Validator(path.query.owner_id).regMoney.test(
								path.query.owner_id,
							)
						) {
							response_object.data = checkMoney(path.query.owner_id);
							response_object.message = "success";
						} else {
							response_object.message = `Owner id is not number.`;
						}
					} else {
						response_object.message =
							"Incorrect sent method,that is not a GET method.";
						response_object.statusCode = 405;
					}
				} catch (error) {
					response_object.message = error;
					response_object.statusCode = 404;
					console.log(error);
				}
				break;
			case "/listTransaction":
				try {
					if (req.method == "GET") {
						if (
							new Validator(path.query.owner_id).regMoney.test(
								path.query.owner_id,
							)
						) {
							response_object.data = listTransaction(path.query.owner_id);
							response_object.message = "success";
						} else {
							response_object.message = `Please enter number.`;
						}
					} else {
						response_object.message =
							"Incorrect sent method,that is not a GET method.";
						response_object.statusCode = 405;
					}
				} catch (error) {
					response_object.message = error;
					response_object.statusCode = 404;
					console.log(error);
				}
				break;
			default:
				response_object.message = "Incorrect path.";
				response_object.statusCode = 404;
				break;
		}

		res.writeHead(response_object.statusCode, { "Content-Type": "application/json" });
		res.end(JSON.stringify(response_object));
	})
	.listen(8080);
console.log("Server running on port 8080.");
