package org.calpoly.gehackathon.repositories.mongodb;

import org.calpoly.gehackathon.domain.Album;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
@Profile("mongodb")
public interface MongoAlbumRepository extends MongoRepository<Album, String> {
}