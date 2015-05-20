class CreateOrganizations < ActiveRecord::Migration
  def change
    create_table :organizations do |t|
      t.string :name
      t.string :product
      t.integer :revenue
      t.text :notes

      t.timestamps null: false
    end
  end

  def change
    add_column :organizations, :city, :string
    add_column :organizations, :province, :string
    add_column :organizations, :country, :string
  end  
end
