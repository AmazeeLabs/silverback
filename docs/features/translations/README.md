---
menu: Features
name: Translations
route: translations
---

# Language Management

## Add language

To add a language to your site, go to the [languages config page](http://127.0.0.1:8888/admin/config/regional/language)
at `Configuration -> Regional and Language -> Language` and click `Add language`.

![Languages config page image](./assets/languages_config.png "Languages config page")

## Enable node content translation

Drupal requires content to be translated per content type. Since Silverback doesn't come with any content types out the
box, the first step is to [add your required content types](http://127.0.0.1:8888/admin/structure/types) at `Structure
-> Content Types`.

![Content type management page image](./assets/add_content_type.png "Content type management page")

Once you have content types to translate, you can configure their translation settings on the
[content language page](http://127.0.0.1:8888/admin/config/regional/content-language) at `Configuration -> Regional and
Language -> Content language and translation`.

![Content language page image](./assets/content_language.png "Content language page")

## Manually translate content

After these settings have been configured to your needs, you will be able to manually add translations of the
configured nodes.

![Translate node link image](./assets/translate_node.png "Translate node link")

![Translate node page image](./assets/translate_node_page.png "Translate node page")

![Create node translation image](./assets/create_translated_node.png "Create node translation")

## Request content translations

Drupal supports translation requests using XLIFF files that can be imported and exported via the UI. This can be done
for a single piece of content using the above described method. However, the most sensible approach with multiple pieces
of content is to use the [content sources](http://127.0.0.1:8888/admin/tmgmt/sources) page at `Translation -> Sources`
and request a translation.

![Content sources page image](./assets/content_sources.png "Content sources page")

Ensure you choose `File exchange` as the provider and export the file to XLIFF.

![Translation job page image](./assets/translation_job.png "Translation job page")

You can then export the file which can be used to translate the content as necessary.

![Export translation file image](./assets/export_file.png "Export translation file page")

Once the file has been updated with the necessary translations, the file can be re-uploaded to the translation job.

![Import translation file image](./assets/import_file.png "Import translation file page")
