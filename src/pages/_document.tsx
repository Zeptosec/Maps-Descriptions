import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href='https://unpkg.com/css.gg@2.0.0/icons/css/pen.css' rel='stylesheet'></link>
        <link href='https://unpkg.com/css.gg@2.0.0/icons/css/remove.css' rel='stylesheet'></link>
        <link href='https://unpkg.com/css.gg@2.0.0/icons/css/check-o.css' rel='stylesheet'></link>
        <link href='https://unpkg.com/css.gg@2.0.0/icons/css/add.css' rel='stylesheet'></link>
        <link href='https://unpkg.com/css.gg@2.0.0/icons/css/arrow-down.css' rel='stylesheet'></link>
        <link href='https://unpkg.com/css.gg@2.0.0/icons/css/arrow-up.css' rel='stylesheet'></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
