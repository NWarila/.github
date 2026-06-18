# renovate: datasource=docker depName=ghcr.io/nwarila-platform/base-micro
FROM ghcr.io/nwarila-platform/base-micro@sha256:1111111111111111111111111111111111111111111111111111111111111111 AS runtime

# renovate: go-fips-builder
ARG GO_VERSION=1.25.3
FROM golang:1.25.3@sha256:2222222222222222222222222222222222222222222222222222222222222222 AS go-fips-builder
