import {address, array, fixedArray, struct, u16, u64, u8, unit} from '@subsquid/borsh'
import {instruction} from '../abi.support.js'
import {Config} from './types.js'

/**
 * Claims tokens from the [TipDistributionAccount].
 */
export interface Claim {
    bump: number
    amount: bigint
    proof: Array<Array<number>>
}

/**
 * Claims tokens from the [TipDistributionAccount].
 */
export const claim = instruction(
    {
        d8: '0x3ec6d6c1d59f6cd2',
    },
    {
        config: 0,
        tipDistributionAccount: 1,
        merkleRootUploadAuthority: 2,
        /**
         * Status of the claim. Used to prevent the same party from claiming multiple times.
         */
        claimStatus: 3,
        /**
         * Receiver of the funds.
         */
        claimant: 4,
        /**
         * Who is paying for the claim.
         */
        payer: 5,
        systemProgram: 6,
    },
    struct({
        bump: u8,
        amount: u64,
        proof: array(fixedArray(u8, 32)),
    }),
)

/**
 * Anyone can invoke this only after the [TipDistributionAccount] has expired.
 * This instruction will return any rent back to `claimant` and close the account
 */
export type CloseClaimStatus = undefined

/**
 * Anyone can invoke this only after the [TipDistributionAccount] has expired.
 * This instruction will return any rent back to `claimant` and close the account
 */
export const closeClaimStatus = instruction(
    {
        d8: '0xa3d6bfa5f5bc11b9',
    },
    {
        config: 0,
        claimStatus: 1,
        /**
         * Receiver of the funds.
         */
        claimStatusPayer: 2,
    },
    unit,
)

/**
 * Anyone can invoke this only after the [TipDistributionAccount] has expired.
 * This instruction will send any unclaimed funds to the designated `expired_funds_account`
 * before closing and returning the rent exempt funds to the validator.
 */
export interface CloseTipDistributionAccount {
    _epoch: bigint
}

/**
 * Anyone can invoke this only after the [TipDistributionAccount] has expired.
 * This instruction will send any unclaimed funds to the designated `expired_funds_account`
 * before closing and returning the rent exempt funds to the validator.
 */
export const closeTipDistributionAccount = instruction(
    {
        d8: '0x2f88d0be7df34ae3',
    },
    {
        config: 0,
        expiredFundsAccount: 1,
        tipDistributionAccount: 2,
        validatorVoteAccount: 3,
        /**
         * Anyone can crank this instruction.
         */
        signer: 4,
    },
    struct({
        _epoch: u64,
    }),
)

/**
 * Initialize a singleton instance of the [Config] account.
 */
export interface Initialize {
    authority: string
    expiredFundsAccount: string
    numEpochsValid: bigint
    maxValidatorCommissionBps: number
    bump: number
}

/**
 * Initialize a singleton instance of the [Config] account.
 */
export const initialize = instruction(
    {
        d8: '0xafaf6d1f0d989bed',
    },
    {
        config: 0,
        systemProgram: 1,
        initializer: 2,
    },
    struct({
        authority: address,
        expiredFundsAccount: address,
        numEpochsValid: u64,
        maxValidatorCommissionBps: u16,
        bump: u8,
    }),
)

export interface InitializeMerkleRootUploadConfig {
    authority: string
    originalAuthority: string
}

export const initializeMerkleRootUploadConfig = instruction(
    {
        d8: '0xe857480e5928281b',
    },
    {
        config: 0,
        merkleRootUploadConfig: 1,
        authority: 2,
        payer: 3,
        systemProgram: 4,
    },
    struct({
        authority: address,
        originalAuthority: address,
    }),
)

/**
 * Initialize a new [TipDistributionAccount] associated with the given validator vote key
 * and current epoch.
 */
export interface InitializeTipDistributionAccount {
    merkleRootUploadAuthority: string
    validatorCommissionBps: number
    bump: number
}

/**
 * Initialize a new [TipDistributionAccount] associated with the given validator vote key
 * and current epoch.
 */
export const initializeTipDistributionAccount = instruction(
    {
        d8: '0x78bf19b66f31b337',
    },
    {
        config: 0,
        tipDistributionAccount: 1,
        /**
         * The validator's vote account is used to check this transaction's signer is also the authorized withdrawer.
         */
        validatorVoteAccount: 2,
        /**
         * Must be equal to the supplied validator vote account's authorized withdrawer.
         */
        signer: 3,
        systemProgram: 4,
    },
    struct({
        merkleRootUploadAuthority: address,
        validatorCommissionBps: u16,
        bump: u8,
    }),
)

export type MigrateTdaMerkleRootUploadAuthority = undefined

export const migrateTdaMerkleRootUploadAuthority = instruction(
    {
        d8: '0x0de2a39038cad617',
    },
    {
        tipDistributionAccount: 0,
        merkleRootUploadConfig: 1,
    },
    unit,
)

/**
 * Update config fields. Only the [Config] authority can invoke this.
 */
export interface UpdateConfig {
    newConfig: Config
}

/**
 * Update config fields. Only the [Config] authority can invoke this.
 */
export const updateConfig = instruction(
    {
        d8: '0x1d9efcbf0a53db63',
    },
    {
        config: 0,
        authority: 1,
    },
    struct({
        newConfig: Config,
    }),
)

export interface UpdateMerkleRootUploadConfig {
    authority: string
    originalAuthority: string
}

export const updateMerkleRootUploadConfig = instruction(
    {
        d8: '0x80e39f8bb0807602',
    },
    {
        config: 0,
        merkleRootUploadConfig: 1,
        authority: 2,
        systemProgram: 3,
    },
    struct({
        authority: address,
        originalAuthority: address,
    }),
)

/**
 * Uploads a merkle root to the provided [TipDistributionAccount]. This instruction may be
 * invoked many times as long as the account is at least one epoch old and not expired; and
 * no funds have already been claimed. Only the `merkle_root_upload_authority` has the
 * authority to invoke.
 */
export interface UploadMerkleRoot {
    root: Array<number>
    maxTotalClaim: bigint
    maxNumNodes: bigint
}

/**
 * Uploads a merkle root to the provided [TipDistributionAccount]. This instruction may be
 * invoked many times as long as the account is at least one epoch old and not expired; and
 * no funds have already been claimed. Only the `merkle_root_upload_authority` has the
 * authority to invoke.
 */
export const uploadMerkleRoot = instruction(
    {
        d8: '0x46036e1dc7becdb0',
    },
    {
        config: 0,
        tipDistributionAccount: 1,
        merkleRootUploadAuthority: 2,
    },
    struct({
        root: fixedArray(u8, 32),
        maxTotalClaim: u64,
        maxNumNodes: u64,
    }),
)
