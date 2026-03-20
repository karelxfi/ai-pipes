import * as p from '@subsquid/evm-codec'
import { event, indexed } from '@subsquid/evm-abi'

export const events = {
  ExchangeRateUpdated: event(
    '0xf525f19964f35afcb9a475680bb27abecbc5e62b4d6d4f66a81a5bd7e8a107e3',
    'ExchangeRateUpdated(uint256,uint256,uint256,uint256)',
    { reportingBlockNumber: p.uint256, totalETHBalance: p.uint256, totalETHXSupply: p.uint256, timestamp: p.uint256 }
  ),
  ExchangeRateSubmitted: event(
    '0x6c291a7ce9906b2982643002c104cb0ba9f2b9fecc8b38e9cc3cf5cfca65b4e8',
    'ExchangeRateSubmitted(address,uint256,uint256,uint256,uint256)',
    { sender: indexed(p.address), reportingBlockNumber: p.uint256, totalETHBalance: p.uint256, totalETHXSupply: p.uint256, timestamp: p.uint256 }
  ),
  ValidatorStatsUpdated: event(
    '0xbc1a0795e699bbeaa982f6049ae9689f4d0e3e22d554adb7c46626be62f3b8bc',
    'ValidatorStatsUpdated(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)',
    { reportingBlockNumber: p.uint256, exitingValidatorsBalance: p.uint256, exitedValidatorsBalance: p.uint256, slashedValidatorsBalance: p.uint256, exitingValidatorsCount: p.uint256, exitedValidatorsCount: p.uint256, slashedValidatorsCount: p.uint256, timestamp: p.uint256 }
  ),
}
