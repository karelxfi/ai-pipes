import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Harvested: event("0x121c5042302bae5fc561fbc64368f297ca60a880878e1e3a7f7e9380377260bf", "Harvested(address,uint256)", {"caller": indexed(p.address), "assets": p.uint256}),
    MevReceived: event("0x7cb3607a76b32d6d17ca5d1aeb444650b19ac0fabbb1f24c93a0da57346b5610", "MevReceived(uint256)", {"assets": p.uint256}),
}

export const functions = {
    harvest: fun("0xddc63262", "harvest(uint256)", {"assets": p.uint256}, ),
}

export class Contract extends ContractBase {
}

/// Event types
export type HarvestedEventArgs = EParams<typeof events.Harvested>
export type MevReceivedEventArgs = EParams<typeof events.MevReceived>

/// Function types
export type HarvestParams = FunctionArguments<typeof functions.harvest>
export type HarvestReturn = FunctionReturn<typeof functions.harvest>

