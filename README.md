# Deployment overview

```mermaid
flowchart
    browser[Browser] --> cloudfront
    subgraph AWS
        cloudfront[Cloudfront]
        cloudfront --> test_mac[S3 Bucket]
        cloudfront --> test_win[Lambda]
    end
```

# API endpoints

```
localhost:4000/local/artists?query=stoned
localhost:4000/local/artists/7105/modules
localhost:4000/local/modules/146940
```

