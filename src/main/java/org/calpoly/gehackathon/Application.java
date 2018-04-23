package org.calpoly.gehackathon;

import org.calpoly.gehackathon.config.SpringApplicationContextInitializer;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

@SpringBootApplication
public class Application extends SpringBootServletInitializer {

    public static void main(String[] args) {
        System.setProperty("testing", "testing");
        new SpringApplicationBuilder(Application.class)
                .initializers(new SpringApplicationContextInitializer())
                .application()
                .run(args);
    }
}