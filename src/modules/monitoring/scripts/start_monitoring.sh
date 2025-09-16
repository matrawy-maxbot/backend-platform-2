#!/bin/bash
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Please install Docker first."
  exit 1
fi

if ! command -v docker-compose &> /dev/null; then
  echo "Docker Compose is not installed. Please install Docker Compose first."
  exit 1
fi

if docker-compose ps | grep -q "Up"; then
  echo "Services are already running."
else
  docker-compose up -d
  echo "Monitoring started!"

  # Health check
  echo "Performing health checks..."
  sleep 10 # Wait for services to start
  if docker-compose ps | grep -q "Up"; then
    echo "All services are up and running."
  else
    echo "Some services failed to start. Check logs for more details."
    exit 1
  fi
fi