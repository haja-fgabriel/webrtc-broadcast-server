FROM sonarqube:8.9.2-community

RUN wget https://www.sourcemeter.com/static/SourceMeter-10.0.0-x64-linux.tgz && \
    tar -xvf SourceMeter-10.0.0-x64-linux.tgz

RUN wget https://github.com/FrontEndART/SonarQube-plug-in/releases/download/v10.0-v8.9-v2.1.0/sourcemeter-10.0-plugins-for-sonarqube-8.9-v2.1.0.tar.gz && \
    tar -xvf sourcemeter-10.0-plugins-for-sonarqube-8.9-v2.1.0.tar.gz && \
    cp -r sourcemeter-10.0-plugins-for-sonarqube-8.9-v2.1.0/plugins/* /opt/sonarqube/extensions/plugins

RUN apk add nodejs glibc

# Add SourceMeter settings to SonarQube
RUN echo "sm.toolchaindir=/opt/sonarqube/SourceMeter-10.0.0-x64-Linux" >>conf/sonar.properties