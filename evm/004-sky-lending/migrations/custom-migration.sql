
CREATE TABLE IF NOT EXISTS dog_bark (
  -- Event params
  ilk FixedString(66),
  urn LowCardinality(FixedString(42)),
  ink UInt256,
  art UInt256,
  due UInt256,
  clip LowCardinality(FixedString(42)),
  id UInt256,
  -- Event metadata
  block_number UInt32,
  tx_hash String,
  tx_index UInt16,
  log_index UInt16,
  timestamp DateTime CODEC (DoubleDelta, ZSTD),
  sign Int8  DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp) -- Data will be split by month
ORDER BY (ilk, timestamp, tx_index, log_index);

