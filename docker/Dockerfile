FROM mhart/alpine-node:6

MAINTAINER Jan Rohwer <jan.rohwer@gmail.com>

RUN apk update && apk --no-cache add git

# install geofency2mqtt
RUN mkdir /opt && git clone https://github.com/janhuddel/geofency2mqtt.git
ENV APP_DIR=/opt/geofency2mqtt
WORKDIR $APP_DIR

EXPOSE 80

CMD ["node", "server.js"]
