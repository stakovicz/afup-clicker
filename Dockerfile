FROM dunglas/mercure

ENV MERCURE_PUBLISHER_JWT_KEY  = '1147c58e-8de5-47d3-bca4-f16137741034'
ENV MERCURE_SUBSCRIBER_JWT_KEY = '1147c58e-8de5-47d3-bca4-f16137741034'

COPY Caddyfile /etc/caddy/Caddyfile
COPY /src /srv

CMD ["/usr/bin/caddy", "run", "--config", "/etc/caddy/Caddyfile"]

EXPOSE 80 443
