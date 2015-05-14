class RemoveColumnsInOrganizations < ActiveRecord::Migration
  def change
    remove_column :organizations, :priority_id
  end
end
