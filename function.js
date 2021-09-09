var owner = new Array();
var easycard = new Array();
var transaction = new Array();
var station = new Array();

const {
	Station,
	Owner,
	EasyCard,
	Transaction,
	Validator,
} = require("./object");

station.push(new Station(station.length + 1, "Bangkok", 250, "45/56 road"));
station.push(new Station(station.length + 1, "Bangkok1", 500, "45/56 road"));
station.push(new Station(station.length + 1, "Bangkok2", 600, "45/56 road"));
station.push(new Station(station.length + 1, "Bangkok3", 675, "45/56 road"));
station.push(new Station(station.length + 1, "Bangkok4", 221, "45/56 road"));

console.log(station);

register = ({ firstname, lastname, address, phone, email, money }) => {
	return new Promise((resolve, reject) => {
		if (money >= 500) {
			let tranRegis = new Promise((resolve) => {
				transaction.push(
					new Transaction(
						transaction.length + 1,
						owner.length + 1,
						money,
						"add",
						money,
					),
				);
				resolve();
			});
			tranRegis
				.then(() => {
					easycard.push(new EasyCard(owner.length + 1, money));
				})
				.then(() => {
					let people = new Owner(
						owner.length + 1,
						firstname,
						lastname,
						address,
						phone,
						email,
					);
					owner.push(people);
					resolve(people);
				});
		} else {
			reject("You must input money more than 500.");
		}
	});
};

returnOwner = (id) => {
	let tempOwner = owner.filter((data) => {
		return data.getOwnerId() == id;
	});
	return tempOwner[0];
};

addMoney = ({ id, amount }) => {
	if (owner[id - 1]) {
		if (amount >= 100) {
			let add = new Transaction(
				transaction.length + 1,
				returnOwner(id).getOwnerId(),
				amount,
				"add",
				easycard[id - 1].addMoney(amount),
			);
			transaction.push(add);
			return add;
		} else {
			return "You must input money more than equal 100.";
		}
	} else {
		return "Not found id.";
	}
};

payMoney = ({ id, station_name }) => {
	let tempStation = station
		.filter((data) => {
			return data.name == station_name;
		})
		.map((data) => {
			return data.getToll();
		});
	if (tempStation.length > 0) {
		let amount = tempStation[0].toll;
		if (owner[id - 1]) {
			if (easycard[id - 1].money > amount) {
				let pay = new Transaction(
					transaction.length + 1,
					returnOwner(id).getOwnerId(),
					amount,
					"pay",
					easycard[id - 1].payMoney(amount),
				);
				transaction.push(pay);
				return pay;
			} else {
				return `You must add money more than equal ${
					(easycard[id - 1].money - amount) / -1
				}`;
			}
		} else {
			return "Not found owner.";
		}
	} else {
		return "Not found station.";
	}
};

checkTollStation = (name) => {
	let tempToll = station.filter((data) => {
			return data.name == name;
		})
		.map((data) => {
			return data.getToll();
		});
	if (tempToll.length > 0) {
		return tempToll;
	} else {
		return "Not found Station.";
	}
};

checkMoney = (id) => {
	let tempMoney = easycard
		.filter((data) => {
			return data.id == id;
		})
		.map((data) => {
			return "You have money = " + data.money;
		});
	if (tempMoney.length > 0) {
		return tempMoney;
	} else {
		return "Not found owner.";
	}
};

listTransaction = (owner_id) => {
	let tempTransaction = transaction.filter((data) => {
		return data.owner_id == owner_id;
	});
	if (tempTransaction.length > 0) {
		return tempTransaction;
	} else {
		return "Not found owner.";
	}
};

module.exports = {
	register: register,
	addMoney: addMoney,
	payMoney: payMoney,
	checkTollStation: checkTollStation,
	checkMoney: checkMoney,
	listTransaction: listTransaction,
	Validator: Validator,
};
