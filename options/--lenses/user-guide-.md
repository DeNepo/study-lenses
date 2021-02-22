> only supported as a local option

placing a `-lenses` field with a relative path value in your top-level study.json file will cause the server to load all valid lenses from that path at build time.

```json
{
  "-local-lenses": "./lenses"
}
```
