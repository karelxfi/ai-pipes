CREATE TABLE IF NOT EXISTS stake_pool_ops (
    slot UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_signature String,
    pool String,
    instruction LowCardinality(String),
    amount_lamports UInt64,
    signer String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (pool, instruction, slot, tx_signature)
PARTITION BY toYYYYMM(timestamp)
