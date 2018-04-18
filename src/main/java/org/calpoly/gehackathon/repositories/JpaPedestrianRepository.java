package org.calpoly.gehackathon.repositories;

import org.calpoly.gehackathon.config.SpringApplicationContextInitializer;
import org.calpoly.gehackathon.domain.Pedestrian;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Profile({SpringApplicationContextInitializer.LOCAL_PROFILE,
          SpringApplicationContextInitializer.IN_MEMORY_PROFILE,
          SpringApplicationContextInitializer.CLOUD_PROFILE})
public interface JpaPedestrianRepository extends JpaRepository<Pedestrian, Integer> {
}
