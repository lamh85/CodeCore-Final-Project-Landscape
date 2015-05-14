class AddStreetToOrganizations < ActiveRecord::Migration
  def change
    add_column :organizations, :street, :string

  end
end
