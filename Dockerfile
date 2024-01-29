FROM debian

# update packages
RUN apt-get -y update && apt-get install -y wget

# create root application folder
WORKDIR /app

# copy configs to /app folder

COPY ./install.sh .
# copy source code to /app/src folder

RUN /app/install.sh

ENTRYPOINT [ "pd" ]