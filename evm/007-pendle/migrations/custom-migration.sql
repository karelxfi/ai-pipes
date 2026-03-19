CREATE TABLE IF NOT EXISTS pendle_swaps (
  swap_type LowCardinality(String),
  caller FixedString(42),
  market FixedString(42),
  asset FixedString(42),
  receiver FixedString(42),
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC (DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (swap_type, market, block_number, tx_hash, log_index);
