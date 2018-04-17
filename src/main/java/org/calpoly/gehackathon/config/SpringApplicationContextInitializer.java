package org.calpoly.gehackathon.config;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cloud.Cloud;
import org.springframework.cloud.CloudException;
import org.springframework.cloud.CloudFactory;
import org.springframework.cloud.service.ServiceInfo;
import org.springframework.cloud.service.common.PostgresqlServiceInfo;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.util.StringUtils;

import java.util.*;

public class SpringApplicationContextInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    private static final Log logger = LogFactory.getLog(SpringApplicationContextInitializer.class);

    private static final Map<Class<? extends ServiceInfo>, String> serviceTypeToProfileName = new HashMap<>();
    private static final List<String> validLocalProfiles = Arrays.asList("postgres");

    public static final String IN_MEMORY_PROFILE = "in-memory";
    public static final String LOCAL_PROFILE = "local";
    public static final String CLOUD_PROFILE = "cloud";

    static {
        serviceTypeToProfileName.put(PostgresqlServiceInfo.class, "postgres");;
    }

    /**
     * Attempts to get profile of the environments in the following order:
     * 1. Cloud Foundry
     * 2. Local database
     * 3. in-memory database H2
     * */
    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        Cloud cloud = getCloud();

        ConfigurableEnvironment appEnvironment = applicationContext.getEnvironment();
        logger.info("initialize");
        String[] persistenceProfiles = getCloudProfile(cloud);
        if (persistenceProfiles == null) {
            persistenceProfiles = getActiveProfile(appEnvironment);
        }
        if (persistenceProfiles == null) {
            persistenceProfiles = new String[] { LOCAL_PROFILE };
        }

        //logger.info("out persistenceProfile: " + persistenceProfiles);
        for (String persistenceProfile : persistenceProfiles) {
            logger.info("persistenceProfile: " + persistenceProfile);
            appEnvironment.addActiveProfile(persistenceProfile);
        }
    }

    /**
     * @return 'cloud' if the application runs on a cloud service
     * */
    private String[] getCloudProfile(Cloud cloud) {
        if (cloud == null) {
            return null;
        }

        List<String> profiles = new ArrayList<>();

        List<ServiceInfo> serviceInfos = cloud.getServiceInfos();

        logger.info("Found serviceInfos: " + StringUtils.collectionToCommaDelimitedString(serviceInfos));

        for (ServiceInfo serviceInfo : serviceInfos) {
            if (serviceTypeToProfileName.containsKey(serviceInfo.getClass())) {
                profiles.add(serviceTypeToProfileName.get(serviceInfo.getClass()));
            }
        }

        if (profiles.size() > 1) {
            throw new IllegalStateException(
                    "Only one service of the following types may be bound to this application: " +
                            serviceTypeToProfileName.values().toString() + ". " +
                            "These services are bound to the application: [" +
                            StringUtils.collectionToCommaDelimitedString(profiles) + "]");
        }

        if (profiles.size() > 0) {
            return createProfileNames(profiles.get(0), CLOUD_PROFILE);
        }

        return null;
    }

    private Cloud getCloud() {
        try {
            CloudFactory cloudFactory = new CloudFactory();
            return cloudFactory.getCloud();
        } catch (CloudException ce) {
            logger.info("Get Cloud exception");
            ce.printStackTrace();
            return null;
        }
    }

    private String[] getActiveProfile(ConfigurableEnvironment appEnvironment) {
        List<String> serviceProfiles = new ArrayList<>();
        logger.info("getActiveProfile");
        for (String profile : appEnvironment.getActiveProfiles()) {
            if (validLocalProfiles.contains(profile)) {
                serviceProfiles.add(profile);
            }
        }

        if (serviceProfiles.size() > 1) {
            throw new IllegalStateException("Only one active Spring profile may be set among the following: " +
                    validLocalProfiles.toString() + ". " +
                    "These profiles are active: [" +
                    StringUtils.collectionToCommaDelimitedString(serviceProfiles) + "]");
        }

        if (serviceProfiles.size() > 0) {
            logger.info("Setting local profile: " + LOCAL_PROFILE);
            return createProfileNames(serviceProfiles.get(0), LOCAL_PROFILE);
        }

        return null;
    }

    private String[] createProfileNames(String baseName, String suffix) {
        String[] profileNames = {baseName, baseName + "-" + suffix};
        logger.info("Setting profile names: " + StringUtils.arrayToCommaDelimitedString(profileNames));
        return profileNames;
    }
}
