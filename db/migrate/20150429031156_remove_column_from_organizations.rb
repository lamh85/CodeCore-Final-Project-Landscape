class RemoveColumnFromOrganizations < ActiveRecord::Migration
  def change
    remove_column :organizations, :product, :string
  end
end
