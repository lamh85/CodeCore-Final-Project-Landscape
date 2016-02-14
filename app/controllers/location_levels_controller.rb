class LocationLevelsController < ApplicationController
    def save
        @location_level = LocationLevel.new(location_level_params)
        if @location_level.save
            render text: @location_level.to_json
        end
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
        LocationLevel.find(params[:id]).delete
        render text: "1"
    end

    private

    def location_level_params
        params.require(:location_level).permit(:name, :level, :thread)
    end
end
