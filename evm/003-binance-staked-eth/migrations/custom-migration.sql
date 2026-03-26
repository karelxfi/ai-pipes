
CREATE TABLE IF NOT EXISTS wbeth_exchange_rate_updated (
  -- Event params
  caller LowCardinality(FixedString(42)),
  new_exchange_rate UInt256,
  -- Event metadata
  block_number UInt32,
  tx_hash String,
  tx_index UInt16,
  log_index UInt16,
  timestamp DateTime CODEC (DoubleDelta, ZSTD),
  sign Int8  DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp) -- Data will be split by month
ORDER BY (timestamp, tx_index, log_index);

