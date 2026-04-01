CREATE TABLE IF NOT EXISTS bold_events (
  event_type LowCardinality(String),
  from_addr LowCardinality(String),
  to_addr LowCardinality(String),
  amount String,
  amount_bold Float64,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime64(3, 'UTC'),
  sign Int8 DEFAULT 1
) ENGINE = CollapsingMergeTree(sign)
PARTITION BY toYYYYMM(timestamp)
ORDER BY (event_type, block_number, log_index);
