FROM dunglas/mercure

COPY Caddyfile /etc/caddy/Caddyfile
COPY /src /srv

EXPOSE 80
EXPOSE 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
