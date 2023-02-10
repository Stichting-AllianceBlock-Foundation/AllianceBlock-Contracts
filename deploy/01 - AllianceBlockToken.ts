import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { verifyContract } from "../utils/verifyContract";
import { TOKEN_NAME, TOKEN_SYMBOL } from "../utils/constants";
import { ethers } from "ethers";
import { SALT, MAX_TOTAL_SUPPLY } from "../utils/constants";
const version = "v2.0.0";
const contractName = "AllianceBlockToken";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    console.log(`Deploying ${contractName} ${version}`);
    const { deployments, getNamedAccounts, network } = hre;

    const { deploy } = deployments;

    const { deployer, admin } = await getNamedAccounts();

    console.log(`Use contract ${contractName}`);

    const deployResult = await deploy(contractName, {
      from: deployer,
      deterministicDeployment: ethers.utils.formatBytes32String(SALT),
      proxy: {
        owner: admin,
        proxyContract: "OptimizedTransparentProxy",
        execute: {
          init: {
            methodName: "init",
            args: [TOKEN_NAME, TOKEN_SYMBOL, admin, MAX_TOTAL_SUPPLY],
          },
        },
      },
      gasLimit: 4000000,
      log: true,
    });

    await verifyContract(network, deployResult, contractName);

    return true;
  }

  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  await main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
};

const id = contractName + version;

export default func;
func.tags = [contractName, version, "upgrade"];
func.id = id;
