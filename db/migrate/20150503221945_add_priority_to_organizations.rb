class AddPriorityToOrganizations < ActiveRecord::Migration
  def change
    add_reference :organizations, :priority, index: true, foreign_key: true
  end
end
