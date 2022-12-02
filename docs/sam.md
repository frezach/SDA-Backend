### 1. Package the app for different environments
```bash
sam build --parameter-overrides ParameterKey=Stage,ParameterValue=dev ParameterKey=AppName,ParameterValue=sda-vod-dev
```

### 2. To start the APIs in local development environment
```bash
sam local start-api -t template.yaml --skip-pull-image --parameter-overrides ParameterKey=Stage,ParameterValue=dev ParameterKey=AppName,ParameterValue=sda-vod-dev
```
