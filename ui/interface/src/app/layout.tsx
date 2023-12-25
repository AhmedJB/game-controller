





export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <title>HarrisTime</title>
      {/* MDB icon */}
      <link rel="icon" href="/img/favicon.png" type="image/x-icon" />
      {/* Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      {/* Google Fonts Roboto */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" />
      {/* MDB */}
      <link rel="stylesheet" href="/css/mdb.min.css" />
      <link rel="stylesheet" href="/css/style.css" />


      </head>
      <body>{children}
      <script type="text/javascript" src="/js/mdb.umd.min.js"></script>
      </body>
    </html>
  )
}
