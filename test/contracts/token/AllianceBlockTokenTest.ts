import {assert} from 'chai';
import { ethers } from 'hardhat'
import {AllianceBlockToken} from '../../../typechain-types';


describe('ERC20', async function () {
  const signers = await ethers.getSigners()
  const initialHolder = signers[0].signer.address;
  const recipient = signers[1].signer.address;
  const deployer  = signers[0];
  const AllianceBlockTokenFactory = await ethers.getContractFactory('AllianceBlockToken');
  let allianceBlockToken: AllianceBlockToken;

  beforeEach(async function () {
    allianceBlockToken =  await AllianceBlockTokenFactory.deploy();
  });

  it("it is correct symbol", async () => {
    const symbol = await allianceBlockToken.symbol();
    assert.strictEqual(symbol, "ALBT", "Incorrect symbol");
  });

  it("increments recipient balance", async () => {
    const tokens = 100;
    await allianceBlockToken.mint(recipient, tokens);
    const balance = await allianceBlockToken.balanceOf(recipient);
    assert(balance.eq(tokens), 'Not enough tokens');
  });

  it("decrement recipient balance", async () => {
    const tokens = 110;
    const burnedTokens = 10;
    await allianceBlockToken.mint(initialHolder, tokens);
    await allianceBlockToken.burn(burnedTokens);
    const balance = await allianceBlockToken.balanceOf(initialHolder);
    assert(balance.eq(tokens - burnedTokens), 'Not enough tokens');
  });

  it("is possible to send tokens between accounts", async () => {
    const tokens = 100;
    const sendtokens = 1;
    await allianceBlockToken.mint(recipient, tokens);
    await allianceBlockToken.from(recipient).transfer(initialHolder, sendtokens);
    const balance = await allianceBlockToken.balanceOf(initialHolder);
    assert(balance.eq(sendtokens), 'Not enough tokens');
  });

  it("can not transfer and burn while paused", async () => {
    const tokens = 100;
    await allianceBlockToken.pause();
    await assert.revert(allianceBlockToken.transferFrom(recipient, initialHolder, tokens));
    await assert.revert(allianceBlockToken.burn(tokens));
  });

  it("remove minter role as owner", async () => {
    const tokens = 100;
    await allianceBlockToken.removeMinterRole(deployer.signer.address);
    await assert.revertWith(allianceBlockToken.mint(initialHolder, tokens), 'ERC20PresetMinterPauser: must have minter role to mint');
  });

});
