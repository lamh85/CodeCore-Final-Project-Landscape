class Product < ActiveRecord::Base

  belongs_to :organization

  validates :organization_id, uniqueness: { scope: :item, message: "This product is already recorded for the organization."}

end
