import { BigNumberish } from 'ethers';
import { ethers } from 'hardhat'
import {AllianceBlockToken, BatchTransfer} from '../../typechain-types';
import { PromiseOrValue } from '../../typechain-types/common';


describe('BatchTransfer', async function () {
  const accounts = await ethers.getSigners();
  const initialHolder = accounts[0].signer.address;
  const deployer  = accounts[0];
  const AllianceBlockTokenFactory = await ethers.getContractFactory('AllianceBlockToken');
  const BatchTransferFactory = await ethers.getContractFactory('BatchTransfer');
  let allianceBlockToken: AllianceBlockToken;
  let batchTransfer: BatchTransfer;
  let tokenAddress: string;
  let batchTransferAddress: string;

  beforeEach(async function () {
    allianceBlockToken = await AllianceBlockTokenFactory.deploy();
    batchTransfer = await BatchTransferFactory.deploy();
    tokenAddress = allianceBlockToken.address;
    batchTransferAddress = batchTransfer.address;
  });

  it("should send tokens to multiple accounts", async () => {
    const tokens = 20;
    const tokensToSend: BigNumberish[] = [];
    const accountsToSend = accounts.map(el => {
      tokensToSend.push(1);
      return el.signer.address;
    });
    const lastAccount = accountsToSend[accountsToSend.length - 1];
    await allianceBlockToken.mint(lastAccount, tokens);
    await allianceBlockToken.from(lastAccount).approve(batchTransfer.contractAddress, tokens);
    await batchTransfer.from(lastAccount).sendTokens(tokenAddress, accountsToSend, tokensToSend);
    const balance = await allianceBlockToken.balanceOf(initialHolder);
    await assert(balance.eq(tokensToSend[0]), 'Not enough tokens');
  });

  it("should send tokens to the maximum number of users", async () => {
    const tokens = 300;
    const mockedTokens = [];
    const tokensToSend = [];
    const accountsToSend = [];
    const accountsMapped = accounts.map(el => {
      mockedTokens.push(1);
      return el.signer.address;
    });
    for (let i = 0; i < 23; i++) {
      tokensToSend.push(...mockedTokens.slice());
      accountsToSend.push(...accountsMapped.slice());
    };
    const lastAccount = accountsToSend[accountsToSend.length - 1];
    await allianceBlockToken.mint(lastAccount, tokens);
    await allianceBlockToken.from(lastAccount).approve(batchTransfer.contractAddress, tokens);
    await batchTransfer.from(lastAccount).sendTokens(tokenAddress, accountsToSend, tokensToSend);
    const balance = await allianceBlockToken.balanceOf(initialHolder);
    await assert(balance.eq(tokensToSend[0] * 23), 'Not enough tokens');
  });

  it("should fail when the recipient is the zero address", async () => {
    const recipient = "0x0000000000000000000000000000000000000000";
    const tokens = 20;
    const tokensToSend = [10];
    await allianceBlockToken.mint(batchTransferAddress, tokens);
    await assert.revertWith(
      batchTransfer.sendTokens(tokenAddress, [recipient], tokensToSend), 'ERC20: transfer to the zero address'
    );
  });

  it("should fail when contract's balance is below tokens sent", async () => {
    const tokens = 5;
    const tokensToSend = [10];
    await allianceBlockToken.mint(batchTransferAddress, tokens);
    await assert.revertWith(
      batchTransfer.sendTokens(tokenAddress, [initialHolder], tokensToSend), 'Not enough balance'
    );
  });

  it("should fail if the two arrays are not with the same length", async () => {
    const tokens = 20;
    const tokensToSend = [];
    const accountsToSend = accounts.map(el => {
      tokensToSend.push(1);
      return el.signer.address;
    });
    accountsToSend.pop();
    await allianceBlockToken.mint(batchTransferAddress, tokens);
    await assert.revertWith(batchTransfer.sendTokens(tokenAddress, accountsToSend, tokensToSend), "The two arrays must be with the same length");
  });
});
