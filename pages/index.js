import Link from '@/components/Link';
import { PageSEO } from '@/components/SEO';
import Tag from '@/components/Tag';
import siteMetadata from '@/data/siteMetadata';
import { getAllFilesFrontMatter } from '@/lib/mdx';
import formatDate from '@/lib/utils/formatDate';
import Script from 'next/script';
import { debounce, once } from 'lodash';

const MAX_DISPLAY = 5;

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog');

  return { props: { posts } };
}

export default function Home({ posts }) {
  return (
    <>
      <Script
        id="pendo"
        onLoad={(function () {
          if (process.browser) {
            (function (apiKey) {
              (function (p, e, n, d, o) {
                var v, w, x, y, z;
                o = p[d] = p[d] || {};
                o._q = o._q || [];
                v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track'];
                for (w = 0, x = v.length; w < x; ++w)
                  (function (m) {
                    o[m] =
                      o[m] ||
                      function () {
                        o._q[m === v[0] ? 'unshift' : 'push'](
                          [m].concat([].slice.call(arguments, 0))
                        );
                      };
                  })(v[w]);
                y = e.createElement(n);
                y.async = !0;
                y.src = 'https://cdn.pendo.io/agent/static/' + apiKey + '/pendo.js';
                z = e.getElementsByTagName(n)[0];
                z.parentNode.insertBefore(y, z);
              })(window, document, 'script', 'pendo');

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
                    pendo.addBodyMutationListener();
                  },
                  guidesLoaded: function () {
                    if (!pendo.dom('._adobe-rc_rc-nav-item').length) {
                      pendo.createNavItems();
                    }
                  },
                },
              });

              /**
               * Helps dynamically create the Navigation items
               * based on what Customers have access to in the guide payload
               */
              pendo.createNavItems = function () {
                var navItemsArray = [];
                pendo._.each(resourceCenterModuleLookup, function (module) {
                  if (pendo.findGuideById(module.id)) {
                    navItemsArray.push(module.html);
                  }
                });
                pendo.dom('.rc-main-nav').append(navItemsArray.join('\n'));
              };

              /**
               * Sets up the observer to create the new Resource Center container
               */
              pendo.addBodyMutationListener = function () {
                var rcWrapper = document.createElement('div');
                rcWrapper.innerHTML = rcHtml;

                var target = document.querySelector('body');
                target.appendChild(rcWrapper.firstElementChild);

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
                          .classList.remove('_adobe-rc_pendo-invisible');

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
                                  tab.classList.remove('_adobe-rc_active-nav-item');
                                });
                                item.classList.add('_adobe-rc_active-nav-item');
                                setNewContent(item);
                              }
                            });
                          });

                          // Quick function to show tab functionality
                          function setNewContent(item) {
                            // Clean up and potentially check if section is already shown
                            pendo.BuildingBlocks.BuildingBlockResourceCenter.dismissResourceCenter();
                            pendo.showGuideById(lookupModuleId(item));
                            cleanUpSectionContent(item);
                          }

                          pendo.adobeRcTabListeners = true;
                        }

                        var rcContainer = mutation.addedNodes[0];
                        var _adobePane = pendo.dom('#_adobe-rc_rc-content-pane')[0];
                        _adobePane.appendChild(rcContainer);

                        if (
                          !pendo.BuildingBlocks.BuildingBlockResourceCenter.findShownResourceCenterModule()
                        ) {
                          // Do a lookup of the default module
                          var defaultModule = pendo._.findWhere(resourceCenterModuleLookup, {
                            default: true,
                          });
                          // This might be simplified since we might infer that
                          // if we have the guide (through lookupModuleId) then we will have the nav item
                          if (
                            defaultModule &&
                            lookupModuleId(defaultModule) &&
                            document.querySelector(`[data-id="${defaultModule.title}"]`)
                          ) {
                            pendo.showGuideById(defaultModule.id);
                            cleanUpSectionContent(
                              document.querySelector(`[data-id="${defaultModule.title}"]`)
                            );
                            pendo
                              .dom(`[data-id="${defaultModule.title}"]`)
                              .addClass('_adobe-rc_active-nav-item');
                          } else {
                            // If the default module isn't available for the user, show the first item in the nav bar
                            var firstNavItemTitle = pendo.dom('._adobe-rc_rc-nav-item')[0]?.title;
                            var firstNavItemId = pendo._.findWhere(resourceCenterModuleLookup, {
                              title: firstNavItemTitle,
                            }).id;
                            pendo.showGuideById(firstNavItemId);
                            pendo
                              .dom(`[data-id="${firstNavItemTitle}"]`)
                              .addClass('_adobe-rc_active-nav-item');
                          }
                        }

                        // Close custom RC when Escape key is pressed
                        pendo.dom('body').on('keydown', function (e) {
                          if (e.which === 27) {
                            closeCustomResourceCenter();
                          }
                        });
                        addTriggerEvent();
                      }
                    }
                  });
                });

                var config = {
                  attributeFilter: ['data-layout'],
                  attributes: true,
                  childList: true,
                  characterData: true,
                  subtree: false,
                };

                observer.observe(target, config);
              };

              const delaySearch = debounce(createSearchResultsContainer, 650, false);
              const delayResetSearch = debounce(removeSearchContainer, 350, false);
              const openClass = 'guide-accordion-open';
              const rcHtml = [
                '<div id="_adobe-rc_resource-center-container" class="rc-container _adobe-rc_slide-right _adobe-rc_pendo-invisible">',
                '<!-- RC HEADER -->',
                '<div class="rc-header-section">',
                '<div class="rc-main-nav _adobe-rc_rc-nav">',
                '</div>',
                '</div>',
                '<!-- RC HOME VIEW / Get Started -->',
                '<div class="_adobe-rc_rc-home-view _adobe-rc_pendo-visible">',
                '<div id="_adobe-rc_rc-content-pane"></div>',
                '</div>',
              ].join('\n');

              /**
               * Object for all Resource Center menu items
               * Add all modules in the Resource Center
               */
              const resourceCenterModuleLookup = [
                {
                  displayName: 'Guides',
                  title: 'guides',
                  id: '-HkbchdtpyVLjDapPPl_o-Rh6cE@pQqHDQbxwFzIXVZrd4J5sQrpfno',
                  html:
                    '<div class="_adobe-rc_rc-nav-item" data-id="guides" title="guides">Guides</div>',
                  default: true,
                },
                {
                  displayName: 'Docs & Community',
                  title: 'docs',
                  id: 'BXJQy11PX00OEIVWyOuBLMNs5ZE@pQqHDQbxwFzIXVZrd4J5sQrpfno',
                  html:
                    '<div class="_adobe-rc_rc-nav-item" data-id="docs" title="docs">Docs & Community</div>',
                },
                {
                  displayName: "What's New",
                  title: 'whatsnew',
                  id: 'ZtnRUQ36CyBVVxrbifBN-gMnLWI@pQqHDQbxwFzIXVZrd4J5sQrpfno',
                  html:
                    '<div class="_adobe-rc_rc-nav-item" data-id="whatsnew" title="whatsnew">What\'s New</div>',
                },
                {
                  displayName: 'Resources',
                  title: 'resources',
                  id: '7ZJ7TiwAyEb-b4kVijCTE3t3bYk@pQqHDQbxwFzIXVZrd4J5sQrpfno',
                  html:
                    '<div class="_adobe-rc_rc-nav-item" data-id="resources" title="resources">Resources</div>',
                },
              ];

              /**
               * Creates the guide accordions based on the number of guides in a category
               * also adds the event listener to the accordions
               * @param {Array} category List of classes for the category
               * @param {HTMLELement} categoryGuidesElements HTMLCollection array of the guide list elements
               */
              function addGuideAccordions(category, categoryGuidesElements) {
                var accordionGuides = [...categoryGuidesElements].splice(0, 1).shift();
                pendo.dom(`.${category[1]} .guide-list`).append(accordionGuides);
                pendo.dom(`.${category[1]} .guide-list li`).addClass('hidden-element');
                pendo.dom(`.${category[1]} .guide-accordion-button`)[0].textContent = `+ ${
                  pendo.dom(`.${category[1]} .guide-list li`).length
                } more`;
                pendo.dom(`.${category[1]} .guide-accordion-button`).on('click', function (e) {
                  // Accordion toggle logic
                  var accordion = pendo.dom(eventTarget(e)).closest('.guide-accordion');
                  // Note: if you have nested accordions and resuse the '_pendo-module-accordion-open_'
                  // class it will close all open nested accordions as well
                  var openAccordion = pendo.dom(`.${openClass}`);

                  pendo.dom(`.${category[1]} .guide-list`).css({
                    height: 0,
                  });

                  if (openAccordion.length && openAccordion[0] !== accordion[0]) {
                    closeAccordion(category, openAccordion, 'openAccordion');
                  }

                  accordion.toggleClass(openClass);

                  if (accordion.hasClass(openClass)) {
                    pendo.dom(`.${category[1]} .guide-list li`).removeClass('hidden-element');
                    pendo.dom(`.${category[1]} .guide-accordion-button`)[0].textContent =
                      '- Collapse';

                    calculateCategoryContainerHeight(category);
                    pendo.dom(`.${category[1]}`).css({
                      height:
                        pendo.pro.guideCategoryHeights[`${category[1]}`].newGuideCategoryHeight,
                    });
                  } else {
                    closeAccordion(category, openAccordion, 'differentAccordion');
                  }
                });
              }

              /**
               * Creates the guide categories
               */
              function addGuideCategoryElements() {
                if (pendo.dom('._pendo-text-list-ordered .guideCategory').length) return;
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
                                                    </div>`;
                var guideListContainer = pendo.dom(
                  '._pendo-resource-center-guidelist-module-list'
                )[0];
                if (guideListContainer) {
                  pendo.dom('._pendo-resource-center-guidelist-module-list').append(categoryNodes);
                }
              }

              /**
               * Adds the event listener for the Resource Center badge
               * and the guide list items to close the custom container
               */
              function addTriggerEvent() {
                pendo.dom('._pendo-resource-center-badge-image').on(
                  'click',
                  pendo._.throttle(() => {
                    if (
                      !pendo
                        .dom('._pendo-resource-center-badge-container')[0]
                        .classList.contains('triggered')
                    ) {
                      closeCustomResourceCenter();
                    } else {
                      pendo
                        .dom('#_adobe-rc_resource-center-container')
                        .removeClass('hidden-element');
                    }
                  }),
                  100
                );
                pendo.dom('._pendo-text-list-item').on('click', function () {
                  pendo.BuildingBlocks.BuildingBlockResourceCenter.dismissResourceCenter();
                  closeCustomResourceCenter();
                });
              }

              /**
               * Moves the search bar to the outer container of the Guide Category section
               */
              function adjustSearch() {
                var searchBar = document.getElementsByClassName(
                  '_pendo-resource-center-guidelist-module-search-bar'
                )[0];
                if (searchBar) {
                  pendo.dom(searchBar).appendTo('#pendo-resource-center-container');
                  pendo.dom(searchBar).attr({ autocomplete: 'off' });
                }
                pendo.dom(searchBar).on('input', (e) => {
                  adjustSearchResultsContainer();
                  if (
                    e.inputType !== 'deleteContentBackward' &&
                    pendo.dom(searchBar)[0].value.length > 2
                  ) {
                    delaySearch(
                      pendo.dom('.guideCategory li:not([style*="display: none"])'),
                      searchBar
                    );
                  }
                  if (
                    e.inputType === 'deleteContentBackward' &&
                    pendo.dom(searchBar)[0].value.length === 0
                  ) {
                    delayResetSearch(searchBar, true);
                  }
                });
              }

              /**
               * Adds and removes the correct classes to the guide category elements
               * @param {Boolean} shouldTeardown determine if we should hide the category elements
               */
              function adjustSearchResultsContainer(shouldTeardown) {
                if (shouldTeardown) {
                  pendo.dom('.categoryHeader').removeClass('hidden-element');
                  pendo.dom('.guide-accordion-button').removeClass('hidden-element');
                  pendo.dom('.guideCategory').removeClass('hidden-element');
                  pendo.dom('.guide-list li').addClass('hidden-element');
                } else {
                  pendo.dom('.categoryHeader').addClass('hidden-element');
                  pendo.dom('.guide-accordion-button').addClass('hidden-element');
                  pendo.dom('.guideCategory').addClass('hidden-element');
                  pendo.dom('.guide-list li').removeClass('hidden-element');
                }
              }

              /**
               * Determines the heights of the Guide Category container for the clicked accordion
               * @param  {Array} category List of classes for the category
               * @return  {Object} lookup object for the heights of specific category sections
               */
              function calculateCategoryContainerHeight(category) {
                if (pendo._.isUndefined(pendo.pro)) {
                  pendo.pro = {};
                }
                if (pendo._.isUndefined(pendo.pro.guideCategoryHeights)) {
                  pendo.pro.guideCategoryHeights = {};
                  pendo.pro.guideCategoryHeights[`${category[1]}`] = {};
                }
                var categoryContainer = document.querySelector(`.${category[1]}`);
                var guideListHeight = 0;
                var originalGuideCategoryHeight = Number(
                  pendo.dom.getComputedStyle(categoryContainer).height.replace(/\D+/g, '')
                );
                pendo._.each(pendo.dom(`.${category[1]} .guide-accordion li`), function (item) {
                  guideListHeight = guideListHeight + pendo.dom(item).height();
                });
                var newGuideCategoryHeight = originalGuideCategoryHeight + guideListHeight;
                return (pendo.pro.guideCategoryHeights[`${category[1]}`] = {
                  guideListHeight: guideListHeight,
                  originalGuideCategoryHeight: originalGuideCategoryHeight,
                  newGuideCategoryHeight: newGuideCategoryHeight,
                });
              }

              /**
               * Finds the display value of the no results container
               * @return {string} css value of the display property
               */
              function checkForNoMatches() {
                var noResultsContainer = pendo.dom('#pendo-no-matches-container');
                return pendo.dom.getComputedStyle(noResultsContainer[0]).display;
              }

              /**
               * Object literal to handle various clean up tasks for the Resource Center menu items
               * Also hides or displays the announcement link icon
               * @param {HTMLElement} item html element for the Nav item
               */
              function cleanUpSectionContent(item) {
                var cleanUpGuides = function () {
                  addGuideCategoryElements();
                  adjustSearch();
                  if (!pendo.designer) {
                    moveGuides();
                  }
                  if (pendo.dom('#pendo-search-results-container').length) {
                    pendo.dom('#pendo-search-results-container').addClass('hidden-element');
                  }
                };

                var cleanUpDocs = function () {};

                var cleanUpWhatsNew = function () {};

                var cleanUpResources = function () {};

                var sections = {
                  guides: cleanUpGuides,
                  whatsnew: cleanUpWhatsNew,
                  docs: cleanUpDocs,
                  resources: cleanUpResources,
                };

                var id = item.dataset?.id || item.title;
                sections[id]();
                setAnnouncementLinkIcon(item);
              }

              /**
               * Sets accordions to a closed state
               * @param  {Array} category List of classes for the category
               * @param {HTMLElement} openAccordion the currenlty open accordion element
               * @param {string} type represents whether to work with the currently open accordion
               * or a different sections accordion.
               * This could be improved.
               */
              function closeAccordion(category, openAccordion, type) {
                if (type === 'openAccordion') {
                  pendo.dom(`.${openClass} .guide-list li`).addClass('hidden-element');
                  if (!pendo._.isUndefined(pendo.pro.guideCategoryHeights)) {
                    var openCategorySection = openAccordion[0]?.dataset.section;
                    var originalHeight =
                      pendo.pro.guideCategoryHeights[`${openCategorySection}`]
                        .originalGuideCategoryHeight;
                    pendo.dom(`.${openCategorySection}`).css({ height: originalHeight });
                  }
                  pendo.dom(`.${openClass} .guide-accordion-button`)[0].textContent = `+ ${
                    pendo.dom(`.${openClass} .guide-list li`).length
                  } more`;
                  openAccordion.toggleClass(openClass);
                }

                if (type === 'differentAccordion') {
                  pendo.dom(`.${category[1]}`).css({
                    height:
                      pendo.pro.guideCategoryHeights[`${category[1]}`].originalGuideCategoryHeight,
                  });
                  pendo.dom(`.${category[1]} .guide-list li`).addClass('hidden-element');
                  pendo.dom(`.${category[1]} .guide-accordion-button`)[0].textContent = `+ ${
                    pendo.dom(`.${category[1]} .guide-list li`).length
                  } more`;
                }
              }

              /**
               * Helper to close the custom Resource Center container
               */
              function closeCustomResourceCenter() {
                pendo
                  .dom('#_adobe-rc_resource-center-container')
                  .addClass('_adobe-rc_pendo-invisible');
                pendo.dom('#_adobe-rc_resource-center-container').addClass('hidden-element');
                pendo.dom('._adobe-rc_active-nav-item').removeClass('_adobe-rc_active-nav-item');
              }

              /**
               * Creates and adds the search results container to the DOM
               * @param {HTMLElement} results html elements of the matching search query
               * @param {HTMLElement} searchElement html search input element
               */
              function createSearchResultsContainer(results, searchElement) {
                var noMatchesDisplay = checkForNoMatches();
                if (noMatchesDisplay === 'block') {
                  removeSearchContainer(searchElement);
                  return;
                }
                if (pendo.dom('#pendo-search-results-container').length) {
                  pendo.dom('._search-results-list').append(results);
                } else {
                  var html = [
                    '<div id="pendo-search-results-container" class="hidden-element">',
                    '<div id="_pendo-guide-search-results" class="bb-text _pendo-simple-text _search-results-header">',
                    'Search Results</div>',
                    '<div class="bb-text _pendo-simple-text _search-results-list">',
                    '</div>',
                    '</div>',
                  ].join('\n');
                  pendo.dom('._pendo-resource-center-guidelist-module-list').append(html);
                  pendo.dom('._search-results-list').append(results);
                  pendo.dom('#pendo-search-results-container').removeClass('hidden-element');
                }
              }

              /**
               * Helper to return the element of an event
               * @param {Event} e event object
               * @return HTML ELement object of the targeted event
               */
              function eventTarget(e) {
                return (e && e.target) || e.srcElement;
              }

              /**
               * Helper to lookup nested values in an object
               * This could be improved.
               * @param {Object} object search object
               * @param {string} key the key to search for in the object
               * @return the first value in the object that matches the key
               */
              function findJsonVal(object, key) {
                var value;
                Object.keys(object).some(function (k) {
                  if (k === key) {
                    value = object[k];
                    return true;
                  }
                  if (object[k] && typeof object[k] === 'object') {
                    value = findJsonVal(object[k], key);
                    return value !== undefined;
                  }
                });
                return value;
              }

              /**
               * Helper to lookup the id associated with a Resource Center Menu item
               * @param {HTMLElement} item html element for the Nav item
               * @return the first value that matches all of the key-value pairs
               */
              function lookupModuleId(item) {
                return pendo._.findWhere(resourceCenterModuleLookup, { title: item.title }).id;
              }

              /**
               * Places guides into the correct category based on the name of the guide
               */
              function moveGuides() {
                // Find all the guides in the guide list module
                var eligibleGuides = pendo.BuildingBlocks.BuildingBlockResourceCenter.getResourceCenter()
                  .activeModule.guidesInModule;
                /*
                 * Find the object of guides for the guide list module. This contains the display name values.
                 */
                var guideModuleChildren = findJsonVal(
                  pendo.BuildingBlocks.BuildingBlockResourceCenter.getResourceCenter().activeModule.activeStep()
                    .domJson,
                  'templateChildren'
                );

                /*
                 * Determine section a guide should go into based on the name.
                 */
                function checkGuideNameForSection(guide) {
                  if (guide.name.includes('[ADMIN]')) {
                    guide.category = 'admin';
                    return 'admin';
                  } else if (guide.name.includes('[BEGINNER]')) {
                    guide.category = 'beginner';
                    return 'beginner';
                  } else if (guide.name.includes('[INTERMEDIATE]')) {
                    guide.category = 'intermediate';
                    return 'intermediate';
                  } else if (guide.name.includes('[ADVANCED]')) {
                    guide.category = 'advanced';
                    return 'advanced';
                  } else {
                    guide.category = 'unknown';
                    return 'unknown';
                  }
                }

                if (eligibleGuides) {
                  pendo._.each(eligibleGuides, function (guide) {
                    var guideSection = checkGuideNameForSection(guide);
                    if (guideModuleChildren) {
                      var moduleChildGuide = guideModuleChildren.find(function (moduleGuide) {
                        return moduleGuide.id === guide.id;
                      });
                      pendo
                        .dom(`li:contains("${moduleChildGuide.title}")`)
                        .appendTo(pendo.dom(`.${guideSection}`));
                    }
                  });
                  pendo._.each(pendo.dom('.guideCategory'), (category) => {
                    if (category.getElementsByTagName('LI').length < 1) {
                      category.classList.add('hidden-element');
                    }
                    if (category.getElementsByTagName('LI').length > 2) {
                      pendo.dom(`.${category.classList[1]} .guide-accordion`).remove();
                      pendo
                        .dom(category)
                        .append(
                          `<div class="guide-accordion" data-section="${category.classList[1]}"><button class="guide-accordion-button"></button><div class="guide-list"</div></div>`
                        );
                      addGuideAccordions(
                        [...category.classList],
                        category.getElementsByTagName('LI')
                      );
                    }
                  });
                }
              }

              /**
               * Resets the state of the guide list module
               * @param {HTMLElement} searchInputElement html search input element
               * @param {Boolean} shouldTeardown determine if we should hide the category elements
               */
              function removeSearchContainer(searchInputElement, shouldTeardown) {
                if (!pendo.dom('#pendo-search-results-container').hasClass('hidden-element')) {
                  pendo.dom('#pendo-search-results-container').addClass('hidden-element');
                }
                if (shouldTeardown) {
                  adjustSearchResultsContainer(shouldTeardown);
                }
                // Reset back to the guide module
                var guideModuleTitle = pendo._.findWhere(resourceCenterModuleLookup, {
                  title: 'guides',
                }).title;
                cleanUpSectionContent(document.querySelector(`[data-id="${guideModuleTitle}"]`));
                pendo.dom('#pendo-search-results-container').remove();
                pendo.dom(searchInputElement).focus();
              }

              /**
               * Add the open in new tab icon to the Announcement module
               * @param {HTMLElement} item html nav bar element
               */
              function setAnnouncementLinkIcon(item) {
                var id = item.dataset?.id || item.title;
                var announcementLinkNode =
                  '<a id="announcement-link-icon" class="icon-fontello-37" href="https://pendo.io" target="_blank"></a>';
                if (id !== 'whatsnew' && pendo.dom('#announcement-link-icon').length) {
                  pendo
                    .dom('._adobe-rc_rc-home-view')[0]
                    .removeChild(pendo.dom('#announcement-link-icon')[0]);
                } else {
                  if (id === 'whatsnew' && !pendo.dom('#announcement-link-icon').length) {
                    pendo.dom('#pendo-resource-center-container').append(announcementLinkNode);
                  }
                }
              }
            })('a2d9f4cd-4232-4b44-510a-9a8837a517f9');
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
            const { slug, date, title, summary, tags } = frontMatter;
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
            );
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
  );
}
