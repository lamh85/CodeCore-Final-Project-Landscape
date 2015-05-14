class RemoveColumnsInOrganizations2 < ActiveRecord::Migration
  def change
    remove_column :organizations, :priority
  end
end
