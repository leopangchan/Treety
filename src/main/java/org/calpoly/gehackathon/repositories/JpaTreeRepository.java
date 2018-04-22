package org.calpoly.gehackathon.repositories;

import org.calpoly.gehackathon.config.SpringApplicationContextInitializer;
import org.calpoly.gehackathon.domain.Measurement;
import org.calpoly.gehackathon.domain.Tree;
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

public interface JpaTreeRepository extends JpaRepository<Tree, Integer> {
}
