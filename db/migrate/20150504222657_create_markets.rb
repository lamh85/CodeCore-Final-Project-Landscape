class CreateMarkets < ActiveRecord::Migration
  def change
    create_table :markets do |t|
      t.references :organization, index: true, foreign_key: true
      t.string :product
      t.references :category, index: true, foreign_key: true
      t.string :country
      t.integer :sales
      t.text :description

      t.timestamps null: false
    end
  end
end
