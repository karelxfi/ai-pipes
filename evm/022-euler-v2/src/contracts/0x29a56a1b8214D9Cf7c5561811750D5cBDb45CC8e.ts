import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Genesis: event("0x6bf6eaff5e9af8fbccb949f4c38cc016936f8775363ccf4224db160365785d52", "Genesis()", {}),
    ProxyCreated: event("0x04e664079117e113faa9684bc14aecb41651cbf098b14eda271248c6d0cda57c", "ProxyCreated(address,bool,address,bytes)", {"proxy": indexed(p.address), "upgradeable": p.bool, "implementation": p.address, "trailingData": p.bytes}),
    SetImplementation: event("0xddebe6de740fe0dd01cc33ffa314d11c6ac6acbbe50b80513c4c360ae7aa4f04", "SetImplementation(address)", {"newImplementation": indexed(p.address)}),
    SetUpgradeAdmin: event("0x7b1ebd0f3ec81bf1cd5f478166ec87beaea1eee7f3bc2612295ae161048a239f", "SetUpgradeAdmin(address)", {"newUpgradeAdmin": indexed(p.address)}),
}

export const functions = {
    createProxy: fun("0x83e85b27", "createProxy(address,bool,bytes)", {"desiredImplementation": p.address, "upgradeable": p.bool, "trailingData": p.bytes}, p.address),
    getProxyConfig: viewFun("0xa20ea5c1", "getProxyConfig(address)", {"proxy": p.address}, p.struct({"upgradeable": p.bool, "implementation": p.address, "trailingData": p.bytes})),
    getProxyListLength: viewFun("0x0a68b7ba", "getProxyListLength()", {}, p.uint256),
    getProxyListSlice: viewFun("0xc0e96df6", "getProxyListSlice(uint256,uint256)", {"start": p.uint256, "end": p.uint256}, p.array(p.address)),
    implementation: viewFun("0x5c60da1b", "implementation()", {}, p.address),
    isProxy: viewFun("0x29710388", "isProxy(address)", {"proxy": p.address}, p.bool),
    proxyList: viewFun("0x378cdb62", "proxyList(uint256)", {"_0": p.uint256}, p.address),
    setImplementation: fun("0xd784d426", "setImplementation(address)", {"newImplementation": p.address}, ),
    setUpgradeAdmin: fun("0x9342f417", "setUpgradeAdmin(address)", {"newUpgradeAdmin": p.address}, ),
    upgradeAdmin: viewFun("0xc4d5608a", "upgradeAdmin()", {}, p.address),
}

export class Contract extends ContractBase {

    getProxyConfig(proxy: GetProxyConfigParams["proxy"]) {
        return this.eth_call(functions.getProxyConfig, {proxy})
    }

    getProxyListLength() {
        return this.eth_call(functions.getProxyListLength, {})
    }

    getProxyListSlice(start: GetProxyListSliceParams["start"], end: GetProxyListSliceParams["end"]) {
        return this.eth_call(functions.getProxyListSlice, {start, end})
    }

    implementation() {
        return this.eth_call(functions.implementation, {})
    }

    isProxy(proxy: IsProxyParams["proxy"]) {
        return this.eth_call(functions.isProxy, {proxy})
    }

    proxyList(_0: ProxyListParams["_0"]) {
        return this.eth_call(functions.proxyList, {_0})
    }

    upgradeAdmin() {
        return this.eth_call(functions.upgradeAdmin, {})
    }
}

/// Event types
export type GenesisEventArgs = EParams<typeof events.Genesis>
export type ProxyCreatedEventArgs = EParams<typeof events.ProxyCreated>
export type SetImplementationEventArgs = EParams<typeof events.SetImplementation>
export type SetUpgradeAdminEventArgs = EParams<typeof events.SetUpgradeAdmin>

/// Function types
export type CreateProxyParams = FunctionArguments<typeof functions.createProxy>
export type CreateProxyReturn = FunctionReturn<typeof functions.createProxy>

export type GetProxyConfigParams = FunctionArguments<typeof functions.getProxyConfig>
export type GetProxyConfigReturn = FunctionReturn<typeof functions.getProxyConfig>

export type GetProxyListLengthParams = FunctionArguments<typeof functions.getProxyListLength>
export type GetProxyListLengthReturn = FunctionReturn<typeof functions.getProxyListLength>

export type GetProxyListSliceParams = FunctionArguments<typeof functions.getProxyListSlice>
export type GetProxyListSliceReturn = FunctionReturn<typeof functions.getProxyListSlice>

export type ImplementationParams = FunctionArguments<typeof functions.implementation>
export type ImplementationReturn = FunctionReturn<typeof functions.implementation>

export type IsProxyParams = FunctionArguments<typeof functions.isProxy>
export type IsProxyReturn = FunctionReturn<typeof functions.isProxy>

export type ProxyListParams = FunctionArguments<typeof functions.proxyList>
export type ProxyListReturn = FunctionReturn<typeof functions.proxyList>

export type SetImplementationParams = FunctionArguments<typeof functions.setImplementation>
export type SetImplementationReturn = FunctionReturn<typeof functions.setImplementation>

export type SetUpgradeAdminParams = FunctionArguments<typeof functions.setUpgradeAdmin>
export type SetUpgradeAdminReturn = FunctionReturn<typeof functions.setUpgradeAdmin>

export type UpgradeAdminParams = FunctionArguments<typeof functions.upgradeAdmin>
export type UpgradeAdminReturn = FunctionReturn<typeof functions.upgradeAdmin>

