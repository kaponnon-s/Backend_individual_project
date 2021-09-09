const Station = function (id, name, toll, address) {
	this.id = id;
	this.name = name;
	this.toll = toll;
	this.address = address;
};
Station.prototype.getToll = function () {
	return { name: this.name, toll: this.toll, address: this.address };
};

const Owner = function (id, firstname, lastname, address, phone, email) {
	this.id = id;
	this.firstname = firstname;
	this.lastname = lastname;
	this.address = address;
	this.phone = phone;
	this.email = email;
	this.EasyCard_id = id;
};
Owner.prototype.getOwnerId = function () {
	return this.id;
};
Owner.prototype.getOwner = function () {
	return {
		id: this.id,
		firstname: this.firstname,
		lastname: this.lastname,
		address: this.address,
		phone: this.phone,
		email: this.email,
		EasyCard_id: this.EasyCard_id,
	};
};

const EasyCard = function (id, money) {
	this.id = id;
	this.money = money;
};
EasyCard.prototype.addMoney = function (money) {
	this.money += money;
	return this.money;
};
EasyCard.prototype.payMoney = function (money) {
	this.money -= money;
	return this.money;
};
EasyCard.prototype.getEasyCard = function () {
	return { id: this.id, money: this.money };
};

const Transaction = function (id, owner, amount, type, total) {
	this.id = id;
	this.owner_id = owner;
	this.amount = amount;
	this.type = type;
	this.total = total;
};
Transaction.prototype.getTransaction = function () {
	return {
		id: this.id,
		owner_id: owner,
		amount: this.amount,
		type: this.type,
		total: this.total,
	};
};

const Validator = function (check) {
	this.check = check;
	this.regName = /^[A-Z]{1}[a-z]{1,20}$/; //owner_firstname
	this.regAddress = /^.{1,100}$/; //owner_address,station_address
	this.regPhone = /^0[689]\d{8,11}$/; //owner_phone
	this.regEmail = /^([\w.-_]+)@(\w+).([\w.]+)$/; //owner_email
	this.regMoney = /^\d*$/; //owner_money,
};

module.exports = {
	Station: Station,
	Owner: Owner,
    EasyCard: EasyCard,
	Transaction: Transaction,
	Validator: Validator,
};
