San Diego has set forth an ambitious Climate Action Plan (https://www.sandiego.gov/sustainability/climate-action-plan) to reduce carbon emissions, increase the city's urban canopy, create more pedestrian-friendly neighborhoods, and revitalize neighborhoods. Many of the goals introduced in the Climate Action Plan can be addressed by planting more trees. Trees provide many benefits to an area such as increasing property value, creating pedestrian-friendly neighborhoods, and reducing carbon emissions. The city would be able to better tackle its climate and socio-economic problems by increasing its urban canopy. 

Our web application, Treety, assists San Diego citizens and city planners in planting more trees. Treety does so by including an interactive map for planting trees and quantifying the benefits of trees through visualizations. Treety provides a seamless experience for the user, helping the user select the best location for their tree by aggregating CityIQ API data and leveraging GE's Predix platform. In doing so, Treety brings the San Diego community together to tackle the climate issues set forth in the Climate Action Plan. 

You can view our application at: https://treemap-connotative-disequilibrium.run.aws-usw02-pr.ice.predix.io.

Our application uses Java's Spring MVC framework on the backend and the Angular JS framework on the frontend. API's we are currently using include: Google Maps, Google Charts, and San Diego CityIQ (pedestrian, environmental, traffic). Our application is deployed using Predix and uses a Predix Postgressql database service. 

Documentation for each API can be found here:
1. https://ngmap.github.io/
2. https://developers.google.com/chart/
3. https://developer.currentbyge.com/cityiq

Our database code can be found in java/org.calpoly.gehackathon
Our entities are under /domain, our web server endpoints are implemented in the classes found under /controllers, and our SQL implementation can be found under /repositories. We used three schemas to store aggregated CityIQ data: Pedestrian, Traffic, Environmental, and Measurement. Each schema stores a timestamp, sensor location id, and one or more aggregated measures, such as a count or average. The Measurement entity stores all the data necessary to calculate a tree benefit score. These endpoints are used by our frontend to display data or compute tree benefits. In addition to these schemas, we also used a Tree schema to store trees that the user plants.  

Our frontend follows the MVC design pattern. Our controller layer consists of three main controllers: TreeMap, ChartController, and PlantTreeController. TreeMap is responsible for the interactive map, Chart is responsible for displaying data and updating charts, and PlantTree is responsible for adding and saving new trees. 

The /data folder contains a python code to aggregate and generate jsons that are later stored in our database as well as compute our tree benefit heatmap. 

