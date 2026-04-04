CREATE TABLE IF NOT EXISTS euler_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    tx_index UInt32,
    log_index UInt32,
    event_type LowCardinality(String),
    caller String DEFAULT '',
    account String DEFAULT '',
    vault String DEFAULT '',
    selector String DEFAULT '',
    proxy String DEFAULT '',
    implementation String DEFAULT '',
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (timestamp, tx_index, log_index)
