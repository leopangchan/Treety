import datetime
import folium
import math
import pandas as pd 
import numpy as np
import pickle
import requests
import time

from datetime import timedelta
from folium.plugins import HeatMap
from Util import *
from Networks import *

default_tree = "oak"

def calculate_tree_benefit_score(startts, endts, sample_loc, debug=True):
    # Pedestrian data
    total_peds = get_pedestrian_benefits(startts, endts, loc=sample_loc, debug=False)

    # Traffic data
    total_vehicles, average_speed = \
     get_vehicle_benefits(startts, endts, loc=sample_loc, debug=False)

    # Environmental data
    evapotranspiration, carbon_reduction = \
     get_env_benefits(startts, endts, loc=sample_loc, debug=False)

    return total_peds - total_vehicles - evapotranspiration + \
     carbon_reduction - average_speed

# calculates the tree benefit score over multiple locations
def calculate_tree_benefit_grid(startts, endts, coords, output):
    print ('Calculating scores...\n')
    scores = []
    i = 0

    for point in coords:
        score = (calculate_tree_benefit_score(startts, endts, point, debug=False))
        scores.append(score)
        print ('{0} {1}'.format(i, score))
        i += 1

    print ('Number of scores: {0}\nAverage {1}\n'.format(len(scores), 
     (sum(scores)/len(scores))))

    pickle.dump(scores, open(output,'wb'))
    return scores

# debug a sample tree benefit score
def calculate_sample_score(startts, endts):
    sample_loc = [32.714111261546044,-117.16024169311527]
    print('start time {0} end time {1}\n'.format(startts, endts))
    calculate_tree_benefit_score(startts, endts, sample_loc, debug=True)

# read randomly generated points
def read_lat_long_points(filename):
    coords = []

    with open(filename, 'r') as f:
        for line in f:
            line = line.split(',')
            if len(line) > 3:
                coords.append([float(line[1]), float(line[3])])

    return coords

# var heatMapData = 
# {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
# ];
def format_scores(scores_file, formatted, coords):
    scores = pickle.load(open(scores_file, 'rb'))

    assert len(coords) == len(scores)

    print ('Number of scores {0}'.format(len(scores)))
    print ('Average of scores {0}'.format(sum(scores)/len(scores)))
    total = sum(scores)
    scores_norm = [(float(i)/total)*10 for i in scores]
    print ('Average of scores {0}'.format(sum(scores_norm)/len(scores_norm)))
    
    with open(formatted, 'w') as f:
        f.write("var treeBenefitHeatmap = [")

        for score, point in zip(scores_norm[:-1], coords[:-1]):
            f.write("{{location : new google.maps.LatLng({0},{1}),weight: {2}}},\n"\
             .format(point[0],point[1],score))

        score = scores_norm[len(scores_norm)-1]
        point = coords[len(coords)-1]

        f.write("{{location : new google.maps.LatLng({0},{1}),weight: {2}}}\n"\
             .format(point[0],point[1],score))

        f.write("];\n")

def draw_heatmap(coords, scores_file):
    scores = pickle.load(open(scores_file, 'rb'))
    lats = [x[0] for x in coords]
    lons = [x[1] for x in coords]

    print (scores[:2])
    print (lats[:2])
    print (lons[:2])

    max_amount = float(np.max(scores))

    hmap = folium.Map(location=[32.7157, -117.1611], zoom_start=13, tiles=None)

    hm_wide = HeatMap( list(zip(lats, lons, scores)), 
        min_opacity=0.2,
        max_val=max_amount,
        radius=15, blur=10, 
        max_zoom=15,)

    #folium.GeoJson(district23).add_to(hmap)
    hmap.add_child(hm_wide)
    hmap.save('heatmap2.html')

def main():
    print ('Reading coordinates')
    coords = read_lat_long_points('coordinates/random_points_sd.csv')
    print (len(coords))
    print ('{0}\n'.format(coords[0]))

    # API parameters
    yesterday = datetime.datetime.now() - timedelta(365)
    endts = int(time.time()*1000)
    startts = int(time.mktime(yesterday.timetuple())*1000)

    #calculate_sample_score(startts, endts)
    #alculate_tree_benefit_grid(startts, endts, coords, '100_scores.p')
    #format_scores('100_scores.p','treeBenefitHeatmap_100.js',coords)
    draw_heatmap(coords, '100_scores.p')
    

if __name__ == "__main__":
    main()

