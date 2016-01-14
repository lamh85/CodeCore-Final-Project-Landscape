class MarketSearchesController < ApplicationController

  def new
    @extra_scripts = ['market_searches','market_searches_angular']
    session[:nav_link_pressed] = "Market Share"
    render "new"
  end

  def results
    # The controller receives this params hash. Each hash's value is a JSON transmitted by the Angular form.
    # params: = { "0" => "{\"search_term\":\"something\",\"property\":\"category\"}",
    #             "1" => "{\"search_term\":\"something\",\"property\":\"category\"}",
    #             "controller"  => "market_searches", "action" => "results_v2" }
    search_filters = params.map{ |key, value| JSON.parse(value) if key.to_i.to_s == key}.compact # Map if key can be converted to integer
    search_filters.each do |filter| # for every filter...
        # If there were previous search search_filters, then merge results
        sql_select_clause = @final_results == nil ? Market : @final_results
        sql_select_clause = sql_select_clause.joins(:category) if filter["property"] == "category"
        sql_where_clause = filter["property"] == "category" ? "name" : filter["property"]
        @final_results = sql_select_clause.where("#{sql_where_clause} ILIKE any (array[?])", sanitize_array(filter["search_term"]))
    end # End the looping through each filter
    @json_data = write_json.html_safe if @final_results
    render text: @json_data
  end # def create

  private

  # Write results to a JSON file
  def write_json
    results_array = []
    @final_results.each do |result|
        results_array <<  {
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
    end
    return {results: results_array, sum: @final_results.sum(:sales)}.to_json
  end # Write results to a JSON file

  def search_params
    params.require(:market_search).permit(:filter_id,
      {market_filters_attributes: [:property, :search_term,:_destroy]}
    )
  end
end