class AddOrganizationToCompetitions < ActiveRecord::Migration
  def change
    add_reference :competitions, :organization, index: true, foreign_key: true
  end
end
