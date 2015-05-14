class CreateChannels < ActiveRecord::Migration
  def change
    create_table :channels do |t|
      t.integer :supplier_id
      t.integer :client_id
      t.integer :revenue
      t.text :description

      t.timestamps null: false
    end
  end
end
