FROM dunglas/mercure

COPY Caddyfile /etc/caddy/Caddyfile
COPY /src /srv

CMD ["/usr/bin/caddy", "run", "--config", "/etc/caddy/Caddyfile"]

EXPOSE 80 443
