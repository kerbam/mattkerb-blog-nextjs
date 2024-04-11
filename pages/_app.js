import '@/css/tailwind.css'

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'

import Analytics from '@/components/analytics'
import LayoutWrapper from '@/components/LayoutWrapper'

import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Script
          id="pendo"
          onLoad={(function () {
            if (process.browser) {
              ;(function (apiKey) {
                ;(function (p, e, n, d, o) {
                  var v, w, x, y, z
                  o = p[d] = p[d] || {}
                  o._q = o._q || []
                  v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track']
                  for (w = 0, x = v.length; w < x; ++w)
                    (function (m) {
                      o[m] =
                        o[m] ||
                        function () {
                          o._q[m === v[0] ? 'unshift' : 'push'](
                            [m].concat([].slice.call(arguments, 0))
                          )
                        }
                    })(v[w])
                  y = e.createElement(n)
                  y.async = !0
                  y.src = 'https://cdn.pendo.io/agent/static/' + apiKey + '/pendo.js'
                  z = e.getElementsByTagName(n)[0]
                  z.parentNode.insertBefore(y, z)
                })(window, document, 'script', 'pendo')

                // Call this whenever information about your visitors becomes available
                // Please use Strings, Numbers, or Bools for value types.
                pendo.initialize({
                  visitor: {
                    id: 'VISITOR-UNIQUE-ID', // Required if user is logged in
                    // email:        // Recommended if using Pendo Feedback, or NPS Email
                    // full_name:    // Recommended if using Pendo Feedback
                    // role:         // Optional

                    // You can add any additional visitor level key-values here,
                    // as long as it's not one of the above reserved names.
                  },

                  account: {
                    id: 'ACCOUNT-UNIQUE-ID', // Required if using Pendo Feedback
                    // name:         // Optional
                    // is_paying:    // Recommended if using Pendo Feedback
                    // monthly_value:// Recommended if using Pendo Feedback
                    // planLevel:    // Optional
                    // planPrice:    // Optional
                    // creationDate: // Optional

                    // You can add any additional account level key-values here,
                    // as long as it's not one of the above reserved names.
                  },
                })
              })('f72d5f01-b371-4cad-7f04-df672c356b81')
            }
          })()}
        />
        <Script
          id="drift"
          onLoad={(function () {
            if (process.browser) {
              !(function () {
                var t = (window.driftt = window.drift = window.driftt || [])
                if (!t.init) {
                  if (t.invoked)
                    return void (
                      window.console &&
                      console.error &&
                      console.error('Drift snippet included twice.')
                    )
                  ;(t.invoked = !0),
                    (t.methods = [
                      'identify',
                      'config',
                      'track',
                      'reset',
                      'debug',
                      'show',
                      'ping',
                      'page',
                      'hide',
                      'off',
                      'on',
                    ]),
                    (t.factory = function (e) {
                      return function () {
                        var n = Array.prototype.slice.call(arguments)
                        return n.unshift(e), t.push(n), t
                      }
                    }),
                    t.methods.forEach(function (e) {
                      t[e] = t.factory(e)
                    }),
                    (t.load = function (t) {
                      var e = 3e5,
                        n = Math.ceil(new Date() / e) * e,
                        o = document.createElement('script')
                      ;(o.type = 'text/javascript'),
                        (o.async = !0),
                        (o.crossorigin = 'anonymous'),
                        (o.src = 'https://js.driftt.com/include/' + n + '/' + t + '.js')
                      var i = document.getElementsByTagName('script')[0]
                      i.parentNode.insertBefore(o, i)
                    })
                }
              })()
              drift.SNIPPET_VERSION = '0.3.1'
              drift.load('vpar49barfcp')
            }
          })()}
        />
      </Head>
      <Analytics />
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </ThemeProvider>
  )
}
