class LocationLevelsController < ApplicationController
    def create
    end

    def index
        @extra_scripts = ['location_levels_angular']
        levels = LocationLevel.all
        render text: levels.to_json
    end

    def update
    end

    def destroy
    end
end
