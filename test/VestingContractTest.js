const etherlime = require('etherlime-lib');
const {
	ethers,
} = require("ethers");
const AllianceBlockToken = require('../build/AllianceBlockToken.json');
const VestingContract = require('../build/Vesting.json');
const PercentageCalculator = require('../build/PercentageCalculator.json')

describe('Vesting Contract', function () {
	const owner = accounts[0]
	const zeroAddress = "0x0000000000000000000000000000000000000000";
	let deployer;
	let vestingContract;
	let allianceBlockToken;
	let percentageCalculator;
	let libraries
	let tokens = 100000

	let cumulativeAmounts = ["10000000000000000000", "200", "300", "400", "500", "600", "700", "800", "900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2100", "2200", "2300", "2400"]
	beforeEach(async function () {
		deployer = new etherlime.EtherlimeGanacheDeployer(owner.secretKey);
		allianceBlockToken = await deployer.deploy(AllianceBlockToken, {});
		percentageCalculator = await deployer.deploy(PercentageCalculator, {});
		libraries = {
			PercentageCalculator: percentageCalculator.contractAddress
		}
		vestingContract = await deployer.deploy(VestingContract, libraries, allianceBlockToken.contractAddress, cumulativeAmounts);
		await allianceBlockToken.mint(vestingContract.contractAddress, tokens);
	});

	it("should have the proper owner address", async () => {
		let contractOwner = await vestingContract.owner();
		assert.strictEqual(contractOwner, owner.signer.address, "The owner address is wrong");
	});

	// it("should set the proper token contract address", async() => {
	// 	let tokenAddress = await vestingContract.tokenAddress();
	// 	assert.strictEqual(tokenAddress, allianceBlockToken.contractAddress, "The owner address is wrong");
	// })

	it("should not deploy the contract with zero token address", async () => {
		await assert.revert(deployer.deploy(VestingContract, libraries, zeroAddress, cumulativeAmounts))
	})

	xit("should fail if the cumulative amounts array is empty", async () => {
		assert.fail(await deployer.deploy(VestingContract, libraries, allianceBlockToken.contractAddress, [""]))
	})
	xit("should fail if the cumulative amounts array length is bigger than 24", async () => {
		assert.fail(await deployer.deploy(VestingContract, libraries, allianceBlockToken.contractAddress, cumulativeAmounts3))
	})

	it("should set the start date properly and emit event", async () => {
		let startDateEvent = "LogStartDateSet"
		let startDate = (Math.floor(Date.now() / 1000) + 1000)
		let transaction = await vestingContract.setStartDate(startDate);
		const transactionReceipt = await vestingContract.verboseWaitForTransaction(transaction);

		let eventEmitted = await utils.hasEvent(transactionReceipt, vestingContract, startDateEvent)
		assert(eventEmitted, 'Event LogStartDateSet was not emitted');
		let vestingStartDate = await vestingContract.startDate()
		assert.equal(vestingStartDate, startDate, "The start date was not set properly")
	})

	it("should fail setting the start date from non owner account", async () => {
		let startDate = (Math.floor(Date.now() / 1000) + 1000)
		await assert.revertWith(vestingContract.from(accounts[1]).setStartDate(startDate), "Ownable: caller is not the owner");
	})

	it("should fail setting the start date in the past", async () => {
		let startDate = (Math.floor(Date.now() / 1000) - 1000)
		await assert.revertWith(vestingContract.setStartDate(startDate), "Start Date can't be in the past");
	})

	it("should fail setting zero start date", async () => {
		await assert.revertWith(vestingContract.setStartDate(0), "Start Date can't be zero");
	})

	it("should add single recipient and emit event", async () => {
		let recipientAddress = accounts[2].signer.address
		let recipientPercentage = 1000
		let addRecipientEvent = "LogRecipientAdded"

		let transaction = await vestingContract.addRecipient(recipientAddress, recipientPercentage);
		const transactionReceipt = await vestingContract.verboseWaitForTransaction(transaction)
		let eventEmitted = await utils.hasEvent(transactionReceipt, vestingContract, addRecipientEvent);

		assert(eventEmitted, "Event LogRecipientAdded not emmited");

		let totalRecipients = await vestingContract.totalRecipients();
		let recipient = await vestingContract.recipients(recipientAddress);

		assert.equal(totalRecipients, 1, "Total recipients number is not correct");
		await assert.equal(recipient.withdrawPercetange.toNumber(), recipientPercentage, "Recipient data is not correct")
	})

	it("should fail adding recipient from not owner", async () => {
		let recipientAddress = accounts[2].signer.address
		let recipientPercentage = 1000
		await assert.revertWith(vestingContract.from(3).addRecipient(recipientAddress, recipientPercentage), "Ownable: caller is not the owner")
	})

	it("should fail if the recipient percentage is not greater than zero", async () => {
		let recipientAddress = accounts[2].signer.address
		await assert.revertWith(vestingContract.addRecipient(recipientAddress, 0), "Provided percentage should be greater than 0")
	})

	it("should fail if the recipient pecentage is greater than 100%", async () => {
		let recipientAddress = accounts[2].signer.address
		//Percentages should be multiolied by 1000
		let percentge = 1000000
		await assert.revertWith(vestingContract.addRecipient(recipientAddress, percentge), "Provided percentage should be less than 100%")
	})

	it("should fail if the recipient is the zero address", async () => {
		"Recepient Address can't be zero address"
		let recipientPercentage = 1000
		await assert.revertWith(vestingContract.addRecipient(zeroAddress, recipientPercentage), "Recepient Address can't be zero address")
	})

	it("should add multiple recipients", async () => {
		let recipientAddresses = [accounts[1].signer.address, accounts[2].signer.address];
		let recipientsPercentages = [1000, 2000];

		await vestingContract.addMultipleRecipients(recipientAddresses, recipientsPercentages);
		let totalRecipients = await vestingContract.totalRecipients();
		let recipient = await vestingContract.recipients(recipientAddresses[1]);

		assert.equal(recipientAddresses.length, totalRecipients, "Total recipients number is not correct");
		assert.equal(recipient.withdrawPercetange.toNumber(), recipientsPercentages[1], "Recipient data is not correct")
	})

	it("should fail if trying to add multiple recipients from non owner address", async () => {
		let recipientAddresses = [accounts[1].signer.address, accounts[2].signer.address];
		let recipientsPercentages = [1000, 2000];

		await assert.revertWith(vestingContract.from(4).addMultipleRecipients(recipientAddresses, recipientsPercentages), "Ownable: caller is not the owner");
	})

	it("should fail if tryong to add more than 50 recipients", async () => {
		let recipientAddresses = [];
		let recipientsPercentages = [];

		for (let i = 0; i < 55; i++) {
			let wallet = ethers.Wallet.createRandom()
			recipientAddresses.push(wallet.address)
			recipientsPercentages.push(1000)
		}
		await assert.revertWith(vestingContract.addMultipleRecipients(recipientAddresses, recipientsPercentages), "The recipients must be not more than 50");

	})

	it("should sucessfully call the claim function", async () => {
		let startDate = (Math.floor(Date.now() / 1000) + 100)
		let recipientAddress = accounts[2].signer.address
		let recipientPercentage = 1000

		await vestingContract.setStartDate(startDate);
		await vestingContract.addRecipient(recipientAddress, recipientPercentage);

		let userInitialBalance = await allianceBlockToken.balanceOf(recipientAddress)
		let contractInitialBalance = await allianceBlockToken.balanceOf(vestingContract.contractAddress);

		let seconds = 600000;
		await utils.timeTravel(deployer.provider, seconds)

		await vestingContract.from(recipientAddress).claim()

		let userFinalBalance = await allianceBlockToken.balanceOf(recipientAddress)
		let contractFinalBalance = await allianceBlockToken.balanceOf(vestingContract.contractAddress);
		console.log(userInitialBalance.toNumber())
		console.log(contractInitialBalance.toNumber())
		console.log(userFinalBalance.toNumber())
		console.log(contractFinalBalance.toNumber())
	})

	it.only("should show how many tokesn the user has to claim", async () => {
		let startDate = (Math.floor(Date.now() / 1000) + 100)
		let recipientAddress = accounts[2].signer.address
		let recipientPercentage = 1

		await vestingContract.setStartDate(startDate);
		await vestingContract.addRecipient(recipientAddress, recipientPercentage);
		console.log(deployer.provider)

		let seconds = 600000;
		// await utils.timeTravel(deployer.provider, seconds)

		let balance = await vestingContract.from(recipientAddress).hasClaim();
		console.log(balance.period.toNumber())
	})

});