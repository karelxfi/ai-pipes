CREATE TABLE IF NOT EXISTS frax_events (
  token LowCardinality(String),
  event_type LowCardinality(String),
  from_addr LowCardinality(String),
  to_addr LowCardinality(String),
  amount String,
  amount_eth Float64,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime64(3, 'UTC'),
  sign Int8 DEFAULT 1
) ENGINE = CollapsingMergeTree(sign)
PARTITION BY toYYYYMM(timestamp)
ORDER BY (token, event_type, block_number, log_index);
