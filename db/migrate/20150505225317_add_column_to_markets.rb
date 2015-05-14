class AddColumnToMarkets < ActiveRecord::Migration
  def change
    add_column :markets, :province, :string
  end
end
