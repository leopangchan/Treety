package org.calpoly.gehackathon.repositories;

import org.calpoly.gehackathon.config.SpringApplicationContextInitializer;
import org.calpoly.gehackathon.domain.Measurement;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Profile({SpringApplicationContextInitializer.LOCAL_PROFILE,
        SpringApplicationContextInitializer.IN_MEMORY_PROFILE,
        SpringApplicationContextInitializer.CLOUD_PROFILE})

public interface JpaMeasurementRepository extends JpaRepository<Measurement, String> {
    @Query(value = "SELECT tffc.avg_speed AS avg_vehicle_speed, tffc.avg_count AS avg_vehicle_count, ped.count " +
            "AS avg_pedestrian_count, env.evapotranspiration AS evapotranspiration, env.carbon_reduction AS carbon_reduction " +
            "FROM (SELECT avg_speed, avg_count FROM traffic WHERE traffic.local_id = :tffcId AND traffic.avg_count > 0 " +
            " AND traffic.avg_speed > 0 ORDER BY time DESC LIMIT 1) AS tffc, " +
            "(SELECT count FROM pedestrian WHERE pedestrian.local_id = :pedId AND pedestrian.count > 0 ORDER " +
            "BY time DESC LIMIT 1) AS ped," +
            "(SELECT evapotranspiration,carbon_reduction FROM environment WHERE environment.local_id = " +
            ":envId ORDER BY time DESC LIMIT 1) AS env " +
            ";", nativeQuery = true)
    List<Measurement> getTreeBenefitScore(@Param("pedId") String pedId,
                                          @Param("tffcId") String tffcId,
                                          @Param("envId") String envId);
}
