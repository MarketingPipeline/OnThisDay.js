// test/fixtures
// Captured from: GET https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/07/04
// Schema: { events: [...], births: [...], deaths: [...], holidays: [...], selected: [...] }
// Each item: { text: string, year: number|null, pages: [...] }

export const july4All = {
  events: [
    {
      text: "The United States Declaration of Independence is adopted by the Second Continental Congress.",
      year: 1776,
      pages: [
        { titles: { normalized: "United States Declaration of Independence" }, extract: "..." }
      ]
    },
    {
      text: "NASA's Pathfinder space probe lands on Mars.",
      year: 1997,
      pages: []
    }
  ],
  births: [
    {
      text: "Calvin Coolidge, 30th President of the United States",
      year: 1872,
      pages: [{ titles: { normalized: "Calvin Coolidge" } }]
    }
  ],
  deaths: [
    {
      text: "Thomas Jefferson, 3rd President of the United States",
      year: 1826,
      pages: []
    },
    {
      text: "John Adams, 2nd President of the United States",
      year: 1826,
      pages: []
    }
  ],
  holidays: [
    {
      text: "Independence Day (United States)",
      year: null,
      pages: [{ titles: { normalized: "Independence Day (United States)" } }]
    }
  ],
  selected: [
    {
      text: "The United States Declaration of Independence is adopted.",
      year: 1776,
      pages: []
    }
  ]
};

// Single-type endpoint returns a plain array
export const july4Events = [
  {
    text: "The United States Declaration of Independence is adopted by the Second Continental Congress.",
    year: 1776,
    pages: [{ titles: { normalized: "United States Declaration of Independence" } }]
  }
];

// Malformed / edge-case fixtures
export const missingFields = {
  events: [
    { text: "Something happened" },           // missing year
    { year: 2000 },                          // missing text
    {},                                      // empty object
    null,                                    // null item
    "not an object",                         // string
    42                                       // number
  ],
  births: null,                              // null array
  deaths: undefined                          // undefined array
};

export const emptyResponse = {
  events: [],
  births: [],
  deaths: [],
  holidays: [],
  selected: []
};
