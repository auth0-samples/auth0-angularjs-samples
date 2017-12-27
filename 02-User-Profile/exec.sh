#!/usr/bin/env bash
docker build -t auth0-angularjs-02-user-profile .
docker run -p 3000:3000 -it auth0-angularjs-02-user-profile
