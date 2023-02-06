// import { BN, constants, expectEvent, expectRevert } from '@openzeppelin/test-helpers';
// import { expect } from 'chai';
// import { BigNumberish } from 'ethers';
// import { ethers } from 'hardhat';
// import {AllianceBlockToken} from '../typechain-types';
// import { PromiseOrValue } from '../typechain-types/common';
// const { ZERO_ADDRESS } = constants;

// import { shouldBehaveLikeERC20, shouldBehaveLikeERC20Transfer, shouldBehaveLikeERC20Approve } from './ERC20.behavior';


// describe('ERC20', async () => {
//   const [initialHolder, recipient, anotherAccount] = await ethers.getSigners();

//   const name = 'My Token';
//   const symbol = 'MTKN';
//   const initialSupply = new BN(100);
//   let Token: any;
//   let token: AllianceBlockToken;

//   before(async () => {
//     const Token = await ethers.getContractFactory("AllianceBlockToken");
//   });

//   beforeEach(async function () {
//     token = await Token.deploy(name, symbol);
//     await token.deployed();
//     await token.mint(initialHolder.address, initialSupply);
//   });

//   it('has a name', async function () {
//     expect(await token.name()).to.equal(name);
//   });

//   it('has a symbol', async function () {
//     expect(await token.symbol()).to.equal(symbol);
//   });

//   it('has 18 decimals', async function () {
//     expect(await token.decimals()).to.be.bignumber.equal('18');
//   });

//   shouldBehaveLikeERC20('ERC20', initialSupply, initialHolder.address, recipient.address, anotherAccount.address);

//   describe('decrease allowance', function () {
//     describe('when the spender is not the zero address', function () {
//       const spender = recipient;

//       function shouldDecreaseApproval(amount: BN) {
//         describe('when there was no approved amount before', function () {
//           it('reverts', async function () {
//             await expectRevert(
//               token.decreaseAllowance(spender.address, amount, { from: initialHolder.address }),
//               'ERC20: decreased allowance below zero',
//             );
//           });
//         });

//         describe('when the spender had an approved amount', function () {
//           const approvedAmount = amount;

//           beforeEach(async function () {
//             await token.connect(initialHolder).approve(spender.address, approvedAmount);
//           });

//           it('emits an approval event', async function () {
//             expectEvent(
//               await token.connect(initialHolder).decreaseAllowance(spender.address, approvedAmount),
//               'Approval',
//               { owner: initialHolder, spender: spender, value: new BN(0) },
//             );
//           });

//           it('decreases the spender allowance subtracting the requested amount', async function () {
//             await token.connect(initialHolder).decreaseAllowance(spender.address, approvedAmount.subn(1));

//             expect(await token.allowance(initialHolder.address, spender.address)).to.be.bignumber.equal('1');
//           });

//           it('sets the allowance to zero when all allowance is removed', async function () {
//             await token.decreaseAllowance(spender.address, approvedAmount, { from: initialHolder.address });
//             expect(await token.allowance(initialHolder.address, spender.address)).to.be.bignumber.equal('0');
//           });

//           it('reverts when more than the full allowance is removed', async function () {
//             await expectRevert(
//               token.connect(initialHolder).decreaseAllowance(spender.address, approvedAmount.addn(1)),
//               'ERC20: decreased allowance below zero',
//             );
//           });
//         });
//       }

//       describe('when the sender has enough balance', function () {
//         const amount = initialSupply;

//         shouldDecreaseApproval(amount);
//       });

//       describe('when the sender does not have enough balance', function () {
//         const amount = initialSupply.addn(1);

//         shouldDecreaseApproval(amount);
//       });
//     });

//     describe('when the spender is the zero address', function () {
//       const amount = initialSupply;
//       const spender = ZERO_ADDRESS;

//       it('reverts', async function () {
//         await expectRevert(
//           token.decreaseAllowance(spender, amount, { from: initialHolder.address }),
//           'ERC20: decreased allowance below zero',
//         );
//       });
//     });
//   });

//   describe('increase allowance', function () {
//     const amount = initialSupply;

//     describe('when the spender is not the zero address', function () {
//       const spender = recipient;

//       describe('when the sender has enough balance', function () {
//         it('emits an approval event', async function () {
//           expectEvent(await token.increaseAllowance(spender.address, amount, { from: initialHolder.address }),
//           'Approval', {
//             owner: initialHolder,
//             spender: spender,
//             value: amount,
//           });
//         });

