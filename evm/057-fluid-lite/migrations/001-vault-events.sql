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
    log_index UInt32,
    timestamp DateTime64(3, 'UTC'),
    sign Int8 DEFAULT 1
) ENGINE = CollapsingMergeTree(sign)
ORDER BY (vault, event_type, block_number, log_index);
