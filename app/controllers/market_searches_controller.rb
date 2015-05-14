class MarketSearchesController < ApplicationController

  def new
    @market_search = MarketSearch.new
    1.times { @market_search.market_filters.build }
  end

  def create
    MarketSearch.destroy_all
    MarketFilter.destroy_all
    @market_search = MarketSearch.new search_params
    respond_to do |format|
      if @market_search.save
        filters = MarketSearch.find(@market_search).market_filters
        # filter_results = nil
        filters.each do |filter| # for every filter...
          filter_results = nil # THIS IS REQUIRED FOR KEEPING *EVERY* filter_results AS AN ACTIVERECORD CLASS!!!

          # LOGIC FOR DELETING BLANKS AND TRIMMING WHITE SPACES
          # ###################################################
          search_terms_array = filter.search_term.split(",")
          search_terms_array.each do |cs_term| # for every CommaSeparated_Term ...
            cs_term.strip! # trim whitespaces
          end
          search_terms_array.delete("") # Delete blank elements

          # LOOP THROUGH EVERY COMMA-SEPARATED TERM
          # #######################################
          if search_terms_array.length > 0 # If there are STILL cs_terms after deleting blank ones
            search_terms_array.each do |cs_term| # for every CommaSeparated_Term ...
              # Check whether it is a category search or other property
              # Returns: cs_term_results
              cs_term_results = search_by_term(filter,cs_term)
              # UPDATE THE FILTER'S RESULTS
              if cs_term_results != nil
                if filter_results == nil
                  filter_results = cs_term_results
                elsif
                  filter_results = filter_results | cs_term_results
                end
              end
            end # for every CommaSeparated_Term ...
          end

          # UPDATE THE FINAL RESULT
          if filter_results == nil
            @final_results = nil
            action = "@final_results = nil"
          elsif @final_results == nil
            @final_results = filter_results
            action = "@final_results = filter_results"
          else
            # filter_results_ids = filter_results.pluck(:id).to_s[1..-2]
            # find_by_array = @final_results.find("#{filter_results_ids}")
            # @final_results = find_by_array
            temp_results = @final_results & filter_results
            @final_results = temp_results
            action = "@final_results = @final_results & filter_results"
          end
        end # End the looping through each filter
        @final_results = @final_results.sort_by { |k| k["sales"] }.reverse

        # @final_results.order(:sales)
        format.html { render :new, notice: "Search complete"}
        format.js {render}
        if @final_results
          write_json
        end
      else # If could not save
        format.html { render :new, alert: "We could not complete your search" }
        format.js {render}
      end # End "if save"
    end # End respond_to

  end # End create block

  def search_by_term(filter,cs_term)
    if filter.property == "category"
      # Get the Category IDs that correspond to the search_term
      category_id_array = Category.where("name ILIKE ?", "%#{cs_term}%").pluck(:id)
      cs_term_results = nil
      category_id_array.each do |id| # find markets via each single category ID
        cat_id_mkts = Category.find(id).markets
        cs_term_results ||= cat_id_mkts # if undefined
        cs_term_results = cs_term_results | cat_id_mkts # accumulate the results
      end # Finding markets via each category ID  
      return cs_term_results
    else # If the filter was not based on category
      cs_term_results = Market.where("#{filter.property} ILIKE ?", "%#{cs_term}%")
    end # If the filter was not based on category
  end

  def show
  end

  private

  # Write results to a JSON file
  def write_json
    result_array = []
    @final_results.each do |result|
      result = {
        "market_id" => result.id,
        "organization_id" => result.organization_id,
        "company" => result.organization.name,
        "category_id" => result.category_id,
        "product" => result.product,
        "category" => result.category.name,
        "province" => result.province,
        "country" => result.country,
        "sales" => result.sales
      } 
      result_array << result
    end
    File.open("app/views/market_searches/show.json","w") do |f|
      f.write(result_array.to_json)
    end 
  end # Write results to a JSON file

  def search_params
    params.require(:market_search).permit(:filter_id,
      {market_filters_attributes: [:property, :search_term,:_destroy]}
      )
  end
end