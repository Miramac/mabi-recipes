import './globals.css'
import { Providers } from './providers'
import Layout from '../components/Layout'

export const metadata = {
  title: 'Mabi Recipes',
  description: 'Your personal recipe collection',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  )
}
