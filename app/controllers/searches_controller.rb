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

          # Make an array based on :group
          # #############################
          if filter.group != "all"
            org_group = Organization.find(filter.organizations).send(filter.group)
            # Add inverse competitors
            # -----------------------
            if filter.group == "competitors"
              # Organization.joins(:competitions).where("competitor_id = 1")
              org_group = org_group | Organization.find(filter.organizations).inverse_competitors
            end
          else
            org_group = Organization.all
          end

          # Delete blanks and trim white spaces - calling application_controller
          # ####################################################################
          if filter.equality == "includes"
            search_terms_array = sanitize_array(filter.search_term)
          elsif filter.property == "revenue"
            filter.search_term.strip!
          end

          org_equality = nil

          if filter.property == "priority"
            # Must specify that you're searching proprities.name because "name" is also a column in Organization table"
            org_equality = Organization.joins(:priority).where("priorities.name ILIKE any (array[?])",search_terms_array)
          elsif filter.property == "revenue"
            org_equality = Organization.where("revenue #{filter.equality} #{filter.search_term}")
          elsif filter.equality == "includes"
            org_equality = Organization.where("#{filter.property} ILIKE any (array[?])",search_terms_array)
          end

          # Comebine the two arrays
          # #######################
          if org_equality == nil
            filter_results = org_group # Since there is no org_equality, there is only one other array to accept
          else
            filter_results = org_group & org_equality
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

  # def show
  # end

  def index
  end

  def search_params
    params.require(:search).permit(:logic,:description,{filters_attributes: [:group,:organizations,:property,:equality,:search_term,:_destroy]})
  end  
end