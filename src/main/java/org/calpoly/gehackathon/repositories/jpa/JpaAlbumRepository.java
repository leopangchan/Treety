package org.calpoly.gehackathon.repositories.jpa;

import org.calpoly.gehackathon.domain.Album;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Profile({"in-memory", "mysql", "postgres", "oracle", "sqlserver"})
public interface JpaAlbumRepository extends JpaRepository<Album, String> {
}
