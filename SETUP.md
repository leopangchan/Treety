Our team used the IntelliJ IDE to develop this project. IntelliJ can be downloaded from: 
https://www.jetbrains.com/idea/download/#section=mac. Additionally, our team used gradle to build the source code.

To obtain the source code, clone the repository on your machine. Once you have the source code, open the IntelliJ IDE
and when prompted select open existing project. Select the directory where you have cloned the source code.

To run the application locally, you must have Postgressql installed on your machine. You can follow the
documentation here to install: https://www.postgresql.org/download/. Once Postgressql has been installed and
you have opened the project in IntelliJ, run ./gradlew bootRun to start the project. Open up the browser of your
choice and navigate to localhost:8080 to view the website. 

To deploy the application on your virtual box, obtain the source code from github and navigate to the project
directory. 

Run these commands to clean, build, and deploy the application.  
./gradlew clean
./gradlew build
cf push TreeMap -p build/libs/GE-Hackathon-1.0.war
