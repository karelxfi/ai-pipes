import {Codec, address, array, bool, i128, struct, sum, u128, u16, u32, u64, u8, unit} from '@subsquid/borsh'

export interface AddressBool {
    addr: string
    value: boolean
}

export const AddressBool: Codec<AddressBool> = struct({
    addr: address,
    value: bool,
})

export interface AddressU8 {
    addr: string
    value: number
}

export const AddressU8: Codec<AddressU8> = struct({
    addr: address,
    value: u8,
})

export interface UserClass {
    addr: string
    class: number
}

export const UserClass: Codec<UserClass> = struct({
    addr: address,
    class: u8,
})

export interface AuthorizationList {
    authUsers: Array<string>
    guardians: Array<string>
    userClasses: Array<UserClass>
}

export const AuthorizationList: Codec<AuthorizationList> = struct({
    authUsers: array(address),
    guardians: array(address),
    userClasses: array(UserClass),
})

export interface Liquidity {
    authority: string
    revenueCollector: string
    status: boolean
    bump: number
}

export const Liquidity: Codec<Liquidity> = struct({
    authority: address,
    revenueCollector: address,
    status: bool,
    bump: u8,
})

export interface LogBorrowRateCap {
    token: string
}

export const LogBorrowRateCap: Codec<LogBorrowRateCap> = struct({
    token: address,
})

export interface LogChangeStatus {
    newStatus: boolean
}

export const LogChangeStatus: Codec<LogChangeStatus> = struct({
    newStatus: bool,
})

export interface LogClaim {
    user: string
    token: string
    recipient: string
    amount: bigint
}

export const LogClaim: Codec<LogClaim> = struct({
    user: address,
    token: address,
    recipient: address,
    amount: u64,
})

export interface LogCollectRevenue {
    token: string
    revenueAmount: bigint
}

export const LogCollectRevenue: Codec<LogCollectRevenue> = struct({
    token: address,
    revenueAmount: u128,
})

export interface LogOperate {
    user: string
    token: string
    supplyAmount: bigint
    borrowAmount: bigint
    withdrawTo: string
    borrowTo: string
    supplyExchangePrice: bigint
    borrowExchangePrice: bigint
}

export const LogOperate: Codec<LogOperate> = struct({
    user: address,
    token: address,
    supplyAmount: i128,
    borrowAmount: i128,
    withdrawTo: address,
    borrowTo: address,
    supplyExchangePrice: u64,
    borrowExchangePrice: u64,
})

export interface LogPauseUser {
    user: string
    mint: string
    status: number
}

export const LogPauseUser: Codec<LogPauseUser> = struct({
    user: address,
    mint: address,
    status: u8,
})

export interface LogUnpauseUser {
    user: string
    mint: string
    status: number
}

export const LogUnpauseUser: Codec<LogUnpauseUser> = struct({
    user: address,
    mint: address,
    status: u8,
})

export interface LogUpdateAuthority {
    newAuthority: string
}

export const LogUpdateAuthority: Codec<LogUpdateAuthority> = struct({
    newAuthority: address,
})

export interface LogUpdateAuths {
    authStatus: Array<AddressBool>
}

export const LogUpdateAuths: Codec<LogUpdateAuths> = struct({
    authStatus: array(AddressBool),
})

export interface LogUpdateExchangePrices {
    token: string
    supplyExchangePrice: bigint
    borrowExchangePrice: bigint
    borrowRate: number
    utilization: number
}

export const LogUpdateExchangePrices: Codec<LogUpdateExchangePrices> = struct({
    token: address,
    supplyExchangePrice: u128,
    borrowExchangePrice: u128,
    borrowRate: u16,
    utilization: u16,
})

export interface LogUpdateGuardians {
    guardianStatus: Array<AddressBool>
}

export const LogUpdateGuardians: Codec<LogUpdateGuardians> = struct({
    guardianStatus: array(AddressBool),
})

/**
 * @notice struct to set borrow rate data for version 1
 */
export interface RateDataV1Params {
    kink: bigint
    rateAtUtilizationZero: bigint
    rateAtUtilizationKink: bigint
    rateAtUtilizationMax: bigint
}

/**
 * @notice struct to set borrow rate data for version 1
 */
export const RateDataV1Params: Codec<RateDataV1Params> = struct({
    kink: u128,
    rateAtUtilizationZero: u128,
    rateAtUtilizationKink: u128,
    rateAtUtilizationMax: u128,
})

