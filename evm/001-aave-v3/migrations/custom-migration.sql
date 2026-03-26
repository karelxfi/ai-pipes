
CREATE TABLE IF NOT EXISTS aave_v_3_pool_liquidation_call (
  -- Event params
  collateral_asset LowCardinality(FixedString(42)),
  debt_asset LowCardinality(FixedString(42)),
  user LowCardinality(FixedString(42)),
  debt_to_cover UInt256,
  liquidated_collateral_amount UInt256,
  liquidator LowCardinality(FixedString(42)),
  receive_a_token Bool,
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

