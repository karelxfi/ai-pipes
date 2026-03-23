import {address, array, bool, i128, option, struct, u128, u8, unit} from '@subsquid/borsh'
import {instruction} from '../abi.support.js'
import {AddressBool, AddressU8, RateDataV1Params, RateDataV2Params, TokenConfig, TransferType, UserBorrowConfig, UserSupplyConfig} from './types.js'

export interface ChangeStatus {
    status: boolean
}

export const changeStatus = instruction(
    {
        d8: '0xec9183e4e311c0ff',
    },
    {
        authority: 0,
        liquidity: 1,
        authList: 2,
    },
    struct({
        status: bool,
    }),
)

export interface Claim {
    recipient: string
}

export const claim = instruction(
    {
        d8: '0x3ec6d6c1d59f6cd2',
    },
    {
        user: 0,
        liquidity: 1,
        tokenReserve: 2,
        mint: 3,
        recipientTokenAccount: 4,
        vault: 5,
        claimAccount: 6,
        tokenProgram: 7,
        associatedTokenProgram: 8,
    },
    struct({
        recipient: address,
    }),
)

export interface CloseClaimAccount {
    _mint: string
}

export const closeClaimAccount = instruction(
    {
        d8: '0xf192cbd83ade5b76',
    },
    {
        user: 0,
        claimAccount: 1,
        systemProgram: 2,
    },
    struct({
        _mint: address,
    }),
)

export type CollectRevenue = undefined

export const collectRevenue = instruction(
    {
        d8: '0x5760d324f02bf657',
    },
    {
        authority: 0,
        liquidity: 1,
        authList: 2,
        mint: 3,
        revenueCollectorAccount: 4,
        revenueCollector: 5,
        tokenReserve: 6,
        vault: 7,
        tokenProgram: 8,
        associatedTokenProgram: 9,
        systemProgram: 10,
    },
    unit,
)

export interface InitClaimAccount {
    mint: string
    user: string
}

export const initClaimAccount = instruction(
    {
        d8: '0x708d2faa2a639091',
    },
    {
        signer: 0,
        claimAccount: 1,
        systemProgram: 2,
    },
    struct({
        mint: address,
        user: address,
    }),
)

export interface InitLiquidity {
    authority: string
    revenueCollector: string
}

export const initLiquidity = instruction(
    {
        d8: '0x5fbdd8b7bc3ef46c',
    },
    {
        signer: 0,
        liquidity: 1,
        authList: 2,
        systemProgram: 3,
    },
    struct({
        authority: address,
        revenueCollector: address,
    }),
)

export interface InitNewProtocol {
    supplyMint: string
    borrowMint: string
    protocol: string
}

export const initNewProtocol = instruction(
    {
        d8: '0xc19305208a87d59e',
    },
    {
        authority: 0,
        authList: 1,
        userSupplyPosition: 2,
        userBorrowPosition: 3,
        systemProgram: 4,
    },
    struct({
        supplyMint: address,
        borrowMint: address,
        protocol: address,
    }),
)

export type InitTokenReserve = undefined

export const initTokenReserve = instruction(
    {
        d8: '0xe4eb41819f0f0654',
    },
    {
        authority: 0,
        liquidity: 1,
        authList: 2,
        mint: 3,
        vault: 4,
        rateModel: 5,
        tokenReserve: 6,
        tokenProgram: 7,
        associatedTokenProgram: 8,
        systemProgram: 9,
    },
    unit,
)

export interface Operate {
    supplyAmount: bigint
    borrowAmount: bigint
    withdrawTo: string
    borrowTo: string
    transferType: TransferType
}

export const operate = instruction(
    {
        d8: '0xd96ad06374972a87',
    },
    {
        protocol: 0,
        liquidity: 1,
        tokenReserve: 2,
        mint: 3,
        vault: 4,
        userSupplyPosition: 5,
        userBorrowPosition: 6,
        rateModel: 7,
        withdrawToAccount: 8,
        borrowToAccount: 9,
        borrowClaimAccount: 10,
        withdrawClaimAccount: 11,
        tokenProgram: 12,
        associatedTokenProgram: 13,
    },
    struct({
        supplyAmount: i128,
        borrowAmount: i128,
        withdrawTo: address,
        borrowTo: address,
        transferType: TransferType,
    }),
)

export interface PauseUser {
    protocol: string
    supplyMint: string
    borrowMint: string
    supplyStatus?: number | undefined
    borrowStatus?: number | undefined
}

export const pauseUser = instruction(
    {
        d8: '0x123f2b5eef35650e',
    },
    {
        authority: 0,
        authList: 1,
        userSupplyPosition: 2,
        userBorrowPosition: 3,
    },
    struct({
        protocol: address,
        supplyMint: address,
        borrowMint: address,
        supplyStatus: option(u8),
        borrowStatus: option(u8),
    }),
)

export interface PreOperate {
    mint: string
}