export interface LogUpdateRateDataV1 {
    token: string
    rateData: RateDataV1Params
}

export const LogUpdateRateDataV1: Codec<LogUpdateRateDataV1> = struct({
    token: address,
    rateData: RateDataV1Params,
})

/**
 * @notice struct to set borrow rate data for version 2
 */
export interface RateDataV2Params {
    kink1: bigint
    kink2: bigint
    rateAtUtilizationZero: bigint
    rateAtUtilizationKink1: bigint
    rateAtUtilizationKink2: bigint
    rateAtUtilizationMax: bigint
}

/**
 * @notice struct to set borrow rate data for version 2
 */
export const RateDataV2Params: Codec<RateDataV2Params> = struct({
    kink1: u128,
    kink2: u128,
    rateAtUtilizationZero: u128,
    rateAtUtilizationKink1: u128,
    rateAtUtilizationKink2: u128,
    rateAtUtilizationMax: u128,
})

export interface LogUpdateRateDataV2 {
    token: string
    rateData: RateDataV2Params
}

export const LogUpdateRateDataV2: Codec<LogUpdateRateDataV2> = struct({
    token: address,
    rateData: RateDataV2Params,
})

export interface LogUpdateRevenueCollector {
    revenueCollector: string
}

export const LogUpdateRevenueCollector: Codec<LogUpdateRevenueCollector> = struct({
    revenueCollector: address,
})

/**
 * @notice struct to set token config
 */
export interface TokenConfig {
    token: string
    fee: bigint
    maxUtilization: bigint
}

/**
 * @notice struct to set token config
 */
export const TokenConfig: Codec<TokenConfig> = struct({
    token: address,
    fee: u128,
    maxUtilization: u128,
})

export interface LogUpdateTokenConfigs {
    tokenConfig: TokenConfig
}

export const LogUpdateTokenConfigs: Codec<LogUpdateTokenConfigs> = struct({
    tokenConfig: TokenConfig,
})

/**
 * @notice struct to set user borrow & payback config
 */
export interface UserBorrowConfig {
    mode: number
    expandPercent: bigint
    expandDuration: bigint
    baseDebtCeiling: bigint
    maxDebtCeiling: bigint
}

/**
 * @notice struct to set user borrow & payback config
 */
export const UserBorrowConfig: Codec<UserBorrowConfig> = struct({
    mode: u8,
    expandPercent: u128,
    expandDuration: u128,
    baseDebtCeiling: u128,
    maxDebtCeiling: u128,
})

export interface LogUpdateUserBorrowConfigs {
    user: string
    token: string
    userBorrowConfig: UserBorrowConfig
}

export const LogUpdateUserBorrowConfigs: Codec<LogUpdateUserBorrowConfigs> = struct({
    user: address,
    token: address,
    userBorrowConfig: UserBorrowConfig,
})

export interface LogUpdateUserClass {
    userClass: Array<AddressU8>
}

export const LogUpdateUserClass: Codec<LogUpdateUserClass> = struct({
    userClass: array(AddressU8),
})

/**
 * @notice struct to set user supply & withdrawal config
 */
export interface UserSupplyConfig {
    mode: number
    expandPercent: bigint
    expandDuration: bigint
    baseWithdrawalLimit: bigint
}

/**
 * @notice struct to set user supply & withdrawal config
 */
export const UserSupplyConfig: Codec<UserSupplyConfig> = struct({
    mode: u8,
    expandPercent: u128,
    expandDuration: u128,
    baseWithdrawalLimit: u128,
})

export interface LogUpdateUserSupplyConfigs {
    user: string
    token: string
    userSupplyConfig: UserSupplyConfig
}

export const LogUpdateUserSupplyConfigs: Codec<LogUpdateUserSupplyConfigs> = struct({
    user: address,
    token: address,
    userSupplyConfig: UserSupplyConfig,
})

export interface LogUpdateUserWithdrawalLimit {
    user: string
    token: string
    newLimit: bigint
}

export const LogUpdateUserWithdrawalLimit: Codec<LogUpdateUserWithdrawalLimit> = struct({
    user: address,
    token: address,
    newLimit: u128,
})

/**
 * Interest rate model data
 */
