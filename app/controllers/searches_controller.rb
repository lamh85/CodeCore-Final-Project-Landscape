class SearchesController < ApplicationController

  def all_orgs
    session[:nav_link_pressed] = "All Orgs"
    @final_results = Organization.all
    render "all_orgs"
  end

  def competitors
    session[:nav_link_pressed] = "My Competitors"
    @final_results = current_user.organization.competitors
    @inverse_competitors = current_user.organization.inverse_competitors
    if @inverse_competitors != nil
      @final_results = @final_results | @inverse_competitors
    end
    @final_results.sort_by! { |organization| organization.revenue }.reverse!
    @competitor_search = true
    render "competitors"
  end

  def clients
    session[:nav_link_pressed] = "My Clients"
    @final_results = current_user.organization.clients
    render "clients"
  end

  def suppliers
    session[:nav_link_pressed] = "My Suppliers"    
    @final_results = current_user.organization.suppliers
    render "suppliers"
  end

  def new
    session[:nav_link_pressed] = "Search Orgs"    
    @search = Search.new
    1.times { @search.filters.build }
  end

  def create
    Search.destroy_all
    Filter.destroy_all
    @search = Search.new search_params

    respond_to do |format|
      if @search.save

        # extract the list of filters
        @filters = Search.find(@search).filters
        # This "do" loop is for *one* filter
        @filters.each do |filter|

          # Search based on type of org relationship
          # ########################################
          if filter.group == "competitors"
            competitor_ids = Competition.where("organization_id = #{filter.organizations} OR competitor_id = #{filter.organizations}").pluck(:organization_id, :competitor_id).flatten.uniq - [filter.organizations.to_i] # Create an array of org IDs, minus the queried org
            filter_results = Organization.where("organizations.id = any (array[?])", competitor_ids)
          elsif filter.group != "all"
            filter_results = Organization.find(filter.organizations).send(filter.group)
          else
            filter_results = Organization.all
          end

          # Search based on org's characteristic
          # ####################################
          if filter.property == "priority"
            filter_results = filter_results.joins(:priority).where("priorities.name ILIKE any (array[?])",search_terms_array)
          else
            escape_string = "?"               if filter.property == "revenue"
            escape_string = "any (array[?])"  if filter.equality == "ILIKE"
            term_query = filter.search_term.strip.to_f      if filter.property == "revenue"
            term_query = sanitize_array(filter.search_term) if filter.equality == "ILIKE"

            filter_results = filter_results.where("#{filter.property} #{filter.equality} #{escape_string}", term_query)
          end

          # Update the final results
          # ########################
          if @final_results == nil
            @final_results = filter_results
          else
            @final_results = @final_results & filter_results
          end # End updating @final_results

        end # End looping through every filter

        format.html { render :new, notice: "Search complete"}
        format.js {render }
        format.csv { send_data @final_results.to_csv }

      else
        format.html { render :new, alert: "We could not complete your search" }
        format.js {render }
      end # End if-save block
    end # End respond_to block
  end # End "create" action

  def index
  end

  def search_params
    params.require(:search).permit(:logic,:description,{filters_attributes: [:group,:organizations,:property,:equality,:search_term,:_destroy]})
  end  
end