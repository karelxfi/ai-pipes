CREATE TABLE IF NOT EXISTS fluid_operations (
  protocol FixedString(42),
  token FixedString(42),
  token_name LowCardinality(String),
  action LowCardinality(String),
  block_number UInt32,
  tx_hash String,
  tx_index UInt16,
  log_index UInt16,
  timestamp DateTime CODEC (DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (token, timestamp, tx_index, log_index);
