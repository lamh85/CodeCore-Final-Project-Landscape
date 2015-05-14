class Search < ActiveRecord::Base

  # ASSOCIATIONS

  has_many :filters, dependent: :destroy
  accepts_nested_attributes_for :filters, :allow_destroy => true

  # VALIDATIONS
  
  def self.to_csv
    byebug
    CSV.generate do |csv|
      csv << column_names
      all.each do |result|
        csv << result.attributes.values_at(*column_names)
      end
    end
  end

end
