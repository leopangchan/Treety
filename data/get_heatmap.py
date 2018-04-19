import datetime
import math
import pickle
import requests
import time

from datetime import timedelta
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

# var heatMapData = [
# {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
# ];
def format_scores(scores_file, formatted, coords):
    scores = pickle.load(open(scores_file, 'rb'))

    assert len(coords) == len(scores)

    print ('Number of scores {0}'.format(len(scores)))
    print ('Average of scores {0}'.format(sum(scores)/len(scores)))
    total = sum(scores)
    scores_norm = [i/total for i in scores]
    print ('Average of scores {0}'.format(sum(scores_norm)/len(scores_norm)))
    
    with open(formatted, 'w') as f:
        f.write("var treeBenefitHeatmap = [")

        for score, point in zip(scores_norm[:-1], coords[:-1]):
            f.write("{{location : new google.maps.LatLng({0},{1}),weight: {2}}},\n"\
             .format(point[0],point[1],score*1000))

        score = scores_norm[len(scores_norm)-1]
        point = coords[len(coords)-1]

        f.write("{{location : new google.maps.LatLng({0},{1}),weight: {2}}}\n"\
             .format(point[0],point[1],score*1000))

        f.write("];\n")

def main():
    print ('Reading coordinates')
    coords = read_lat_long_points('random_points_sd_1000.csv')
    print (len(coords))
    print ('{0}\n'.format(coords[0]))

    # API parameters
    yesterday = datetime.datetime.now() - timedelta(365)
    endts = int(time.time()*1000)
    startts = int(time.mktime(yesterday.timetuple())*1000)

    #calculate_sample_score(startts, endts)
    #calculate_tree_benefit_grid(startts, endts, coords, '1000_scores.p')
    #format_scores('1000_scores.p','treeBenefitHeatmap_1000.js',coords)
    

if __name__ == "__main__":
    main()

