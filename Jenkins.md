## How to integrate with Jenkins


### Jenkins Plugins

* install Active Choices Plugin https://wiki.jenkins-ci.org/display/JENKINS/Active+Choices+Plugin
* create a parameter
* sample groovy script

```
import groovy.json.JsonSlurper
def jsonSluper = new JsonSlurper()
def builds_json = 'https://www.buildmaster.com/builds?application=releaseMaster&format=jenkins'.toURL().text
def builds= jsonSluper.parseText(builds_json)

return builds
```
