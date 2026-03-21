CREATE TABLE IF NOT EXISTS vault_reallocations (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    log_index UInt32,
    vault String,
    event_type LowCardinality(String),
    caller String,
    market_id String,
    assets String,
    shares String,
    sign Int8
) ENGINE = ReplacingMergeTree()
ORDER BY (vault, block_number, tx_hash, log_index)
