class RenameColumnInCompetitions < ActiveRecord::Migration
  def change
    rename_column :competitions, :org_2, :competitor_id
  end
end
