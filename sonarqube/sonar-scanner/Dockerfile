FROM ubuntu:22.04

RUN apt update && \
    apt install -y wget zip unzip

RUN curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -; \
    apt-get install -y nodejs

RUN wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.7.0.2747-linux.zip && \
    unzip sonar-scanner-cli-4.7.0.2747-linux.zip

ENV PATH /sonar-scanner-4.7.0.2747-linux/bin:$PATH

RUN wget https://www.sourcemeter.com/static/SourceMeter-10.0.0-x64-linux.tgz && \
    tar -xvf SourceMeter-10.0.0-x64-linux.tgz -C /

WORKDIR /SourceMeter-10.0.0-x64-Linux/JavaScript

RUN mv SourceMeterJavaScript RealSourceMeterJavaScript; \
    echo "find .. -path **/node_modules | xargs rm -rf; exec /SourceMeter-10.0.0-x64-Linux/JavaScript/RealSourceMeterJavaScript \"\$@\"" > SourceMeterJavaScript; \
    chmod 777 SourceMeterJavaScript

WORKDIR /usr/src