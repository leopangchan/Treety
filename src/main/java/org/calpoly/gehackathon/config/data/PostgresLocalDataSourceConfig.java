package org.calpoly.gehackathon.config.data;

import org.calpoly.gehackathon.config.SpringApplicationContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
@Profile(SpringApplicationContextInitializer.LOCAL_PROFILE)
public class PostgresLocalDataSourceConfig extends AbstractLocalDataSourceConfig {

  @Bean
  public DataSource dataSource() {
    return createDataSource("jdbc:postgresql://localhost/treemap",
        "org.postgresql.Driver", "postgres", "postgres");
  }

}