CREATE TABLE IF NOT EXISTS liquidity_ops (
  user LowCardinality(String),
  token LowCardinality(String),
  token_label LowCardinality(String),
  user_label LowCardinality(String),
  op_type LowCardinality(String),
  supply_amount String,
  borrow_amount String,
  withdraw_to LowCardinality(String),
  borrow_to LowCardinality(String),
  total_amounts String,
  exchange_prices_and_config String,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime64(3, 'UTC'),
  sign Int8 DEFAULT 1
) ENGINE = CollapsingMergeTree(sign)
PARTITION BY toYYYYMM(timestamp)
ORDER BY (token_label, op_type, block_number, log_index);
