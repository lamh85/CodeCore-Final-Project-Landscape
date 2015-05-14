class AddColumnsToProducts < ActiveRecord::Migration
  def change
    add_reference :products, :organization, index: true, foreign_key: true
  end
end
