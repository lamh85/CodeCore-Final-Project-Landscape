class RenameColumnInClientele < ActiveRecord::Migration
  def change
    rename_column :clienteles, :organization_id, :seller_id
  end
end
