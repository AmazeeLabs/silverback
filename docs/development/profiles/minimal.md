# Minimal Installation Profile

Run following commands to install minimal profile.

```
<Composer command="create-project" params="drupal/recommended-project silverback-minimal"/>
<Dir cd="silverback-minimal"/>
<Composer command="require" params="amazeelabs/silverback:dev-9.0-update" />
<Silverback command="init"/>
<Composer command="install" />
<Yarn />
<Silverback command="setup" profile="minimal"/>
```
