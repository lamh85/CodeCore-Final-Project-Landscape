class AddColumnToOrganizations < ActiveRecord::Migration
  def change
    add_column :organizations, :priority, :string
  end
end
