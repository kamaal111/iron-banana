default:
    just --list --unsorted

dev-web:
    just web/dev

dev-server: build-web
    just server/dev

build-web:
    #!/bin/zsh

    just web/build
    cp -r web/dist/* server/
    for file in server/*.html
    do
        mv $file server/static/
    done
