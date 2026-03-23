import {event} from '../abi.support.js'
import {ClaimStatusClosedEvent as ClaimStatusClosedEvent_, ClaimedEvent as ClaimedEvent_, ConfigUpdatedEvent as ConfigUpdatedEvent_, MerkleRootUploadAuthorityUpdatedEvent as MerkleRootUploadAuthorityUpdatedEvent_, MerkleRootUploadedEvent as MerkleRootUploadedEvent_, TipDistributionAccountClosedEvent as TipDistributionAccountClosedEvent_, TipDistributionAccountInitializedEvent as TipDistributionAccountInitializedEvent_, ValidatorCommissionBpsUpdatedEvent as ValidatorCommissionBpsUpdatedEvent_} from './types.js'

export type ClaimStatusClosedEvent = ClaimStatusClosedEvent_

export const ClaimStatusClosedEvent = event(
    {
        d8: '0xbc8fede5c0b6a476',
    },
    ClaimStatusClosedEvent_,
)

export type ClaimedEvent = ClaimedEvent_

export const ClaimedEvent = event(
    {
        d8: '0x90acd15690575473',
    },
    ClaimedEvent_,
)

export type ConfigUpdatedEvent = ConfigUpdatedEvent_

export const ConfigUpdatedEvent = event(
    {
        d8: '0xf59e81633c64d6dc',
    },
    ConfigUpdatedEvent_,
)

export type MerkleRootUploadAuthorityUpdatedEvent = MerkleRootUploadAuthorityUpdatedEvent_

export const MerkleRootUploadAuthorityUpdatedEvent = event(
    {
        d8: '0x539d3aa5c8ab086a',
    },
    MerkleRootUploadAuthorityUpdatedEvent_,
)

export type MerkleRootUploadedEvent = MerkleRootUploadedEvent_

export const MerkleRootUploadedEvent = event(
    {
        d8: '0x5ee9ec3134e0b5a7',
    },
    MerkleRootUploadedEvent_,
)

export type TipDistributionAccountClosedEvent = TipDistributionAccountClosedEvent_

export const TipDistributionAccountClosedEvent = event(
    {
        d8: '0xf698319a094f193a',
    },
    TipDistributionAccountClosedEvent_,
)

export type TipDistributionAccountInitializedEvent = TipDistributionAccountInitializedEvent_

export const TipDistributionAccountInitializedEvent = event(
    {
        d8: '0x27a5e03d288c8bff',
    },
    TipDistributionAccountInitializedEvent_,
)

export type ValidatorCommissionBpsUpdatedEvent = ValidatorCommissionBpsUpdatedEvent_

export const ValidatorCommissionBpsUpdatedEvent = event(
    {
        d8: '0x04225c19e45833ce',
    },
    ValidatorCommissionBpsUpdatedEvent_,
)
