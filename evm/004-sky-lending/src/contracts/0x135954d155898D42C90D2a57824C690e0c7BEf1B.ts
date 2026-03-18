import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'
import { ContractBase, event, fun, indexed, viewFun } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'

export const events = {
  Bark: event(
    '0x85258d09e1e4ef299ff3fc11e74af99563f022d21f3f940db982229dc2a3358c',
    'Bark(bytes32,address,uint256,uint256,uint256,address,uint256)',
    {
      ilk: indexed(p.bytes32),
      urn: indexed(p.address),
      ink: p.uint256,
      art: p.uint256,
      due: p.uint256,
      clip: p.address,
      id: indexed(p.uint256),
    },
  ),
  Cage: event('0x2308ed18a14e800c39b86eb6ea43270105955ca385b603b64eca89f98ae8fbda', 'Cage()', {}),
  Deny: event('0x184450df2e323acec0ed3b5c7531b81f9b4cdef7914dfd4c0a4317416bb5251b', 'Deny(address)', {
    usr: indexed(p.address),
  }),
  Digs: event('0x54f095dc7308776bf01e8580e4dd40fd959ea4bf50b069975768320ef8d77d8a', 'Digs(bytes32,uint256)', {
    ilk: indexed(p.bytes32),
    rad: p.uint256,
  }),
  'File(bytes32 indexed,uint256)': event(
    '0xe986e40cc8c151830d4f61050f4fb2e4add8567caad2d5f5496f9158e91fe4c7',
    'File(bytes32,uint256)',
    { what: indexed(p.bytes32), data: p.uint256 },
  ),
  'File(bytes32 indexed,address)': event(
    '0x8fef588b5fc1afbf5b2f06c1a435d513f208da2e6704c3d8f0e0ec91167066ba',
    'File(bytes32,address)',
    { what: indexed(p.bytes32), data: p.address },
  ),
  'File(bytes32 indexed,bytes32 indexed,uint256)': event(
    '0x851aa1caf4888170ad8875449d18f0f512fd6deb2a6571ea1a41fb9f95acbcd1',
    'File(bytes32,bytes32,uint256)',
    { ilk: indexed(p.bytes32), what: indexed(p.bytes32), data: p.uint256 },
  ),
  'File(bytes32 indexed,bytes32 indexed,address)': event(
    '0x4ff2caaa972a7c6629ea01fae9c93d73cc307d13ea4c369f9bbbb7f9b7e9461d',
    'File(bytes32,bytes32,address)',
    { ilk: indexed(p.bytes32), what: indexed(p.bytes32), clip: p.address },
  ),
  Rely: event('0xdd0e34038ac38b2a1ce960229778ac48a8719bc900b6c4f8d0475c6e8b385a60', 'Rely(address)', {
    usr: indexed(p.address),
  }),
}

export const functions = {
  Dirt: viewFun('0xeda6e121', 'Dirt()', {}, p.uint256),
  Hole: viewFun('0xaf7cfeb1', 'Hole()', {}, p.uint256),
  bark: fun(
    '0xed998908',
    'bark(bytes32,address,address)',
    { ilk: p.bytes32, urn: p.address, kpr: p.address },
    p.uint256,
  ),
  cage: fun('0x69245009', 'cage()', {}),
  chop: viewFun('0xd7926538', 'chop(bytes32)', { ilk: p.bytes32 }, p.uint256),
  deny: fun('0x9c52a7f1', 'deny(address)', { usr: p.address }),
  digs: fun('0xc87193f4', 'digs(bytes32,uint256)', { ilk: p.bytes32, rad: p.uint256 }),
  'file(bytes32,bytes32,uint256)': fun('0x1a0b287e', 'file(bytes32,bytes32,uint256)', {
    ilk: p.bytes32,
    what: p.bytes32,
    data: p.uint256,
  }),
  'file(bytes32,uint256)': fun('0x29ae8114', 'file(bytes32,uint256)', { what: p.bytes32, data: p.uint256 }),
  'file(bytes32,address)': fun('0xd4e8be83', 'file(bytes32,address)', { what: p.bytes32, data: p.address }),
  'file(bytes32,bytes32,address)': fun('0xebecb39d', 'file(bytes32,bytes32,address)', {
    ilk: p.bytes32,
    what: p.bytes32,
    clip: p.address,
  }),
  ilks: viewFun(
    '0xd9638d36',
    'ilks(bytes32)',
    { _0: p.bytes32 },
    { clip: p.address, chop: p.uint256, hole: p.uint256, dirt: p.uint256 },
  ),
  live: viewFun('0x957aa58c', 'live()', {}, p.uint256),
  rely: fun('0x65fae35e', 'rely(address)', { usr: p.address }),
  vat: viewFun('0x36569e77', 'vat()', {}, p.address),
  vow: viewFun('0x626cb3c5', 'vow()', {}, p.address),
  wards: viewFun('0xbf353dbb', 'wards(address)', { _0: p.address }, p.uint256),
}

