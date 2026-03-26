CREATE TABLE IF NOT EXISTS trove_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    tx_index UInt32,
    log_index UInt32,
    event_type LowCardinality(String),
    borrower String,
    debt_lusd Float64,
    coll_eth Float64,
    operation LowCardinality(String),
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (timestamp, tx_index, log_index)
PARTITION BY toYYYYMM(timestamp)
