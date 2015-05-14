class CreateFilters < ActiveRecord::Migration
  def change
    create_table :filters do |t|
      t.string :group
      t.string :organizations
      t.string :attribute
      t.string :equality
      t.string :search_term

      t.timestamps null: false
    end
  end
end
