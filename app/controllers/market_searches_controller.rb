class MarketSearchesController < ApplicationController

  def new
    @extra_scripts = ['market_searches']
    session[:nav_link_pressed] = "Market Share"    
    @market_search = MarketSearch.new
    1.times { @market_search.market_filters.build }
  end

  def new_v2
    @extra_scripts = ['market_searches','market_searches_angular']
    render "new_v2"
  end

  def results_v2
=begin
    params: = { "0" => "{\"search_term\":\"something\",\"property\":\"category\"}",
                "1" => "{\"search_term\":\"something\",\"property\":\"category\"}",
      "controller"  => "market_searches", "action" => "results_v2" }
=end
    filters = params.map{|key, value| eval(value) if key != "controller" && key != "action"}.compact
    filters.each do |filter| # for every filter...
        # If there were previous search filters, then merge results
        sql_select = @final_results == nil ? Market : @final_results

        sql_select = sql_select.joins(:category) if filter[:property] == "category"
        where_column = filter[:property] == "category" ? "name" : filter[:property]
        @final_results = sql_select.where("#{where_column} ILIKE any (array[?])", sanitize_array(filter[:search_term]))
    end # End the looping through each filter
    @final_results = @final_results.sort_by { |k| k["sales"] }.reverse
    @json_data = write_json.html_safe if @final_results
    render text: @json_data
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

            # If there were previous search filters, then merge results
            sql_select = @final_results == nil ? Market : @final_results

            sql_select = sql_select.joins(:category) if filter.property == "category"
            where_column = filter.property == "category" ? "name" : filter.property
            @final_results = sql_select.where("#{where_column} ILIKE any (array[?])", sanitize_array(filter.search_term))

        end # End the looping through each filter
        @final_results = @final_results.sort_by { |k| k["sales"] }.reverse
        @json_data = write_json.html_safe if @final_results
        format.html { render :new, notice: "Search complete"}
        format.js {render}
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
        result_array <<  {
          "market_id"   => result.id,
          "company"     => result.organization.name,
          "priority"    => result.organization.priority.name,
          "product"     => result.product,
          "category"    => result.category.name,
          "province"    => result.province,
          "country"     => result.country,
          "sales"       => result.sales,
          "description" => result.description
        } 
      # result_array << result
    end
    return result_array.to_json
  end # Write results to a JSON file

  def search_params
    params.require(:market_search).permit(:filter_id,
      {market_filters_attributes: [:property, :search_term,:_destroy]}
    )
  end
end