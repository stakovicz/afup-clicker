FROM dunglas/mercure

COPY Caddyfile /etc/caddy/Caddyfile
COPY /src /srv

RUN sed -i 's/0\.0\.0\.0/0.0.0.0:{$PORT}/' /etc/Caddyfile
RUN sed -e '$a tls off' /etc/Caddyfile

CMD ["/usr/bin/caddy", "run", "--config", "/etc/caddy/Caddyfile"]

EXPOSE 80 443
