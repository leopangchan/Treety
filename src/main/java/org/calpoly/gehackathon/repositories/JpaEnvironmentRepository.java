package org.calpoly.gehackathon.repositories;

import org.calpoly.gehackathon.config.SpringApplicationContextInitializer;
import org.calpoly.gehackathon.domain.Environmental;
import org.calpoly.gehackathon.domain.Traffic;
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

public interface JpaEnvironmentRepository extends JpaRepository<Environmental, Integer> {

    @Query("from environment where local_id = :locId and time >= :start and time <= :end")
    List<Environmental> findAllByLocIdAndTimeRange(@Param("locId") String locId,
                                                   @Param("start") Long start,
                                                   @Param("end") Long end);
}
