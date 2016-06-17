# APIs

### Add application

```
POST /applications 
{
  "name": "ReleaseMaster",
  "description": "This is a description"
}
```


### List all applications

```
GET /applications
```

### Get all builds for application

```
GET /applications/{applicationName}
```

### Add build

```
POST /builds
{
  "application": "0",
  "gitRepo": "git@github.com/test",
  "gitSHA": "1111abcd1234",
  "gitBranch": "master",
  "dockerDigest": "sha256:12345678"
}
```


### Query latest build for application

```
GET /api/{applicationName}/latest?q=docker&branch={branch}

```

### Query all buildz for application

```
GET /api/{applicationName}/all?q=docker&branch={branch}

```