//         describe('when there was no approved amount before', function () {
//           it('approves the requested amount', async function () {
//             await token.connect(initialHolder).increaseAllowance(spender.address, amount);

//             expect(await token.allowance(initialHolder.address, spender.address)).to.be.bignumber.equal(amount);
//           });
//         });

//         describe('when the spender had an approved amount', function () {
//           beforeEach(async function () {
//             await token.connect(initialHolder).approve(spender.address, new BN(1));
//           });

//           it('increases the spender allowance adding the requested amount', async function () {
//             await token.increaseAllowance(spender.address, amount, { from: initialHolder.address });

//             expect(await token.allowance(initialHolder.address, spender.address)).to.be.bignumber.equal(amount.addn(1));
//           });
//         });
//       });

//       describe('when the sender does not have enough balance', function () {
//         const amount = initialSupply.addn(1);

//         it('emits an approval event', async function () {
//           expectEvent(await token.connect(initialHolder).increaseAllowance(spender.address, amount), 'Approval', {
//             owner: initialHolder,
//             spender: spender,
//             value: amount,
//           });
//         });

//         describe('when there was no approved amount before', function () {
//           it('approves the requested amount', async function () {
//             await token.connect(initialHolder).increaseAllowance(spender.address, amount);

//             expect(await token.allowance(initialHolder.address, spender.address)).to.be.bignumber.equal(amount);
//           });
//         });

//         describe('when the spender had an approved amount', function () {
//           beforeEach(async function () {
//             await token.approve(spender.address, new BN(1), { from: initialHolder });
//           });

//           it('increases the spender allowance adding the requested amount', async function () {
//             await token.connect(initialHolder).increaseAllowance(spender.address, amount);

//             expect(await token.allowance(initialHolder.address, spender.address)).to.be.bignumber.equal(amount.addn(1));
//           });
//         });
//       });
//     });

//     describe('when the spender is the zero address', function () {
//       const spender = ZERO_ADDRESS;

//       it('reverts', async function () {
//         await expectRevert(
//           token.increaseAllowance(spender, amount, { from: initialHolder.address }),
//           'ERC20: approve to the zero address',
//         );
//       });
//     });
//   });

//   describe('mint', function () {
//     const amount = new BN(50);
//     it('rejects a null account', async function () {
//       await expectRevert(token.mint(ZERO_ADDRESS, amount), 'ERC20: mint to the zero address');
//     });

//     describe('for a non zero account', function () {
//       beforeEach('minting', async function () {
//         this.receipt = await token.mint(recipient.address, amount);
//       });

//       it('increments totalSupply', async function () {
//         const expectedSupply = initialSupply.add(amount);
//         expect(await token.totalSupply()).to.be.bignumber.equal(expectedSupply);
//       });

//       it('increments recipient balance', async function () {
//         expect(await token.balanceOf(recipient.address)).to.be.bignumber.equal(amount);
//       });

//       it('emits Transfer event', async function () {
//         const event = expectEvent(this.receipt, 'Transfer', { from: ZERO_ADDRESS, to: recipient });

//         expect(event.args.value).to.be.bignumber.equal(amount);
//       });
//     });
//   });


//   describe('transfer', function () {
//     shouldBehaveLikeERC20Transfer('ERC20', initialHolder.address, recipient.address, initialSupply,
//      function (from: signerOrProvider, to: string, amount: PromiseOrValue<BigNumberish>) {
//       return token.connect(from).transfer( to, amount);
//     });

//     describe('when the sender is the zero address', function () {
//       it('reverts', async function () {
//         await expectRevert(
//           token.transfer(ZERO_ADDRESS, recipient.address, initialSupply),
//           'ERC20: transfer from the zero address',
//         );
//       });
//     });
//   });

//   describe('approve', function () {
//     shouldBehaveLikeERC20Approve('ERC20', initialHolder.address, recipient.address, initialSupply,
//     function (owner: signerOrProvider, spender: string, amount: BN) {
//       return token.connect(owner).approve(spender, amount);
//     });

//     describe('when the owner is the zero address', function () {
//       it('reverts', async function () {
//         await expectRevert(
//           token.approve(ZERO_ADDRESS, recipient.address, initialSupply),
//           'ERC20: approve from the zero address',
//         );
//       });
//     });
//   });
// });
