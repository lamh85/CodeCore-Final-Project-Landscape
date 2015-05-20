class Channel < ActiveRecord::Base

  belongs_to :organization
  belongs_to :client, class_name: "Organization"

  validates :client_id, uniqueness: {scope: :organization_id, message: "This supplier-client relationship was already recorded."}

  def self.seed(number)
    number.times {|x| c = Channel.new
      c.client_id = Organization.all.sample.id
      c.organization_id = Organization.all.sample.id
      c.save}
  end

end
