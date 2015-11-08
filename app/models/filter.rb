class Filter < ActiveRecord::Base

  belongs_to :search

  # VALIDATIONS

  validate :revenue_validations

  validate :text_search

  validate :property_blank

  def revenue_validations
    if property == "revenue"
      if equality == "includes"
        errors.add(:equality, "You must choose a mathematical option when filtering by revenue: less than, greater than, etc.")
      end
      
      if search_term.to_f <= 0
        errors.add(:search_term, "You must enter a number greater than 0 when filtering by revenue.")
      end
      if search_term.to_f > 2147483647
        errors.add(:search_term, "Sorry, our database does not support searching a number greater than 2,147,483,647")
      end
    end
  end

  def text_search
    if property != "revenue" && property != nil && property != ""
      if equality != "ILIKE"
        errors.add(:property, "You must choose 'contains text' when searcing by this property.")
      end
    end
  end

  def property_blank
    if (equality != nil && equality != "" && search_term != nil  && search_term != "") && (property == nil || property == "")
      errors.add(:property, "Please specify what organizational property that you want to search by.")
    end
  end

end