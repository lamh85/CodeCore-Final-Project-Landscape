class AddColumnToMarketFilter < ActiveRecord::Migration
  def change
    add_reference :market_filters, :market_search, index: true, foreign_key: true
  end
end
