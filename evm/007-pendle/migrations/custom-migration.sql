CREATE TABLE IF NOT EXISTS pendle_swaps (
  swap_type LowCardinality(String),
  caller FixedString(42),
  market FixedString(42),
  asset FixedString(42),
  receiver FixedString(42),
  block_number UInt32,
  tx_hash String,
  tx_index UInt16,
  log_index UInt16,
  timestamp DateTime CODEC (DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (market, timestamp, tx_index, log_index);
