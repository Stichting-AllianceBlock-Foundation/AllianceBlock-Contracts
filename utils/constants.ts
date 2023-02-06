import * as dotenv from 'dotenv';

dotenv.config();

export const accounts = !process.env.PRIVATE_KEY && !process.env.HDWALLET_MNEMONIC
  ?  undefined
  : process.env.PRIVATE_KEY
    ? [process.env.PRIVATE_KEY]
    : {
      mnemonic: process.env.HDWALLET_MNEMONIC
    }

export const SALT = process.env.SALT || 'AllianceBlockSalt';

export const forking = {
  enabled: process.env.FORK_ENABLED || false,
  url: process.env.ALCHEMY_URL,
  blockNumber: process.env.FORK_BLOCK_NUMBER
}

export const INFURA_API_KEY = process.env.INFURA_API_KEY || ''

export const TOKEN_NAME = 'AllianceBlock Nexera Token';

export const TOKEN_SYMBOL = 'NXRA';
