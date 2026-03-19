CREATE TABLE IF NOT EXISTS meth_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    event_type LowCardinality(String),
    staker String,
    eth_amount String,
    meth_amount String,
    unstake_id UInt64 DEFAULT 0,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (event_type, block_number, tx_hash)
