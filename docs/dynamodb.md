# DynamoDB Docker Image Helper Commands

Table needs to be created before running the API Gateway + Lambda locally. This command creates local table with indexes required.

```bash
aws dynamodb create-table \
    --table-name sda-dev \
    --attribute-definitions AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=GSI1,AttributeType=S  \
    --key-schema AttributeName=PK,KeyType=HASH \
        AttributeName=SK,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5 \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"GSI1\",
                \"KeySchema\": [{\"AttributeName\":\"GSI1\",\"KeyType\":\"HASH\"},
                                {\"AttributeName\":\"SK\",\"KeyType\":\"RANGE\"}],
                \"Projection\":{
                    \"ProjectionType\":\"ALL\"
                },
                \"ProvisionedThroughput\": {
                    \"ReadCapacityUnits\": 10,
                    \"WriteCapacityUnits\": 5
                }
            }
        ]" \
  --endpoint-url http://localhost:8000
```
