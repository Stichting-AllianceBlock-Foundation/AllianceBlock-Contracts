import { expect } from 'chai';
import { ethers } from 'hardhat';
import { time } from '@nomicfoundation/hardhat-network-helpers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ERC20Minter, Vesting } from '../typechain-types';

describe('Vesting', function () {
  let deployer: SignerWithAddress;
  let another1Account: SignerWithAddress;
  let another2Account: SignerWithAddress;
  let another3Account: SignerWithAddress;
  let vestingContract: Vesting;
  let vestingToken: ERC20Minter;
  let tokenAmount = ethers.utils.parseEther('10000');

  let amount = ethers.BigNumber.from(100);
  let power = ethers.BigNumber.from(25);
  let finalAmount = amount.pow(power);
  console.log(finalAmount.toString());

  let cumulativeAmounts = [
    10000,
    20000,
    30000,
    40000,
    50000,
    60000,
    70000,
    80000,
    90000,
    100000,
    110000,
    120000,
    130000,
    140000,
    150000,
    160000,
    170000,
    180000,
    190000,
    200000,
    210000,
    220000,
    230000,
    240000,
    250000,
    260000,
    270000,
    280000,
    290000,
    300000,
    310000,
    320000,
    330000,
    340000,
    finalAmount,
  ];

  const deployVesting = async (cumulativeAmounts: any[], inputToken?: string) => {
    const PercentageCalculator = await ethers.getContractFactory('PercentageCalculator');
    const percentageCalculator = await PercentageCalculator.deploy();

    const Token = await ethers.getContractFactory('ERC20Minter');
    const Vesting = await ethers.getContractFactory('Vesting', {
      libraries: { PercentageCalculator: percentageCalculator.address },
    });
    const vestingToken = (await Token.deploy()) as ERC20Minter;

    const vestingContract = (await Vesting.deploy(inputToken || vestingToken.address, cumulativeAmounts)) as Vesting;
    await vestingToken.mint(vestingContract.address, tokenAmount);

    return { vestingToken, vestingContract };
  };

  beforeEach(async function () {
    // Contracts are deployed using the first signer/account by default
    [deployer, another1Account, another2Account, another3Account] = await ethers.getSigners();
    ({ vestingToken, vestingContract } = await deployVesting(cumulativeAmounts));
  });

  it('[Should have the proper owner address]:', async () => {
    const contractOwner = await vestingContract.owner();
    expect(contractOwner).to.equal(deployer.address, 'The owner address is wrong');
  });

  it('[Should not deploy the contract with zero token address]:', async () => {
    expect(deployVesting(cumulativeAmounts, ethers.constants.AddressZero)).to.reverted;
  });

  it('[Should set the start date properly and emit event]:', async () => {
    let startDate = (await time.latest()) + 100;
    await vestingContract.setStartDate(startDate);

    const filter = vestingContract.filters.LogStartDateSet();
    const logs = await vestingContract.queryFilter(filter);
    expect(logs[0].args.startDate).to.equal(startDate, 'The start date was not set properly');
  });

  it('[Should fail setting the start date from non owner account]:', async () => {
    let startDate = Math.floor(Date.now() / 1000) + 1000;
    expect(vestingContract.connect(another1Account).setStartDate(startDate)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );
  });

  it('[Should fail setting the start date in the past]:', async () => {
    let startDate = Math.floor(Date.now() / 1000) - 1000;
    expect(vestingContract.setStartDate(startDate)).to.be.revertedWith("Start Date can't be in the past");
  });

  it('[Should fail setting zero start date]:', async () => {
    expect(vestingContract.setStartDate(0)).to.be.revertedWith("Start Date can't be in the past");
  });

  it('[Should add single recipient and emit event]:', async () => {
    let recipientAddress = another1Account.address;
    let recipientPercentage = 1000;

    await vestingContract.addRecipient(recipientAddress, recipientPercentage);
    const filter = vestingContract.filters.LogRecipientAdded();
    const logs = await vestingContract.queryFilter(filter);

    expect(logs[0].args.withdrawPercentage).to.equal(recipientPercentage, 'Event LogRecipientAdded not emmited');

    const totalRecipients = await vestingContract.totalRecipients();
    const recipient = await vestingContract.recipients(recipientAddress);

    expect(totalRecipients).to.equal(1, 'Total recipients number is not correct');
    expect(recipient.withdrawPercentage).to.equal(1000, 'Recipient data is not correct');
  });

  it('[Should fail adding recipient from not owner]:', async () => {
    let recipientAddress = another1Account.address;
    let recipientPercentage = 1000;
    expect(
      vestingContract.connect(another1Account).addRecipient(recipientAddress, recipientPercentage)
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('[Should fail if the recipient percentage is not greater than zero]:', async () => {
    const recipientAddress = another1Account.address;
    expect(vestingContract.addRecipient(recipientAddress, 0)).to.be.revertedWith(
      'Provided percentage should be greater than 0'
    );
  });

  it('should fail if the recipient pecentage is greater than 100%', async () => {
    let recipientAddress = another1Account.address;
    //Percentages should be multiplied by 1000
    let percentage = 1200000;
    expect(vestingContract.addRecipient(recipientAddress, percentage)).to.be.revertedWith(
      'Provided percentage should be less than 100%'
    );
  });

  it('[Should fail if the recipient is the zero address]:', async () => {
    let recipientPercentage = 1000;
    expect(vestingContract.addRecipient(ethers.constants.AddressZero, recipientPercentage)).to.be.revertedWith(
      "Recepient Address can't be zero address"
    );
  });

  it('[should add multiple recipients]:', async () => {
    let recipientAddresses = [another1Account.address, another2Account.address];
    let recipientsPercentages = [1000, 2000];

    await vestingContract.addMultipleRecipients(recipientAddresses, recipientsPercentages);
    let totalRecipients = await vestingContract.totalRecipients();
    let recipient = await vestingContract.recipients(recipientAddresses[1]);
    let totalPercentages = await vestingContract.totalPercentages();

    expect(totalPercentages).to.equal(3000, 'Total percentages are wrong');
    expect(recipientAddresses.length).to.equal(totalRecipients, 'Total recipients number is not correct');
    expect(recipient.withdrawPercentage).equal(recipientsPercentages[1], 'Recipient data is not correct');
  });

  it('[Should add  max recipients]:', async () => {
    const recipientAddresses = [];
    const recipientsPercentages = [];

    for (let i = 0; i < 229; i++) {
      let wallet = ethers.Wallet.createRandom();
      recipientAddresses.push(wallet.address);
      recipientsPercentages.push(436);
    }

    await vestingContract.addMultipleRecipients(recipientAddresses, recipientsPercentages);
    const totalRecipients = await vestingContract.totalRecipients();

    expect(recipientAddresses.length).to.equal(totalRecipients, 'Total recipients number is not correct');
  });

  it.only('[Should sucessfully call the claim function]:', async () => {
    let startDate = (await time.latest()) + 100;
    await vestingContract.setStartDate(startDate);
    let recipientAddress = another1Account.address;
    let recipientPercentage = 100000;

    await vestingContract.addRecipient(recipientAddress, recipientPercentage);

    let contractInitialBalance = await vestingToken.balanceOf(vestingContract.address);

    let seconds = 600000;
    await time.increase(seconds);

    await vestingContract.connect(another1Account).claim();

    let userFinalBalance = await vestingToken.balanceOf(recipientAddress);
    let contractFinalBalance = await vestingToken.balanceOf(vestingContract.address);
    let owedBalance = ((cumulativeAmounts[0] as number) * recipientPercentage) / 100000;
    let recipient = await vestingContract.recipients(recipientAddress);
    let hasToClaim = await vestingContract.connect(another1Account).hasClaim();

    seconds = 6000000;
    await time.increase(seconds);

    await vestingContract.connect(another1Account).claim();

    userFinalBalance = await vestingToken.balanceOf(recipientAddress);
    contractFinalBalance = await vestingToken.balanceOf(vestingContract.address);
    owedBalance = ((cumulativeAmounts[0] as number) * recipientPercentage) / 100000;
    recipient = await vestingContract.recipients(recipientAddress);
    hasToClaim = await vestingContract.connect(another1Account).hasClaim();

    expect(recipient.withdrawnAmount).to.equal(owedBalance, 'The withdrawn amount is not correct');
    expect(owedBalance).to.equal(userFinalBalance, 'The claim was not sucessfull');
    expect(contractInitialBalance.sub(owedBalance)).equal(contractFinalBalance, 'The claim was not sucessfull');
    expect(hasToClaim).to.equal(0, 'The user must have nothing to claim');
  });

  it('[Should successfully call the claim function for first and second period]:', async () => {
    let startDate = (await time.latest()) + 100;
    await vestingContract.setStartDate(startDate);
    let recipientAddress = another1Account.address;
    let recipientPercentage = 1000;

    await vestingContract.addRecipient(recipientAddress, recipientPercentage);

    let contractInitialBalance = await vestingToken.balanceOf(vestingContract.address);

    let seconds = 600000;
    await time.increase(seconds);

    await vestingContract.connect(another1Account).claim();

    let userFinalBalance = await vestingToken.balanceOf(recipientAddress);
    let contractFinalBalance = await vestingToken.balanceOf(vestingContract.address);
    let owedBalance = ((cumulativeAmounts[0] as number) * recipientPercentage) / 100000;
    let recipient = await vestingContract.recipients(recipientAddress);

    expect(recipient.withdrawnAmount).to.equal(owedBalance, 'The withdrawn amount is not correct');
    expect(owedBalance).to.equal(userFinalBalance, 'The claim was not sucessfull');
    expect(contractInitialBalance.sub(owedBalance)).equal(contractFinalBalance, 'The claim was not sucessfull');

    seconds = 604800; // 1 week
    seconds = seconds * 4; // 1 month
    await time.increase(seconds);

    await vestingContract.connect(another1Account).claim();

    userFinalBalance = await vestingToken.balanceOf(recipientAddress);
    contractFinalBalance = await vestingToken.balanceOf(vestingContract.address);
    owedBalance = ((cumulativeAmounts[1] as number) * recipientPercentage) / 100000;
    recipient = await vestingContract.recipients(recipientAddress);

    expect(recipient.withdrawnAmount).to.equal(owedBalance, 'The withdrawn amount is not correct');
    expect(owedBalance).to.equal(userFinalBalance, 'The claim was not sucessfull');
    expect(contractInitialBalance.sub(owedBalance)).equal(contractFinalBalance, 'The claim was not sucessfull');
  });

  it('[Should fail to claim if there is not start date]:', async () => {
    expect(vestingContract.claim()).to.revertedWith("The vesting hasn't started");
  });

  it('[Should fail to claim if there is no start date]:', async () => {
    const startDate = (await time.latest()) + 10000;
    await vestingContract.setStartDate(startDate);
    expect(vestingContract.claim()).to.be.revertedWith("The vesting hasn't started");
  });

  it('[Should show how many tokens the user has to claim]:', async () => {
    const startDate = (await time.latest()) + 100;
    await vestingContract.setStartDate(startDate);

    const seconds = 86400; //1 day
    await time.increase(seconds);
    const recipientAddress = another1Account.address;
    const recipientPercentage = 1000;

    await vestingContract.addRecipient(recipientAddress, recipientPercentage);
    const balance = await vestingContract.connect(another1Account).hasClaim();
    const owedBalance = ((cumulativeAmounts[0] as number) * recipientPercentage) / 100000;
    expect(balance).to.equal(owedBalance, 'The owed balance is not correct	');
  });

  it('[Should return zero if there is no start date]:', async () => {
    const owedAmount = await vestingContract.connect(another1Account).hasClaim();
    expect(owedAmount).to.equal(0, 'The owed amount is wrong');
  });

  it("[Should fail if the vesting hasn't started]:", async () => {
    const startDate = (await time.latest()) + 10000;
    await vestingContract.setStartDate(startDate);
    const owedAmount = await vestingContract.connect(another1Account).hasClaim();
    expect(owedAmount).equal(0, 'The owed amount is wrong');
  });

  it('[Should return zero if the recipient is not in part of the vesting]:', async () => {
    const startDate = (await time.latest()) + 100;
    await vestingContract.setStartDate(startDate);

    const seconds = 86400; //1 day
    await time.increase(seconds);

    const balance = await vestingContract.connect(another1Account).hasClaim();
    expect(balance).equal(0, 'The owed balance is not correct	');
  });
});
