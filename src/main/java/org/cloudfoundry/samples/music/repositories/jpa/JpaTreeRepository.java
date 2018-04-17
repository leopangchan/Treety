package org.cloudfoundry.samples.music.repositories.jpa;

import org.cloudfoundry.samples.music.config.SpringApplicationContextInitializer;
import org.cloudfoundry.samples.music.domain.Tree;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Profile({SpringApplicationContextInitializer.LOCAL_PROFILE,
          SpringApplicationContextInitializer.IN_MEMORY_PROFILE,
          SpringApplicationContextInitializer.CLOUD_PROFILE})
public interface JpaTreeRepository extends JpaRepository<Tree, String> {
}
