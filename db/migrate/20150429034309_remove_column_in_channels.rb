class RemoveColumnInChannels < ActiveRecord::Migration
  def change
    remove_column :channels, :supplier_id
  end
end
