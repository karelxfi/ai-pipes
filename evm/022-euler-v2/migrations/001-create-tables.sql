CREATE TABLE IF NOT EXISTS euler_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    event_type LowCardinality(String),
    caller String DEFAULT '',
    account String DEFAULT '',
    vault String DEFAULT '',
    selector String DEFAULT '',
    proxy String DEFAULT '',
    implementation String DEFAULT '',
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (event_type, block_number, tx_hash)
