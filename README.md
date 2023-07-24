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


OnThisDay.js is a JavaScript library for fetching events on specific dates from Wikipedia. It allows you to retrieve historical events, births, and deaths that occurred on the current or a particular date.

## Example and usage

<b>How to use OnThisDay.js:</b>

```js
import { OnThisDay } from 'https://cdn.jsdelivr.net/gh/MarketingPipeline/OnThisDay.js@latest/dist/onthisday.min.js';

// Fetch events, births, and deaths for a specific date
try {
    let onDate = await OnThisDay('July 4')
    console.log('All Data:', onDate.getAll());
    console.log('Births:', onDate.getBirths());
    console.log('Deaths:', onDate.getDeaths());
    console.log('Events:', onDate.getEvents());
} catch (error) {
    console.log(error.message)
}

// Fetch events, births, and deaths that happened on the current date.
try {
    let onToday = await OnThisDay()
    console.log('All Data:', onToday.getAll());
    console.log('Births:', onToday.getBirths());
    console.log('Deaths:', onToday.getDeaths());
    console.log('Events:', onToday.getEvents());
} catch (error) {
    console.log(error.message)
}
```


## Contributing ![GitHub](https://img.shields.io/github/contributors/MarketingPipeline/OnThisDay.js)

Want to improve this? Create a pull request with detailed changes / improvements! If approved you will be added to the list of contributors of this awesome project!

See also the list of
[contributors](https://github.com/MarketingPipeline/OnThisDay.js/graphs/contributors) who
participate in this project.

## License ![GitHub](https://img.shields.io/github/license/MarketingPipeline/OnThisDay.js)
This library is open-source and available under the MIT License. See the [LICENSE](https://github.com/MarketingPipeline/OnThisDay.js/blob/main/LICENSE) file for more details.
