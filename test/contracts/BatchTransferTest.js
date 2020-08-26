const etherlime = require('etherlime-lib');
const BatchTransfer = require('../../build/BatchTransfer.json');
const AllianceBlockToken = require('../../build/AllianceBlockToken.json');
const { ethers } = require('ethers');


describe('BatchTransfer', function () {
  this.timeout(100000);
  const initialHolderSecretKey = accounts[0].secretKey;
  const initialHolder = accounts[0].signer.address;
  let deployer;
  let batchTransfer;
  let allianceBlockToken; 

  beforeEach(async function () {
    deployer = new etherlime.EtherlimeGanacheDeployer(initialHolderSecretKey);
    allianceBlockToken = await deployer.deploy(AllianceBlockToken, {});
    batchTransfer = await deployer.deploy(BatchTransfer, {}, allianceBlockToken.contract.address);
  });

  it("is possible to send tokens to multiple accounts", async () => {
    const tokens = 20;
    const tokensToSend = [];
    const accountsToSend = accounts.map(el => {
      tokensToSend.push(1);
      return el.signer.address;
    });
    await allianceBlockToken.mint(batchTransfer.contract.address, tokens);
    await batchTransfer.sendTokens(accountsToSend, tokensToSend);
    const balance = await allianceBlockToken.balanceOf(initialHolder);
    await assert(balance.eq(tokensToSend[0]), 'Not enough tokens');
  });

  it("send tokens to the maximum number of users", async () => {
    const tokens = 300;
    const mockedTokens = [];
    const tokensToSend = [];
    const accountsToSend = [];
    const accountsMapped = accounts.map(el => {
      mockedTokens.push(1);
      return el.signer.address;
    });
    for (let i = 0; i < 25; i++) {
      tokensToSend.push(...mockedTokens.slice());
      accountsToSend.push(...accountsMapped.slice());
    };
    await allianceBlockToken.mint(batchTransfer.contract.address, tokens);
    const transaction = await batchTransfer.sendTokens(accountsToSend, tokensToSend);
    const balance = await allianceBlockToken.balanceOf(initialHolder);
    await assert(balance.eq(tokensToSend[0] * 25), 'Not enough tokens');
  });

  it("when the recipient is the zero address", async () => {
    const recipient = "0x0000000000000000000000000000000000000000";
    const tokens = 20;
    const tokensToSend = [10];
    await allianceBlockToken.mint(batchTransfer.contract.address, tokens);
    await assert.revertWith(
      batchTransfer.sendTokens([recipient], tokensToSend), 'ERC20: transfer to the zero address'
    );
  })

  it("when contract's balance is below tokens sent", async () => {
    const tokens = 5;
    const tokensToSend = [10];
    await allianceBlockToken.mint(batchTransfer.contract.address, tokens);
    await assert.revertWith(
      batchTransfer.sendTokens([initialHolder], tokensToSend), 'Not enough balance'
    );
  })
});