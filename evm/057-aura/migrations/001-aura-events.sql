CREATE TABLE IF NOT EXISTS aura_events (
  source LowCardinality(String),
  event_type LowCardinality(String),
  from_addr LowCardinality(String),
  to_addr LowCardinality(String),
  user_addr LowCardinality(String),
  pool_id UInt64 DEFAULT 0,
  amount String,
  amount_dec Float64,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime64(3, 'UTC'),
  sign Int8 DEFAULT 1
) ENGINE = CollapsingMergeTree(sign)
PARTITION BY toYYYYMM(timestamp)
ORDER BY (source, event_type, block_number, log_index);
