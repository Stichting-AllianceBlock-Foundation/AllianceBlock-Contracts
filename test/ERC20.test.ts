import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { AllianceBlockToken, TestProxy } from "../typechain-types";
import { MAX_TOTAL_SUPPLY } from "../utils/constants";

const ZERO_ADDRESS = ethers.constants.AddressZero;
const MAX_UINT256 = ethers.constants.MaxUint256;

describe("ERC20", () => {
  let initialHolder: any, recipient: any, anotherAccount: any, proxyAdmin: any;
  const name = "My Token";
  const symbol = "MTKN";
  const initialSupply = BigNumber.from(100);
  const maxTotalSupply = MAX_TOTAL_SUPPLY;
  let Token: any, TestProxy: any;
  let token: AllianceBlockToken;
  let testProxy: TestProxy;
  let tokenImplementation: AllianceBlockToken;

  before(async () => {
    [initialHolder, recipient, anotherAccount, proxyAdmin] = await ethers.getSigners();
    Token = await ethers.getContractFactory("AllianceBlockToken");
    TestProxy = await ethers.getContractFactory("TestProxy");
    tokenImplementation = await Token.deploy();
  });

  beforeEach(async () => {
    const populatedTx = await tokenImplementation.populateTransaction.init(name, symbol, initialHolder.address, maxTotalSupply);
    testProxy = await TestProxy.deploy(tokenImplementation.address, proxyAdmin.address, populatedTx.data);
    token = await ethers.getContractAt("AllianceBlockToken", testProxy.address) as AllianceBlockToken;
    await token.mint(initialHolder.address, initialSupply);
  });

  it("has a name", async function () {
    expect(await token.name()).to.equal(name);
  });

  it("has a symbol", async function () {
    expect(await token.symbol()).to.equal(symbol);
  });

  it("has 18 decimals", async function () {
    expect(await token.decimals()).to.be.equal(BigNumber.from(18));
  });

  it("has correct cap", async function () {
    expect(await token.cap()).to.be.equal(MAX_TOTAL_SUPPLY);
  });

  describe("decrease allowance", () => {
    describe("when the spender is not the zero address", () => {
      let spender: any;

      before(async () => {
        spender = recipient;
      });

      function shouldDecreaseApproval(amount: BigNumber) {
        describe("when there was no approved amount before", () => {
          it("reverts", async () => {
            await expect(token.connect(initialHolder).decreaseAllowance(spender.address, amount)).to.be.revertedWith(
              "ERC20: decreased allowance below zero",
            );
          });
        });

        describe("when the spender had an approved amount", () => {
          const approvedAmount = amount;

          beforeEach(async function () {
            await token.connect(initialHolder).approve(spender.address, approvedAmount);
          });

          it("emits an approval event", async () => {
            await expect(token.connect(initialHolder).decreaseAllowance(spender.address, approvedAmount)).to.emit(
              token,
              "Approval",
            );
          });

          it("decreases the spender allowance subtracting the requested amount", async () => {
            await token.connect(initialHolder).decreaseAllowance(spender.address, approvedAmount.sub(1));

            expect(await token.allowance(initialHolder.address, spender.address)).to.be.equal(BigNumber.from("1"));
          });

          it("sets the allowance to zero when all allowance is removed", async () => {
            await token.decreaseAllowance(spender.address, approvedAmount, { from: initialHolder.address });
            expect(await token.allowance(initialHolder.address, spender.address)).to.be.equal(BigNumber.from("0"));
          });

          it("reverts when more than the full allowance is removed", async () => {
            await expect(
              token.connect(initialHolder).decreaseAllowance(spender.address, approvedAmount.add(1)),
            ).to.be.revertedWith("ERC20: decreased allowance below zero");
          });
        });
      }

      describe("when the sender has enough balance", () => {
        const amount = initialSupply;

        shouldDecreaseApproval(amount);
      });

      describe("when the sender does not have enough balance", () => {
        const amount = initialSupply.add(1);

        shouldDecreaseApproval(amount);
      });
    });

    describe("when the spender is the zero address", function () {
      const amount = initialSupply;
      const spender = ZERO_ADDRESS;

      it("reverts", async function () {
        await expect(token.connect(initialHolder).decreaseAllowance(spender, amount)).to.be.revertedWith(
          "ERC20: decreased allowance below zero",
        );
      });
    });
  });

  describe("increase allowance", function () {
    const amount = initialSupply;

    describe("when the spender is not the zero address", function () {
      let spender: any;

      before(async () => {
        spender = recipient;
      });

      describe("when the sender has enough balance", function () {
        it("emits an approval event", async function () {
          await expect(token.connect(initialHolder).increaseAllowance(spender.address, amount)).to.emit(
            token,
            "Approval",
          );
        });

        describe("when there was no approved amount before", function () {
          it("approves the requested amount", async function () {
            await token.connect(initialHolder).increaseAllowance(spender.address, amount);

            expect(await token.allowance(initialHolder.address, spender.address)).to.be.equal(amount);
          });
        });

        describe("when the spender had an approved amount", function () {
          beforeEach(async function () {
            await token.connect(initialHolder).approve(spender.address, BigNumber.from(1));
          });

          it("increases the spender allowance adding the requested amount", async function () {
            await token.increaseAllowance(spender.address, amount, { from: initialHolder.address });

            expect(await token.allowance(initialHolder.address, spender.address)).to.be.equal(amount.add(1));
          });
        });
      });

      describe("when the sender does not have enough balance", function () {
        const amount = initialSupply.add(1);

        it("emits an approval event", async function () {
          await expect(token.connect(initialHolder).increaseAllowance(spender.address, amount)).to.emit(
            token,
            "Approval",
          );
        });

        describe("when there was no approved amount before", function () {
          it("approves the requested amount", async function () {
            await token.connect(initialHolder).increaseAllowance(spender.address, amount);

            expect(await token.allowance(initialHolder.address, spender.address)).to.be.equal(amount);
          });
        });

        describe("when the spender had an approved amount", function () {
          beforeEach(async function () {
            await token.connect(initialHolder).approve(spender.address, BigNumber.from(1));
          });

          it("increases the spender allowance adding the requested amount", async function () {
            await token.connect(initialHolder).increaseAllowance(spender.address, amount);

            expect(await token.allowance(initialHolder.address, spender.address)).to.be.equal(amount.add(1));
          });
        });
      });
    });

    describe("when the spender is the zero address", function () {
      const spender = ZERO_ADDRESS;

      it("reverts", async function () {
        await expect(token.increaseAllowance(spender, amount, { from: initialHolder.address })).to.be.revertedWith(
          "ERC20: approve to the zero address",
        );
      });
    });
  });

  describe("mint", function () {
    const amount = BigNumber.from(50);
    it("rejects a null account", async function () {
      await expect(token.mint(ZERO_ADDRESS, amount)).to.be.revertedWith("ERC20: mint to the zero address");
    });

    describe("for a non zero account", function () {
      beforeEach("minting", async function () {
        await token.mint(recipient.address, amount);
      });

      it("increments totalSupply", async function () {
        const expectedSupply = initialSupply.add(amount);
        expect(await token.totalSupply()).to.be.equal(expectedSupply);
      });

      it("increments recipient balance", async function () {
        expect(await token.balanceOf(recipient.address)).to.be.equal(amount);
      });

      it("emits Transfer event", async function () {
        await expect(token.mint(recipient.address, amount)).to.emit(token, "Transfer");
      });
    });
  });

  describe("total supply", function () {
    it("returns the total amount of tokens", async function () {
      expect(await token.totalSupply()).to.be.equal(initialSupply);
    });
  });

  describe("balanceOf", function () {
    describe("when the requested account has no tokens", function () {
      it("returns zero", async function () {
        expect(await token.balanceOf(anotherAccount.address)).to.be.equal(BigNumber.from("0"));
      });
    });

    describe("when the requested account has some tokens", function () {
      it("returns the total amount of tokens", async function () {
        expect(await token.balanceOf(initialHolder.address)).to.be.equal(initialSupply);
      });
    });
  });

  describe("transfer from", function () {
    const errorPrefix = "ERC20";
    let spender: any;

    before(async () => {
      spender = recipient;
    });

    describe("when the token owner is not the zero address", function () {
      let tokenOwner: any;
      before(async () => {
        tokenOwner = initialHolder;
      });

      describe("when the recipient is not the zero address", function () {
        let to: any;
        before(async () => {
          to = anotherAccount;
        });

        describe("when the spender has enough allowance", function () {
          beforeEach(async function () {
            await token.connect(initialHolder).approve(spender.address, initialSupply);
          });

          describe("when the token owner has enough balance", function () {
            const amount = initialSupply;

            it("transfers the requested amount", async function () {
              await token.connect(spender).transferFrom(tokenOwner.address, to.address, amount);

              expect(await token.balanceOf(tokenOwner.address)).to.be.equal(BigNumber.from("0"));

              expect(await token.balanceOf(to.address)).to.be.equal(amount);
            });

            it("decreases the spender allowance", async function () {
              await token.connect(spender).transferFrom(tokenOwner.address, to.address, amount);

              expect(await token.allowance(tokenOwner.address, spender.address)).to.be.equal(BigNumber.from("0"));
            });

            it("emits a transfer event", async function () {
              await expect(token.connect(spender).transferFrom(tokenOwner.address, to.address, amount)).to.emit(
                token,
                "Transfer",
              );

              it("emits an approval event", async function () {
                await expect(token.connect(spender).transferFrom(tokenOwner.address, to.address, amount)).to.emit(
                  token,
                  "Approval",
                );
              });
            });

            describe("when the token owner does not have enough balance", function () {
              const amount = initialSupply;

              beforeEach("reducing balance", async function () {
                await token.connect(tokenOwner).transfer(to.address, 1);
              });

              it("reverts", async function () {
                await expect(
                  token.connect(spender).transferFrom(tokenOwner.address, to.address, amount),
                ).to.be.revertedWith(`${errorPrefix}: transfer amount exceeds balance`);
              });
            });
          });

          describe("when the spender does not have enough allowance", function () {
            const allowance = initialSupply.sub(1);

            beforeEach(async function () {
              await token.connect(tokenOwner).approve(spender.address, allowance);
            });

            describe("when the token owner has enough balance", function () {
              const amount = initialSupply;

              it("reverts", async function () {
                await expect(
                  token.connect(spender).transferFrom(tokenOwner.address, to.address, amount),
                ).to.be.revertedWith(`${errorPrefix}: insufficient allowance`);
              });
            });

            describe("when the token owner does not have enough balance", function () {
              const amount = allowance;

              beforeEach("reducing balance", async function () {
                await token.connect(tokenOwner).transfer(to.address, 2);
              });

              it("reverts", async function () {
                await expect(
                  token.connect(spender).transferFrom(tokenOwner.address, to.address, amount),
                ).to.be.revertedWith(`${errorPrefix}: transfer amount exceeds balance`);
              });
            });
          });

          describe("when the spender has unlimited allowance", function () {
            beforeEach(async function () {
              await token.connect(initialHolder).approve(spender.address, MAX_UINT256);
            });

            it("does not decrease the spender allowance", async function () {
              await token.connect(spender).transferFrom(tokenOwner.address, to.address, 1);

              expect(await token.allowance(tokenOwner.address, spender.address)).to.be.equal(MAX_UINT256);
            });
          });
        });

        describe("when the recipient is the zero address", function () {
          const amount = initialSupply;
          const to = ZERO_ADDRESS;

          beforeEach(async function () {
            await token.connect(tokenOwner).approve(spender.address, amount);
          });

          it("reverts", async function () {
            await expect(token.connect(spender).transferFrom(tokenOwner.address, to, amount)).to.be.revertedWith(
              `${errorPrefix}: transfer to the zero address`,
            );
          });
        });
        describe("when the token owner is the zero address", function () {
          const amount = 0;
          const tokenOwner = ZERO_ADDRESS;
          let to: any;
          before(async () => {
            to = recipient;
          });

          it("reverts", async function () {
            await expect(token.connect(spender).transferFrom(tokenOwner, to.address, amount)).to.be.revertedWith(
              "ERC20: approve from the zero address",
            );
          });
        });
      });
    });
  });
});
