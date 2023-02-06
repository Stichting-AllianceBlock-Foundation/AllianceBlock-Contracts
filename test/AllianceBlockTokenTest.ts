import {assert} from 'chai';
import { ethers } from 'hardhat';
// import { ethers, deployments } from 'hardhat'
import {AllianceBlockToken} from '../typechain-types';


describe('ERC20', async function () {
  const [initialHolder, recipient] = await ethers.getSigners();
   const name = 'My Token';
   const symbol = 'MTKN';
   const initialSupply = '100';
   const Token = await ethers.getContractFactory("AllianceBlockToken");
   let token: AllianceBlockToken;

  before(async () => {
  });

  beforeEach(async function () {
    token = await Token.deploy(name, symbol, initialHolder.address, initialHolder.address);
    await token.deployed();
    await token.mint(initialHolder.address, initialSupply);
  });

  // before(async () => {
  //   const signers = await ethers.getSigners()
  //   const { deployer } = await getNamedAccounts()
  //   const chainId = parseInt(await getChainId(), 10)
  //   this.config = proyectConfig['CanisNFT'][chainId]
  //   this.deployer = deployer
  //   this.owner = signers[0]
  //   this.alice = signers[1]
  //   this.bob = signers[2]
  //   this.charly = signers[3]
  //   this.royaltyReceiver = signers[4]
  //   this.CanisNFT = await ethers.getContractFactory('CanisNFT')
  //   this.Royalty = await ethers.getContractFactory('Royalty')
  //   this.maxClaim = proyectConfig['CanisNFT'].maxClaim
  //   this.DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

  // })

  // beforeEach(async () => {
  //   await deployments.fixture(['Royalty', 'CanisNFT', 'SwapBurner'])
  //   this.canisNFT = await ethers.getContract('CanisNFT', this.deployer)
  //   //await ethers.getContract('Royalty', deployer)
  //   this.defaultRoyaltyReceiver = (await ethers.getContract('Royalty', this.deployer)).address
  // })

  it("it is correct symbol", async () => {
    const symbol = await token.symbol();
    assert.strictEqual(symbol, "ALBT", "Incorrect symbol");
  });

  it("increments recipient balance", async () => {
    const tokens = 100;
    await token.mint(recipient.address, tokens);
    const balance = await token.balanceOf(recipient.address);
    assert(balance.eq(tokens), 'Not enough tokens');
  });

  it("decrement recipient balance", async () => {
    const tokens = 110;
    const burnedTokens = 10;
    await token.mint(initialHolder.address, tokens);
    await token.burn(burnedTokens);
    const balance = await token.balanceOf(initialHolder.address);
    assert(balance.eq(tokens - burnedTokens), 'Not enough tokens');
  });

  it("is possible to send tokens between accounts", async () => {
    const tokens = 100;
    const sendtokens = 1;
    await token.mint(recipient.address, tokens);
    await token.connect(recipient).transfer(initialHolder.address, sendtokens);
    const balance = await token.balanceOf(initialHolder.address);
    assert(balance.eq(sendtokens), 'Not enough tokens');
  });

  it("can not transfer and burn while paused", async () => {
    const tokens = 100;
    await token.pause();
    await assert.revert(token.transferFrom(recipient.address, initialHolder.address, tokens));
    await assert.revert(token.burn(tokens));
  });

  it("remove minter role as owner", async () => {
    const tokens = 100;
    const role = await token.MINTER_ROLE();
    await token.revokeRole(initialHolder.address, role);
    await assert.revertWith(token.mint(initialHolder.address, tokens), 'ERC20PresetMinterPauser: must have minter role to mint');
  });

});
