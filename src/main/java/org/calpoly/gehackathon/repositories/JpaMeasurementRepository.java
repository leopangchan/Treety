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
    @Query(value = "SELECT tffc.avg_speed AS avg_vehicle_speed, tffc.avg_count AS avg_vehicle_count, ped.count "+
                    "AS avg_pedestrian_count, env.evapotranspiration AS evapotranspiration, env.carbon_reduction AS carbon_reduction " +
                    "FROM (select avg_speed, avg_count from traffic where traffic.local_id = :tffcId and traffic.avg_count > 0 " +
                    " and traffic.avg_speed > 0 order by time desc limit 1) as tffc, " +
                    "(select count from pedestrian where pedestrian.local_id = :pedId and pedestrian.count > 0 order " +
                    "by time desc limit 1) as ped," +
                    "(select evapotranspiration,carbon_reduction from environment where environment.local_id = " +
                    ":envId order by time desc limit 1) as env " +
                    ";", nativeQuery = true)
    List<Measurement> getTreeBenefitScore(@Param("pedId") String pedId,
                                          @Param("tffcId") String tffcId,
                                          @Param("envId") String envId);
}
