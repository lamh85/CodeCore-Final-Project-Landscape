class MarketSearchesController < ApplicationController

  def new
    session[:nav_link_pressed] = "Market Share"    
    @market_search = MarketSearch.new
    1.times { @market_search.market_filters.build }
  end

  def new_v2
    @extra_scripts = ['market_searches_angular']
    render "new_v2"
  end

  def results_v2
    # (byebug) params
    # {"0"=>"{\"search_term\":\"fff\",\"property\":\"category\"}", "controller"=>"market_searches", "action"=>"results_v2"}
    # (byebug) params["0"]
    # {"search_term":"fff","property":"category"}
    # (byebug) params["controller"]
    # market_searches

    # Parameters: {"0"=>"{\"search_term\":\"something\",\"property\":\"category\"}"}
    # *** ONE ITERATION ***
    # The key is {"0"=>"{\"search_term\":\"something\",\"property\":\"category\"}"}
    # Its class is Hash
    # The value is 
    # Its class is NilClass

    params_spliced = params.map{|key,value| {key => value} if key != "controller" && key != "action" }
    # array_of_filters = []
    params_spliced.each do |element|        # params_spliced is an Array. Each element is a Hash
      element.each do |key,value|
        puts "*** ONE ITERATION ***"        # {"0"=>"{\"search_term\":\"something\",\"property\":\"category\"}"}
        puts "The key is #{key}"            # 0
        puts "Its class is #{key.class}"    # String
        puts "The value is #{value}"        # {"search_term":"something","property":"category"}
        puts "Its class is #{value.class}"  # String
      end
    end
    # render text: array_of_filters.to_json
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
      result = {
        "market_id" => result.id,
        "company"   => result.organization.name,
        "product"   => result.product,
        "category"  => result.category.name,
        "province"  => result.province,
        "country"   => result.country,
        "sales"     => result.sales
      } 
      result_array << result
    end
    return result_array.to_json
  end # Write results to a JSON file

  def search_params
    params.require(:market_search).permit(:filter_id,
      {market_filters_attributes: [:property, :search_term,:_destroy]}
    )
  end
end