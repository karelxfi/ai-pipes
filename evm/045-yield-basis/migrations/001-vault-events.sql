CREATE TABLE IF NOT EXISTS vault_events (
    vault String,
    event_type String,
    sender String,
    owner String,
    receiver String,
    assets String,
    shares String,
    block_number UInt32,
    tx_hash String,
    log_index UInt16,
    timestamp DateTime64(3, 'UTC')
) ENGINE = ReplacingMergeTree()
ORDER BY (vault, block_number, log_index);
