import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>HarrisTime</title>
        {/* Favicon icon */}
        <link rel="icon" href="/img/favicon.png" type="image/x-icon" />
        {/* Google Fonts Roboto */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"
        />
        <link rel="stylesheet" href="/css/mdb.min.css" />
      </head>
      <body>
        {children}
        <ToastContainer
position="top-center"
autoClose={800}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
        <script type="text/javascript" src="/js/mdb.umd.min.js"></script>
      </body>
    </html>
  );
}
