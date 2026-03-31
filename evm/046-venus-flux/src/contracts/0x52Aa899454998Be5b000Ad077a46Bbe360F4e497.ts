import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'
import { ContractBase, event, fun, indexed, viewFun } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'

export const events = {
  LogRemoveImplementation: event(
    '0xda53aaefabec4c3f8ba693a2e3c67fa0152fbd71c369d51f669e66b28a4a0864',
    'LogRemoveImplementation(address)',
    { implementation: indexed(p.address) },
  ),
  LogSetAdmin: event(
    '0xb2396a4169c0fac3eb0713eb7d54220cbe5e21e585a59578ec4de929657c0733',
    'LogSetAdmin(address,address)',
    { oldAdmin: indexed(p.address), newAdmin: indexed(p.address) },
  ),
  LogSetDummyImplementation: event(
    '0x761380f4203cd2fcc7ee1ae32561463bc08bbf6761cb9d5caa925f99a6d54502',
    'LogSetDummyImplementation(address,address)',
    { oldDummyImplementation: indexed(p.address), newDummyImplementation: indexed(p.address) },
  ),
  LogSetImplementation: event(
    '0xd613a4a18e567ee1f2db4d5b528a5fee09f7dff92d6fb708afd6c095070a9c6d',
    'LogSetImplementation(address,bytes4[])',
    { implementation: indexed(p.address), sigs: p.array(p.bytes4) },
  ),
}

export const functions = {
  addImplementation: fun('0xf0c01b42', 'addImplementation(address,bytes4[])', {
    implementation_: p.address,
    sigs_: p.array(p.bytes4),
  }),
  getAdmin: viewFun('0x6e9960c3', 'getAdmin()', {}, p.address),
  getDummyImplementation: viewFun('0x908bfe5e', 'getDummyImplementation()', {}, p.address),
  getImplementationSigs: viewFun(
    '0x89396dc8',
    'getImplementationSigs(address)',
    { impl_: p.address },
    p.array(p.bytes4),
  ),
  getSigsImplementation: viewFun('0xa5fcc8bc', 'getSigsImplementation(bytes4)', { sig_: p.bytes4 }, p.address),
  readFromStorage: viewFun('0xb5c736e4', 'readFromStorage(bytes32)', { slot_: p.bytes32 }, p.uint256),
  removeImplementation: fun('0x22175a32', 'removeImplementation(address)', { implementation_: p.address }),
  setAdmin: fun('0x704b6c02', 'setAdmin(address)', { newAdmin_: p.address }),
  setDummyImplementation: fun('0xc39aa07d', 'setDummyImplementation(address)', { newDummyImplementation_: p.address }),
}

export class Contract extends ContractBase {
  getAdmin() {
    return this.eth_call(functions.getAdmin, {})
  }

  getDummyImplementation() {
    return this.eth_call(functions.getDummyImplementation, {})
  }

  getImplementationSigs(impl_: GetImplementationSigsParams['impl_']) {
    return this.eth_call(functions.getImplementationSigs, { impl_ })
  }

  getSigsImplementation(sig_: GetSigsImplementationParams['sig_']) {
    return this.eth_call(functions.getSigsImplementation, { sig_ })
  }

  readFromStorage(slot_: ReadFromStorageParams['slot_']) {
    return this.eth_call(functions.readFromStorage, { slot_ })
  }
}

/// Event types
export type LogRemoveImplementationEventArgs = EParams<typeof events.LogRemoveImplementation>
export type LogSetAdminEventArgs = EParams<typeof events.LogSetAdmin>
export type LogSetDummyImplementationEventArgs = EParams<typeof events.LogSetDummyImplementation>
export type LogSetImplementationEventArgs = EParams<typeof events.LogSetImplementation>

/// Function types
export type AddImplementationParams = FunctionArguments<typeof functions.addImplementation>
export type AddImplementationReturn = FunctionReturn<typeof functions.addImplementation>

export type GetAdminParams = FunctionArguments<typeof functions.getAdmin>
export type GetAdminReturn = FunctionReturn<typeof functions.getAdmin>

export type GetDummyImplementationParams = FunctionArguments<typeof functions.getDummyImplementation>
export type GetDummyImplementationReturn = FunctionReturn<typeof functions.getDummyImplementation>

export type GetImplementationSigsParams = FunctionArguments<typeof functions.getImplementationSigs>
export type GetImplementationSigsReturn = FunctionReturn<typeof functions.getImplementationSigs>

export type GetSigsImplementationParams = FunctionArguments<typeof functions.getSigsImplementation>
export type GetSigsImplementationReturn = FunctionReturn<typeof functions.getSigsImplementation>

export type ReadFromStorageParams = FunctionArguments<typeof functions.readFromStorage>
export type ReadFromStorageReturn = FunctionReturn<typeof functions.readFromStorage>

export type RemoveImplementationParams = FunctionArguments<typeof functions.removeImplementation>
export type RemoveImplementationReturn = FunctionReturn<typeof functions.removeImplementation>

export type SetAdminParams = FunctionArguments<typeof functions.setAdmin>
export type SetAdminReturn = FunctionReturn<typeof functions.setAdmin>

export type SetDummyImplementationParams = FunctionArguments<typeof functions.setDummyImplementation>
export type SetDummyImplementationReturn = FunctionReturn<typeof functions.setDummyImplementation>
