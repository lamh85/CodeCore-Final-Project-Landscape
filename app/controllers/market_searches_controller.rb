class MarketSearchesController < ApplicationController

  def new
    session[:nav_link_pressed] = "Market Share"    
    @market_search = MarketSearch.new
    1.times { @market_search.market_filters.build }
  end

  def create
    MarketSearch.destroy_all
    MarketFilter.destroy_all
    @market_search = MarketSearch.new search_params
    respond_to do |format|
      if @market_search.save
        @final_results = nil
        filters = MarketSearch.find(@market_search).market_filters
        filters.each do |filter| # for every filter...

          # Delete blanks and trim white spaces - calling application_controller
          # ####################################################################
          search_terms_array = sanitize_array(filter.search_term)

          # MERGE THE FILTER RESULTS WITH FINAL RESULTS
          # ###########################################
          if filter.property == "category"
            if @final_results == nil
              @final_results = Market.joins(:category).where("name ILIKE any (array[?])",search_terms_array)
            else
              @final_results = @final_results.joins(:category).where("name ILIKE any (array[?])",search_terms_array)              
            end # if @final_results == nil
          else # if filter.property == "category"
            if @final_results == nil
              @final_results = Market.where("#{filter.property} ILIKE any (array[?])",search_terms_array)
            else
              @final_results = @final_results.where("#{filter.property} ILIKE any (array[?])",search_terms_array)
            end # if @final_results == nil
          end # if filter.property == "category"

        end # End the looping through each filter
        @final_results = @final_results.sort_by { |k| k["sales"] }.reverse
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