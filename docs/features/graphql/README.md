---
menu: Features
name: GraphQL
route: graphql
---

# GraphQL 4.0-alpha2 changes

* Per schema permissions -> new permissions have to be set
* No more direct injection of closures. Use `$builder->callback()` instead
* `ResolvedContext` api changes
	* `setContext($key, $value, $info)` -> `setContextValue($info, $key, $value)`
	* `getContext($key, $value, $info, $default)` -> `getContextValue($info, $key, $value) ?? $default`
* Central language handling: `ResolveContext::setContextLanguage()` will set system language for whole language operation. No more `executeInLanguageContext`
	* we will add the same for workspaces
* `$builder->fromPath()` is broken. `property_path` producer does the same. Unsure if we will fix or remove `fromPath`
* `$builder->produce()` api change: mapping and config have been separated.
  Before:
  ```
  $builder->produce(‘foo’, [‘mapping’ => [
    ‘Bar’ => $builder->fromParent(),
  ]]);
  ```
  After:
  ```
  $builder->produce(‘foo’, [
    ‘Bar’ => $builder->fromParent(),
  ]);
  ```
