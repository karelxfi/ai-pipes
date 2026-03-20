CREATE TABLE IF NOT EXISTS savax_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    event_type LowCardinality(String),
    user String,
    avax_amount String,
    share_amount String,
    reward_value String,
    total_shares String,
    unlock_requested_at String,
    sign Int8
) ENGINE = ReplacingMergeTree()
ORDER BY (event_type, block_number, tx_hash)
