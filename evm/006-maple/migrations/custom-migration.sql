CREATE TABLE IF NOT EXISTS maple_pool_flows (
  pool LowCardinality(String),
  pool_name LowCardinality(String),
  event_type LowCardinality(String),
  user FixedString(42),
  assets UInt256,
  shares UInt256,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC (DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (pool, event_type, block_number, tx_hash, log_index);
