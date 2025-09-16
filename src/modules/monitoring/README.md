# Monitoring

## How to Start
1. Run `./scripts/start_monitoring.sh`.
2. Access Grafana at `http://localhost:3000`.

## Adding Alerts
- Edit the files in `alerts/`.
- Reload Prometheus to apply changes.

## Troubleshooting
### Prometheus not scraping targets
- Check if the targets are up and running.
- Verify the scrape interval in `prometheus.config.js`.

## Extending Monitoring
- To monitor Kubernetes, add the following targets to `prometheus.config.js`:
  ```javascript
  kubernetes: ['localhost:9093']