# Changelog

All notable changes to OnThisDay.js will be documented in this file.

## [3.0.1] - (July 5, 2026)

### Fixed
- Removed `User-Agent` header from `fetch()` request that caused iOS Safari and WKWebView to fail.

## [3.0.0] - (July, 5, 2026)

### Added
- Zero-dependency rewrite using native `fetch`.
- Multi-language support with 12 verified Wikipedia language codes.
- More methods

### Changed
- Date input changed from strings (`"July 4"`) to positional numbers (`7, 4`).
- Removed `wtf_wikipedia` dependency entirely.
- Minimum Node.js version is 18+.
- Objects are not freezed anymore.

## [2.0.0] - (July, 30, 2024)

### Added
- Webpack Config Build.

### Changed
- Remove usage of ```wtf_wikipedia``` via CDN.
- Usage of ```wtf_wikipedia``` via NPM install.


## [1.0.1] - (July, 24, 2023)
Fixed a small (and embarrassing) issue. Forced to bump version due to CDN caching. 

## [1.0.0] - (July, 24, 2023)

Initial release of OnThisDay.js library. 


<!--
These Markdown anchors provide a link to the diff for each release. They should be
updated any time a new release is cut.
-->
[3.0.0]: https://github.com/MarketingPipeline/OnThisDay.js/releases/v3.0.0
[2.0.0]: https://github.com/MarketingPipeline/OnThisDay.js/releases/v2.0.0
[1.0.1]: https://github.com/MarketingPipeline/OnThisDay.js/releases/v1.0.1
[1.0.0]: https://github.com/MarketingPipeline/OnThisDay.js/releases/v1.0.0
