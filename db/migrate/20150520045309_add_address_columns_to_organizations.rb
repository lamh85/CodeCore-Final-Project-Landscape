class AddAddressColumnsToOrganizations < ActiveRecord::Migration
  def change
    add_column :organizations, :city, :string
    add_column :organizations, :province, :string
    add_column :organizations, :country, :string
  end
end
