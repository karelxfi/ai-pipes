CREATE TABLE IF NOT EXISTS market_orders (
    trader String,
    pair_index UInt32,
    is_open UInt8,
    order_id UInt64,
    is_buy UInt8,
    is_pnl UInt8,
    initial_pos_token String,
    leverage UInt64,
    block_number UInt32,
    tx_hash String,
    log_index UInt32,
    timestamp DateTime64(3, 'UTC')
) ENGINE = ReplacingMergeTree()
ORDER BY (block_number, log_index);

CREATE TABLE IF NOT EXISTS limit_orders (
    trader String,
    pair_index UInt32,
    order_id UInt64,
    block_number UInt32,
    tx_hash String,
    log_index UInt32,
    timestamp DateTime64(3, 'UTC')
) ENGINE = ReplacingMergeTree()
ORDER BY (block_number, log_index);

CREATE TABLE IF NOT EXISTS open_limits (
    trader String,
    pair_index UInt32,
    trade_index UInt32,
    is_buy UInt8,
    open_price String,
    order_type UInt8,
    collateral String,
    leverage UInt64,
    block_number UInt32,
    tx_hash String,
    log_index UInt32,
    timestamp DateTime64(3, 'UTC')
) ENGINE = ReplacingMergeTree()
ORDER BY (block_number, log_index);

CREATE TABLE IF NOT EXISTS margin_updates (
    trader String,
    pair_index UInt32,
    trade_index UInt32,
    update_type UInt8,
    position_size_usdc String,
    open_price String,
    is_buy UInt8,
    leverage UInt64,
    margin_fees String,
    block_number UInt32,
    tx_hash String,
    log_index UInt32,
    timestamp DateTime64(3, 'UTC')
) ENGINE = ReplacingMergeTree()
ORDER BY (block_number, log_index);

CREATE TABLE IF NOT EXISTS tp_updates (
    trader String,
    pair_index UInt32,
    trade_index UInt32,
    new_tp String,
    block_number UInt32,
    tx_hash String,
    log_index UInt32,
    timestamp DateTime64(3, 'UTC')
) ENGINE = ReplacingMergeTree()
ORDER BY (block_number, log_index);

CREATE TABLE IF NOT EXISTS sl_updates (
    trader String,
    pair_index UInt32,
    trade_index UInt32,
    new_sl String,
    block_number UInt32,
    tx_hash String,
    log_index UInt32,
    timestamp DateTime64(3, 'UTC')
) ENGINE = ReplacingMergeTree()
ORDER BY (block_number, log_index);
