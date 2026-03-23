import {Codec, address, bool, fixedArray, option, struct, u16, u64, u8} from '@subsquid/borsh'

/**
 * Gives us an audit trail of who and what was claimed; also enforces and only-once claim by any party.
 */
export interface ClaimStatus {
    isClaimed: boolean
    claimant: string
    claimStatusPayer: string
    slotClaimedAt: bigint
    amount: bigint
    expiresAt: bigint
    bump: number
}

/**
 * Gives us an audit trail of who and what was claimed; also enforces and only-once claim by any party.
 */
export const ClaimStatus: Codec<ClaimStatus> = struct({
    isClaimed: bool,
    claimant: address,
    claimStatusPayer: address,
    slotClaimedAt: u64,
    amount: u64,
    expiresAt: u64,
    bump: u8,
})

export interface ClaimStatusClosedEvent {
    claimStatusPayer: string
    claimStatusAccount: string
}

export const ClaimStatusClosedEvent: Codec<ClaimStatusClosedEvent> = struct({
    claimStatusPayer: address,
    claimStatusAccount: address,
})

export interface ClaimedEvent {
    tipDistributionAccount: string
    payer: string
    claimant: string
    amount: bigint
}

export const ClaimedEvent: Codec<ClaimedEvent> = struct({
    tipDistributionAccount: address,
    payer: address,
    claimant: address,
    amount: u64,
})

export interface Config {
    authority: string
    expiredFundsAccount: string
    numEpochsValid: bigint
    maxValidatorCommissionBps: number
    bump: number
}

export const Config: Codec<Config> = struct({
    authority: address,
    expiredFundsAccount: address,
    numEpochsValid: u64,
    maxValidatorCommissionBps: u16,
    bump: u8,
})

export interface ConfigUpdatedEvent {
    authority: string
}

export const ConfigUpdatedEvent: Codec<ConfigUpdatedEvent> = struct({
    authority: address,
})

export interface MerkleRoot {
    root: Array<number>
    maxTotalClaim: bigint
    maxNumNodes: bigint
    totalFundsClaimed: bigint
    numNodesClaimed: bigint
}

export const MerkleRoot: Codec<MerkleRoot> = struct({
    root: fixedArray(u8, 32),
    maxTotalClaim: u64,
    maxNumNodes: u64,
    totalFundsClaimed: u64,
    numNodesClaimed: u64,
})

export interface MerkleRootUploadAuthorityUpdatedEvent {
    oldAuthority: string
    newAuthority: string
}

export const MerkleRootUploadAuthorityUpdatedEvent: Codec<MerkleRootUploadAuthorityUpdatedEvent> = struct({
    oldAuthority: address,
    newAuthority: address,
})

/**
 * Singleton account that allows overriding TDA's merkle upload authority
 */
export interface MerkleRootUploadConfig {
    overrideAuthority: string
    originalUploadAuthority: string
    bump: number
}

/**
 * Singleton account that allows overriding TDA's merkle upload authority
 */
export const MerkleRootUploadConfig: Codec<MerkleRootUploadConfig> = struct({
    overrideAuthority: address,
    originalUploadAuthority: address,
    bump: u8,
})

export interface MerkleRootUploadedEvent {
    merkleRootUploadAuthority: string
    tipDistributionAccount: string
}

export const MerkleRootUploadedEvent: Codec<MerkleRootUploadedEvent> = struct({
    merkleRootUploadAuthority: address,
    tipDistributionAccount: address,
})

/**
 * The account that validators register as **tip_receiver** with the tip-payment program.
 */
export interface TipDistributionAccount {
    validatorVoteAccount: string
    merkleRootUploadAuthority: string
    merkleRoot?: MerkleRoot | undefined
    epochCreatedAt: bigint
    validatorCommissionBps: number
    expiresAt: bigint
    bump: number
}

/**
 * The account that validators register as **tip_receiver** with the tip-payment program.
 */
export const TipDistributionAccount: Codec<TipDistributionAccount> = struct({
    validatorVoteAccount: address,
    merkleRootUploadAuthority: address,
    merkleRoot: option(MerkleRoot),
    epochCreatedAt: u64,
    validatorCommissionBps: u16,
    expiresAt: u64,
    bump: u8,
})

export interface TipDistributionAccountClosedEvent {
    expiredFundsAccount: string
    tipDistributionAccount: string
    expiredAmount: bigint
}

export const TipDistributionAccountClosedEvent: Codec<TipDistributionAccountClosedEvent> = struct({
    expiredFundsAccount: address,
    tipDistributionAccount: address,
    expiredAmount: u64,
})

export interface TipDistributionAccountInitializedEvent {
    tipDistributionAccount: string
}

export const TipDistributionAccountInitializedEvent: Codec<TipDistributionAccountInitializedEvent> = struct({
    tipDistributionAccount: address,
})

export interface ValidatorCommissionBpsUpdatedEvent {
    tipDistributionAccount: string
    oldCommissionBps: number
    newCommissionBps: number
}

export const ValidatorCommissionBpsUpdatedEvent: Codec<ValidatorCommissionBpsUpdatedEvent> = struct({
    tipDistributionAccount: address,
    oldCommissionBps: u16,
    newCommissionBps: u16,
})
