#!/bin/bash
if docker-compose ps | grep -q "Up"; then
  docker-compose down
  echo "Monitoring stopped!"
else
  echo "Services are already stopped."
fi