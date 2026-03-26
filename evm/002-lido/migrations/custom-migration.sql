
CREATE TABLE IF NOT EXISTS lido_token_rebased (
  -- Event params
  report_timestamp UInt256,
  time_elapsed UInt256,
  pre_total_shares UInt256,
  pre_total_ether UInt256,
  post_total_shares UInt256,
  post_total_ether UInt256,
  shares_minted_as_fees UInt256,
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

