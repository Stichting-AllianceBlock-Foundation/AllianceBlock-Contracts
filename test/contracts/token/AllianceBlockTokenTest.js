const etherlime = require('etherlime-lib');
const AllianceBlockToken = require('../../../build/AllianceBlockToken.json');

describe('ERC20', function () {
  const initialHolderSecretKey = accounts[0].secretKey;
  const initialHolder = accounts[0].signer.address;
  const recipient = accounts[1].signer.address;
  let deployer;
  let allianceBlockToken;
  
  beforeEach(async function () {
    deployer = new etherlime.EtherlimeGanacheDeployer(initialHolderSecretKey);
    allianceBlockToken = await deployer.deploy(AllianceBlockToken, {});
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