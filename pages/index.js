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
                  id: 'VISITOR-UNIQUE-ID',
                  transLang: 'en-us', // Required if user is logged in
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
                events: {
                  ready: function () {
                    pendo.addBodyMutationListener()
                  },
                  guidesLoaded: function () {},
                },
              })

              pendo.addBodyMutationListener = function () {
                var rcWrapper = document.createElement('div')
                rcWrapper.innerHTML = rcHtml

                var target = document.querySelector('body')
                target.appendChild(rcWrapper.firstElementChild)

                // create an observer instance
                var observer = new MutationObserver(function (mutations) {
                  mutations.forEach(function (mutation) {
                    if (mutation.addedNodes.length) {
                      if (
                        mutation.addedNodes[0].className.includes(
                          '_pendo-resource-center-global-container'
                        )
                      ) {
                        document
                          .getElementById('_adobe-rc_resource-center-container')
                          .classList.remove('_adobe-rc_pendo-invisible')
                        pendo
                          .dom('#_adobe-rc_resource-center-container')[0]
                          .classList.remove('_adobe-rc_slide-right')

                        if (!pendo.adobeRcTabListeners) {
                          // Adds active class to clicked tabs.  Flushes other active tabs.
                          Array.from(
                            document.getElementsByClassName('_adobe-rc_rc-nav-item')
                          ).forEach((item) => {
                            item.addEventListener('click', function () {
                              if (!item.classList.contains('_adobe-rc_active-nav-item')) {
                                Array.from(
                                  document.getElementsByClassName('_adobe-rc_rc-nav-item')
                                ).forEach((tab) => {
                                  tab.classList.remove('_adobe-rc_active-nav-item')
                                })
                                item.classList.add('_adobe-rc_active-nav-item')
                                setNewContent(item)
                              }
                            })
                          })

                          // Quick function to show tab functionality
                          function setNewContent(item) {
                            // Clean up and potentially check if section is already shown
                            pendo.BuildingBlocks.BuildingBlockResourceCenter.dismissResourceCenter()
                            if (item.title == 'Guides') {
                              pendo.showGuideById(
                                '-HkbchdtpyVLjDapPPl_o-Rh6cE@pQqHDQbxwFzIXVZrd4J5sQrpfno'
                              )
                            }
                            if (item.title == 'Docs') {
                              pendo.showGuideById(
                                'BXJQy11PX00OEIVWyOuBLMNs5ZE@pQqHDQbxwFzIXVZrd4J5sQrpfno'
                              )
                            }
                            if (item.title == "What's New") {
                              pendo.showGuideById(
                                'ZtnRUQ36CyBVVxrbifBN-gMnLWI@pQqHDQbxwFzIXVZrd4J5sQrpfno'
                              )
                            }
                            if (item.title == 'Resources') {
                              pendo.showGuideById(
                                '7ZJ7TiwAyEb-b4kVijCTE3t3bYk@pQqHDQbxwFzIXVZrd4J5sQrpfno'
                              )
                            }
                            cleanUpSectionContent(item)
                            setUpRcModule()
                          }

                          pendo.adobeRcTabListeners = true
                        }

                        var rcContainer = mutation.addedNodes[0]
                        var _adobePane = pendo.dom('#_adobe-rc_rc-content-pane')[0]
                        _adobePane.appendChild(rcContainer)

                        if (
                          !pendo.BuildingBlocks.BuildingBlockResourceCenter.findShownResourceCenterModule()
                        ) {
                          Array.from(
                            document.getElementsByClassName('_adobe-rc_rc-nav-item')
                          ).forEach((tab) => {
                            tab.classList.remove('_adobe-rc_active-nav-item')
                          })
                          pendo.showGuideById(
                            '-HkbchdtpyVLjDapPPl_o-Rh6cE@pQqHDQbxwFzIXVZrd4J5sQrpfno'
                          )
                          cleanUpSectionContent(document.querySelector('[data-id="guides"]'))
                          pendo
                            .dom('._adobe-rc_rc-nav-item[title="Guides"]')[0]
                            .classList.add('_adobe-rc_active-nav-item')
                        }
                        addTriggerEvent()
                        // setUpRcModule();
                      }
                    }
                  })
                })

                var config = {
                  attributeFilter: ['data-layout'],
                  attributes: true,
                  childList: true,
                  characterData: true,
                  subtree: false,
                }

                observer.observe(target, config)
              }
              var rcHtml = `
                        <div id="_adobe-rc_resource-center-container" class="rc-container _adobe-rc_slide-right _adobe-rc_pendo-invisible">
                        <!-- RC HEADER -->
                        <div class="rc-header-section">
                            <div class="rc-main-nav _adobe-rc_rc-nav">
                                <div class="_adobe-rc_rc-nav-item" data-id="guides" title="Guides">
                                Guides
                                </div>
                                <div class="_adobe-rc_rc-nav-item" data-id="docs" title="Docs">
                                Docs & Community
                                </div>
                                <div class="_adobe-rc_rc-nav-item" data-id="whatsnew" title="What's New">
                                What's New
                                </div>
                                <div class="_adobe-rc_rc-nav-item" data-id="resources" title="Resources">
                                Resources
                                </div>
                            </div>
                            </div>
                        <!-- RC HOME VIEW / Get Started -->
                        <div class="_adobe-rc_rc-home-view _adobe-rc_pendo-visible">
                            <div id="_adobe-rc_rc-content-pane"></div>
                        </div>
                            <!-- Whats New Divider -->
                            <div class="_adobe-rc_rc-whats-new-divider _adobe-rc_pendo-invisible"></div>
                            </div>
                            `

              function addGuideCategoryElements() {
                var categoryNodes = `<div class="guideCategory beginner">
                                                    <h3 class="categoryHeader">Beginner</h3>
                                                    </div>
                                                    <div class="guideCategory intermediate">
                                                    <h3 class="categoryHeader">Intermediate</h3>
                                                    </div>
                                                    <div class="guideCategory advanced">
                                                    <h3 class="categoryHeader">Advanced</h3>
                                                    </div>
                                                    <div class="guideCategory admin">
                                                    <h3 class="categoryHeader">Admin</h3>
                                                    </div>
                                                    <div class="guideCategory unknown">
                                                    <h3 class="categoryHeader">Misc.</h3>
                                                    </div>`
                console.log('adding guide categories')
                var guideListContainer = pendo.dom(
                  '._pendo-resource-center-guidelist-module-list'
                )[0]
                if (guideListContainer) {
                  pendo.dom('._pendo-resource-center-guidelist-module-list').append(categoryNodes)
                }
              }

              function addGuideShowEvent() {
                pendo.dom('._pendo-resource-center-guidelist-module-list').on(
                  'click',
                  pendo._.throttle((e) => {
                    var target = pendo
                      .dom(eventTarget(e))
                      .closest('._pendo-resource-center-guidelist-module-listed-guide')
                    if (target) {
                      pendo.dom('#_adobe-rc_resource-center-container').toggleClass('hiddenRC')
                    }
                  }),
                  100
                )
              }

              function addTriggerEvent() {
                pendo.dom('._pendo-resource-center-badge-image').on(
                  'click',
                  pendo._.throttle(() => {
                    if (
                      !pendo
                        .dom('._pendo-resource-center-badge-container')[0]
                        .classList.contains('triggered')
                    ) {
                      pendo.dom('#_adobe-rc_resource-center-container').addClass('hiddenRC')
                    } else {
                      pendo.dom('#_adobe-rc_resource-center-container').removeClass('hiddenRC')
                    }
                  }),
                  100
                )
              }

              function adjustSearch() {
                var searchBar = document.getElementsByClassName(
                  '_pendo-resource-center-guidelist-module-search-bar'
                )[0]
                if (searchBar) {
                  pendo.dom(searchBar).appendTo('#pendo-resource-center-container')
                }
                pendo.dom(searchBar).on('input', (e) => {
                  if (e.inputType === 'insertText') {
                    pendo._.each(pendo.dom('.categoryHeader'), (header) =>
                      pendo.dom(header).addClass('hiddenCategory')
                    )
                  }
                  if (
                    e.inputType === 'deleteContentBackward' &&
                    pendo.dom(searchBar)[0].value.length === 0
                  ) {
                    pendo._.each(pendo.dom('.categoryHeader'), (header) =>
                      pendo.dom(header).removeClass('hiddenCategory')
                    )
                  }
                })
              }

              function eventTarget(e) {
                return (e && e.target) || e.srcElement
              }

              function moveGuides() {
                var eligibleGuides = pendo.BuildingBlocks.BuildingBlockResourceCenter.getResourceCenter()
                  .activeModule.guidesInModule

                function checkGuideNameForSection(guide) {
                  if (guide.name.includes('[ADMIN]')) {
                    guide.category = 'admin'
                    return 'admin'
                  } else if (guide.name.includes('[BEGINNER]')) {
                    guide.category = 'beginner'
                    return 'beginner'
                  } else if (guide.name.includes('[INTERMEDIATE]')) {
                    guide.category = 'intermediate'
                    return 'intermediate'
                  } else if (guide.name.includes('[ADVANCED]')) {
                    guide.category = 'advanced'
                    return 'advanced'
                  } else {
                    guide.category = 'unknown'
                    return 'unknown'
                  }
                }

                if (eligibleGuides) {
                  pendo._.each(eligibleGuides, function (guide) {
                    var guideSection = checkGuideNameForSection(guide)
                    pendo
                      .dom(`li:contains("${guide.name.slice(guide.name.indexOf('] ') + 2)}")`)
                      .appendTo(pendo.dom(`.${guideSection}`))
                  })
                  pendo._.each(pendo.dom('.guideCategory'), (category) => {
                    if (category.getElementsByTagName('LI').length < 1) {
                      category.classList.add('hiddenCategory')
                    }
                  })
                }
              }

              function setAnnouncementLinkIcon(item) {
                var announcementLinkNode =
                  '<a id="announcement-link-icon" class="icon-fontello-37" href="https://pendo.io" target="_blank"></a>'
                if (item.dataset.id !== 'whatsnew' && pendo.dom('#announcement-link-icon').length) {
                  pendo
                    .dom('._adobe-rc_rc-home-view')[0]
                    .removeChild(pendo.dom('#announcement-link-icon')[0])
                } else {
                  if (
                    item.dataset.id === 'whatsnew' &&
                    !pendo.dom('#announcement-link-icon').length
                  ) {
                    pendo.dom('._adobe-rc_rc-home-view').append(announcementLinkNode)
                  }
                }
              }

              function cleanUpSectionContent(item) {
                var cleanUpGuides = function () {
                  addGuideCategoryElements()
                  adjustSearch()
                  if (!pendo.designer) {
                    moveGuides()
                  }
                }

                var cleanUpDocs = function () {}

                var cleanUpWhatsNew = function () {}

                var cleanUpResources = function () {}

                var sections = {
                  guides: cleanUpGuides,
                  whatsnew: cleanUpWhatsNew,
                  docs: cleanUpDocs,
                  resources: cleanUpResources,
                }

                if (!pendo._.isUndefined(item.dataset)) {
                  sections[item.dataset.id]()
                  setAnnouncementLinkIcon(item)
                }
              }

              function setUpRcModule() {}
            })('a2d9f4cd-4232-4b44-510a-9a8837a517f9')
          }
        })()}
      />
      {/* <Script
                src="https://static.zdassets.com/ekr/snippet.js?key=70be359a-9c3d-41ee-9923-3011e9451a80"
                id="zendesk"
                onLoad={(function () {
                    if (process.browser) {
                        return;
                    }
                })()}
            /> */}
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
