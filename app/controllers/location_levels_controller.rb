class LocationLevelsController < ApplicationController
    def save
        render text: params
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
end
