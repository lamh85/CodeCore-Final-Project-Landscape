class CreateCompetitions < ActiveRecord::Migration
  def change
    create_table :competitions do |t|
      t.integer :org_1
      t.integer :org_2
      t.text :description

      t.timestamps null: false
    end
  end
end
