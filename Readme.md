# CSS System Colors Demo

CSS System Colors are derived from the user's operating system's color scheme.
They are useful for creating a consistent look and feel that matches the user's
preferences.

This page is a nice visual reference to the system-colors - but **specific to
this browser/operating System**!

> Avoid specifying different colors for light or dark mode: let the browser & OS
> handle it for you!

This page demonstrates the CSS System Colors in action. You can view the colors
(and their change the light/dark mode and contrast settings to see how the
colors adapt to different environments. We uniquely display the actual color's
[RGBA](https://drafts.csswg.org/css-color/#rgb-functions) values for the current
environment.

## Introduction

[CSS System Colors](https://drafts.csswg.org/css-color/#css-system-colors) are a
set of 17 color keywords that are derived from the user's operating system's
color scheme. They are useful for creating a consistent look and feel that
matches the user's preferences.

CSS System Colors are a new ![W3C](W3C.png) standard (under development since
[2017](https://www.w3.org/standards/history/css-color-4/) as part of CSS Color
Module Level 4), but still in proposal status as of 2024) -- but well adopted by
modern browsers. The colors and descriptions are current as of November 2024.

The colors are defined in the CSS Color Module Level 4 specification and can be
used in any property that accepts a color value. They are prefixed with the
system- keyword, such as system-highlight or system-buttonface.

The colors are designed to adapt to different light/dark modes and contrast
settings, making them ideal for creating accessible and user-friendly
interfaces. They can be used in combination with other color values to create a
harmonious color palette.

> Note: System colors' actual RGBA values may vary depending on the user's
> operating system and browser settings!

A nice feature of CSS System Colors is that they can be used in combination with
other color values to create a harmonious color palette.

Some colors are
[deprecated](https://drafts.csswg.org/css-color/#typedef-deprecated-color) as
they enable mimicking system colors too well, and could be used for fake, evil
phishing sites. Don't go there!

For more information on CSS System Colors, check out:

- Jim Nielsen's blog post <https://blog.jim-nielsen.com/2021/css-system-colors/>
- MDN Web Docs <https://developer.mozilla.org/en-US/docs/Web/CSS/system-color>
- CSS Color Module Level 4 specification
  ([~2024](https://www.w3.org/standards/history/css-color-4/))
  <https://www.w3.org/TR/css-color-4/#css-system-colors>

 <summary>Tests</summary>
    <ul >
     <li ><a  href="https://wpt.fyi/results/css/css-color/system-color-consistency.html" title="css/css-color/system-color-consistency.html">system-color-consistency.html<small> (56 tests)</small></a><span ><span title="chrome 56/56" style="background: conic-gradient(forestgreen 360deg, darkred 0deg);"></span><span title="firefox 56/56" style="background: conic-gradient(forestgreen 360deg, darkred 0deg);"></span><span title="safari 26/56" style="background: conic-gradient(forestgreen 167.14285714285714deg, darkred 0deg);"></span><span title="edge 55/56" style="background: conic-gradient(forestgreen 353.57142857142856deg, darkred 0deg);"></span></span> <a class="wpt-live" href="http://wpt.live/css/css-color/system-color-consistency.html"><small>(live test)</small></a> <a  href="https://github.com/web-platform-tests/wpt/blob/master/css/css-color/system-color-consistency.html"><small>(source)</small></a>
     </li><li ><a  href="https://wpt.fyi/results/css/css-color/system-color-support.html" title="css/css-color/system-color-support.html">system-color-support.html<small> (21 tests)</small></a><span ><span title="chrome 18/21" style="background: conic-gradient(forestgreen 308.57142857142856deg, darkred 0deg);"></span><span title="firefox 20/21" style="background: conic-gradient(forestgreen 342.85714285714283deg, darkred 0deg);"></span><span title="safari 18/21" style="background: conic-gradient(forestgreen 308.57142857142856deg, darkred 0deg);"></span><span title="edge 19/21" style="background: conic-gradient(forestgreen 325.7142857142857deg, darkred 0deg);"></span></span> <a class="wpt-live" href="http://wpt.live/css/css-color/system-color-support.html"><small>(live test)</small></a> <a  href="https://github.com/web-platform-tests/wpt/blob/master/css/css-color/system-color-support.html"><small>(source)</small></a>
     </li><li ><a  href="https://wpt.fyi/results/css/css-color/parsing/color-valid-system-color.html" title="css/css-color/parsing/color-valid-system-color.html">color-valid-system-color.html<small> (19 tests)</small></a><span ><span title="chrome 17/19" style="background: conic-gradient(forestgreen 322.10526315789474deg, darkred 0deg);"></span><span title="firefox 19/19" style="background: conic-gradient(forestgreen 360deg, darkred 0deg);"></span><span title="safari 19/19" style="background: conic-gradient(forestgreen 360deg, darkred 0deg);"></span><span title="edge 17/19" style="background: conic-gradient(forestgreen 322.10526315789474deg, darkred 0deg);"></span></span> <a class="wpt-live" href="http://wpt.live/css/css-color/parsing/color-valid-system-color.html"><small>(live test)</small></a> <a  href="https://github.com/web-platform-tests/wpt/blob/master/css/css-color/parsing/color-valid-system-color.html"><small>(source)</small></a>
    </li></ul>
   </details>

## License

©2024 eoc.online under the permissive MIT License. Please note our contributions
though!

<https://eoc.online>: Open source tooling for Emergency Operation Centers

Source & details at <https://github.com/eoconline/css-system-colors>
