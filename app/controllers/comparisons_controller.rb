class ComparisonsController < ApplicationController

  def new
    @comparison = Comparison.new
  end

  def create
    @comparison = Comparison.new comparison_params
    respond_to do |format|
      if @comparison.save
        @org1 = Organization.find(@comparison.org1)
        @org2 = Organization.find(@comparison.org2)
        format.html { render :new }
        format.js { render }
      else
        format.html { render :new }
        format.js { render }
      end # if save
    end # respond_to
  end

  def comparison_params
    params.require(:comparison).permit(:org1, :org2)
  end

end