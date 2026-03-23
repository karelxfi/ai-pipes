CREATE TABLE IF NOT EXISTS trove_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    log_index UInt32,
    event_type LowCardinality(String),
    borrower String,
    debt_lusd Float64,
    coll_eth Float64,
    operation LowCardinality(String),
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (event_type, block_number, tx_hash, log_index)
PARTITION BY toYYYYMM(timestamp)
