CREATE TABLE IF NOT EXISTS tip_claims (
    slot UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_signature String,
    claimant String,
    payer String,
    tip_distribution_account String,
    amount_lamports UInt64,
    amount_sol Float64,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (slot, tx_signature, claimant)
PARTITION BY toYYYYMM(timestamp)
