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
  let tokenAddress;

  beforeEach(async function () {
    deployer = new etherlime.EtherlimeGanacheDeployer(initialHolderSecretKey);
    allianceBlockToken = await deployer.deploy(AllianceBlockToken, {});
    batchTransfer = await deployer.deploy(BatchTransfer, {});
    tokenAddress = allianceBlockToken.contract.address;
  });

  it("should send tokens to multiple accounts", async () => {
    const tokens = 20;
    const tokensToSend = [];
    const accountsToSend = accounts.map(el => {
      tokensToSend.push(1);
      return el.signer.address;
    });
    await allianceBlockToken.mint(batchTransfer.contract.address, tokens);
    await batchTransfer.sendTokens(tokenAddress, accountsToSend, tokensToSend);
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
    await allianceBlockToken.mint(batchTransfer.contract.address, tokens);
    await batchTransfer.sendTokens(tokenAddress, accountsToSend, tokensToSend);
    const balance = await allianceBlockToken.balanceOf(initialHolder);
    await assert(balance.eq(tokensToSend[0] * 23), 'Not enough tokens');
  });

  it("should fail when the recipient is the zero address", async () => {
    const recipient = "0x0000000000000000000000000000000000000000";
    const tokens = 20;
    const tokensToSend = [10];
    await allianceBlockToken.mint(batchTransfer.contract.address, tokens);
    await assert.revertWith(
      batchTransfer.sendTokens(tokenAddress, [recipient], tokensToSend), 'ERC20: transfer to the zero address'
    );
  })

  it("should fail when contract's balance is below tokens sent", async () => {
    const tokens = 5;
    const tokensToSend = [10];
    await allianceBlockToken.mint(batchTransfer.contract.address, tokens);
    await assert.revertWith(
      batchTransfer.sendTokens(tokenAddress, [initialHolder], tokensToSend), 'Not enough balance'
    );
  })
});