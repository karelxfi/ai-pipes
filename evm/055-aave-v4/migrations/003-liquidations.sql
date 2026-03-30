CREATE TABLE IF NOT EXISTS liquidations (
  spoke LowCardinality(String),
  collateral_reserve_id UInt256,
  debt_reserve_id UInt256,
  user String,
  liquidator String,
  receive_shares Bool,
  debt_amount_restored UInt256,
  drawn_shares_liquidated UInt256,
  collateral_amount_removed UInt256,
  collateral_shares_liquidated UInt256,
  collateral_shares_to_liquidator UInt256,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC(DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (block_number, tx_hash, log_index);
