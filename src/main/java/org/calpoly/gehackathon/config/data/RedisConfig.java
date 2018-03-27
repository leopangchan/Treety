package org.calpoly.gehackathon.config.data;

import org.calpoly.gehackathon.domain.Album;
import org.calpoly.gehackathon.repositories.redis.RedisAlbumRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@Profile("redis")
public class RedisConfig {

    @Bean
    public RedisAlbumRepository redisRepository(RedisTemplate<String, Album> redisTemplate) {
        return new RedisAlbumRepository(redisTemplate);
    }

    @Bean
    public RedisTemplate<String, Album> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Album> template = new RedisTemplate<>();

        template.setConnectionFactory(redisConnectionFactory);

        RedisSerializer<String> stringSerializer = new StringRedisSerializer();
        RedisSerializer<Album> albumSerializer = new Jackson2JsonRedisSerializer<>(Album.class);

        template.setKeySerializer(stringSerializer);
        template.setValueSerializer(albumSerializer);
        template.setHashKeySerializer(stringSerializer);
        template.setHashValueSerializer(albumSerializer);

        return template;
    }

}
