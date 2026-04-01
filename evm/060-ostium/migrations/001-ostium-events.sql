CREATE TABLE IF NOT EXISTS trading_events (
  event_type LowCardinality(String),
  trader LowCardinality(String),
  pair_index UInt16,
  order_id UInt64 DEFAULT 0,
  trade_id UInt64 DEFAULT 0,
  trade_index UInt8 DEFAULT 0,
  order_type LowCardinality(String) DEFAULT '',
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime64(3, 'UTC'),
  sign Int8 DEFAULT 1
) ENGINE = CollapsingMergeTree(sign)
PARTITION BY toYYYYMM(timestamp)
ORDER BY (event_type, pair_index, block_number, log_index);
