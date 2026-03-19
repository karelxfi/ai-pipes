CREATE TABLE IF NOT EXISTS lista_staking_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    event_type LowCardinality(String),
    user_address String,
    amount String,
    withdraw_idx UInt64 DEFAULT 0,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (event_type, block_number, tx_hash)
