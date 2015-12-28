class CreateLocationLevels < ActiveRecord::Migration
  def change
    create_table :location_levels do |t|
      t.string :name
      t.integer :parent

      t.timestamps null: false
    end
  end
end
