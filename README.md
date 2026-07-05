## OnThisDay.js

<a href="https://github.com/MarketingPipeline/OnThisDay.js/">
<img height=350 alt="Repo Banner for OnThisDay.js - JavaScript Library" src="https://capsule-render.vercel.app/api?type=waving&color=c4a2bd&height=300&section=header&text=OnThisDay.js&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Find%20things%20that%20happened%20in%20history!&descAlignY=60&descAlign=50"></img></a>

<p align="center">
  <small> <b><i>Show your support!</i> </b></small>
  <br>
   <a href="https://github.com/MarketingPipeline/OnThisDay.js">
    <img title="Star on GitHub" src="https://img.shields.io/github/stars/MarketingPipeline/OnThisDay.js.svg?style=social&label=Star">
  </a>
  <a href="https://github.com/MarketingPipeline/OnThisDay.js/fork">
    <img title="Fork on GitHub" src="https://img.shields.io/github/forks/MarketingPipeline/OnThisDay.js.svg?style=social&label=Fork">
  </a>
   </p>  


OnThisDay.js is a zero-dependency JavaScript library for fetching historical events, births, deaths, and holidays from the [Wikimedia REST API](https://api.wikimedia.org/wiki/Feed_API/On_this_day). It works in Node.js 18+ and modern browsers.


## Example and usage

<b>How to use OnThisDay.js:</b>

```js
import { OnThisDay } from 'https://esm.sh/gh/MarketingPipeline/OnThisDay.js';

// Fetch events, births, and deaths for a specific date
try {
    const result = await OnThisDay(7, 4);
    
    console.log(result.getEvents());   // historical events
    console.log(result.getBirths());   // famous births
    console.log(result.getDeaths());   // notable deaths
    console.log(result.getHolidays()); // holidays & observances
    console.log(result.getSelected()); // editor's picks
    console.log(result.getAll());      // everything at once
    console.log(result.getRaw());      // full Wikimedia response
} catch (error) {
    console.log(error.message)
}

// Fetch events, births, and deaths that happened on the current date.
try {
    const onToday = await OnThisDay()
    console.log('All Data:', onToday.getAll());
    console.log('Births:', onToday.getBirths());
    console.log('Deaths:', onToday.getDeaths());
    console.log('Events:', onToday.getEvents());
    console.log('Holidays:', onToday.getHolidays());
    console.log('Editor Picks:', onToday.getSelected());
    console.log('Wikimedia:', onToday.getRaw());
} catch (error) {
    console.log(error.message)
}

// With options
try {
    const withOptions = await OnThisDay(7, 4, {
      lang: 'de',       // see supported languages below
      timeout: 5000     // milliseconds
    });
} catch (error) {
    console.log(error.message)
}

// Invalid date
try {
    await OnThisDay(2, 30);
} catch (error) {
    console.log(error.message)
}

// Unsupported language
try {
    await OnThisDay(7, 4, { lang: 'ja' });
} catch (error) {
    console.log(error.message)
}
```

## Options

| Option    | Default | Description                                                            |
| --------- | ------- | ---------------------------------------------------------------------- |
| `lang`    | `'en'`  | `en`, `es`, `de`, `fr`, `zh`, `ru`, `ar`, `pt`, `sv`, `tr`, `cs`, `uk` |
| `timeout` | `10000` | Request timeout in milliseconds                                        |


## Contributing ![GitHub](https://img.shields.io/github/contributors/MarketingPipeline/OnThisDay.js)

Want to improve this? Create a pull request with detailed changes.

See the list of [contributors](https://github.com/MarketingPipeline/OnThisDay.js/graphs/contributors) who participate in this project.

## License ![GitHub](https://img.shields.io/github/license/MarketingPipeline/OnThisDay.js)
This library is open-source and available under the MIT License. See the [LICENSE](https://github.com/MarketingPipeline/OnThisDay.js/blob/main/LICENSE) file for more details.
