class LocationLevelsController < ApplicationController
    def save
        # byebug
        @location_level = LocationLevel.new(location_level_params)
        if @location_level.save
            render text: @location_level.to_json
        end
        # render text: params
=begin
(byebug) params
    {"level"=>3, "name"=>"UN-NAMED LEVEL", "thread"=>nil, "controller"=>"location_levels", "action"=>"save", "location_level"=>{"name"=>"UN-NAMED LEVEL", "level"=>3, "thread"=>nil}}
(byebug) params[:location_level]
    {"name"=>"UN-NAMED LEVEL", "level"=>3, "thread"=>nil}
(byebug) params[:location_level]["name"]
    UN-NAMED LEVEL
=end
    end

    def get_all
        levels = LocationLevel.all
        render text: levels.to_json
    end

    def index
        @extra_scripts = ['location_levels_angular']
        render 'index'
    end

    def destroy
    end

    private

    def location_level_params
        params.require(:location_level).permit(:name, :level, :thread)
    end
end
