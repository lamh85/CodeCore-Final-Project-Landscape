class CreateComparisons < ActiveRecord::Migration
  def change
    create_table :comparisons do |t|
      t.integer :org1
      t.integer :org2

      t.timestamps null: false
    end
  end
end
