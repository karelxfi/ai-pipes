import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'
import { ContractBase, event, fun, indexed, viewFun } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'

export const events = {
  AdminChanged: event(
    '0x7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f',
    'AdminChanged(address,address)',
    { previousAdmin: p.address, newAdmin: p.address },
  ),
  BeaconUpgraded: event(
    '0x1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e',
    'BeaconUpgraded(address)',
    { beacon: indexed(p.address) },
  ),
  Upgraded: event('0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b', 'Upgraded(address)', {
    implementation: indexed(p.address),
  }),
}

export const functions = {
  admin: fun('0xf851a440', 'admin()', {}, p.address),
  changeAdmin: fun('0x8f283970', 'changeAdmin(address)', { newAdmin: p.address }),
  implementation: fun('0x5c60da1b', 'implementation()', {}, p.address),
  upgradeTo: fun('0x3659cfe6', 'upgradeTo(address)', { newImplementation: p.address }),
  upgradeToAndCall: fun('0x4f1ef286', 'upgradeToAndCall(address,bytes)', {
    newImplementation: p.address,
    data: p.bytes,
  }),
}

export class Contract extends ContractBase {}

/// Event types
export type AdminChangedEventArgs = EParams<typeof events.AdminChanged>
export type BeaconUpgradedEventArgs = EParams<typeof events.BeaconUpgraded>
export type UpgradedEventArgs = EParams<typeof events.Upgraded>

/// Function types
export type AdminParams = FunctionArguments<typeof functions.admin>
export type AdminReturn = FunctionReturn<typeof functions.admin>

export type ChangeAdminParams = FunctionArguments<typeof functions.changeAdmin>
export type ChangeAdminReturn = FunctionReturn<typeof functions.changeAdmin>

export type ImplementationParams = FunctionArguments<typeof functions.implementation>
export type ImplementationReturn = FunctionReturn<typeof functions.implementation>

export type UpgradeToParams = FunctionArguments<typeof functions.upgradeTo>
export type UpgradeToReturn = FunctionReturn<typeof functions.upgradeTo>

export type UpgradeToAndCallParams = FunctionArguments<typeof functions.upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof functions.upgradeToAndCall>
