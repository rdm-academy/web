FROM abiosoft/caddy

COPY Caddyfile /etc/Caddyfile
COPY build /www

ENTRYPOINT ["/usr/bin/caddy"]
CMD ["--conf", "/etc/Caddyfile"]
