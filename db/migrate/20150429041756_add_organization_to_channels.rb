class AddOrganizationToChannels < ActiveRecord::Migration
  def change
    add_reference :channels, :organization, index: true, foreign_key: true
  end
end
