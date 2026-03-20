CREATE TABLE IF NOT EXISTS gmx_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    event_name LowCardinality(String),
    msg_sender String,
    event_variant LowCardinality(String),
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (event_name, block_number, tx_hash)
