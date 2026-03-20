CREATE TABLE IF NOT EXISTS yearn_v2_strategy_reported (
  -- Event params
  vault LowCardinality(FixedString(42)),
  strategy LowCardinality(FixedString(42)),
  gain String,
  loss String,
  debt_paid String,
  total_gain String,
  total_loss String,
  total_debt String,
  debt_added String,
  debt_ratio String,
  -- Event metadata
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC(DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (block_number, tx_hash, log_index);
