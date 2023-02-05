/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Vesting, VestingInterface } from "../../contracts/Vesting";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256[35]",
        name: "_cumulativeAmountsToVest",
        type: "uint256[35]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "withdrawPercentage",
        type: "uint256",
      },
    ],
    name: "LogRecipientAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "setter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startDate",
        type: "uint256",
      },
    ],
    name: "LogStartDateSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LogTokensClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_recipients",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_withdrawPercentages",
        type: "uint256[]",
      },
    ],
    name: "addMultipleRecipients",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_recipientAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_withdrawPercentage",
        type: "uint256",
      },
    ],
    name: "addRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "cumulativeAmountsToVest",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hasClaim",
    outputs: [
      {
        internalType: "uint256",
        name: "_owedAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "recipients",
    outputs: [
      {
        internalType: "uint256",
        name: "withdrawnAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "withdrawPercentage",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_startDate",
        type: "uint256",
      },
    ],
    name: "setStartDate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startDate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalPercentages",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRecipients",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200102b3803806200102b833981016040819052620000349162000199565b6200003f33620000d9565b6001600160a01b038216620000a65760405162461bcd60e51b815260206004820152602360248201527f546f6b656e20416464726573732063616e2774206265207a65726f206164647260448201526265737360e81b606482015260840160405180910390fd5b602680546001600160a01b0319166001600160a01b038416179055620000d0600282602362000129565b50505062000242565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b82602381019282156200015a579160200282015b828111156200015a5782518255916020019190600101906200013d565b50620001689291506200016c565b5090565b5b808211156200016857600081556001016200016d565b634e487b7160e01b600052604160045260246000fd5b600080610480808486031215620001af57600080fd5b83516001600160a01b0381168114620001c757600080fd5b92506020603f85018613620001db57600080fd5b60405161046081016001600160401b038111828210171562000201576200020162000183565b6040529185019180878411156200021757600080fd5b8287015b848110156200023457805182529083019083016200021b565b509497909650945050505050565b610dd980620002526000396000f3fe608060405234801561001057600080fd5b50600436106100df5760003560e01c806382d95df51161008c578063eb82031211610066578063eb82031214610177578063f2fde38b146101b3578063f4f8495b146101c6578063f7982243146101cf57600080fd5b806382d95df5146101365780638da5cb5b14610149578063e3eb15991461016457600080fd5b80634e71d92d116100bd5780634e71d92d1461011d57806356fcdae314610125578063715018a61461012e57600080fd5b80630b97bc86146100e4578063114a76a1146101005780633e2c3a5a14610115575b600080fd5b6100ed60015481565b6040519081526020015b60405180910390f35b61011361010e366004610bb0565b6101e2565b005b6100ed61033c565b61011361035e565b6100ed60255481565b61011361052a565b610113610144366004610c70565b61053e565b6000546040516001600160a01b0390911681526020016100f7565b6100ed610172366004610c70565b6105d7565b61019e610185366004610c89565b6028602052600090815260409020805460019091015482565b604080519283526020830191909152016100f7565b6101136101c1366004610c89565b6105ee565b6100ed60275481565b6101136101dd366004610cab565b61067e565b6101ea6108d7565b60e68251106102665760405162461bcd60e51b815260206004820152602860248201527f54686520726563697069656e7473206d757374206265206e6f74206d6f72652060448201527f7468616e2032333000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b80518251146102dd5760405162461bcd60e51b815260206004820152602860248201527f5468652074776f2061727279617320617265207769746820646966666572656e60448201527f74206c656e677468000000000000000000000000000000000000000000000000606482015260840161025d565b60005b8251811015610337576103258382815181106102fe576102fe610cd5565b602002602001015183838151811061031857610318610cd5565b602002602001015161067e565b8061032f81610d01565b9150506102e0565b505050565b6000600154421161034d5750600090565b6000610357610931565b5092915050565b6001546000036103b05760405162461bcd60e51b815260206004820152601a60248201527f5468652076657374696e67206861736e27742073746172746564000000000000604482015260640161025d565b6001544210156104025760405162461bcd60e51b815260206004820152601a60248201527f5468652076657374696e67206861736e27742073746172746564000000000000604482015260640161025d565b60008061040d610931565b33600081815260286020526040808220849055602654905163a9059cbb60e01b815260048101939093526024830185905293955091935090916001600160a01b03169063a9059cbb906044016020604051808303816000875af1158015610478573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061049c9190610d1a565b9050806104eb5760405162461bcd60e51b815260206004820152601c60248201527f54686520636c61696d20776173206e6f74207375636365737366756c00000000604482015260640161025d565b60408051338152602081018590527fcb3b287df62322e81cc5b4c1ba9d9f5a449e34069d403b00eb061faed581737b91015b60405180910390a1505050565b6105326108d7565b61053c6000610a56565b565b6105466108d7565b428110156105965760405162461bcd60e51b815260206004820152601f60248201527f537461727420446174652063616e277420626520696e20746865207061737400604482015260640161025d565b600181905560408051338152602081018390527fe5461405d7121c89a6fa291896d72f0514ac8957d0839feae0b904b5065e51a8910160405180910390a150565b600281602381106105e757600080fd5b0154905081565b6105f66108d7565b6001600160a01b0381166106725760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f6464726573730000000000000000000000000000000000000000000000000000606482015260840161025d565b61067b81610a56565b50565b6106866108d7565b80620186a081106106ff5760405162461bcd60e51b815260206004820152602c60248201527f50726f76696465642070657263656e746167652073686f756c64206265206c6560448201527f7373207468616e20313030250000000000000000000000000000000000000000606482015260840161025d565b600081116107755760405162461bcd60e51b815260206004820152602c60248201527f50726f76696465642070657263656e746167652073686f756c6420626520677260448201527f6561746572207468616e20300000000000000000000000000000000000000000606482015260840161025d565b6001600160a01b0383166107f15760405162461bcd60e51b815260206004820152602760248201527f526563657069656e7420416464726573732063616e2774206265207a65726f2060448201527f6164647265737300000000000000000000000000000000000000000000000000606482015260840161025d565b816025546107ff9190610d3c565b6025819055620186a010156108565760405162461bcd60e51b815260206004820152601e60248201527f546f74616c2070657263656e7461676573206578636565647320313030250000604482015260640161025d565b6027805490600061086683610d01565b9091555050604080518082018252600080825260208083018681526001600160a01b0388168084526028835292859020935184555160019093019290925582519081529081018490527f595c5a9418c2ea607b802dfdeac0ce122b959c5eb469f9c0bf86c1e262e7c72f910161051d565b6000546001600160a01b0316331461053c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161025d565b600080600062278d00600154426109489190610d55565b6109529190610d68565b90506023811061096b5761096860016023610d55565b90505b600073__$542b321ac4500581434ba7ee99683f852f$__63a391c15b6002846023811061099a5761099a610cd5565b0154336000908152602860205260409081902060010154905160e084901b7fffffffff0000000000000000000000000000000000000000000000000000000016815260048101929092526024820152604401602060405180830381865af4158015610a09573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a2d9190610d8a565b3360009081526028602052604081205491925090610a4b9083610d55565b959194509092505050565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff81118282101715610afd57610afd610abe565b604052919050565b600067ffffffffffffffff821115610b1f57610b1f610abe565b5060051b60200190565b80356001600160a01b0381168114610b4057600080fd5b919050565b600082601f830112610b5657600080fd5b81356020610b6b610b6683610b05565b610ad4565b82815260059290921b84018101918181019086841115610b8a57600080fd5b8286015b84811015610ba55780358352918301918301610b8e565b509695505050505050565b60008060408385031215610bc357600080fd5b823567ffffffffffffffff80821115610bdb57600080fd5b818501915085601f830112610bef57600080fd5b81356020610bff610b6683610b05565b82815260059290921b84018101918181019089841115610c1e57600080fd5b948201945b83861015610c4357610c3486610b29565b82529482019490820190610c23565b96505086013592505080821115610c5957600080fd5b50610c6685828601610b45565b9150509250929050565b600060208284031215610c8257600080fd5b5035919050565b600060208284031215610c9b57600080fd5b610ca482610b29565b9392505050565b60008060408385031215610cbe57600080fd5b610cc783610b29565b946020939093013593505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060018201610d1357610d13610ceb565b5060010190565b600060208284031215610d2c57600080fd5b81518015158114610ca457600080fd5b80820180821115610d4f57610d4f610ceb565b92915050565b81810381811115610d4f57610d4f610ceb565b600082610d8557634e487b7160e01b600052601260045260246000fd5b500490565b600060208284031215610d9c57600080fd5b505191905056fea2646970667358221220f2fd00a3445248570d5e27053fbfd7eb929c3d3e5aa07988918acc29a47b25d164736f6c63430008110033";

type VestingConstructorParams =
  | [linkLibraryAddresses: VestingLibraryAddresses, signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VestingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => {
  return (
    typeof xs[0] === "string" ||
    (Array.isArray as (arg: any) => arg is readonly any[])(xs[0]) ||
    "_isInterface" in xs[0]
  );
};

export class Vesting__factory extends ContractFactory {
  constructor(...args: VestingConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      const [linkLibraryAddresses, signer] = args;
      super(_abi, Vesting__factory.linkBytecode(linkLibraryAddresses), signer);
    }
  }

  static linkBytecode(linkLibraryAddresses: VestingLibraryAddresses): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$542b321ac4500581434ba7ee99683f852f\\$__", "g"),
      linkLibraryAddresses[
        "contracts/PercentageCalculator.sol:PercentageCalculator"
      ]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  override deploy(
    _tokenAddress: PromiseOrValue<string>,
    _cumulativeAmountsToVest: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Vesting> {
    return super.deploy(
      _tokenAddress,
      _cumulativeAmountsToVest,
      overrides || {}
    ) as Promise<Vesting>;
  }
  override getDeployTransaction(
    _tokenAddress: PromiseOrValue<string>,
    _cumulativeAmountsToVest: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _tokenAddress,
      _cumulativeAmountsToVest,
      overrides || {}
    );
  }
  override attach(address: string): Vesting {
    return super.attach(address) as Vesting;
  }
  override connect(signer: Signer): Vesting__factory {
    return super.connect(signer) as Vesting__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VestingInterface {
    return new utils.Interface(_abi) as VestingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Vesting {
    return new Contract(address, _abi, signerOrProvider) as Vesting;
  }
}

export interface VestingLibraryAddresses {
  ["contracts/PercentageCalculator.sol:PercentageCalculator"]: string;
}
