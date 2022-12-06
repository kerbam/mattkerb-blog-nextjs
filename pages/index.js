import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'
import Script from 'next/script'

const MAX_DISPLAY = 5

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')

  return { props: { posts } }
}

export default function Home({ posts }) {
  return (
    <>
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
            })('f72d5f01-b371-4cad-7f04-df672c356b81') // 7a22a7d9-70ec-4310-7291-42140a3c1c52
          }
        })()}
      />
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Latest
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug, date, title, summary, tags } = frontMatter
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose text-gray-500 max-w-none dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
    </>
  )
}
