CREATE TABLE IF NOT EXISTS lista_staking_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    tx_index UInt32,
    log_index UInt32,
    event_type LowCardinality(String),
    user_address String,
    amount String,
    withdraw_idx UInt64 DEFAULT 0,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (timestamp, tx_index, log_index)
