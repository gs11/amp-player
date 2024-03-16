```
localhost:8888/artists?query=stoned
localhost:8888/artists/7105/modules
localhost:8888/modules/146940
```


```mermaid
flowchart
    browser[Browser] --> cloudfront
    subgraph AWS    
        cloudfront[Cloudfront]
        cloudfront --> test_mac[S3 Bucket]
        cloudfront --> test_win[Lambda]
    end
```