export const preOperate = instruction(
    {
        d8: '0x81cd9e9bc69b4885',
    },
    {
        protocol: 0,
        liquidity: 1,
        userSupplyPosition: 2,
        userBorrowPosition: 3,
        vault: 4,
        tokenReserve: 5,
        associatedTokenProgram: 6,
        tokenProgram: 7,
    },
    struct({
        mint: address,
    }),
)

export interface UnpauseUser {
    protocol: string
    supplyMint: string
    borrowMint: string
    supplyStatus?: number | undefined
    borrowStatus?: number | undefined
}

export const unpauseUser = instruction(
    {
        d8: '0x477380fcb67eea3e',
    },
    {
        authority: 0,
        authList: 1,
        userSupplyPosition: 2,
        userBorrowPosition: 3,
    },
    struct({
        protocol: address,
        supplyMint: address,
        borrowMint: address,
        supplyStatus: option(u8),
        borrowStatus: option(u8),
    }),
)

export interface UpdateAuthority {
    newAuthority: string
}

export const updateAuthority = instruction(
    {
        d8: '0x202e401c954bf358',
    },
    {
        authority: 0,
        liquidity: 1,
        authList: 2,
    },
    struct({
        newAuthority: address,
    }),
)

export interface UpdateAuths {
    authStatus: Array<AddressBool>
}

export const updateAuths = instruction(
    {
        d8: '0x5d60b29c3975fdd1',
    },
    {
        authority: 0,
        liquidity: 1,
        authList: 2,
    },
    struct({
        authStatus: array(AddressBool),
    }),
)

export interface UpdateExchangePrice {
    _mint: string
}

export const updateExchangePrice = instruction(
    {
        d8: '0xeff40af874193596',
    },
    {
        tokenReserve: 0,
        rateModel: 1,
    },
    struct({
        _mint: address,
    }),
)

export interface UpdateGuardians {
    guardianStatus: Array<AddressBool>
}

export const updateGuardians = instruction(
    {
        d8: '0x2b3efa8a8d758461',
    },
    {
        authority: 0,
        liquidity: 1,
        authList: 2,
    },
    struct({
        guardianStatus: array(AddressBool),
    }),
)

export interface UpdateRateDataV1 {
    rateData: RateDataV1Params
}

export const updateRateDataV1 = instruction(
    {
        d8: '0x0614227a1696b416',
    },
    {
        authority: 0,
        authList: 1,
        rateModel: 2,
        mint: 3,
        tokenReserve: 4,
    },
    struct({
        rateData: RateDataV1Params,
    }),
)

export interface UpdateRateDataV2 {
    rateData: RateDataV2Params
}

export const updateRateDataV2 = instruction(
    {
        d8: '0x74493592d82de47c',
    },
    {
        authority: 0,
        authList: 1,
        rateModel: 2,
        mint: 3,
        tokenReserve: 4,
    },
    struct({
        rateData: RateDataV2Params,
    }),
)

export interface UpdateRevenueCollector {
    revenueCollector: string
}

export const updateRevenueCollector = instruction(
    {
        d8: '0xa78e7cf0dc718d3b',
    },
    {
        authority: 0,
        liquidity: 1,
    },
    struct({
        revenueCollector: address,
    }),
)

export interface UpdateTokenConfig {
    tokenConfig: TokenConfig
}

export const updateTokenConfig = instruction(
    {
        d8: '0xe77ab54fff4f90a7',
    },
    {
        authority: 0,
        authList: 1,
        rateModel: 2,
        mint: 3,
        tokenReserve: 4,
    },
    struct({
        tokenConfig: TokenConfig,
    }),
)

export interface UpdateUserBorrowConfig {
    userBorrowConfig: UserBorrowConfig
}

export const updateUserBorrowConfig = instruction(
    {
        d8: '0x64b0c9aef70236a8',
    },
    {
        authority: 0,
        protocol: 1,
        authList: 2,
        rateModel: 3,
        mint: 4,
        tokenReserve: 5,
        userBorrowPosition: 6,
    },
    struct({
        userBorrowConfig: UserBorrowConfig,
    }),
)

export interface UpdateUserClass {
    userClass: Array<AddressU8>
}

export const updateUserClass = instruction(
    {
        d8: '0x0cce44873fd43077',
    },
    {
        authority: 0,
        authList: 1,
    },
    struct({
        userClass: array(AddressU8),
    }),
)

export interface UpdateUserSupplyConfig {
    userSupplyConfig: UserSupplyConfig
}

export const updateUserSupplyConfig = instruction(
    {
        d8: '0xd9efe1da2131eab7',
    },
    {
        authority: 0,
        protocol: 1,
        authList: 2,
        rateModel: 3,
        mint: 4,
        tokenReserve: 5,
        userSupplyPosition: 6,
    },
    struct({
        userSupplyConfig: UserSupplyConfig,
    }),
)

export interface UpdateUserWithdrawalLimit {
    newLimit: bigint
    protocol: string
    mint: string
}

export const updateUserWithdrawalLimit = instruction(
    {
        d8: '0xa209ba09d51ead4e',
    },
    {
        authority: 0,
        authList: 1,
        userSupplyPosition: 2,
    },
    struct({
        newLimit: u128,
        protocol: address,
        mint: address,
    }),
)
