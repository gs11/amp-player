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
localhost:4000/local/api/artists?query=stoned
localhost:4000/local/api/artists/7105/modules
localhost:4000/local/api/modules/146940
```

# TODO

- Switching songs sometimes yield console errors
- Switching songs fast yields multiple playing simultaneously
