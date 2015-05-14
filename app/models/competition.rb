class Competition < ActiveRecord::Base

  belongs_to :organization

  belongs_to :competitor, class_name: "Organization"

  validates :competitor_id, uniqueness: { scope: :organization_id, message: "The competitor was already recorded for this organization." }

  # validate :swap_orgs

  def swap_orgs
    # Find the record where Org ID = inputted Org ID
    if Competition.find_by_organization_id(competitor_id)
    existing_record = Competition.find_by_organization_id(competitor_id)
    # If the record's Competitor ID = the inputted Org ID
      if existing_record.competitor_id == organization_id
        errors.add(:organization_id, "These two organizations were already recorded as competitors.")
      end # end the if block
    end # end the if block
  end # end the def block

  def self.seed(number)
    number.times {|x| c = Competition.new
      c.competitor_id = Organization.all.sample.id
      c.organization_id = Organization.all.sample.id
      c.save}
  end

  # number.times {|x| c = Competition.new; c.competitor_id = Organization.all.sample.id; c.organization_id = Organization.all.sample.id; c.save}

end
