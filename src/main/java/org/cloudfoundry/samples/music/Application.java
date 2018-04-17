package org.cloudfoundry.samples.music;

import org.cloudfoundry.samples.music.config.SpringApplicationContextInitializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

import javax.sql.DataSource;

@SpringBootApplication
public class Application extends SpringBootServletInitializer {

    public static void main(String[] args) {
        new SpringApplicationBuilder(Application.class)
                .initializers(new SpringApplicationContextInitializer())
                .application()
                .run(args);
    }
}