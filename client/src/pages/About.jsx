// @ts-check
import React, { useContext } from "react";
import logoImg from "img/logo.png";
import { apiLocation } from "App";
import useFetch from "hooks/useFetch";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Paragraph from "components/Dashboard/common/Paragraph";

const attrib = `
# Attributions and copyright

## Fonts

SIL Open Font License 1.1
The website uses Montserrat font by the Montserrat Font Project.
https://github.com/JulietaUla/Montserrat

The TIFF files downloaded while visiting the website are subject to
the above license. A copy of the license is included at the end of
this document.

## Icons

All icons from SVGRepo and Flaticon are credited below and used
within the bounds of their respective licenses. Icons with
licenses requiring a copy of the license to be included (e.g. MIT)
will have a copy included at the end of this document.

Calendar icon
* MIT license
* https://www.svgrepo.com/svg/500483/calendar
* element-plus at svgrepo.com. Used with attribution.

Book & apple icon:
* Attribution CC BY license
* https://www.svgrepo.com/svg/385297/education-books-apple
* wishforge.games at svgrepo.com. Used with attribution.

Plus icon:
* MIT license
* https://www.svgrepo.com/svg/510136/plus
* zest at svgrepo.com
* Modifications: Colour modified to grey.

Gravatar:
*  Generated at http://identicon.net/ using some random string (we forgot).

Logout icon:
* Public domain
* https://www.svgrepo.com/svg/469799/sign-out-2
* Mary Akveo at svgrepo.com

Contract icon:
* Public domain
* https://www.svgrepo.com/svg/486130/contract-line
* SVG Repo at svgrepo.com
* Modifications: Colour modified to black.

Upload icon:
* Attribution CC BY license
* https://www.svgrepo.com/svg/506351/upload
* Software Mansion at svgrepo.com

Abacus icon:
* Public domain
* https://www.svgrepo.com/svg/485953/abacus
* brankic1979 at svgrepo.com

Weight icon:
* Attribution CC BY license
* https://www.svgrepo.com/svg/331983/weight
* Amit Jakhu at svgrepo.com
  
Clock icon:
* Public domain
* https://www.svgrepo.com/svg/506771/time
* Salah Elimam at svgrepo.com

Bookshelf icon:
* MIT license
* https://www.svgrepo.com/svg/455392/bookshelf-library
* Vectopus at svgrepo.com

Filter (funnel) icon:
* https://www.svgrepo.com/svg/509927/filter
* zest at svgrepo.com

Open book icon:
* Public domain
* https://www.svgrepo.com/svg/293919/open-book
* SVG Repo at svgrepo.com

Sun icon:
* MIT license
* https://www.svgrepo.com/svg/507434/sun
* scarlab at svgrepo.com
* Modifications: background removed, retextured to orange

Moon icon:
* MIT license
* https://www.svgrepo.com/svg/507373/moon
* scarlab at svgrepo.com
* Modifications: background removed, retextured to blue

Book emoji icons (favicon-xx, android-chrome-xx, apple-touch-icon):
* Attribution CC BY license
* https://twemoji.twitter.com/ and https://github.com/twitter/twemoji
* Twitter, Inc and other contributors
* Generated into icons at https://favicon.io/emoji-favicons/books

Loading spinner:
* Public domain
* https://loading.io/
* Modifications: removed background, retextured to black

Error icon:
* Public domain
* https://www.svgrepo.com/svg/488925/error
* Gabriele Malaspina at svgrepo.com

Checkmark icon:
* Attribution CC BY license
* https://www.svgrepo.com/svg/491588/checkmark-circle
* thewolfkit at svgrepo.com

Delete icon:
* Public domain
* https://www.svgrepo.com/svg/493964/delete-1
* Dan Dan at svgrepo.com

## Licenses

Some licenses require a copy of the license to be included with the resource. They are included below.

### Icons under the MIT License

Replace copyright holder with author. Years are not specified and could not be found.

\`\`\`txt
MIT License

Copyright (c) [year] [author]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

### License for the Montserrat font

\`\`\`txt
Copyright 2011 The Montserrat Project Authors (https://github.com/JulietaUla/Montserrat)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded, 
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

1) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

1) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

1) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

1) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
\`\`\`

`

function About() {

  const apiURL = useContext(apiLocation);

  const { loading: loadingPrivacy, error: errorPrivacy, data: dataPrivacy } = useFetch(`${apiURL}/docs/privacy`);
  const { loading: loadingTerms, error: errorTerms, data: dataTerms } = useFetch(`${apiURL}/docs/terms`);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <img src={logoImg} className="not-icon" style={{ height: "6rem" }} alt="Logo" />
      </div>

      {/* About */}
      <Paragraph name="About">
        <p>
          GradeTrackLite is a simple privacy-conscious grade tracking webapp.
        </p>
        <p>
          GradeTrackLite authors: COMP555 Project Group 7
        </p>
        <p>
          Your host is your data processor and you are subject to their terms of use and privacy notice, which are attached below. Read them carefully and contact them if you have any questions. 
        </p>
      </Paragraph>

      <Paragraph name="Cookie Usage">
        <p>
          This website uses two cookies: "theme" and "token"
        </p>
        <ul>
          <li>token: stores your authentication token. The site cannot function without it. Removed on logout.</li>
          <li>theme: either "dark" or "light". <b>Only set if you change the theme from the default</b> (click the sun/moon).</li>
        </ul>
      </Paragraph>

      {/* Privacy Policy */}
      <Paragraph name="Your Host's Privacy Notice">
        {loadingPrivacy && <div>loading privacy policy...</div>}
        {errorPrivacy && <div style={{color: "red"}}>Error loading privacy policy!</div>}
        {
          dataPrivacy && <ReactMarkdown>{dataPrivacy.content}</ReactMarkdown>
        }
      </Paragraph>
      
      {/* Terms of Use */}
      <Paragraph name="Your Host's Terms of Use">
        {loadingTerms && <div>loading privacy policy...</div>}
        {errorTerms && <div style={{color: "red"}}>Error loading privacy policy!</div>}
        {
          dataTerms && <ReactMarkdown>{dataTerms.content}</ReactMarkdown>
        }
      </Paragraph>

      {/* Attributions */}
      <Paragraph name="Attributions and Licenses">
        <p>
          This webapp uses open-licensed resources. Their authors and copies of their respective licenses (if required) are listed below.
        </p>
        <ReactMarkdown>{attrib}</ReactMarkdown>
      </Paragraph>


    </div>
  );
}

export default About;
