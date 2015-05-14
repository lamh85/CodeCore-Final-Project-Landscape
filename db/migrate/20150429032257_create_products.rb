class CreateProducts < ActiveRecord::Migration
  def change
    create_table :products do |t|
      t.integer :supplier_id
      t.string :item
      t.string :type
      t.integer :revenue
      t.text :description

      t.timestamps null: false
    end
  end
end
