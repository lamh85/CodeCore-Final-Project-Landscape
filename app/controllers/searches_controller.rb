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
              org_group = org_group | Organization.find(filter.organizations).inverse_competitors
            end
          else
            org_group = Organization.all
          end

          # Make an array based on :search_term
          # If the user did NOT choose revenue
          # ###################################
          if filter.equality == "includes" || filter.property == "priority"
            org_equality = nil

            # Delete blanks and trim white spaces - calling application_controller
            # ####################################################################
            search_terms_array = sanitize_array(filter.search_term)            

            # LOOP THROUGH EVERY COMMA-SEPARATED TERM
            # #######################################            
            if search_terms_array.length > 0 # If there are STILL cs_terms after deleting blank ones
                search_terms_array.each do |cs_term| # for every CommaSeparated_Term ...
                  cs_term.strip!
                  search_terms_array.delete("")
                  if filter.property == "priority"
                    priority_id_array = Priority.where("name ILIKE ?", "%#{cs_term}%").pluck(:id)
                    cs_term_results = nil
                    priority_id_array.each do |id| # Loop through every Priority ID
                      priority_id_orgs = Priority.find(id).organizations
                      cs_term_results ||= priority_id_orgs
                      cs_term_results = cs_term_results | priority_id_orgs
                    end
                  elsif filter.equality == "includes"
                    cs_term_results = Organization.where("#{filter.property} ILIKE ?", "%#{cs_term}%")
                  end

                  # Combine the single term's results with previous comman-separated terms
                  if cs_term_results != nil 
                    if org_equality == nil
                      org_equality = cs_term_results
                    elsif
                      org_equality = org_equality | cs_term_results
                    end
                  end # Combine the single term's results with previous comman-separated terms
                end # loop through every comma-separated term
              
            end # if there are no blanks in the array of search terms

          # IF NOT SEARCH BY SEARCH TERM
          # ############################
          elsif filter.property == "revenue"
            filter.search_term.strip!
            if filter.search_term != ""
              org_equality = Organization.where("revenue #{filter.equality} ?", "#{filter.search_term}")
            end
          else # If the user did not specify what proprty to search
            org_equality = nil
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
