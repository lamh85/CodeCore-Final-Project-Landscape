class RenameColumnInOrganizations < ActiveRecord::Migration
  def change
    rename_column :organizations, :notes, :description
  end
end
