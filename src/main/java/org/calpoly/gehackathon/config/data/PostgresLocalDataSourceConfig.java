package org.calpoly.gehackathon.config.data;

import org.apache.commons.dbcp.BasicDataSource;
import org.calpoly.gehackathon.config.SpringApplicationContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
@Profile(SpringApplicationContextInitializer.LOCAL_PROFILE)
public class PostgresLocalDataSourceConfig {

    @Bean
    public DataSource dataSource() {

        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setUrl("jdbc:postgresql://localhost/treemap");
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUsername("postgres");
        dataSource.setPassword("postgres");

        return dataSource;
    }

}