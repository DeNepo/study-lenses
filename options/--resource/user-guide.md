## --resource

The `--resource` option allows you to assign arbitrary properties over the piped resource before it reaches the lense pipeline.

the query value should look like this. If merge is true, these values are merged over the requested resource. if merge is false, the resource will be used without reading a resource from the file system:

```json
{
  "resource": "a valid resource type",
  "merge": true
}
```
