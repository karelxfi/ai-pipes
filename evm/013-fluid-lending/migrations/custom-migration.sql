CREATE TABLE IF NOT EXISTS fluid_operations (
  protocol FixedString(42),
  token FixedString(42),
  token_name LowCardinality(String),
  action LowCardinality(String),
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC (DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (token, action, block_number, tx_hash, log_index);
