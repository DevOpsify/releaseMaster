# EndPoints

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

### Add build info

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
GET /api/{applicationName}/latest
GET /api/{applicationName}/latest?q=[docker|git|branch]
GET /api/{applicationName}/latest?branch={branch}
GET /api/{applicationName}/latest?q=[docker|git|branch]&branch={branch}
```


### Query all builds for application (not implemted yet)

```
GET /api/{applicationName}/all?q=docker&branch={branch}
```


### Add environment

```
POST /environments 
{
  "name": "DEV",
  "description": "This is a description"
}
```


### List all environments

```
GET /environments
```


### List all deployments

```
GET /deployments
```

### List a deployments by its id

```
GET /deployments/id/<id>
```

### Create a deployment

```
POST /deployments

{
  "build": "1",
  "environment": "0"
}
```

### Update a deployment

```
PUT /deployments/id/<id>

{
  "status": "pass regression test"
}
```

###  Delete a deployment by its id

``` 
DELETE /deployments/id/<id>
```
