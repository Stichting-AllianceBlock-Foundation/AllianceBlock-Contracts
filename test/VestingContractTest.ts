import { ethers } from 'hardhat'
import {AllianceBlockToken, Vesting, PercentageCalculator} from '../typechain-types';

describe('Vesting Contract', async function () {
  const accounts = await ethers.getSigners()
  const AllianceBlockTokenFactory = await ethers.getContractFactory('AllianceBlockToken');
  const VestingContractFactory = await ethers.getContractFactory('Vesting');
  const PercentageCalculatorFactory = await ethers.getContractFactory('PercentageCalculator');
	const owner = accounts[0];
	const zeroAddress = "0x0000000000000000000000000000000000000000";
	const deployer = accounts[0];
	let vestingContract: Vesting;
	let allianceBlockToken: AllianceBlockToken;
	let percentageCalculator: PercentageCalculator;
	const libraries = { PercentageCalculator: '' }
	let tokens = 100000

	let amount = ethers.BigNumber.from(100);
	let power = ethers.BigNumber.from(25);
	let finalAmount = amount.pow(power)

	let cumulativeAmounts = [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000, 210000, 220000, 230000,240000,250000,260000,270000,280000,290000,300000,310000,320000,330000,340000, finalAmount]
	beforeEach(async function () {
		allianceBlockToken = await AllianceBlockTokenFactory.deploy();
		percentageCalculator = await PercentageCalculatorFactory.deploy();
		libraries.PercentageCalculator = percentageCalculator.address;
		}
		vestingContract = await VestingContractFactory.deploy(allianceBlockToken.address, cumulativeAmounts, {libraries});
		await allianceBlockToken.mint(vestingContract.address, tokens);
	});

	it("should have the proper owner address", async () => {
		let contractOwner = await vestingContract.owner();
		assert.strictEqual(contractOwner, owner.signer.address, "The owner address is wrong");
	});


	it("should not deploy the contract with zero token address", async () => {
		await assert.revert(VestingContractFactory.deploy(zeroAddress, cumulativeAmounts,{libraries}))
	})

	it("should set the start date properly and emit event", async () => {
		let startDateEvent = "LogStartDateSet"
		let provider = new ethers.providers.JsonRpcProvider();
		let startDate = ((await provider.getBlock()).timestamp) + 100
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
		await assert.revertWith(vestingContract.setStartDate(0), "Start Date can't be in the past");
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
		await assert.equal(recipient.withdrawPercentage.toNumber(), recipientPercentage, "Recipient data is not correct")
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
		let totalPercentages = await vestingContract.totalPercentages()
		assert.equal(totalPercentages.toNumber(), 3000, "Total percentages are wrong")
		assert.equal(recipientAddresses.length, totalRecipients, "Total recipients number is not correct");
		assert.equal(recipient.withdrawPercentage.toNumber(), recipientsPercentages[1], "Recipient data is not correct")
	})

	it("should add  max recipients", async () => {
		let recipientAddresses = []
		let recipientsPercentages = []

		for (let i = 0; i < 229; i++) {
			let wallet = ethers.Wallet.createRandom()
			recipientAddresses.push(wallet.address)
			recipientsPercentages.push(1)
		}

		await vestingContract.addMultipleRecipients(recipientAddresses, recipientsPercentages)
		let totalRecipients = await vestingContract.totalRecipients();
		let recipient = await vestingContract.recipients(recipientAddresses[1]);

		assert.equal(recipientAddresses.length, totalRecipients, "Total recipients number is not correct");
		assert.equal(recipient.withdrawPercentage.toNumber(), recipientsPercentages[1], "Recipient data is not correct")
	})

	xit("should add multiple recipients with strange", async () => {
		let recipientAddresses = []
		let recipientsPercentages = []

		for (let i = 0; i < 10; i++) {
			let wallet = ethers.Wallet.createRandom()
			recipientAddresses.push(wallet.address)
			recipientsPercentages.push(1)
		}

		await vestingContract.addMultipleRecipients(recipientAddresses, recipientsPercentages)
		let totalRecipients = await vestingContract.totalRecipients();
		let recipient = await vestingContract.recipients(recipientAddresses[1]);

		assert.equal(recipientAddresses.length, totalRecipients, "Total recipients number is not correct");
		assert.equal(recipient.withdrawPercentage.toNumber(), recipientsPercentages[1], "Recipient data is not correct")
	})

	it("should fail if the total percentages are over 100%", async () => {
		let recipientAddresses = []
		let recipientsPercentages = []

		for (let i = 0; i < 12; i++) {
			let wallet = ethers.Wallet.createRandom()
			recipientAddresses.push(wallet.address)
			recipientsPercentages.push(10000)
		}
		await assert.revertWith(vestingContract.addMultipleRecipients(recipientAddresses, recipientsPercentages), "Total percentages exceeds 100%")
	})

	it("should fail if trying to add multiple recipients from non owner address", async () => {
		let recipientAddresses = [accounts[1].signer.address, accounts[2].signer.address];
		let recipientsPercentages = [1000, 2000];

		await assert.revertWith(vestingContract.from(4).addMultipleRecipients(recipientAddresses, recipientsPercentages), "Ownable: caller is not the owner");
	})

	it("should fail if the two arrays are with different length", async () => {
		let recipientAddresses = [accounts[1].signer.address, accounts[2].signer.address];
		let recipientsPercentages = [1000];

		await assert.revertWith(vestingContract.addMultipleRecipients(recipientAddresses, recipientsPercentages), "The two arryas are with different length");
	})

	it("should fail if tryong to add more than 230 recipients", async () => {
		let recipientAddresses = [];
		let recipientsPercentages = [];

		for (let i = 0; i < 255; i++) {
			let wallet = ethers.Wallet.createRandom()
			recipientAddresses.push(wallet.address)
			recipientsPercentages.push(10000)
		}
		await assert.revertWith(vestingContract.addMultipleRecipients(recipientAddresses, recipientsPercentages), "The recipients must be not more than 230");

	})

	it("should sucessfully call the claim function", async () => {
		let provider = new ethers.providers.JsonRpcProvider();
		let startDate = ((await provider.getBlock()).timestamp) + 100
		await vestingContract.setStartDate(startDate);
		let recipientAddress = accounts[2].signer.address
		let recipientPercentage = 1000

		await vestingContract.addRecipient(recipientAddress, recipientPercentage);

		let contractInitialBalance = await allianceBlockToken.balanceOf(vestingContract.contractAddress);

		let seconds = 600000;
		await utils.timeTravel(deployer.provider, seconds)

		await vestingContract.from(recipientAddress).claim()

		let userFinalBalance = await allianceBlockToken.balanceOf(recipientAddress)
		let contractFinalBalance = await allianceBlockToken.balanceOf(vestingContract.contractAddress);
		let owedBalance = cumulativeAmounts[0] * recipientPercentage / 100000
		let recipient = await vestingContract.recipients(recipientAddress);
		let hasToClaim = await vestingContract.from(recipientAddress).hasClaim()

		assert.equal(recipient.withdrawnAmount.toNumber(), owedBalance, "The withdrawn amount is not correct");
		assert.equal(owedBalance, userFinalBalance, "The claim was not sucessfull");
		assert.equal((contractInitialBalance - owedBalance), contractFinalBalance, "The claim was not sucessfull");
		assert.equal(hasToClaim.toNumber(), 0, "The user must have nothing to claim");
	})

	it("should successfully call the claim function for first and second period", async () => {
		let provider = new ethers.providers.JsonRpcProvider();
		let startDate = ((await provider.getBlock()).timestamp) + 100
		await vestingContract.setStartDate(startDate);
		let recipientAddress = accounts[2].signer.address
		let recipientPercentage = 1000

		await vestingContract.addRecipient(recipientAddress, recipientPercentage);

		let contractInitialBalance = await allianceBlockToken.balanceOf(vestingContract.contractAddress);

		let seconds = 600000;
		await utils.timeTravel(deployer.provider, seconds)

		await vestingContract.from(recipientAddress).claim()
		seconds = 604800; // 1 week
		seconds = ethers.BigNumber.from(604800);
		seconds = seconds.mul(4); // 1 month
		await utils.timeTravel(deployer.provider, seconds.toNumber())

		await vestingContract.from(recipientAddress).claim()

		let userFinalBalance = await allianceBlockToken.balanceOf(recipientAddress)
		let contractFinalBalance = await allianceBlockToken.balanceOf(vestingContract.contractAddress);
		let owedBalance = cumulativeAmounts[1] * recipientPercentage / 100000
		let recipient = await vestingContract.recipients(recipientAddress);
		let hasToClaim = await vestingContract.from(recipientAddress).hasClaim()

		assert.equal(recipient.withdrawnAmount.toNumber(), owedBalance, "The withdrawn amount is not correct");
		assert.equal(owedBalance, userFinalBalance, "The claim was not sucessfull");
		assert.equal((contractInitialBalance - owedBalance), contractFinalBalance, "The claim was not sucessfull");
		assert.equal(hasToClaim.toNumber(), 0, "The user must have nothing to claim");
	})

	it("should fail to claim if there is not start date", async () => {
		let recipientAddress = accounts[2].signer.address
		await assert.revertWith(vestingContract.from(recipientAddress).claim(), "The vesting hasn't started");

	})
	it("should fail to claim if there is no start date", async () => {
		let recipientAddress = accounts[2].signer.address
		let provider = new ethers.providers.JsonRpcProvider();
		let startDate = ((await provider.getBlock()).timestamp) + 10000
		await vestingContract.setStartDate(startDate);
		await assert.revertWith(vestingContract.from(recipientAddress).claim(), "The vesting hasn't started");
	})

	it("should show how many tokens the user has to claim", async () => {

		let provider = new ethers.providers.JsonRpcProvider();
		let startDate = ((await provider.getBlock()).timestamp) + 100
		await vestingContract.setStartDate(startDate);

		let seconds = 86400; //1 day
		await utils.timeTravel(deployer.provider, seconds)
		let recipientAddress = accounts[2].signer.address
		let recipientPercentage = 1000

		await vestingContract.addRecipient(recipientAddress, recipientPercentage);
		let balance = await vestingContract.from(recipientAddress).hasClaim();
		let owedBalance = cumulativeAmounts[0] * recipientPercentage / 100000
		assert.equal(balance.toNumber(), owedBalance, "The owed balance is not correct	")
	})

	it("should return zero if there is no start date", async () => {
		let recipientAddress = accounts[2].signer.address
		let owedAmount = await vestingContract.from(recipientAddress).hasClaim();
		assert.equal(owedAmount.toNumber(), 0, "The owed amount is wrong");
	})
	it("should fail if the vetins hasn'st started", async () => {
		let recipientAddress = accounts[2].signer.address
		let provider = new ethers.providers.JsonRpcProvider();
		let startDate = ((await provider.getBlock()).timestamp) + 10000
		await vestingContract.setStartDate(startDate);
		let owedAmount = await vestingContract.from(recipientAddress).hasClaim();
		assert.equal(owedAmount.toNumber(), 0, "The owed amount is wrong");
	})

	it("shouyld return zero if the recipient is not in part of the vesting", async () => {
		let provider = new ethers.providers.JsonRpcProvider();
		let startDate = ((await provider.getBlock()).timestamp) + 100
		await vestingContract.setStartDate(startDate);

		let seconds = 86400; //1 day
		await utils.timeTravel(deployer.provider, seconds)

		let balance = await vestingContract.from(accounts[6]).hasClaim();
		let owedBalance = 0
		assert.equal(balance.toNumber(), owedBalance, "The owed balance is not correct	")
	})
});
