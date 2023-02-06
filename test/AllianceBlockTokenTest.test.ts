import { assert, expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers, deployments } from 'hardhat';
import { AllianceBlockToken } from '../typechain-types';
import { TOKEN_NAME, TOKEN_SYMBOL } from '../utils/constants';
import { crypto } from 'crypto';


describe('AllianceBlockToken', function () {
  let deployer: any, admin: any, recipient: any, anotherAccount: any;
  let token: AllianceBlockToken;

  before(async () => {
    [deployer, admin, recipient, anotherAccount] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const contractName = 'AllianceBlockToken';
    await deployments.fixture([contractName]);
    const deployedContract = await deployments.get(contractName); // Token is available because the fixture was executed
    token = await ethers.getContractAt(contractName, deployedContract.address);
    token = token.connect(admin);
  });

  it("it is correct name", async () => {
    const name = await token.name();
    assert.strictEqual(name, TOKEN_NAME, "Incorrect Token name");
  });

  it("it is correct symbol", async () => {
    const symbol = await token.symbol();
    assert.strictEqual(symbol, TOKEN_SYMBOL, "Incorrect Token symbol");
  });

  it("deployer can't mint", async () => {
    const tokens = BigNumber.from(100);
    await expect(token.connect(deployer).mint(recipient.address, tokens))
      .to.be.revertedWith('ERC20PresetMinterPauser: must have minter role to mint');

  });

  it("increments recipient balance", async () => {
    const tokens = BigNumber.from(100);
    await token.mint(recipient.address, tokens);
    const balance = await token.balanceOf(recipient.address);
    assert(balance.eq(tokens), 'Not enough tokens');
  });

  it("decrement recipient balance", async () => {
    const tokens = BigNumber.from(110);
    const burnedTokens = BigNumber.from(10);
    await token.mint(admin.address, tokens);
    await token.burn(burnedTokens);
    const balance = await token.balanceOf(admin.address);
    assert(balance.eq(tokens.sub(burnedTokens)), 'Not enough tokens');
  });

  it("is possible to send tokens between accounts", async () => {
    const tokens = BigNumber.from(100);
    const sendtokens = BigNumber.from(1);
    await token.mint(recipient.address, tokens);
    await token.connect(recipient).transfer(admin.address, sendtokens);
    const balance = await token.balanceOf(admin.address);
    assert(balance.eq(sendtokens), 'Not enough tokens');
  });

  it("can not transfer or burn while paused", async () => {
    const tokens = 100;
    await token.mint(recipient.address, tokens);
    await token.pause();
    await expect(token.transfer(recipient.address, tokens))
      .to.be.revertedWith('ERC20Pausable: token transfer while paused');
    await expect(token.burn(tokens)).to.be.revertedWith('ERC20Pausable: token transfer while paused');
    await token.approve(recipient.address, tokens);
    await expect(token.connect(recipient).transferFrom(admin.address, recipient.address, tokens))
      .to.be.revertedWith('ERC20Pausable: token transfer while paused');
  });

  it("remove minter role as owner", async () => {
    const tokens = 100;
    const role = await token.MINTER_ROLE();
    await token.revokeRole(role, admin.address);
    await expect(token.mint(admin.address, tokens))
      .to.be.revertedWith('ERC20PresetMinterPauser: must have minter role to mint');
  });

  describe('BatchMint', function () {
    it("is possible to mint tokens to multiple 10 accounts", async () => {
      const tokens: BigNumber[] = [];
      const recipients: string[] = [];
      const numberOfAccounts = 10;
      for (let i = 0; i < numberOfAccounts; i++) {
        const address = Buffer.from(ethers.utils.randomBytes(20)).toString('hex');
        recipients.push(address);
        tokens.push(BigNumber.from(Math.floor(Math.random() * 100)));
      }
      await token.batchMint(recipients, tokens);
      for (let i = 0; i < numberOfAccounts; i++) {
        const balance = await token.balanceOf(recipients[i]);
        assert(balance.eq(tokens[i]), 'Incorrect balance after batch mint');
      }
    });

    it("is possible to mint tokens to multiple 500 accounts", async () => {
      const tokens: BigNumber[] = [];
      const recipients: string[] = [];
      const numberOfAccounts = 500;
      for (let i = 0; i < numberOfAccounts; i++) {
        const address = Buffer.from(ethers.utils.randomBytes(20)).toString('hex');
        recipients.push(address);
        tokens.push(BigNumber.from(Math.floor(Math.random() * 100)));
      }
      await token.batchMint(recipients, tokens);
      for (let i = 0; i < numberOfAccounts; i++) {
        const balance = await token.balanceOf(recipients[i]);
        assert(balance.eq(tokens[i]), 'Incorrect balance after batch mint');
      }
    });


  });

});
