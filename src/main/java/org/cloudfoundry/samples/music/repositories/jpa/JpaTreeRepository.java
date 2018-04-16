package org.cloudfoundry.samples.music.repositories.jpa;

import org.cloudfoundry.samples.music.domain.Tree;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Profile({"in-memory", "postgres"})
public interface JpaTreeRepository extends JpaRepository<Tree, String> {
}
