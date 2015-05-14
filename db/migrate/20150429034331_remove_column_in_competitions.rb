class RemoveColumnInCompetitions < ActiveRecord::Migration
  def change
    remove_column :competitions, :org_1
  end
end