export interface RateModel {
    mint: string
    version: number
    rateAtZero: number
    kink1Utilization: number
    rateAtKink1: number
    rateAtMax: number
    kink2Utilization: number
    rateAtKink2: number
}

/**
 * Interest rate model data
 */
export const RateModel: Codec<RateModel> = struct({
    mint: address,
    version: u8,
    rateAtZero: u16,
    kink1Utilization: u16,
    rateAtKink1: u16,
    rateAtMax: u16,
    kink2Utilization: u16,
    rateAtKink2: u16,
})

/**
 * Token configuration and exchange prices
 */
export interface TokenReserve {
    mint: string
    vault: string
    borrowRate: number
    feeOnInterest: number
    lastUtilization: number
    lastUpdateTimestamp: bigint
    supplyExchangePrice: bigint
    borrowExchangePrice: bigint
    maxUtilization: number
    totalSupplyWithInterest: bigint
    totalSupplyInterestFree: bigint
    totalBorrowWithInterest: bigint
    totalBorrowInterestFree: bigint
    totalClaimAmount: bigint
    interactingProtocol: string
    interactingTimestamp: bigint
    interactingBalance: bigint
}

/**
 * Token configuration and exchange prices
 */
export const TokenReserve: Codec<TokenReserve> = struct({
    mint: address,
    vault: address,
    borrowRate: u16,
    feeOnInterest: u16,
    lastUtilization: u16,
    lastUpdateTimestamp: u64,
    supplyExchangePrice: u64,
    borrowExchangePrice: u64,
    maxUtilization: u16,
    totalSupplyWithInterest: u64,
    totalSupplyInterestFree: u64,
    totalBorrowWithInterest: u64,
    totalBorrowInterestFree: u64,
    totalClaimAmount: u64,
    interactingProtocol: address,
    interactingTimestamp: u64,
    interactingBalance: u64,
})

export type TransferType_SKIP = undefined

export const TransferType_SKIP = unit

export type TransferType_DIRECT = undefined

export const TransferType_DIRECT = unit

export type TransferType_CLAIM = undefined

export const TransferType_CLAIM = unit

export type TransferType = 
    | {
        kind: 'SKIP'
        value?: TransferType_SKIP
      }
    | {
        kind: 'DIRECT'
        value?: TransferType_DIRECT
      }
    | {
        kind: 'CLAIM'
        value?: TransferType_CLAIM
      }

export const TransferType: Codec<TransferType> = sum(1, {
    SKIP: {
        discriminator: 0,
        value: TransferType_SKIP,
    },
    DIRECT: {
        discriminator: 1,
        value: TransferType_DIRECT,
    },
    CLAIM: {
        discriminator: 2,
        value: TransferType_CLAIM,
    },
})

/**
 * User borrow position
 */
export interface UserBorrowPosition {
    protocol: string
    mint: string
    withInterest: number
    amount: bigint
    debtCeiling: bigint
    lastUpdate: bigint
    expandPct: number
    expandDuration: number
    baseDebtCeiling: bigint
    maxDebtCeiling: bigint
    status: number
}

/**
 * User borrow position
 */
export const UserBorrowPosition: Codec<UserBorrowPosition> = struct({
    protocol: address,
    mint: address,
    withInterest: u8,
    amount: u64,
    debtCeiling: u64,
    lastUpdate: u64,
    expandPct: u16,
    expandDuration: u32,
    baseDebtCeiling: u64,
    maxDebtCeiling: u64,
    status: u8,
})

export interface UserClaim {
    user: string
    amount: bigint
    mint: string
}

export const UserClaim: Codec<UserClaim> = struct({
    user: address,
    amount: u64,
    mint: address,
})

/**
 * User supply position
 */
export interface UserSupplyPosition {
    protocol: string
    mint: string
    withInterest: number
    amount: bigint
    withdrawalLimit: bigint
    lastUpdate: bigint
    expandPct: number
    expandDuration: bigint
    baseWithdrawalLimit: bigint
    status: number
}

/**
 * User supply position
 */
export const UserSupplyPosition: Codec<UserSupplyPosition> = struct({
    protocol: address,
    mint: address,
    withInterest: u8,
    amount: u64,
    withdrawalLimit: u128,
    lastUpdate: u64,
    expandPct: u16,
    expandDuration: u64,
    baseWithdrawalLimit: u64,
    status: u8,
})
