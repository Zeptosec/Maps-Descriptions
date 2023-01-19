import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href='https://css.gg/pen.css' rel='stylesheet'></link>
        <link href='https://css.gg/remove.css' rel='stylesheet'></link>
        <link href='https://css.gg/check-o.css' rel='stylesheet'></link>
        <link href='https://css.gg/add.css' rel='stylesheet'></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
