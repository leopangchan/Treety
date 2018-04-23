package org.calpoly.gehackathon.domain;

import javax.persistence.*;

@Entity(name = "measurement")
@Table(name = "measurement")
public class Measurement {
    @Id
    @Column(length = 40)
    @GeneratedValue
    public Integer id;

    public Double avg_vehicle_speed;
    public Double avg_vehicle_count;
    public Double avg_pedestrian_count;
    public Double evapotranspiration;
    public Double carbon_reduction;

    public Measurement(Double avg_vehicle_speed, Double avg_vehicle_count,
                       Double avg_pedestrian_count, Double evapotranspiration,
                       Double carbon_reduction) {

        this.avg_vehicle_speed = avg_vehicle_speed;
        this.avg_vehicle_count = avg_vehicle_count;
        this.avg_pedestrian_count = avg_pedestrian_count;
        this.evapotranspiration = evapotranspiration;
        this.carbon_reduction = carbon_reduction;
    }

    public Measurement() {

    }
}
