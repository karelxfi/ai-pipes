CREATE TABLE IF NOT EXISTS savax_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    tx_index UInt32,
    log_index UInt32,
    event_type LowCardinality(String),
    user String,
    avax_amount String,
    share_amount String,
    reward_value String,
    total_shares String,
    unlock_requested_at String,
    sign Int8
) ENGINE = ReplacingMergeTree()
ORDER BY (timestamp, tx_index, log_index)
