CREATE TABLE IF NOT EXISTS lc_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    event_type LowCardinality(String),
    depositor String DEFAULT '',
    recipient String DEFAULT '',
    amount String DEFAULT '0',
    validator_count UInt64 DEFAULT 0,
    validator_balance String DEFAULT '0',
    old_total_balance String DEFAULT '0',
    new_total_balance String DEFAULT '0',
    old_total_supply String DEFAULT '0',
    new_total_supply String DEFAULT '0',
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (event_type, block_number, tx_hash)
