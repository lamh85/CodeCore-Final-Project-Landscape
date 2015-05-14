class CreateSearches < ActiveRecord::Migration
  def change
    create_table :searches do |t|
      t.references :filter, index: true, foreign_key: true
      t.string :logic
      t.text :description

      t.timestamps null: false
    end
  end
end