export class Contract extends ContractBase {
  Dirt() {
    return this.eth_call(functions.Dirt, {})
  }

  Hole() {
    return this.eth_call(functions.Hole, {})
  }

  chop(ilk: ChopParams['ilk']) {
    return this.eth_call(functions.chop, { ilk })
  }

  ilks(_0: IlksParams['_0']) {
    return this.eth_call(functions.ilks, { _0 })
  }

  live() {
    return this.eth_call(functions.live, {})
  }

  vat() {
    return this.eth_call(functions.vat, {})
  }

  vow() {
    return this.eth_call(functions.vow, {})
  }

  wards(_0: WardsParams['_0']) {
    return this.eth_call(functions.wards, { _0 })
  }
}

/// Event types
export type BarkEventArgs = EParams<typeof events.Bark>
export type CageEventArgs = EParams<typeof events.Cage>
export type DenyEventArgs = EParams<typeof events.Deny>
export type DigsEventArgs = EParams<typeof events.Digs>
export type FileEventArgs_0 = EParams<(typeof events)['File(bytes32 indexed,uint256)']>
export type FileEventArgs_1 = EParams<(typeof events)['File(bytes32 indexed,address)']>
export type FileEventArgs_2 = EParams<(typeof events)['File(bytes32 indexed,bytes32 indexed,uint256)']>
export type FileEventArgs_3 = EParams<(typeof events)['File(bytes32 indexed,bytes32 indexed,address)']>
export type RelyEventArgs = EParams<typeof events.Rely>

/// Function types
export type DirtParams = FunctionArguments<typeof functions.Dirt>
export type DirtReturn = FunctionReturn<typeof functions.Dirt>

export type HoleParams = FunctionArguments<typeof functions.Hole>
export type HoleReturn = FunctionReturn<typeof functions.Hole>

export type BarkParams = FunctionArguments<typeof functions.bark>
export type BarkReturn = FunctionReturn<typeof functions.bark>

export type CageParams = FunctionArguments<typeof functions.cage>
export type CageReturn = FunctionReturn<typeof functions.cage>

export type ChopParams = FunctionArguments<typeof functions.chop>
export type ChopReturn = FunctionReturn<typeof functions.chop>

export type DenyParams = FunctionArguments<typeof functions.deny>
export type DenyReturn = FunctionReturn<typeof functions.deny>

export type DigsParams = FunctionArguments<typeof functions.digs>
export type DigsReturn = FunctionReturn<typeof functions.digs>

export type FileParams_0 = FunctionArguments<(typeof functions)['file(bytes32,bytes32,uint256)']>
export type FileReturn_0 = FunctionReturn<(typeof functions)['file(bytes32,bytes32,uint256)']>

export type FileParams_1 = FunctionArguments<(typeof functions)['file(bytes32,uint256)']>
export type FileReturn_1 = FunctionReturn<(typeof functions)['file(bytes32,uint256)']>

export type FileParams_2 = FunctionArguments<(typeof functions)['file(bytes32,address)']>
export type FileReturn_2 = FunctionReturn<(typeof functions)['file(bytes32,address)']>

export type FileParams_3 = FunctionArguments<(typeof functions)['file(bytes32,bytes32,address)']>
export type FileReturn_3 = FunctionReturn<(typeof functions)['file(bytes32,bytes32,address)']>

export type IlksParams = FunctionArguments<typeof functions.ilks>
export type IlksReturn = FunctionReturn<typeof functions.ilks>

export type LiveParams = FunctionArguments<typeof functions.live>
export type LiveReturn = FunctionReturn<typeof functions.live>

export type RelyParams = FunctionArguments<typeof functions.rely>
export type RelyReturn = FunctionReturn<typeof functions.rely>

export type VatParams = FunctionArguments<typeof functions.vat>
export type VatReturn = FunctionReturn<typeof functions.vat>

export type VowParams = FunctionArguments<typeof functions.vow>
export type VowReturn = FunctionReturn<typeof functions.vow>

export type WardsParams = FunctionArguments<typeof functions.wards>
export type WardsReturn = FunctionReturn<typeof functions.wards>
